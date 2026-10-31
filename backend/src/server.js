require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");
const { seedDatabase } = require("./utils/seed");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Automatically ensure demo user and seed data exists
    if (process.env.AUTO_SEED !== "false") {
      try {
        await seedDatabase();
      } catch (seedErr) {
        console.warn("[Server] Note: Auto-seed skipped or completed:", seedErr.message);
      }
    }

    // 3. Start Express HTTP server
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Zerodha Trading Server running on port ${PORT}`);
      console.log(`🌐 Base API: http://localhost:${PORT}/api`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error("[Server] Fatal error starting server:", error);
    process.exit(1);
  }
};

startServer();
