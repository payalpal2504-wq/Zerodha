const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAWAL", "ORDER_BUY", "ORDER_SELL"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "FAILED"],
      default: "COMPLETED",
    },
  },
  { _id: true }
);

const fundsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    availableBalance: {
      type: Number,
      required: true,
      default: 100000.0, // Initial simulated balance of ₹1,00,000
      min: [0, "Balance cannot be negative"],
    },
    usedMargin: {
      type: Number,
      default: 0.0,
      min: 0,
    },
    collateral: {
      type: Number,
      default: 0.0,
      min: 0,
    },
    transactions: [transactionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Funds", fundsSchema);
