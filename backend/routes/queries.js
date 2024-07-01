import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

// MySQL connection
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//post summary file to tables
app.post("/api/store-user-summary", async (req, res) => {
  const { name, phoneNumber, summary } = req.body;

  try {
    const [existingRows] = await db.execute(
      "SELECT * FROM Users WHERE username = ? AND phone_number = ?",
      [name, phoneNumber]
    );

    if (existingRows.length > 0) {
      const existingUser = existingRows[0];
      const updatedFiles = existingUser.summary_files
        ? `${existingUser.summary_files}, ${summary}`
        : summary;

      await db.execute(
        "UPDATE Users SET summary_files = ? WHERE username = ? AND phone_number = ?",
        [updatedFiles, name, phoneNumber]
      );

      res
        .status(200)
        .json({ message: "add summary to users table successfully." });
    } else {
      await db.execute(
        "INSERT INTO Users (username, phone_number, summary_files) VALUES (?, ?, ?)",
        [name, phoneNumber, summary]
      );
      res
        .status(200)
        .json({ message: "New user created with sumary successfully." });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error storing or updating user information." });
  }
});

export default router;
