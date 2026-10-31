const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      min: [0, "Quantity cannot be negative"],
    },
    avgPrice: {
      type: Number,
      required: true,
      min: [0, "Average price cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique stock per user in holdings
holdingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model("Holding", holdingSchema);
