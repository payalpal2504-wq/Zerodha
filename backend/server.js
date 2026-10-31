require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const { seedDatabase } = require("./src/utils/seed");

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";

let server;

/**
 * Start the Express server after connecting to MongoDB.
 */
const startServer = async () => {
  try {
    // 1. Validate environment configuration
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from environment variables.");
    }

    // 2. Connect to MongoDB
    console.log("[Database] Connecting to MongoDB...");

    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection was not established.");
    }

    console.log("[Database] Connected successfully.");

    // 3. Seed database only when explicitly enabled
    if (process.env.AUTO_SEED === "true") {
      console.log("[Database] Running database seed...");

      await seedDatabase();

      console.log("[Database] Seeding completed.");
    }

    // 4. Start Express server
    server = app.listen(PORT, HOST, () => {
      console.log("----------------------------------------");
      console.log(" Zerodha Backend Server Started");
      console.log("----------------------------------------");
      console.log(` Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(` Port        : ${PORT}`);
      console.log(` API         : http://localhost:${PORT}/api`);
      console.log(` Health      : http://localhost:${PORT}/api/health`);
      console.log("----------------------------------------");
    });

    server.on("error", (error) => {
      console.error("[Server] HTTP server error:", error.message);
      process.exit(1);
    });

  } catch (error) {
    console.error("[Startup] Failed to start server:", error.message);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
};

/**
 * Gracefully shut down the application.
 */
const shutdown = async (signal) => {
  console.log(`\n[Server] ${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      console.log("[Server] HTTP server closed.");

      try {
        await mongoose.disconnect();
        console.log("[Database] MongoDB disconnected.");
        process.exit(0);
      } catch (error) {
        console.error("[Shutdown] Error:", error.message);
        process.exit(1);
      }
    });
  } else {
    await mongoose.disconnect().catch(() => {});
    process.exit(0);
  }
};

// Handle operating system shutdown signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Handle unexpected promise rejections
process.on("unhandledRejection", (error) => {
  console.error("[Process] Unhandled rejection:", error);

  if (server) {
    shutdown("UNHANDLED_REJECTION");
  } else {
    process.exit(1);
  }
});

// Start application
startServer();