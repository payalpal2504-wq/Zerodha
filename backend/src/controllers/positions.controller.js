const Position = require("../models/Position");
const portfolioService = require("../services/portfolio.service");

exports.getPositions = async (req, res, next) => {
  try {
    const rawPositions = await Position.find({ userId: req.user._id }).sort({ symbol: 1 });
    const { positions, totalPnL } = portfolioService.enrichPositions(rawPositions);

    res.json({
      success: true,
      data: positions,
      totalPnL,
    });
  } catch (error) {
    next(error);
  }
};
