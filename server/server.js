const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

// IMPORTANT: Load .env before importing files that use environment variables
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("RoadWatch Backend is Running 🚀");
});

// Global Error Handler
app.use((err, req, res, next) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Image must be smaller than 5 MB",
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }

  // Unsupported image type from uploadMiddleware
  if (
    err.message ===
    "Only JPG, JPEG, PNG and WEBP images are allowed."
  ) {
    return res.status(400).json({
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});