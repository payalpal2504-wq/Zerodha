# Zerodha Clone — Backend API

Production-ready, modular REST API engine for the Zerodha Kite trading platform built with Node.js, Express, MongoDB, and Mongoose.

## Architecture

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Mongoose connection & health status
│   ├── controllers/
│   │   ├── auth.controller.js     # User registration, login, logout, me
│   │   ├── user.controller.js     # User profile retrieval & safe updates
│   │   ├── holdings.controller.js # Longterm portfolio holdings
│   │   ├── positions.controller.js# Intraday open positions
│   │   ├── orders.controller.js   # Simulated execution & order book
│   │   ├── watchlist.controller.js# Watchlist management
│   │   ├── funds.controller.js    # Margins, simulated deposits & withdrawals
│   │   └── market.controller.js   # Stock quotes & indices
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT & HTTP-only cookie extraction
│   │   ├── error.middleware.js    # Centralized error handler
│   │   ├── validate.middleware.js # Zod schema validation
│   │   └── rateLimit.middleware.js# Brute-force & API rate limiters
│   ├── models/
│   │   ├── User.js                # User identity & bcrypt passwords
│   │   ├── Holding.js             # User delivery holdings
│   │   ├── Position.js            # User intraday positions
│   │   ├── Order.js               # User execution history
│   │   ├── Watchlist.js           # User custom tracked instruments
│   │   └── Funds.js               # Balances & transaction ledger
│   ├── routes/                    # Scoped REST route definitions
│   ├── services/
│   │   ├── market.service.js      # Clean market data provider interface
│   │   └── portfolio.service.js   # P&L, valuation, & summary calculators
│   ├── utils/
│   │   ├── jwt.js                 # JWT signing & verification
│   │   └── seed.js                # Deterministic demo portfolio seeder
│   ├── app.js                     # Express middleware & route setup
│   └── server.js                  # Entrypoint & database bootstrap
├── tests/
│   ├── auth.test.js               # Auth, security, & JWT tests
│   └── trading.test.js            # Trading, order, holdings & funds tests
├── .env.example
├── .gitignore
└── package.json
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/zerodha_trading
JWT_SECRET=zerodha_secure_dev_jwt_secret_key_8899
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
AUTO_SEED=true
```

### 3. Seed Demo Data
```bash
npm run seed
```

### 4. Run Automated Tests
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
# Server running on http://localhost:5000/api
```

## Demo Credentials
- **Email:** `demo@zerodha.local`
- **Password:** `Password@123`
- **User ID:** `ZR8899`
- **Initial Demo Capital:** `₹1,00,000.00`
