/**
 * Centralized Express Error Handler
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;

    const field = err.keyPattern
      ? Object.keys(err.keyPattern)[0]
      : "field";

    message = `A record with this ${field} already exists.`;
  }

  // Mongoose validation error
  else if (err.name === "ValidationError") {
    statusCode = 400;

    message = "Validation failed.";

    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }

  // Invalid MongoDB ObjectId
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID.";
  }

  // Invalid JWT
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }

  // Expired JWT
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
  }

  // Invalid JSON request body
  else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON request body.";
  }

  // Request body too large
  else if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request body is too large.";
  }

  // MongoDB server selection error
  else if (err.name === "MongooseServerSelectionError") {
    statusCode = 503;
    message = "Database service is temporarily unavailable.";
  }

  // Ensure valid HTTP status code
  if (
    !Number.isInteger(statusCode) ||
    statusCode < 400 ||
    statusCode > 599
  ) {
    statusCode = 500;
  }

  // Log server errors
  if (statusCode >= 500) {
    console.error("[Server Error]", {
      method: req.method,
      path: req.originalUrl,
      message: err.message,
      stack:
        process.env.NODE_ENV !== "production"
          ? err.stack
          : undefined,
    });
  }

  // Never expose internal error details in production
  if (process.env.NODE_ENV === "production" && statusCode >= 500) {
    message = "Internal server error.";
    errors = null;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};

module.exports = errorHandler;