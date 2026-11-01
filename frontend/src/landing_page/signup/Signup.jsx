import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Signup() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    // Only permit digits up to 10
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate 10 digit Indian mobile number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number (starts with 6-9).");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/send-otp", {
        phone,
        purpose: "signup",
      });

      if (response.data?.success) {
        // Navigate to OTP verification page with phone and metadata
        navigate("/verify-otp", {
          state: {
            phone,
            purpose: "signup",
            isExistingUser: response.data.isExistingUser,
            devOtp: response.data.devOtp,
            cooldownSeconds: response.data.cooldownSeconds || 30,
          },
        });
      } else {
        setError(response.data?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row p-4 p-md-5 align-items-center">
        {/* Left Banner */}
        <div className="col-lg-7 col-12 text-center p-3 p-md-4">
          <img
            src="/media/images/signup.png"
            alt="Signup Banner"
            className="img-fluid"
            style={{ maxWidth: "85%" }}
          />
        </div>

        {/* Right Form Card */}
        <div className="col-lg-5 col-12 p-3 p-md-4">
          <h1 className="fw-normal mb-1">Signup now</h1>
          <p className="text-muted mt-2 mb-4">
            Or track your existing application.
          </p>

          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3 small" role="alert">
              <i className="fa fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group mb-2">
              <span className="input-group-text bg-white text-muted fw-medium px-3 border-end-0">
                +91
              </span>
              <input
                type="tel"
                id="mobileNumber"
                className="form-control py-2 ps-2 border-start-0"
                placeholder="Your 10 digit mobile number"
                value={phone}
                onChange={handlePhoneChange}
                maxLength="10"
                disabled={loading}
                autoFocus
                required
              />
            </div>

            <p className="text-muted mb-3" style={{ fontSize: "12px" }}>
              You will receive an OTP on your number
            </p>

            <button
              type="submit"
              className="btn btn-primary px-4 py-2 w-100 fw-medium shadow-sm"
              style={{ backgroundColor: "#387ed1", borderColor: "#387ed1" }}
              disabled={loading || phone.length !== 10}
            >
              {loading ? (
                <span>
                  <i className="fa fa-spinner fa-spin me-2"></i> Sending OTP...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-3 text-center">
            <span className="text-muted small">Already have an account? </span>
            <Link to="/login" className="text-primary text-decoration-none small fw-medium">
              Log in here
            </Link>
          </div>

          <div className="mt-4 pt-2 border-top">
            <p className="text-muted" style={{ fontSize: "12px", lineHeight: "1.5" }}>
              By submitting your contact details, you authorize Zerodha to
              contact you even if you are registered on DND &amp; agree to our{" "}
              <a href="#" style={{ textDecoration: "none" }}>
                Terms &amp; conditions
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
