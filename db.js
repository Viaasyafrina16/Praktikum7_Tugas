require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT 
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Database connected!");
});

module.exports = db;
