const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
      default: function () {
        if (this.phone) return `User ${this.phone.slice(-4)}`;
        return "Zerodha Trader";
      },
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    userId: {
      type: String,
      unique: true,
      uppercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Generate Kite-like user ID before saving
userSchema.pre("save", async function (next) {
  if (!this.userId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = (this.name ? this.name.replace(/[^A-Za-z]/g, "").slice(0, 2) : "ZR").toUpperCase() || "ZR";
    this.userId = `${prefix}${randomNum}`;
  }

  if (!this.password || !this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
