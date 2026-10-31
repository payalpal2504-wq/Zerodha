const User = require("../models/User");
const Funds = require("../models/Funds");
const Watchlist = require("../models/Watchlist");
const { generateToken } = require("../utils/jwt");
const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || "",
    });
    await user.save();

    // Create initial funds account with ₹1,00,000 for simulated trading
    await Funds.create({
      userId: user._id,
      availableBalance: 100000.0,
      usedMargin: 0.0,
      collateral: 0.0,
      transactions: [
        {
          type: "DEPOSIT",
          amount: 100000.0,
          description: "Welcome Bonus Demo Fund Allocation",
          balanceAfter: 100000.0,
        },
      ],
    });

    // Create default watchlist
    await Watchlist.create({
      userId: user._id,
      items: [
        { symbol: "RELIANCE", name: "Reliance Industries Ltd." },
        { symbol: "TCS", name: "Tata Consultancy Services Ltd." },
        { symbol: "INFY", name: "Infosys Ltd." },
        { symbol: "HDFCBANK", name: "HDFC Bank Ltd." },
        { symbol: "ICICIBANK", name: "ICICI Bank Ltd." },
        { symbol: "SBIN", name: "State Bank of India" },
        { symbol: "ITC", name: "ITC Ltd." },
        { symbol: "TATAMOTORS", name: "Tata Motors Ltd." },
      ],
    });

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.json({
    success: true,
    message: "Logged out successfully.",
  });
};

exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      userId: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};

exports.registerSchema = registerSchema;
exports.loginSchema = loginSchema;
