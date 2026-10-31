const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");

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
