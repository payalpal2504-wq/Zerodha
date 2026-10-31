const express = require("express");
const router = express.Router();
const positionsController = require("../controllers/positions.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", positionsController.getPositions);

module.exports = router;
