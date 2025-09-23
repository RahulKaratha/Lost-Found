// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "6mb" })); // allow bigger bodies for base64 images (if used)
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;

// start
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
