const path = require("path");
const express = require("express");
const cors = require("cors");
const config = require("./config/env");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const aiRoutes = require("./routes/aiRoutes");
const sqlAnalyticsRoutes = require("./routes/sqlAnalyticsRoutes");

// Error handling middleware
const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// Security & Parsing Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "RoadWatch Backend API is Running 🚀",
    environment: config.env,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      reports: "/api/reports",
      ai: "/api/ai",
      analytics: "/api/analytics/sql-queries",
    },
  });
});

// Mount Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", sqlAnalyticsRoutes);

// Catch-all 404 handler
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\x1b[32m[SERVER]\x1b[0m RoadWatch Server listening on port ${PORT} (${config.env} mode)`);
});