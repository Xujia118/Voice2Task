import mysql from "mysql2/promise"

// Connect to Database
const db = await mysql.createConnection({
  user: "root",
  password: "password",
  database: "summary",
});

console.log("Connected to MySQL server.");

export default db;