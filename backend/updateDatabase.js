const ExcelJS = require('exceljs');
const fs = require('fs');
const mysql = require('mysql2/promise'); // promise-based
require('dotenv').config();

// Set up the database connection
async function main() {
  const connection = await mysql.createConnection({
    host: 'mysql-liams-sock-emporium-ontariotechu-0ee1.f.aivencloud.com',
    port: 11764,
    user: 'avnadmin',
    password: process.env.SQL_PW,
    database: 'defaultdb',
    ssl: { ca: fs.readFileSync('./ca.pem') },
  });

  // Read Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('Socks.xlsx');
  const worksheet = workbook.getWorksheet(1);

  // Loop through rows
  for (let i = 2; i <= worksheet.rowCount; i++) { // skip header row
    const row = worksheet.getRow(i);
    let sock = row.getCell(1).value;
    let date = row.getCell(2).value;
    const day = row.getCell(3).value;

    // Convert Excel date to 'YYYY-MM-DD'
    if (date instanceof Date) {
      date = date.toISOString().split('T')[0];
    }

    try {
      await connection.execute(
        `INSERT INTO schedule (sock, date, day)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE date = VALUES(date), day = VALUES(day)`,
        [sock, date, day]
      );
      console.log(`Inserted/Updated: ${sock} ${date} ${day}`);
    } catch (err) {
      console.error('Error inserting data:', err);
    }
  }

  // Close connection
  await connection.end();
  console.log('All data inserted/updated successfully!');
}

main().catch(err => console.error(err));
