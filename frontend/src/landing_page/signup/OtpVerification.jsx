import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function OtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Retrieve passed state (phone, devOtp, etc.)
  const phone = location.state?.phone || "";
  const initialDevOtp = location.state?.devOtp || "";
  const initialCooldown = location.state?.cooldownSeconds || 30;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(initialCooldown);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devOtpNotice, setDevOtpNotice] = useState(initialDevOtp);

  const inputRefs = useRef([]);

  // Redirect if no phone number was passed
  useEffect(() => {
    if (!phone) {
      navigate("/signup", { replace: true });
    }
  }, [phone, navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Focus the first empty input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle single character input & auto-focus movement
  const handleInputChange = (index, value) => {
    // Only permit digits
    const cleanChar = value.replace(/\D/g, "");
    if (!cleanChar && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = cleanChar ? cleanChar.slice(-1) : "";
    setOtp(newOtp);
    if (error) setError("");

    // Move to next box if character entered
    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Current box is empty, jump to previous and focus
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste support for 6-digit codes
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);
    if (error) setError("");

    const targetIndex = Math.min(pasteData.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  // Quick autofill for development test mode
  const autofillDevOtp = (code) => {
    if (!code || code.length !== 6) return;
    const digits = code.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  // Submit OTP Verification
  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post("/auth/verify-otp", {
        phone,
        otp: fullOtp,
      });

      if (response.data?.success && response.data?.token) {
        setSuccessMsg("Verification successful! Redirecting to dashboard...");
        login(response.data.token, response.data.user);

        // Redirect to Kite Dashboard
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 600);
      } else {
        setError(response.data?.message || "Invalid OTP code.");
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (timer > 0 || resending) return;

    setResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post("/auth/resend-otp", { phone });

      if (response.data?.success) {
        setSuccessMsg(`A new OTP has been sent to +91 ${phone}`);
        setTimer(response.data.cooldownSeconds || 30);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();

        if (response.data.devOtp) {
          setDevOtpNotice(response.data.devOtp);
        }
      } else {
        setError(response.data?.message || "Could not resend OTP.");
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center p-3 p-md-5">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0 p-4 p-md-5 rounded-3">
            {/* Zerodha Header */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3"
                style={{ width: "64px", height: "64px" }}
              >
                <i
                  className="fa fa-shield text-primary"
                  style={{ fontSize: "28px", color: "#387ed1" }}
                ></i>
              </div>
              <h2 className="fw-normal mb-1">Two-factor authentication</h2>
              <p className="text-muted small mt-2">
                Enter the 6-digit OTP sent to{" "}
                <span className="fw-semibold text-dark">+91 {phone}</span>
              </p>
              <button
                type="button"
                className="btn btn-link btn-sm text-decoration-none p-0"
                style={{ fontSize: "13px", color: "#387ed1" }}
                onClick={() => navigate(-1)}
              >
                <i className="fa fa-pencil me-1"></i> Change mobile number
              </button>
            </div>

            {/* Development Mock Notice */}
            {devOtpNotice && (
              <div
                className="alert alert-info py-2 px-3 mb-3 small d-flex align-items-center justify-content-between"
                role="alert"
              >
                <div>
                  <i className="fa fa-info-circle me-2"></i>
                  <strong>[Dev Test Mode] OTP:</strong> <code>{devOtpNotice}</code>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary py-0 px-2"
                  onClick={() => autofillDevOtp(devOtpNotice)}
                  style={{ fontSize: "11px" }}
                >
                  Auto-fill
                </button>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 small" role="alert">
                <i className="fa fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="alert alert-success py-2 px-3 mb-3 small" role="alert">
                <i className="fa fa-check-circle me-2"></i>
                {successMsg}
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerify}>
              {/* 6 Individual Input Boxes */}
              <div
                className="d-flex justify-content-between gap-2 mb-4"
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    className="form-control text-center fw-bold fs-4 p-0"
                    style={{
                      height: "52px",
                      maxWidth: "50px",
                      borderRadius: "6px",
                      border: digit ? "1.5px solid #387ed1" : "1px solid #ced4da",
                      backgroundColor: digit ? "#f8fbff" : "#fff",
                    }}
                    value={digit}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={loading}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-medium shadow-sm mb-3"
                style={{ backgroundColor: "#387ed1", borderColor: "#387ed1" }}
                disabled={loading || otp.join("").length !== 6}
              >
                {loading ? (
                  <span>
                    <i className="fa fa-spinner fa-spin me-2"></i> Verifying OTP...
                  </span>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              {/* Resend OTP Section */}
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <span className="text-muted small">
                  Didn't receive the code?
                </span>

                {timer > 0 ? (
                  <span className="badge bg-light text-muted border px-2 py-1 small">
                    <i className="fa fa-clock-o me-1"></i> Resend in {timer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-decoration-none fw-medium p-0"
                    style={{ color: "#387ed1" }}
                    onClick={handleResend}
                    disabled={resending}
                  >
                    {resending ? (
                      <span>
                        <i className="fa fa-spinner fa-spin me-1"></i> Sending...
                      </span>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
