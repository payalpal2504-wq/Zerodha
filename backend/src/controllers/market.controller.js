const marketService = require("../services/market.service");

exports.getAllQuotes = (req, res) => {
  const quotes = marketService.getAllQuotes();
  const indices = marketService.getIndexQuotes();

  res.json({
    success: true,
    data: {
      indices,
      quotes,
    },
  });
};

exports.getSingleQuote = (req, res) => {
  const { symbol } = req.params;
  const quote = marketService.getQuote(symbol);

  res.json({
    success: true,
    data: quote,
  });
};
