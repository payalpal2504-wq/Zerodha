const express = require("express");
const router = express.Router();
const marketController = require("../controllers/market.controller");

router.get("/quotes", marketController.getAllQuotes);
router.get("/quote/:symbol", marketController.getSingleQuote);

module.exports = router;
