require("dotenv").config

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.json({ message: "Success!" })
})

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} http://localhost:3000`);
});
