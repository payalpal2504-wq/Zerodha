const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

router.use(authMiddleware);

router.get("/me", userController.getProfile);
router.put(
  "/me",
  validate(userController.updateProfileSchema),
  userController.updateProfile
);

module.exports = router;
