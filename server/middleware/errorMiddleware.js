const multer = require("multer");
const AppError = require("../utils/appError");

/**
 * Handle Mongoose CastError (e.g. invalid MongoDB ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose Duplicate Key Error (code 11000)
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || "field";
  const value = err.keyValue ? err.keyValue[field] : "";
  const message = `Duplicate value: '${value}' for ${field}. Please use another value.`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose Schema Validation Errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Validation error: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT Invalid Signature Error
 */
const handleJWTError = () =>
  new AppError("Invalid authentication token. Please log in again.", 401);

/**
 * Handle JWT Token Expiration Error
 */
const handleJWTExpiredError = () =>
  new AppError("Your session token has expired. Please log in again.", 401);

/**
 * Handle Multer File Upload Errors
 */
const handleMulterError = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return new AppError("Uploaded image exceeds maximum size limit (5 MB).", 400);
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return new AppError(`Unexpected upload field: ${err.field}`, 400);
  }
  return new AppError(`File upload error: ${err.message}`, 400);
};

/**
 * 404 Not Found Middleware for unhandled API routes
 */
const notFoundHandler = (req, res, next) => {
  next(new AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404));
};

/**
 * Centralized Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, message: err.message, name: err.name };

  // Transform known library errors into friendly AppErrors
  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
  if (err instanceof multer.MulterError) error = handleMulterError(err);
  if (err.message === "Only JPG, JPEG, PNG and WEBP images are allowed.") {
    error = new AppError(err.message, 400);
  }

  // Development response (includes stack trace for easy debugging)
  if (process.env.NODE_ENV !== "production") {
    return res.status(error.statusCode || err.statusCode).json({
      success: false,
      status: error.status || err.status,
      statusCode: error.statusCode || err.statusCode,
      message: error.message || err.message,
      error: err,
      stack: err.stack,
    });
  }

  // Production response (clean message, no leaked internals)
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
    });
  }

  // Unknown or programming error: don't leak details
  console.error("UNKNOWN SERVER ERROR 💥:", err);
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong on the server. Please try again later.",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
