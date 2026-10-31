const Holding = require("../models/Holding");
const portfolioService = require("../services/portfolio.service");

exports.getHoldings = async (req, res, next) => {
  try {
    const rawHoldings = await Holding.find({ userId: req.user._id }).sort({ symbol: 1 });
    const { holdings, summary } = portfolioService.enrichHoldings(rawHoldings);

    res.json({
      success: true,
      data: holdings,
      summary,
    });
  } catch (error) {
    next(error);
  }
};
