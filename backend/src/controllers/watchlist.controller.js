const Watchlist = require("../models/Watchlist");
const marketService = require("../services/market.service");
const { z } = require("zod");

const addWatchlistSchema = z.object({
  symbol: z.string().min(1).toUpperCase(),
});

exports.getWatchlist = async (req, res, next) => {
  try {
    let watchlist = await Watchlist.findOne({ userId: req.user._id });
    if (!watchlist) {
      watchlist = await Watchlist.create({
        userId: req.user._id,
        items: [
          { symbol: "RELIANCE", name: "Reliance Industries Ltd." },
          { symbol: "TCS", name: "Tata Consultancy Services Ltd." },
          { symbol: "INFY", name: "Infosys Ltd." },
          { symbol: "HDFCBANK", name: "HDFC Bank Ltd." },
          { symbol: "ITC", name: "ITC Ltd." },
        ],
      });
    }

    // Enrich with live quotes
    const enrichedItems = watchlist.items.map((item) => {
      const quote = marketService.getQuote(item.symbol);
      return {
        _id: item._id,
        symbol: item.symbol,
        name: item.name,
        exchange: item.exchange,
        price: quote.price,
        change: quote.change,
        percentChange: quote.percentChange,
        isLoss: quote.change < 0,
      };
    });

    res.json({
      success: true,
      data: enrichedItems,
    });
  } catch (error) {
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    const cleanSymbol = symbol.toUpperCase().trim();
    const quote = marketService.getQuote(cleanSymbol);

    let watchlist = await Watchlist.findOne({ userId: req.user._id });
    if (!watchlist) {
      watchlist = new Watchlist({ userId: req.user._id, items: [] });
    }

    // Check if symbol already exists in watchlist
    const alreadyExists = watchlist.items.some((item) => item.symbol === cleanSymbol);
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: `${cleanSymbol} is already in your watchlist.`,
      });
    }

    watchlist.items.push({
      symbol: cleanSymbol,
      name: quote.name,
      exchange: quote.exchange || "NSE",
    });
    await watchlist.save();

    res.status(201).json({
      success: true,
      message: `${cleanSymbol} added to watchlist.`,
      data: {
        symbol: cleanSymbol,
        name: quote.name,
        exchange: quote.exchange,
        price: quote.price,
        change: quote.change,
        percentChange: quote.percentChange,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cleanParam = id.toUpperCase().trim();

    const watchlist = await Watchlist.findOne({ userId: req.user._id });
    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: "Watchlist not found.",
      });
    }

    // Allow deleting either by mongo _id or by stock symbol
    watchlist.items = watchlist.items.filter(
      (item) => item._id.toString() !== id && item.symbol !== cleanParam
    );
    await watchlist.save();

    res.json({
      success: true,
      message: "Symbol removed from watchlist.",
    });
  } catch (error) {
    next(error);
  }
};

exports.addWatchlistSchema = addWatchlistSchema;
