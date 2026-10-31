const marketService = require("./market.service");

class PortfolioService {
  /**
   * Enrich raw holdings with current market prices, current values, and P&L
   */
  enrichHoldings(holdings) {
    let totalInvestment = 0;
    let currentValue = 0;
    let totalDaysPnL = 0;

    const enriched = holdings.map((holding) => {
      const quote = marketService.getQuote(holding.symbol);
      const ltp = quote.price;
      const investment = Number((holding.qty * holding.avgPrice).toFixed(2));
      const curValue = Number((holding.qty * ltp).toFixed(2));
      const pnl = Number((curValue - investment).toFixed(2));
      const pnlPercent = investment > 0 ? Number(((pnl / investment) * 100).toFixed(2)) : 0;
      const dayPnL = Number((holding.qty * quote.change).toFixed(2));

      totalInvestment += investment;
      currentValue += curValue;
      totalDaysPnL += dayPnL;

      return {
        _id: holding._id,
        symbol: holding.symbol,
        name: holding.name,
        qty: holding.qty,
        avgPrice: holding.avgPrice,
        ltp,
        curValue,
        investment,
        pnl,
        pnlPercent,
        dayChange: quote.change,
        dayChangePercent: quote.percentChange,
        dayPnL,
      };
    });

    const totalPnL = Number((currentValue - totalInvestment).toFixed(2));
    const totalPnLPercent =
      totalInvestment > 0 ? Number(((totalPnL / totalInvestment) * 100).toFixed(2)) : 0;

    return {
      holdings: enriched,
      summary: {
        totalInvestment: Number(totalInvestment.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        totalPnL,
        totalPnLPercent,
        totalDaysPnL: Number(totalDaysPnL.toFixed(2)),
      },
    };
  }

  /**
   * Enrich raw positions with current market prices and real-time P&L
   */
  enrichPositions(positions) {
    let totalPositionsPnL = 0;

    const enriched = positions.map((pos) => {
      const quote = marketService.getQuote(pos.symbol);
      const ltp = quote.price;
      const pnl = Number(((ltp - pos.avgPrice) * pos.qty).toFixed(2));
      const pnlPercent =
        pos.avgPrice > 0 ? Number((((ltp - pos.avgPrice) / pos.avgPrice) * 100).toFixed(2)) : 0;

      totalPositionsPnL += pnl;

      return {
        _id: pos._id,
        product: pos.product,
        symbol: pos.symbol,
        name: pos.name,
        qty: pos.qty,
        avgPrice: pos.avgPrice,
        ltp,
        pnl,
        pnlPercent,
        dayChange: quote.change,
        dayChangePercent: quote.percentChange,
        isLoss: pnl < 0,
      };
    });

    return {
      positions: enriched,
      totalPnL: Number(totalPositionsPnL.toFixed(2)),
    };
  }
}

module.exports = new PortfolioService();
