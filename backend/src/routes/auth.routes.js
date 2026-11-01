const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");

// Mobile OTP endpoints
router.post(
  "/send-otp",
  authLimiter,
  validate(authController.sendOtpSchema),
  authController.sendOtp
);

router.post(
  "/resend-otp",
  authLimiter,
  validate(authController.resendOtpSchema),
  authController.resendOtp
);

router.post(
  "/verify-otp",
  authLimiter,
  validate(authController.verifyOtpSchema),
  authController.verifyOtp
);

// Email & password endpoints
router.post(
  "/register",
  authLimiter,
  validate(authController.registerSchema),
  authController.register
);

router.post(
  "/login",
  authLimiter,
  validate(authController.loginSchema),
  authController.login
);

router.post("/logout", authController.logout);

router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
