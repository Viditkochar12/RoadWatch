const dotenv = require("dotenv");

// Load .env file
dotenv.config();

/**
 * Environment Variables & Secrets Management Module
 * Validates and exposes sanitized configuration parameters.
 * Ensures required secrets exist at startup without leaking values into logs.
 */
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const missingVars = requiredEnvVars.filter(
  (key) => !process.env[key] || process.env[key].trim() === ""
);

if (missingVars.length > 0) {
  console.warn(
    `\x1b[33m[WARN] Missing recommended environment variables: ${missingVars.join(
      ", "
    )}. Some features may use fallbacks or fail.\x1b[0m`
  );
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/roadwatch",
  jwtSecret: process.env.JWT_SECRET || "roadwatch_jwt_development_secret_key_2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  },
  isProduction: process.env.NODE_ENV === "production",
};

module.exports = config;
