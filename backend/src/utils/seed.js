const mongoose = require("mongoose");
const User = require("../models/User");
const Holding = require("../models/Holding");
const Position = require("../models/Position");
const Order = require("../models/Order");
const Watchlist = require("../models/Watchlist");
const Funds = require("../models/Funds");
const { connectDB } = require("../config/db");
require("dotenv").config();

const DEMO_USER = {
  name: "Demo Trader",
  email: "demo@zerodha.local",
  password: "Password@123",
  phone: "9876543210",
  userId: "ZR8899",
  role: "user",
};

const SEED_HOLDINGS = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", qty: 15, avgPrice: 2750.0 },
  { symbol: "INFY", name: "Infosys Ltd.", qty: 25, avgPrice: 1720.5 },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd.", qty: 10, avgPrice: 3950.0 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", qty: 20, avgPrice: 1610.0 },
  { symbol: "ITC", name: "ITC Ltd.", qty: 50, avgPrice: 440.0 },
  { symbol: "SBIN", name: "State Bank of India", qty: 30, avgPrice: 780.0 },
];

const SEED_POSITIONS = [
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", product: "MIS", qty: 25, avgPrice: 975.0 },
  { symbol: "WIPRO", name: "Wipro Ltd.", product: "MIS", qty: 40, avgPrice: 530.0 },
];

const SEED_WATCHLIST = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd." },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd." },
  { symbol: "INFY", name: "Infosys Ltd." },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd." },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd." },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "ITC", name: "ITC Ltd." },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd." },
];

const SEED_ORDERS = [
  {
    orderId: "ORD-1709012345-001",
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    qty: 15,
    price: 2750.0,
    type: "BUY",
    product: "CNC",
    orderType: "MARKET",
    status: "COMPLETE",
  },
  {
    orderId: "ORD-1709012345-002",
    symbol: "INFY",
    name: "Infosys Ltd.",
    qty: 25,
    price: 1720.5,
    type: "BUY",
    product: "CNC",
    orderType: "LIMIT",
    status: "COMPLETE",
  },
  {
    orderId: "ORD-1709012345-003",
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd.",
    qty: 25,
    price: 975.0,
    type: "BUY",
    product: "MIS",
    orderType: "MARKET",
    status: "COMPLETE",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("[Seeder] Connected to database. Starting seeding...");

    // Find or create demo user
    let user = await User.findOne({ email: DEMO_USER.email });
    if (!user) {
      user = new User(DEMO_USER);
      await user.save();
      console.log(`[Seeder] Created demo user: ${DEMO_USER.email}`);
    } else {
      console.log(`[Seeder] Demo user already exists: ${DEMO_USER.email}`);
    }

    const userId = user._id;

    // Reset or seed funds
    let funds = await Funds.findOne({ userId });
    if (!funds) {
      funds = new Funds({
        userId,
        availableBalance: 125000.0,
        usedMargin: 18500.0,
        collateral: 25000.0,
        transactions: [
          {
            type: "DEPOSIT",
            amount: 200000.0,
            description: "Initial Simulated Fund Payin",
            balanceAfter: 200000.0,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            type: "ORDER_BUY",
            amount: 75000.0,
            description: "Executed CNC Buy Portfolio Orders",
            balanceAfter: 125000.0,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      });
      await funds.save();
      console.log("[Seeder] Created funds with initial balance.");
    }

    // Seed holdings
    for (const holding of SEED_HOLDINGS) {
      await Holding.findOneAndUpdate(
        { userId, symbol: holding.symbol },
        { ...holding, userId },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seeder] Seeded ${SEED_HOLDINGS.length} holdings.`);

    // Seed positions
    for (const pos of SEED_POSITIONS) {
      await Position.findOneAndUpdate(
        { userId, symbol: pos.symbol, product: pos.product },
        { ...pos, userId },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seeder] Seeded ${SEED_POSITIONS.length} positions.`);

    // Seed watchlist
    await Watchlist.findOneAndUpdate(
      { userId },
      { userId, items: SEED_WATCHLIST },
      { upsert: true, new: true }
    );
    console.log(`[Seeder] Seeded ${SEED_WATCHLIST.length} watchlist items.`);

    // Seed sample orders
    for (const ord of SEED_ORDERS) {
      await Order.findOneAndUpdate(
        { userId, orderId: ord.orderId },
        { ...ord, userId },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seeder] Seeded ${SEED_ORDERS.length} past orders.`);

    console.log("[Seeder] Seeding finished successfully!");
    return user;
  } catch (error) {
    console.error("[Seeder] Error seeding database:", error.message);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}

module.exports = { seedDatabase, DEMO_USER };
