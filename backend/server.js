import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Summary routes
import summaryRouter from "./routes/summary.js";
app.use("/", summaryRouter)

// Queries routes
// import queryRouter from "./routes/queries.js"

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
