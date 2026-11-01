import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // overview, orders, holdings, positions, funds
  const [watchlist, setWatchlist] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [holdingsSummary, setHoldingsSummary] = useState(null);
  const [positions, setPositions] = useState([]);
  const [positionsSummary, setPositionsSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [funds, setFunds] = useState(null);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState("");

  // Order Modal State
  const [orderModal, setOrderModal] = useState({
    isOpen: false,
    symbol: "",
    name: "",
    price: 0,
    type: "BUY", // BUY or SELL
    product: "CNC", // CNC or MIS
    orderType: "MARKET", // MARKET or LIMIT
    qty: 1,
  });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Fetch initial trading data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [wlRes, holdRes, posRes, ordRes, fndRes, mktRes] = await Promise.allSettled([
        api.get("/watchlist"),
        api.get("/holdings"),
        api.get("/positions"),
        api.get("/orders"),
        api.get("/funds"),
        api.get("/market/quotes"),
      ]);

      if (wlRes.status === "fulfilled" && wlRes.value.data?.success) {
        setWatchlist(wlRes.value.data.data?.items || []);
      }
      if (holdRes.status === "fulfilled" && holdRes.value.data?.success) {
        setHoldings(holdRes.value.data.data || []);
        setHoldingsSummary(holdRes.value.data.summary);
      }
      if (posRes.status === "fulfilled" && posRes.value.data?.success) {
        setPositions(posRes.value.data.data || []);
        setPositionsSummary(posRes.value.data.summary);
      }
      if (ordRes.status === "fulfilled" && ordRes.value.data?.success) {
        setOrders(ordRes.value.data.data || []);
      }
      if (fndRes.status === "fulfilled" && fndRes.value.data?.success) {
        setFunds(fndRes.value.data.data);
      }
      if (mktRes.status === "fulfilled" && mktRes.value.data?.success) {
        const qMap = {};
        (mktRes.value.data.data || []).forEach((q) => {
          qMap[q.symbol] = q;
        });
        setQuotes(qMap);
      }
    } catch (err) {
      console.error("[Dashboard] Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const openOrderModal = (symbol, type = "BUY") => {
    const q = quotes[symbol] || { price: 1000 };
    setOrderModal({
      isOpen: true,
      symbol,
      name: q.name || symbol,
      price: q.price || 1000,
      type,
      product: "CNC",
      orderType: "MARKET",
      qty: 1,
    });
    setOrderError("");
  };

  const closeOrderModal = () => {
    setOrderModal((prev) => ({ ...prev, isOpen: false }));
    setOrderError("");
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);
    setOrderError("");

    try {
      const response = await api.post("/orders", {
        symbol: orderModal.symbol,
        qty: Number(orderModal.qty),
        type: orderModal.type,
        product: orderModal.product,
        orderType: orderModal.orderType,
        price: Number(orderModal.price),
      });

      if (response.data?.success) {
        setActionNotice(`Order placed: ${orderModal.type} ${orderModal.qty} ${orderModal.symbol}`);
        closeOrderModal();
        await fetchData(); // refresh portfolio and funds
        setTimeout(() => setActionNotice(""), 4000);
      } else {
        setOrderError(response.data?.message || "Order rejected.");
      }
    } catch (err) {
      setOrderError(err.message || "Failed to place order.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleAddFunds = async (amount = 25000) => {
    try {
      const res = await api.post("/funds/deposit", { amount });
      if (res.data?.success) {
        setActionNotice(`₹${amount.toLocaleString()} added to funds.`);
        await fetchData();
        setTimeout(() => setActionNotice(""), 3000);
      }
    } catch (err) {
      alert(err.message || "Could not add funds");
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Top Kite Header */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-2 px-3 sticky-top shadow-sm">
        <div className="container-fluid">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <img
              src="/media/images/kite.png"
              alt="Kite"
              height="28"
              className="me-2"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="fw-bold fs-5 text-dark" style={{ letterSpacing: "-0.5px" }}>
              Kite
            </span>
          </div>

          {/* Market Tickers */}
          <div className="d-none d-md-flex align-items-center ms-4 ps-3 border-start gap-4 small text-muted">
            <div>
              <span className="fw-medium text-dark">NIFTY 50</span>{" "}
              <span className="text-success fw-semibold">24,350.25</span>{" "}
              <span className="text-success small">+0.45%</span>
            </div>
            <div>
              <span className="fw-medium text-dark">SENSEX</span>{" "}
              <span className="text-success fw-semibold">80,120.80</span>{" "}
              <span className="text-success small">+0.38%</span>
            </div>
          </div>

          {/* Nav Tabs & User ID */}
          <div className="ms-auto d-flex align-items-center gap-3">
            <ul className="nav nav-pills d-none d-sm-flex">
              {[
                ["overview", "Dashboard"],
                ["orders", "Orders"],
                ["holdings", "Holdings"],
                ["positions", "Positions"],
                ["funds", "Funds"],
              ].map(([tab, label]) => (
                <li className="nav-item" key={tab}>
                  <button
                    type="button"
                    className={`nav-link py-1 px-3 btn-sm fw-medium rounded-pill ${
                      activeTab === tab
                        ? "active bg-primary text-white"
                        : "text-secondary"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            {/* User Dropdown */}
            <div className="d-flex align-items-center gap-2 border-start ps-3">
              <span className="badge bg-light text-primary border px-2 py-2 fw-semibold">
                <i className="fa fa-user me-1"></i> {user?.userId || "USER"}
              </span>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm py-1 px-2"
                title="Logout"
                onClick={handleLogout}
              >
                <i className="fa fa-sign-out"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="container mt-2">
          <div className="alert alert-success py-2 px-3 shadow-sm small d-flex align-items-center">
            <i className="fa fa-check-circle me-2"></i> {actionNotice}
          </div>
        </div>
      )}

      {/* Main Body: 2 Columns */}
      <div className="container-fluid px-3 px-md-4 mt-3">
        <div className="row g-3">
          {/* Left Column: Watchlist (col-lg-4) */}
          <div className="col-12 col-lg-4">
            <div className="card border shadow-sm rounded-3 overflow-hidden bg-white">
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-semibold">
                  <i className="fa fa-bookmark text-primary me-2"></i> Market Watchlist
                </h6>
                <span className="badge bg-light text-muted border">
                  {watchlist.length || 8} stocks
                </span>
              </div>

              {/* Watchlist Items */}
              <div className="list-group list-group-flush" style={{ maxHeight: "580px", overflowY: "auto" }}>
                {(watchlist.length > 0
                  ? watchlist
                  : [
                      { symbol: "RELIANCE", name: "Reliance Industries" },
                      { symbol: "TCS", name: "Tata Consultancy Services" },
                      { symbol: "INFY", name: "Infosys Ltd." },
                      { symbol: "HDFCBANK", name: "HDFC Bank" },
                      { symbol: "ICICIBANK", name: "ICICI Bank" },
                      { symbol: "SBIN", name: "State Bank of India" },
                      { symbol: "ITC", name: "ITC Ltd." },
                      { symbol: "TATAMOTORS", name: "Tata Motors Ltd." },
                    ]
                ).map((item) => {
                  const quote = quotes[item.symbol] || {
                    price: 2450.5,
                    change: 12.3,
                    changePercent: 0.52,
                  };
                  const isPositive = (quote.change || 0) >= 0;

                  return (
                    <div
                      key={item.symbol}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-3"
                    >
                      <div>
                        <div className="fw-semibold text-dark">{item.symbol}</div>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: "160px" }}>
                          {item.name || quotes[item.symbol]?.name}
                        </small>
                      </div>

                      <div className="text-end d-flex align-items-center gap-3">
                        <div>
                          <div className="fw-medium">₹{Number(quote.price || 0).toFixed(2)}</div>
                          <small className={isPositive ? "text-success" : "text-danger"}>
                            {isPositive ? "+" : ""}
                            {Number(quote.change || 0).toFixed(2)} (
                            {isPositive ? "+" : ""}
                            {Number(quote.changePercent || 0).toFixed(2)}%)
                          </small>
                        </div>

                        {/* Buy / Sell Quick Buttons */}
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm px-2 py-0 fw-bold"
                            style={{ backgroundColor: "#387ed1" }}
                            title="Buy"
                            onClick={() => openOrderModal(item.symbol, "BUY")}
                          >
                            B
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm px-2 py-0 fw-bold"
                            title="Sell"
                            onClick={() => openOrderModal(item.symbol, "SELL")}
                          >
                            S
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Trading Tabs (col-lg-8) */}
          <div className="col-12 col-lg-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="row g-3">
                {/* Portfolio Summary Card */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="text-muted small">Total Investment</span>
                        <h3 className="fw-bold mt-1 text-dark">
                          ₹{Number(holdingsSummary?.totalInvestment || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                      </div>
                      <div className="text-end">
                        <span className="text-muted small">Current Valuation</span>
                        <h3 className="fw-bold mt-1 text-primary">
                          ₹{Number(holdingsSummary?.currentValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                      </div>
                    </div>

                    <div className="row g-2 mt-3 pt-3 border-top">
                      <div className="col-sm-4">
                        <span className="text-muted small">Total P&amp;L:</span>{" "}
                        <span
                          className={`fw-semibold ${(holdingsSummary?.totalPnL || 0) >= 0 ? "text-success" : "text-danger"}`}
                        >
                          {(holdingsSummary?.totalPnL || 0) >= 0 ? "+" : ""}
                          ₹{Number(holdingsSummary?.totalPnL || 0).toFixed(2)} (
                          {Number(holdingsSummary?.pnlPercentage || 0).toFixed(2)}%)
                        </span>
                      </div>
                      <div className="col-sm-4">
                        <span className="text-muted small">Available Cash:</span>{" "}
                        <span className="fw-semibold text-dark">
                          ₹{Number(funds?.availableBalance || 100000).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="col-sm-4 text-sm-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary py-0 px-2"
                          onClick={() => handleAddFunds(50000)}
                        >
                          + Add Demo Margin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Holdings Preview */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Holdings ({holdings.length})</h6>
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-decoration-none p-0"
                        onClick={() => setActiveTab("holdings")}
                      >
                        View all &rarr;
                      </button>
                    </div>

                    {holdings.length === 0 ? (
                      <div className="text-center py-4 text-muted small">
                        No delivery holdings yet. Click <strong>B</strong> on any watchlist stock to buy!
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle small mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Instrument</th>
                              <th>Qty</th>
                              <th>Avg Price</th>
                              <th>LTP</th>
                              <th>Cur. Val</th>
                              <th>P&amp;L</th>
                            </tr>
                          </thead>
                          <tbody>
                            {holdings.slice(0, 5).map((h) => (
                              <tr key={h._id || h.symbol}>
                                <td className="fw-medium">{h.symbol}</td>
                                <td>{h.quantity}</td>
                                <td>₹{Number(h.avgPrice).toFixed(2)}</td>
                                <td>₹{Number(h.currentPrice || h.avgPrice).toFixed(2)}</td>
                                <td>₹{Number(h.currentValue || (h.quantity * h.avgPrice)).toFixed(2)}</td>
                                <td className={(h.pnl || 0) >= 0 ? "text-success" : "text-danger"}>
                                  {(h.pnl || 0) >= 0 ? "+" : ""}
                                  ₹{Number(h.pnl || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Holdings Tab */}
            {activeTab === "holdings" && (
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">Holdings ({holdings.length})</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={fetchData}>
                    <i className="fa fa-refresh me-1"></i> Refresh
                  </button>
                </div>

                {holdings.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="fa fa-folder-open-o fs-1 mb-2 d-block text-secondary"></i>
                    You have no stock holdings yet.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light small">
                        <tr>
                          <th>Instrument</th>
                          <th>Qty</th>
                          <th>Avg Cost</th>
                          <th>LTP</th>
                          <th>Cur. Value</th>
                          <th>P&amp;L</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map((h) => (
                          <tr key={h._id || h.symbol}>
                            <td className="fw-bold text-dark">{h.symbol}</td>
                            <td>{h.quantity}</td>
                            <td>₹{Number(h.avgPrice).toFixed(2)}</td>
                            <td>₹{Number(h.currentPrice || h.avgPrice).toFixed(2)}</td>
                            <td>₹{Number(h.currentValue || h.quantity * h.avgPrice).toFixed(2)}</td>
                            <td className={(h.pnl || 0) >= 0 ? "text-success fw-medium" : "text-danger fw-medium"}>
                              {(h.pnl || 0) >= 0 ? "+" : ""}₹{Number(h.pnl || 0).toFixed(2)}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm py-0 px-2"
                                onClick={() => openOrderModal(h.symbol, "SELL")}
                              >
                                Exit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Positions Tab */}
            {activeTab === "positions" && (
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">Intraday Positions ({positions.length})</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={fetchData}>
                    <i className="fa fa-refresh me-1"></i> Refresh
                  </button>
                </div>

                {positions.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="fa fa-briefcase fs-1 mb-2 d-block text-secondary"></i>
                    No open intraday positions for today.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light small">
                        <tr>
                          <th>Product</th>
                          <th>Instrument</th>
                          <th>Qty</th>
                          <th>Avg Price</th>
                          <th>LTP</th>
                          <th>P&amp;L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map((p) => (
                          <tr key={p._id || p.symbol}>
                            <td><span className="badge bg-light text-dark border">{p.product || "MIS"}</span></td>
                            <td className="fw-bold">{p.symbol}</td>
                            <td>{p.quantity}</td>
                            <td>₹{Number(p.avgPrice).toFixed(2)}</td>
                            <td>₹{Number(p.currentPrice || p.avgPrice).toFixed(2)}</td>
                            <td className={(p.pnl || 0) >= 0 ? "text-success fw-medium" : "text-danger fw-medium"}>
                              {(p.pnl || 0) >= 0 ? "+" : ""}₹{Number(p.pnl || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">Order Book ({orders.length})</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={fetchData}>
                    <i className="fa fa-refresh me-1"></i> Refresh
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="fa fa-clock-o fs-1 mb-2 d-block text-secondary"></i>
                    No executed orders found.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle small">
                      <thead className="table-light">
                        <tr>
                          <th>Time</th>
                          <th>Type</th>
                          <th>Instrument</th>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o._id || o.orderId}>
                            <td className="text-muted">
                              {o.createdAt ? new Date(o.createdAt).toLocaleTimeString() : "--"}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  o.type === "BUY" ? "bg-primary" : "bg-danger"
                                }`}
                              >
                                {o.type}
                              </span>
                            </td>
                            <td className="fw-bold">{o.symbol}</td>
                            <td>{o.product}</td>
                            <td>{o.qty}</td>
                            <td>₹{Number(o.price).toFixed(2)}</td>
                            <td>
                              <span
                                className={`badge ${
                                  o.status === "COMPLETE"
                                    ? "bg-success"
                                    : o.status === "REJECTED"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Funds Tab */}
            {activeTab === "funds" && (
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <h5 className="fw-semibold mb-4">Funds &amp; Margins</h5>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <span className="text-muted small">Available Cash</span>
                      <h4 className="fw-bold mt-1 text-primary">
                        ₹{Number(funds?.availableBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <span className="text-muted small">Used Margin</span>
                      <h4 className="fw-bold mt-1 text-dark">
                        ₹{Number(funds?.usedMargin || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <span className="text-muted small">Collateral Margin</span>
                      <h4 className="fw-bold mt-1 text-dark">
                        ₹{Number(funds?.collateral || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAddFunds(50000)}
                  >
                    + Add ₹50,000 Demo Funds
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleAddFunds(100000)}
                  >
                    + Add ₹1,00,000 Demo Funds
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Window Modal */}
      {orderModal.isOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div
                className={`modal-header py-3 ${
                  orderModal.type === "BUY" ? "bg-primary text-white" : "bg-danger text-white"
                }`}
              >
                <h5 className="modal-title fs-6 fw-bold">
                  {orderModal.type} {orderModal.symbol}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeOrderModal}
                  aria-label="Close"
                ></button>
              </div>

              <form onSubmit={handleOrderSubmit}>
                <div className="modal-body p-4">
                  {orderError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      <i className="fa fa-exclamation-circle me-1"></i> {orderError}
                    </div>
                  )}

                  {/* Product Type Toggle: CNC / MIS */}
                  <div className="mb-3">
                    <label className="form-label small text-muted mb-1">Product</label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn btn-sm ${orderModal.product === "CNC" ? "btn-dark" : "btn-outline-secondary"}`}
                        onClick={() => setOrderModal((m) => ({ ...m, product: "CNC" }))}
                      >
                        CNC (Longterm)
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${orderModal.product === "MIS" ? "btn-dark" : "btn-outline-secondary"}`}
                        onClick={() => setOrderModal((m) => ({ ...m, product: "MIS" }))}
                      >
                        MIS (Intraday)
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Qty</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={orderModal.qty}
                        onChange={(e) =>
                          setOrderModal((m) => ({ ...m, qty: Math.max(1, parseInt(e.target.value) || 1) }))
                        }
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Price</label>
                      <input
                        type="number"
                        step="0.05"
                        className="form-control"
                        value={orderModal.price}
                        onChange={(e) =>
                          setOrderModal((m) => ({ ...m, price: parseFloat(e.target.value) || 0 }))
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Required Margin Calculation */}
                  <div className="p-2 bg-light rounded text-muted small d-flex justify-content-between">
                    <span>Margin required:</span>
                    <span className="fw-bold text-dark">
                      ₹{(orderModal.qty * orderModal.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="modal-footer bg-light py-2 px-4 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={closeOrderModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-sm px-4 fw-bold ${
                      orderModal.type === "BUY" ? "btn-primary" : "btn-danger"
                    }`}
                    disabled={orderSubmitting}
                  >
                    {orderSubmitting ? (
                      <span>
                        <i className="fa fa-spinner fa-spin me-1"></i> Executing...
                      </span>
                    ) : (
                      orderModal.type
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
