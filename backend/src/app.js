const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const errorHandler = require("./middleware/error.middleware");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const holdingsRoutes = require("./routes/holdings.routes");
const positionsRoutes = require("./routes/positions.routes");
const ordersRoutes = require("./routes/orders.routes");
const watchlistRoutes = require("./routes/watchlist.routes");
const fundsRoutes = require("./routes/funds.routes");
const marketRoutes = require("./routes/market.routes");

const app = express();

// Security headers
app.use(helmet());

// CORS configuration supporting credentials (cookies)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://localhost:4173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Check explicit allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow onrender.com and vercel.app preview and production domains
      if (/\.onrender\.com$/.test(origin) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health & root endpoints
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Zerodha Trading Platform Backend API is running.",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Zerodha Trading Engine",
    version: "1.0.0",
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/holdings", holdingsRoutes);
app.use("/api/positions", positionsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/funds", fundsRoutes);
app.use("/api/market", marketRoutes);

// Catch 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
