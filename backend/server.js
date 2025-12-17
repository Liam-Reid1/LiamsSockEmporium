const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Dynamic import for node-fetch because it's ESM-only


let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();


const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public'))); 

// ✅ Database

/*
const db = mysql.createConnection({
  host: 'mysql-liams-sock-emporium-ontariotechu-0ee1.f.aivencloud.com',
  port: 11764,
  user: 'avnadmin',
  password: process.env.SQL_PW, 
  database: 'defaultdb',
  ssl: { ca: fs.readFileSync('./ca.pem') },
  multipleStatements: false, 
});
*/

const db = mysql.createConnection({
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  user: process.env.SQL_USER,
  password: process.env.SQL_PW,
  database: process.env.SQL_DB,
  ssl: { ca: Buffer.from(process.env.SQL_CA, 'base64').toString('utf8') }
});


db.connect(err => {
  if (err) console.error('Database connection failed:', err);
  else console.log('Database connected');
});

// Returns names of socks
app.get('/sockName', (req, res) => {
  db.query('SELECT sock FROM socktype', (err, results) => {
    if (err) {
      console.error('Error fetching socks:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

//  /api/chat route
app.post('/api/chat', async (req, res) => {
  const { question, socksList } = req.body;
  if (!question || !socksList) {
    return res.status(400).json({ error: 'Missing question or socksList' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ //  deepseek/deepseek-chat-v3.1:free
        model: "deepseek/deepseek-r1-distill-llama-70b:free", 
      /* error: {
        message: 'No endpoints found matching your data policy (Free model publication). Configure: https://openrouter.ai/settings/privacy',    
        code: 404
      }
      */
        messages: [
          {
            role: "system",
            content: "You are a cranky, impolite assistant named 'Socko'. You care only about socks and refuse to talk about anything else. Avoid giving long explanations unless asked. You can answer sock-related questions using these socks:\n\n" + socksList + "\n\nBe sure to have some variation in what socks you talk about."
          },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "I'm done talking today, buzz off.";
    console.log(data);
    res.json({ reply });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ error: 'Failed to get response from OpenRouter' });
  }
});


// Returns what months a sock has appeared most on
app.get('/socktype/month', (req, res) => {
  const sock = req.query.sock; // e.g., /socktype/month?sock=blue
  const params = [sock, sock];

  const sql = `
    SELECT t.Sock, COUNT(s.Sock) AS month_count, DATE_FORMAT(s.Date, '%b') AS month
    FROM socktype t
    JOIN schedule s ON s.Sock = t.Sock
    WHERE t.Sock = ?
    GROUP BY t.Sock, month
    HAVING month_count = (
        SELECT MAX(monthly_count) 
        FROM (
            SELECT COUNT(s2.Sock) AS monthly_count
            FROM socktype t2
            JOIN schedule s2 ON s2.Sock = t2.Sock
            WHERE t2.Sock = ?
            GROUP BY DATE_FORMAT(s2.Date, '%M')
        ) AS counts
    )
    ORDER BY month_count DESC
  `;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
    }
  });
});

// Returns what days a sock has appeared most on
app.get('/socktype/day', (req, res) => {
  const sock = req.query.sock; // e.g., /socktype/month?sock=blue
  const params = [sock, sock];
  const sql = `
    SELECT t.Sock, COUNT(s.Sock) AS day_count, s.Day
    FROM socktype t
    JOIN schedule s ON s.Sock = t.Sock
    WHERE t.Sock = ?
    GROUP BY t.Sock, s.Day
    HAVING day_count = (
        SELECT MAX(daily_count) 
        FROM (
            SELECT COUNT(s2.Sock) AS daily_count
            FROM socktype t2
            JOIN schedule s2 ON s2.Sock = t2.Sock
            WHERE t2.Sock = ?
            GROUP BY s2.Day
        ) AS counts
    )
    ORDER BY day_count DESC
  `;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
    }
  });
});

// Returns important info for each sock in a specified order
app.get('/socktype', (req, res) => {
  const order = Object.keys(req.query)[0]; // "Name", "Popular", "Newest", or "Recent"
  
  let sql = `
    SELECT 
        t.Sock, 
        COUNT(s.Sock) AS wear_count, 
        MAX(s.Date) AS recent, 
        t.Description, 
        t.Colour,
        t.Alive,
        DATE_FORMAT(MIN(s.Date), '%b %d %Y') AS first_worn, 
        DATE_FORMAT(MAX(s.Date), '%b %d %Y') AS last_worn,
        DATE_FORMAT(MIN(s.Date), '%Y %m %d') AS newest
    FROM socktype t
    LEFT JOIN schedule s ON s.Sock = t.Sock
    GROUP BY t.Sock
  `;

  // Add ORDER BY based on query
  if (order === 'Name') {
    sql += ' ORDER BY t.Sock ASC'; // A to Z
  } else if (order === 'Popular') {
    sql += ' ORDER BY wear_count DESC'; // Most worn first
  } else if (order === 'Recent') {
    sql += ' ORDER BY recent DESC'; // Most recently worn first
  }
  else if (order === 'Newest') {
    sql += ' ORDER BY newest DESC'; // Most recently acquired first
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
    }
  });
});

