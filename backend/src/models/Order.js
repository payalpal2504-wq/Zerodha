const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    product: {
      type: String,
      enum: ["CNC", "MIS"],
      default: "CNC",
    },
    orderType: {
      type: String,
      enum: ["MARKET", "LIMIT"],
      default: "MARKET",
    },
    status: {
      type: String,
      enum: ["COMPLETE", "PENDING", "CANCELLED", "REJECTED"],
      default: "COMPLETE",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
