import dotenv from "dotenv";
dotenv.config();

import express from "express";
const router = express.Router();

import db from "../db.js";

// Helper functions
async function findClient(clientObj) {
  const { name, phone } = clientObj;
  const q = "SELECT * FROM clients WHERE name = ? AND phone = ?";

  try {
    const [rows] = await db.query(q, [name, phone]);
    console.log("data to return", rows);
    return rows;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }

  // Check out the differences. Both codes seem to work
  // db.query(q, [name, phone], (err, data) => {
  //   if (err) {
  //     return;
  //   }
  //   console.log("data to return", data)
  //   return data;
  // });
}

async function createClient(clientObj) {
  
}

async function updateClient(clientObj) {}

async function createSummary(client_id, newSummary) {

};

// Get client data.
// We must use post because we send client data in req.body
router.post("/user-data", async (req, res) => {
  const { clientObj } = req.body;

  console.log("received obj:", clientObj);

  try {
    let clientData = await findClient(clientObj);

    if (!clientData) {
      // If client doesn't exist, create a new one
      clientData = await createClient(clientObj);
      res.status(201).json({ message: "Client created", clientData });
    } else {
      // If client exists, update with new data
      const updatedData = {};
      for (const key in clientObj) {
        if (clientObj[key] !== clientData[key]) {
          updatedData[key] = clientObj[key];
        }
      }

      if (Object.keys(updatedData).length > 0) {
        clientData = await updateClient(clientData.id, updatedData);
        res.status(200).json({ message: "Client updated", clientData });
      } else {
        res.status(200).json({ message: "No changes needed", clientData });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// post summary
// summary needs a foreign key, which is client_id
// So we need to first find the client; if client doesn't exist, 
// we have to create one and get his client_id
// then we create summary with the client_id

router.post("/store-user-summary", async (req, res) => {
  const { name, phoneNumber, summary } = req.body;
});

export default router;
