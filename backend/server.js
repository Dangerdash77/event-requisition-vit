// ------------------------
// ✅ Server.js (Final Fixed Version)
// ------------------------
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Load environment variables
dotenv.config();

// ✅ Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------------
// ✅ Middleware
// ------------------------
app.use(cors());
app.use(express.json());

// ✅ Debug: Log every request
app.use((req, res, next) => {
  try {
    const previewBody =
      typeof req.body === "object"
        ? JSON.stringify(req.body).slice(0, 500)
        : String(req.body);
    console.log(
      `[REQ] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | body: ${previewBody}`
    );
  } catch (e) {
    console.log("[REQ] Error while logging request body:", e);
  }
  next();
});

// ✅ Serve uploaded files (so you can access /uploads/... in browser)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------
// ✅ Import routes
// ------------------------
import eventRoutes from "./routes/eventRoutes.js"; // ensure this file exists
import authRoutes from "./routes/authRoutes.js";

// ✅ Use routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

// ------------------------
// ✅ Health check route
// ------------------------
app.get("/health", (req, res) => {
  console.log(`[HEALTH] ${new Date().toISOString()} /health hit`);
  res.json({ ok: true, time: new Date().toISOString() });
});

// ------------------------
// ✅ Root route
// ------------------------
app.get("/", (req, res) => {
  console.log(`[ROOT] Root route hit`);
  res.send("✅ Server is running successfully");
});

// ------------------------
// ✅ MongoDB connection
// ------------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vit_events";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at: http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ------------------------
// ✅ Global error handler
// ------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