// Returns sock entries depending on requested sock, year, month, and day
app.get('/list', (req, res) => {
  const { month, day, year, weekday, sock } = req.query;
  let sql = `SELECT sock, DATE_FORMAT(date, '%M %d %Y') AS formatted_date, day FROM schedule`;
  let conditions = [];
  let params = [];

  if (year) {
    conditions.push(`DATE_FORMAT(date, '%Y') LIKE ?`);
    params.push(`%${year}%`);
  }
  if (month) {
    conditions.push(`DATE_FORMAT(date, '%m') LIKE ?`);
    params.push(`%${month.padStart(2, '0')}%`);
  }
  if (day) {
    conditions.push(`DATE_FORMAT(date, '%d') LIKE ?`);
    params.push(`%${day.padStart(2, '0')}%`);
  }
  if (weekday) {
    conditions.push('day LIKE ?')
    params.push(`%${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}%`);
  }
  if (sock) {
    conditions.push('sock LIKE ?')
    params.push(`%${sock.charAt(0).toUpperCase()}${sock.slice(1)}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY date ASC';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
    }
  });
});

// Returns socks and their colour, wear count, and percentage
app.get('/main/chart', (req, res) => { //fix percentage
  const query = `
    SELECT 
        s.sock,
        COUNT(s.sock) AS wear_count, 
        ROUND((COUNT(1) / (SELECT COUNT(1) FROM schedule)), 4) * 100 AS percentage, 
        t.colour
    FROM schedule s
    JOIN socktype t ON s.sock = t.sock
    GROUP BY s.sock, t.colour
    ORDER BY t.sock
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching sock data:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});

app.get('/main/total-socks', (req, res) => {
  const query = `
    WITH RECURSIVE months AS (
      SELECT DATE_FORMAT(MIN(Date), '%Y-%m-01') AS month_start
      FROM schedule
      UNION ALL
      SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
      FROM months
      WHERE month_start < (
          SELECT DATE_FORMAT(MAX(Date), '%Y-%m-01')
          FROM schedule
      )
    ),
    first_worn AS (
        SELECT
            Sock,
            DATE_FORMAT(MIN(Date), '%Y-%m-01') AS first_month
        FROM schedule
        GROUP BY Sock
    ),
    new_socks_per_month AS (
        SELECT
            first_month,
            COUNT(*) AS new_socks
        FROM first_worn
        GROUP BY first_month
    )
    SELECT
        DATE_FORMAT(m.month_start, '%Y-%m') AS month,
        COALESCE(n.new_socks, 0) AS new_socks,
        SUM(COALESCE(n.new_socks, 0)) OVER (ORDER BY m.month_start) AS total_socks
    FROM months m
    LEFT JOIN new_socks_per_month n
        ON n.first_month = m.month_start
    ORDER BY m.month_start
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching sock data:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
})

// not used, keep?
app.get('/socks/most-worn', (req, res) => {
  const query = `
      SELECT s.sock, COUNT(s.sock) AS wear_count, t.colour
      FROM schedule s
      JOIN socktype t ON s.sock = t.sock
      GROUP BY s.sock, t.colour
      ORDER BY wear_count DESC
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching sock data:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});

// If featured sock has nothing for the requested day, new entry is created here. Pulls random sock from socktype
app.get('/main/featured-sock/set', async (req, res) => {
  const date = req.query.date;
  const params = [date];

  try {
    // 1. Delete outdated entries
    await db.promise().query(
      `DELETE FROM featured WHERE DATE_FORMAT(Date, '%Y-%m-%d') != ?`, 
      params
    );

    // 2. Insert a new random sock
    await db.promise().query(
      `INSERT INTO featured (Sock, Date)
       VALUES ((SELECT Sock FROM socktype ORDER BY RAND() LIMIT 1), ?)`,
      params
    );

    res.json({ message: 'Featured sock updated successfully!' });
  } catch (err) {
    console.error('Query failed:', err);
    res.status(500).send('Query failed');
  }
});


// Pulls sock related to current day
app.get('/main/featured-sock/get', (req, res) => { 
  const date = req.query.date;
  const params = [date];

  const sql = `
    SELECT 
      t.Sock, 
      COUNT(s.Sock) AS wear_count, 
      MAX(s.Date) AS recent, 
      t.Description, 
      t.Alive,
      t.Colour,
      DATE_FORMAT(MIN(s.Date), '%b %d %Y') AS first_worn, 
      DATE_FORMAT(MAX(s.Date), '%b %d %Y') AS last_worn,
      DATE_FORMAT(MIN(s.Date), '%Y %m %d') AS newest
    FROM socktype t
    LEFT JOIN schedule s ON s.Sock = t.Sock
    LEFT JOIN featured f ON f.Sock = t.Sock
    WHERE DATE_FORMAT(f.Date, '%Y-%m-%d') = ?
    GROUP BY t.Sock;
  `;

  db.query(sql, params, (err, results) => { 
    if (err) { 
      console.error('Query failed:', err); 
      res.status(500).send('Query failed'); 
    } else { 
      res.json(results); 
    } 
  }); 
});


// Returns the total number of entries in socktype and schedule
app.get('/main/big-numbers', (req, res) => { 
	const date = req.query.date; // e.g., /socktype/month?sock=blue 
	const params = [date, date]; 
	const sql = `
	   
SELECT 
    (SELECT COUNT(*) FROM socktype) AS total_socks,
    (SELECT COUNT(*) FROM schedule) AS total_days;
	`; 
	db.query(sql, params, (err, results) => { 
		if (err) { 
			console.error('Query failed:', err); 
			res.status(500).send('Query failed'); 
		} else { 
			res.json(results); 
		} 
	}); 
});

// Returns the most worn sock in the last 100 days
app.get('/main/top-sock', (req, res) => { 
	const date = req.query.date; // e.g., /socktype/month?sock=blue 
	const params = [date, date]; 
	const sql = `
        SELECT 
            s.Sock,
            COUNT(*) AS wear_count,
            t.Description, 
            t.Alive,
            t.Colour,
            DATE_FORMAT(MAX(s.Date), '%b %d %Y') AS last_worn
        FROM schedule s
        LEFT JOIN socktype t ON t.Sock = s.Sock
        WHERE s.Date >= (SELECT MAX(Date) FROM schedule) - INTERVAL 100 DAY
        GROUP BY s.Sock
        HAVING wear_count = (
            SELECT MAX(cnt)
            FROM (
                SELECT COUNT(*) AS cnt
                FROM schedule
                WHERE Date >= (SELECT MAX(Date) FROM schedule) - INTERVAL 100 DAY
                GROUP BY Sock
            ) sub
        )
        ORDER BY wear_count DESC;
	`; 
	db.query(sql, params, (err, results) => { 
		if (err) { 
			console.error('Query failed:', err); 
			res.status(500).send('Query failed'); 
		} else { 
			res.json(results); 
		} 
	}); 
});

// Returns the most worn sock in the last 30 days
app.get('/main/sotm', (req, res) => { 
	const date = req.query.date; // e.g., /socktype/month?sock=blue 
	const params = [date, date]; 
	const sql = `
        SELECT 
            s.Sock,
            COUNT(*) AS wear_count,
            t.Description, 
            t.Alive,
            t.Colour,
            DATE_FORMAT(MAX(s.Date), '%b %d %Y') AS last_worn
        FROM schedule s
        LEFT JOIN socktype t ON t.Sock = s.Sock
        WHERE s.Date >= (SELECT MAX(Date) FROM schedule) - INTERVAL 30 DAY
        GROUP BY s.Sock
        HAVING wear_count = (
            SELECT MAX(cnt)
            FROM (
                SELECT COUNT(*) AS cnt
                FROM schedule
                WHERE Date >= (SELECT MAX(Date) FROM schedule) - INTERVAL 30 DAY
                GROUP BY Sock
            ) sub
        )
        ORDER BY wear_count DESC;
	`; 
	db.query(sql, params, (err, results) => { 
		if (err) { 
			console.error('Query failed:', err); 
			res.status(500).send('Query failed'); 
		} else { 
			res.json(results); 
		} 
	}); 
});

// Line chart
app.get('/main/date-chart', (req, res) => { //fix percentage
  const query = `
    WITH RECURSIVE
      max_schedule_date AS (
        SELECT MAX(Date) AS max_date FROM schedule
      ),
      months AS (
        SELECT DATE_FORMAT(DATE_SUB((SELECT max_date FROM max_schedule_date), INTERVAL 11 MONTH), '%Y-%m-01') AS month_start
        UNION ALL
        SELECT DATE_FORMAT(DATE_ADD(STR_TO_DATE(month_start, '%Y-%m-%d'), INTERVAL 1 MONTH), '%Y-%m-01')
        FROM months
        WHERE STR_TO_DATE(month_start, '%Y-%m-%d') < DATE_FORMAT((SELECT max_date FROM max_schedule_date), '%Y-%m-01')
      ),
      socks AS (
        SELECT DISTINCT sock, colour FROM socktype
      ),
      past_totals AS (
        SELECT
          sch.sock,
          COUNT(*) AS past_wear_count
        FROM schedule sch
        WHERE sch.Date < DATE_FORMAT(DATE_SUB((SELECT max_date FROM max_schedule_date), INTERVAL 11 MONTH), '%Y-%m-01')
        GROUP BY sch.sock
      ),
      wears AS (
        SELECT 
          sch.sock,
          DATE_FORMAT(sch.Date, '%Y-%m-01') AS month_start,
          COUNT(*) AS wear_count
        FROM schedule sch
        WHERE sch.Date >= DATE_FORMAT(DATE_SUB((SELECT max_date FROM max_schedule_date), INTERVAL 11 MONTH), '%Y-%m-01')
        GROUP BY sch.sock, month_start
      ),
      sock_months AS (
        SELECT 
          s.sock,
          m.month_start,
          COALESCE(w.wear_count, 0) AS wear_count,
          s.colour,
          COALESCE(p.past_wear_count, 0) AS past_wear_count
        FROM socks s
        CROSS JOIN months m
        LEFT JOIN wears w ON w.sock = s.sock AND w.month_start = m.month_start
        LEFT JOIN past_totals p ON p.sock = s.sock
      ),
      cumulative AS (
        SELECT
          sock,
          DATE_FORMAT(STR_TO_DATE(month_start, '%Y-%m-%d'), '%b-%Y') AS YearMonth,
          colour,
          past_wear_count + SUM(wear_count) OVER (
            PARTITION BY sock 
            ORDER BY STR_TO_DATE(month_start, '%Y-%m-%d') 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ) AS CumulativeWorn
        FROM sock_months
      )
      SELECT *
      FROM cumulative
      ORDER BY sock, STR_TO_DATE(YearMonth, '%b-%Y');
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching sock data:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});


app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/main.html'));
});

app.get('/record', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/record.html'));
});

app.get('/socks', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/socks.html'));
});

// Start server
app.get('/', (req, res) => {
  res.redirect('/main');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}/main.html`);
});