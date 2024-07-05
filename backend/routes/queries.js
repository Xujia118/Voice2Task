import dotenv from "dotenv";
dotenv.config();

import express from "express";
const router = express.Router();

import db from "../db.js";

// Helper functions
async function findClient({ name, phone }) {
  const q = "SELECT * FROM clients WHERE name = ? AND phone = ?";

  try {
    const [rows] = await db.query(q, [name, phone]);
    return rows[0].client_id;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
}

async function createClient({ name, phone, email }) {
  const q = "INSERT INTO clients (name, phone, email) VALUES (?, ?, ?)";

  try {
    const [result] = await db.query(q, [name, phone, email]);
    console.log("Client created", result.insertId);
    return result.insertId;
  } catch (err) {
    console.err("Error creating client:", err);
    throw err;
  }
}

async function createSummary({ summary_text, url, client_id }) {
  const q =
    "INSERT INTO summaries (summary_text, url, client_id) VALUES (?, ?, ?)";

  try {
    const [result] = await db.query(q, [summary_text, url, client_id]);
    return result;
  } catch (err) {
    console.error("Error creating summary:", err);
    throw err;
  }
}

// Get a client. Since we send in body, we use POST
router.post("/get-client", async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required." });
  }

  try {
    const client = await findClient({ name, phone });

    if (client.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    console.log("client:", client);
    return res.json(client[0]);
  } catch (err) {
    console.error("Error fetching client data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new client
router.post("/create-client", async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required." });
  }

  try {
    const client_id = await createClient({ name, phone, email });
    if (!client_id) {
      return res.status(500).json({ error: "Failed to create client." });
    }

    res
      .status(201)
      .json({ message: "Client created successfully.", client_id });
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new summary: summary needs a foreign key, which is client_id
// So we need to first find the client;
// if client doesn't exist, we have to creat a new one
// then we create summary with the client_id
router.post("/store-summary", async (req, res) => {
  const { name, phone, summary_text, url } = req.body;

  try {
    let client_id = await findClient({ name, phone });
    if (!client_id) {
      client_id = await createClient({ name, phone, email });
    }

    const result = await createSummary({ summary_text, url, client_id });
    console.log("result:", result.insertId);
    res.status(201).json({ messge: "Summary created successfully." });
  } catch (err) {
    console.error("Error creating summary:", err);
    res
      .status(500)
      .json({ message: "Error creating summary", err: err.message });
  }
});

// Get all summaries of a client
router.post("/get-summary-list", async (req, res) => {
  const { name, phone } = req.body;

  const client_id = await findClient({ name, phone });

  const q = `SELECT summaries.* FROM summaries 
              INNER JOIN clients ON summaries.client_id = clients.client_id 
              WHERE clients.client_id = ?`;
  try {
    const [result] = await db.query(q, [client_id]);
    console.log("summary list:", result);
  } catch (err) {
    console.error("Error fetching summary list:", err);
    throw err;
  }
});

export default router;
