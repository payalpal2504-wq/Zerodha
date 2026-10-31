const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zerodha_trading";

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`[Database] MongoDB connection failed: ${error.message}`);
    // If local MongoDB is not running during development, we allow graceful fallback
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

const getStatus = () => isConnected;

module.exports = { connectDB, getStatus };
