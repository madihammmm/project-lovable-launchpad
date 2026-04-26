import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import contactRoutes from "./routes/contactRoutes.js";
import perfumeRoutes from "./routes/perfumeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas connected"))
    .catch((error) => console.error("MongoDB connection failed, using in-memory fallback:", error.message));
} else {
  console.log("MONGO_URI not set, using in-memory fallback.");
}

app.get("/", (_req, res) => res.json({ message: "DreamScents Express API is running" }));
app.use("/api/perfumes", perfumeRoutes);
app.use("/api/contact", contactRoutes);

app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || "Internal server error" });
});

app.listen(PORT, () => console.log(`DreamScents API listening on port ${PORT}`));
