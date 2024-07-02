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

// Helper functions
async function findClient(name, phoneNumber, summary) {
  const [existingRows] = await db.execute(
    "SELECT * FROM Users WHERE username = ? AND phone_number = ?",
    [name, phoneNumber]
  );
  console.log("success find");
  return existingRows.length > 0 ? existingRows : "";
}

async function createClient(name, phoneNumber, summary) {
  await db.execute(
    "INSERT INTO Users (username, phone_number, summary_files) VALUES (?, ?, ?)",
    [name, phoneNumber, summary]
  );
  console.log("success create");
}

//clientData should be a row of client data
async function updateClient(clientData, name, phoneNumber, summary) {
  const existingUser = clientData[0];
  const updatedFiles = existingUser.summary_files
    ? `${existingUser.summary_files}, ${summary}`
    : summary;

  await db.execute(
    "UPDATE Users SET summary_files = ? WHERE username = ? AND phone_number = ?",
    [updatedFiles, name, phoneNumber]
  );
  console.log("success updating");
}

router.post("/user-data", async (req, res) => {
  const { clientObj } = req.body;

  // Unwrap clientObj
  const name = clientObj.name;
  const phoneNumber = clientObj.phoneNumber;
  const summary = clientObj.summary; // Must be a list

  try {
    let clientData = await findClient(name, phoneNumber, summary);

    if (!clientData) {
      await createClient(name, phoneNumber, summary);
      res.status(201).json({ message: "Client created", clientData });
    } else {
      await updateClient(clientData, name, phoneNumber, summary);
      res.status(200).json({ message: "Client updated", clientData });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// To Test: if only summary is sent, will name and phoneNumber be made null?
// If it's the case, write a separate new summary update logic
export default router;
