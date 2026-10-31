const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlist.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

router.use(authMiddleware);

router.get("/", watchlistController.getWatchlist);
router.post(
  "/",
  validate(watchlistController.addWatchlistSchema),
  watchlistController.addToWatchlist
);
router.delete("/:id", watchlistController.removeFromWatchlist);

module.exports = router;
