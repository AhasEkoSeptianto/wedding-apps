import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import wishRoutes from "./routes/wishRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import weddingRoutes from "./routes/weddingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

// Allowed CORS origins (can be comma-separated list in production)
const allowedOrigins = CLIENT_ORIGIN.split(",").map((s) => s.trim());

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes("vercel.app") ||
        origin.includes("netlify.app") ||
        origin.includes("onrender.com")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Database Connection
connectDB();

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "JanjiSuci Wedding Backend",
    timestamp: new Date().toISOString(),
  });
});

// Resource Routes
app.use("/api/auth", authRoutes);
app.use("/api/wishes", wishRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/wedding", weddingRoutes);
app.use("/api/upload", uploadRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n💍 JanjiSuci Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Allowed Client: ${CLIENT_ORIGIN}\n`);
});

