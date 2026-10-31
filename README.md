# Zerodha Kite — Full-Stack Trading Platform

A modern, high-fidelity Zerodha Kite trading platform clone built with a React + Vite frontend and an Express + MongoDB backend.

## Project Structure

```text
Zerodha_project/
├── frontend/               # React + Vite trading dashboard
│   ├── src/
│   │   ├── api/            # API client with credentials & token support
│   │   ├── components/     # Navbar, Watchlist, OrderModal, ProtectedRoute
│   │   ├── context/        # AuthContext for session management
│   │   ├── pages/          # Dashboard, Orders, Holdings, Positions, Funds, Login, Signup
│   │   ├── App.jsx         # Router & Kite layout wrapper
│   │   ├── index.css       # Zerodha Kite typography, layout & styling
│   │   └── main.jsx        # Root React mount
│   ├── index.html
│   └── vite.config.js
├── backend/                # Express + MongoDB trading engine
│   ├── src/
│   │   ├── config/         # Database connection module
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, error handling, rate limiting, validation
│   │   ├── models/         # User, Holding, Position, Order, Watchlist, Funds
│   │   ├── routes/         # REST endpoints under /api/*
│   │   ├── services/       # Market data provider & portfolio calculators
│   │   └── utils/          # JWT utilities & database seeder
│   └── tests/              # 12 automated unit & integration tests
└── package.json            # Root workspace scripts
```

## Running the Application

### 1. Start MongoDB
Ensure MongoDB is running locally on port `27017` or configure your connection string in `backend/.env`.

### 2. Start the Backend
```bash
cd backend
npm install
npm run seed     # Seeds demo portfolio
npm run dev      # Starts on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

## Demo Credentials
- **Email:** `demo@zerodha.local`
- **Password:** `Password@123`
- Click the **"⚡ Auto-fill Demo Account"** button on the Login page for one-click access.

## Features
- **Authentication**: JWT authentication with HTTP-only cookies and Bearer tokens, bcrypt password hashing, and auto-session verification.
- **Watchlist**: Search symbols, real-time simulated quotes, add/remove instruments, and hover action buttons (**B** for Buy, **S** for Sell).
- **Order Window**: Authentic Kite modal supporting CNC/MIS products, Market/Limit types, margin calculations, and real-time validation.
- **Portfolio & Holdings**: Auto-calculated invested value, current market value, day's P&L, and total P&L.
- **Positions**: Intraday contracts with real-time P&L and one-click exit.
- **Funds & Margins**: Live cash balance, margin used, instant simulated deposit, and withdrawal with complete transaction ledger.
