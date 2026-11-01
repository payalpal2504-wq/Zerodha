const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const User = require("../models/User");
const Otp = require("../models/Otp");
const Funds = require("../models/Funds");
const Watchlist = require("../models/Watchlist");
const { generateToken } = require("../utils/jwt");
const smsService = require("../services/sms.service");

// Zod Schemas
const sendOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  purpose: z.enum(["signup", "login", "auth"]).optional().default("auth"),
});

const verifyOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  name: z.string().optional(),
});

const resendOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
});

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

/**
 * Initialize default funds and watchlist for newly registered user
 */
const initializeUserData = async (userId) => {
  const existingFunds = await Funds.findOne({ userId });
  if (!existingFunds) {
    await Funds.create({
      userId,
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
  }

  const existingWatchlist = await Watchlist.findOne({ userId });
  if (!existingWatchlist) {
    await Watchlist.create({
      userId,
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
  }
};

/**
 * POST /api/auth/send-otp
 */
exports.sendOtp = async (req, res, next) => {
  try {
    const { phone, purpose } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });

    if (purpose === "login" && !existingUser) {
      return res.status(404).json({
        success: false,
        message: "No account found with this mobile number. Please sign up first.",
      });
    }

    // Rate-limiting / Cooldown check (30 seconds between requests for the same number)
    const existingOtp = await Otp.findOne({ phone });
    if (existingOtp && existingOtp.lastSentAt) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(existingOtp.lastSentAt).getTime()) / 1000
      );
      if (elapsedSeconds < 30) {
        const waitSeconds = 30 - elapsedSeconds;
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
          retryAfter: waitSeconds,
        });
      }
    }

    // Generate cryptographically secure 6-digit OTP
    const rawOtp = String(crypto.randomInt(100000, 1000000));

    // Hash OTP before storing
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(rawOtp, salt);

    // OTP expires after 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Upsert OTP record
    await Otp.deleteMany({ phone });
    await Otp.create({
      phone,
      otpHash,
      purpose: purpose || (existingUser ? "login" : "signup"),
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt,
    });

    // Deliver via configured SMS provider
    await smsService.sendOtp(phone, rawOtp);

    const isDev = process.env.NODE_ENV !== "production";

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to +91 ${phone}`,
      phone,
      cooldownSeconds: 30,
      isExistingUser: Boolean(existingUser),
      // In dev mode only, provide devOtp for local verification ease
      ...(isDev ? { devOtp: rawOtp } : {}),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-otp
 */
exports.resendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const existingOtp = await Otp.findOne({ phone });
    if (existingOtp && existingOtp.lastSentAt) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(existingOtp.lastSentAt).getTime()) / 1000
      );
      if (elapsedSeconds < 30) {
        const waitSeconds = 30 - elapsedSeconds;
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
          retryAfter: waitSeconds,
        });
      }
    }

    // Generate new OTP
    const rawOtp = String(crypto.randomInt(100000, 1000000));
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(rawOtp, salt);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ phone });
    await Otp.create({
      phone,
      otpHash,
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt,
    });

    await smsService.sendOtp(phone, rawOtp);

    const isDev = process.env.NODE_ENV !== "production";

    return res.status(200).json({
      success: true,
      message: `New OTP sent to +91 ${phone}`,
      phone,
      cooldownSeconds: 30,
      ...(isDev ? { devOtp: rawOtp } : {}),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 */
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, name } = req.body;

    const otpRecord = await Otp.findOne({ phone });

    // Validate OTP existence & expiry
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No active OTP request found. Please request a new OTP.",
      });
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Max 5 attempts
    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "Maximum OTP attempts exceeded. Please request a new OTP.",
      });
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(String(otp), otpRecord.otpHash);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = 5 - otpRecord.attempts;

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      });
    }

    // OTP verified successfully -> Delete to prevent replay attacks
    await Otp.deleteOne({ _id: otpRecord._id });

    // Find or create user
    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        phone,
        name: name || `User ${phone.slice(-4)}`,
        email: `${phone}@zerodha.local`,
      });
      await user.save();
    }

    // Ensure demo funds and default watchlist are present
    await initializeUserData(user._id);

    // Generate JWT
    const token = generateToken({
      id: user._id,
      phone: user.phone,
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: isNewUser ? "Account created successfully!" : "Login successful!",
      isNewUser,
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register (Email + Password)
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || "",
    });
    await user.save();

    await initializeUserData(user._id);

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

/**
 * POST /api/auth/login (Email + Password)
 */
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

/**
 * POST /api/auth/logout
 */
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

/**
 * GET /api/auth/me
 */
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

// Export schemas
exports.sendOtpSchema = sendOtpSchema;
exports.verifyOtpSchema = verifyOtpSchema;
exports.resendOtpSchema = resendOtpSchema;
exports.registerSchema = registerSchema;
exports.loginSchema = loginSchema;
