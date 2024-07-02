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

// Write these helper functions
// User you previous logic in api
async function findClient(name, phoneNumber, summary) {
  const [existingRows] = await db.execute(
    "SELECT * FROM Users WHERE username = ? AND phone_number = ?",
    [name, phoneNumber]
  );
  console.log("success find")
  return existingRows.length > 0 ? existingRows : "";
}

async function createClient(name, phoneNumber, summary) {
  await db.execute(
    "INSERT INTO Users (username, phone_number, summary_files) VALUES (?, ?, ?)", 
    [name, phoneNumber,  summary]
  ); 
  console.log("success create")
}


//clientData should be a row of client data
async function updateClient(clientData, name, phoneNumber, summary) {
  const existingUser = clientData[0]; 
  const updatedFiles = existingUser.summary_files ? `${existingUser.summary_files}, ${summary}` : summary

  await db.execute(
    "UPDATE Users SET summary_files = ? WHERE username = ? AND phone_number = ?",
    [updatedFiles, name, phoneNumber]
  );
  console.log("success updating")

}

// Get client data. 
// We must use post because we send client data in req.body
router.post("/user-data", async (req, res) => {
  // const { clientObj } = req.body;
  const { name, phoneNumber, summary } = req.body;

  console.log(name);

  try {
    let clientData = await findClient(name, phoneNumber, summary);

    if (!clientData) {
      // If client doesn't exist, create a new one
      await createClient(name, phoneNumber, summary);
      res.status(201).json({ message: "Client created", clientData });
    } else {
      // // If client exists, update with new data
      // const updatedData = {};
      // for (const key in clientObj) {
      //   if (clientObj[key] !== clientData[key]) {
      //     updatedData[key] = clientObj[key];
      //   }
      // }

      // if (Object.keys(updatedData).length > 0) {
      //   clientData = await updateClient(clientData, clientObj);
      //   res.status(200).json({ message: "Client updated", clientData });
      // } else {
      //   res.status(200).json({ message: "No changes needed", clientData });
      // }
      await updateClient(clientData, name, phoneNumber, summary);
      res.status(200).json({ message: "Client updated" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // post summary file to tables
// router.post("/store-user-summary", async (req, res) => {
//   const { name, phoneNumber, summary } = req.body;

//   try {
//     const [existingRows] = await db.execute(
//       "SELECT * FROM Users WHERE username = ? AND phone_number = ?",
//       [name, phoneNumber]
//     );

//     if (existingRows.length > 0) {
//       const existingUser = existingRows[0];
//       const updatedFiles = existingUser.summary_files
//         ? `${existingUser.summary_files}, ${summary}`
//         : summary;

//       await db.execute(
//         "UPDATE Users SET summary_files = ? WHERE username = ? AND phone_number = ?",
//         [updatedFiles, name, phoneNumber]
//       );

//       res
//         .status(200)
//         .json({ message: "add summary to users table successfully." });
//     } else {
//       await db.execute(
//         "INSERT INTO Users (username, phone_number, summary_files) VALUES (?, ?, ?)",
//         [name, phoneNumber, summary]
//       );
//       res
//         .status(200)
//         .json({ message: "New user created with sumary successfully." });
//     }
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Error storing or updating user information." });
//   }
// });

export default router;
