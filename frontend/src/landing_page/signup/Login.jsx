import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [activeTab, setActiveTab] = useState("otp"); // "otp" or "password"
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (error) setError("");
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/send-otp", {
        phone,
        purpose: "login",
      });

      if (response.data?.success) {
        navigate("/verify-otp", {
          state: {
            phone,
            purpose: "login",
            devOtp: response.data.devOtp,
            cooldownSeconds: response.data.cooldownSeconds || 30,
          },
        });
      } else {
        setError(response.data?.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP. Account may not exist.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data?.success && response.data?.token) {
        login(response.data.token, response.data.user);
        navigate("/dashboard");
      } else {
        setError(response.data?.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setActiveTab("password");
    setEmail("demo@zerodha.local");
    setPassword("Password@123");
    setError("");
  };

  return (
    <div className="container mt-5">
      <div className="row p-4 p-md-5 align-items-center justify-content-center">
        {/* Left Kite Banner */}
        <div className="col-lg-6 col-12 text-center p-3 p-md-4">
          <img
            src="/media/images/homeHero.png"
            alt="Zerodha Kite Login"
            className="img-fluid"
            style={{ maxWidth: "80%" }}
          />
        </div>

        {/* Right Login Box */}
        <div className="col-lg-5 col-12 p-3 p-md-4">
          <div className="card shadow-sm border-0 p-4 rounded-3">
            <div className="text-center mb-4">
              <h2 className="fw-normal mb-1">Login to Kite</h2>
              <p className="text-muted small">Zerodha trading platform</p>
            </div>

            {/* Login Mode Tabs */}
            <ul className="nav nav-pills nav-fill mb-3 bg-light p-1 rounded">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link py-2 btn-sm fw-medium ${activeTab === "otp" ? "active bg-white text-primary shadow-sm" : "text-muted"}`}
                  onClick={() => {
                    setActiveTab("otp");
                    setError("");
                  }}
                >
                  <i className="fa fa-mobile me-1"></i> Mobile OTP
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link py-2 btn-sm fw-medium ${activeTab === "password" ? "active bg-white text-primary shadow-sm" : "text-muted"}`}
                  onClick={() => {
                    setActiveTab("password");
                    setError("");
                  }}
                >
                  <i className="fa fa-key me-1"></i> Email &amp; Password
                </button>
              </li>
            </ul>

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 small" role="alert">
                <i className="fa fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            {/* Mobile OTP Tab */}
            {activeTab === "otp" && (
              <form onSubmit={handleMobileSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">
                    Mobile Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted fw-medium border-end-0">
                      +91
                    </span>
                    <input
                      type="tel"
                      className="form-control py-2 ps-2 border-start-0"
                      placeholder="10 digit registered mobile"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength="10"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <small className="text-muted" style={{ fontSize: "11px" }}>
                    We will send a 6-digit login OTP
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-medium shadow-sm"
                  style={{ backgroundColor: "#387ed1", borderColor: "#387ed1" }}
                  disabled={loading || phone.length !== 10}
                >
                  {loading ? (
                    <span>
                      <i className="fa fa-spinner fa-spin me-2"></i> Sending OTP...
                    </span>
                  ) : (
                    "Get Login OTP"
                  )}
                </button>
              </form>
            )}

            {/* Email/Password Tab */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control py-2"
                    placeholder="demo@zerodha.local"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control py-2"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-medium shadow-sm mb-2"
                  style={{ backgroundColor: "#387ed1", borderColor: "#387ed1" }}
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <i className="fa fa-spinner fa-spin me-2"></i> Signing in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>

                <button
                  type="button"
                  onClick={autofillDemo}
                  className="btn btn-outline-secondary w-100 py-2 btn-sm"
                >
                  ⚡ Auto-fill Demo Account
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-top text-center">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/signup" className="text-primary text-decoration-none small fw-medium">
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
