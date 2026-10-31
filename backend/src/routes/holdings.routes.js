const express = require("express");
const router = express.Router();
const holdingsController = require("../controllers/holdings.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", holdingsController.getHoldings);

module.exports = router;
