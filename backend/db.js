import mysql from "mysql2/promise"

// Connect to Database
const db = await mysql.createConnection({
  user: "root",
  password: "password",
  database: "summary",
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to MYSQL server:", err);
    return;
  }
  console.log("Connected to MySQL server.");
});

export default db;
