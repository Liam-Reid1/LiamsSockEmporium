const fs = require('fs');
const mysql = require('mysql2/promise'); // promise-based
require('dotenv').config();
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Set up the database connection
async function main() {

  const connection = await mysql.createConnection({
    // add here
  });

  const name = await askQuestion('Sock Name? ');
  console.log(`${name} Socks!`);

  const colour = await askQuestion('Sock Colour? ');
  console.log(`${colour} for ${name} Socks!`);

  const description = await askQuestion('Sock Description? ');
  console.log(`"${description}"`);

  try {
    await connection.execute(
      `INSERT INTO socktype (sock, colour, description, alive)
        VALUES (?, ?, ?, ?)
      `,
      [name, colour, description, true]
    );
    console.log(`Inserted/Updated: ${name} ${colour} ${description}`);
  } catch (err) {
    console.error('Error inserting data:', err);
  }

  // Close connection
  await connection.end();
  console.log('All data inserted/updated successfully!');
}


main().catch(err => console.error(err));
