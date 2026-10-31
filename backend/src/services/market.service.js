/**
 * Market Data Service
 * 
 * Provides simulated deterministic market quotes for Indian equities.
 * Designed with a clean interface that can easily integrate with external market APIs (e.g., Kite Connect, Yahoo Finance, NSE).
 */

const BASE_MARKET_DATA = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", basePrice: 2845.5, prevClose: 2820.0, exchange: "NSE" },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd.", basePrice: 4120.0, prevClose: 4150.0, exchange: "NSE" },
  { symbol: "INFY", name: "Infosys Ltd.", basePrice: 1820.25, prevClose: 1795.0, exchange: "NSE" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", basePrice: 1680.4, prevClose: 1675.0, exchange: "NSE" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", basePrice: 1245.8, prevClose: 1230.5, exchange: "NSE" },
  { symbol: "SBIN", name: "State Bank of India", basePrice: 815.3, prevClose: 822.0, exchange: "NSE" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", basePrice: 1640.0, prevClose: 1625.0, exchange: "NSE" },
  { symbol: "ITC", name: "ITC Ltd.", basePrice: 475.6, prevClose: 472.0, exchange: "NSE" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", basePrice: 980.5, prevClose: 995.0, exchange: "NSE" },
  { symbol: "WIPRO", name: "Wipro Ltd.", basePrice: 535.1, prevClose: 528.4, exchange: "NSE" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd.", basePrice: 6920.0, prevClose: 6850.0, exchange: "NSE" },
  { symbol: "LT", name: "Larsen & Toubro Ltd.", basePrice: 3580.0, prevClose: 3540.0, exchange: "NSE" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries", basePrice: 1720.0, prevClose: 1710.0, exchange: "NSE" },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd.", basePrice: 11850.0, prevClose: 11900.0, exchange: "NSE" },
  { symbol: "TITAN", name: "Titan Company Ltd.", basePrice: 3450.0, prevClose: 3410.0, exchange: "NSE" },
];

class MarketService {
  /**
   * Get quote for a single symbol
   */
  getQuote(symbol) {
    const sym = (symbol || "").toUpperCase();
    const stock = BASE_MARKET_DATA.find((item) => item.symbol === sym);

    if (!stock) {
      // Fallback pseudo quote for unknown symbols
      return {
        symbol: sym,
        name: sym,
        price: 100.0,
        change: 0.0,
        percentChange: 0.0,
        prevClose: 100.0,
        exchange: "NSE",
        isSimulated: true,
      };
    }

    const price = Number(stock.basePrice.toFixed(2));
    const change = Number((price - stock.prevClose).toFixed(2));
    const percentChange = Number(((change / stock.prevClose) * 100).toFixed(2));

    return {
      symbol: stock.symbol,
      name: stock.name,
      price,
      change,
      percentChange,
      prevClose: stock.prevClose,
      exchange: stock.exchange,
      isSimulated: true,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get quotes for all tracked symbols
   */
  getAllQuotes() {
    return BASE_MARKET_DATA.map((item) => this.getQuote(item.symbol));
  }

  /**
   * Get index quotes (NIFTY 50 and SENSEX)
   */
  getIndexQuotes() {
    return [
      {
        name: "NIFTY 50",
        value: 24340.55,
        change: 85.3,
        percentChange: 0.35,
      },
      {
        name: "SENSEX",
        value: 79815.2,
        change: 290.4,
        percentChange: 0.37,
      },
    ];
  }
}

module.exports = new MarketService();
