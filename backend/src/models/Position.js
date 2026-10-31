const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
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
    product: {
      type: String,
      enum: ["MIS", "CNC", "NRML"],
      default: "MIS",
    },
    qty: {
      type: Number,
      required: true,
    },
    avgPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

positionSchema.index({ userId: 1, symbol: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Position", positionSchema);
