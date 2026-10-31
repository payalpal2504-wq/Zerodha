import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const products = [
  ["kite.png", "Kite", "Trading platform"],
  ["console.png", "Console", "Backoffice & reports"],
  ["coin.png", "Coin", "Mutual funds"],
  ["varsity.png", "Varsity", "Education"],
  ["kiteconnect.png", "Kite Connect API", "Trading APIs"],
];

const platforms = [
  "Sensibull",
  "Smallcase",
  "Streak",
  "Ditto",
  "Zerodha Fund House",
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);

  const menuRef = useRef(null);
  const location = useLocation();

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsEcosystemOpen(false);
  }, [location.pathname]);

  // Close ecosystem dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsEcosystemOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom sticky-top bg-white py-2"
      style={{ zIndex: 1000 }}
    >
      <div className="container p-2">

        {/* Logo */}
        <Link className="navbar-brand" to="/" onClick={closeMobileMenu}>
          <img
            src="/media/images/logo.svg"
            alt="Zerodha Logo"
            width="130"
          />
        </Link>

        {/* Mobile Hamburger - Only One */}
        <button
          className="navbar-toggler border-0 d-lg-none"
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <i className="fa fa-bars fs-5" aria-hidden="true"></i>
        </button>

        {/* Navigation Links */}
        <div
          className={`navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center mb-2 mb-lg-0">

            {[
              ["Signup", "/signup"],
              ["About", "/about"],
              ["Products", "/products"],
              ["Pricing", "/pricing"],
              ["Support", "/support"],
            ].map(([label, path]) => (
              <li className="nav-item" key={path}>
                <Link
                  className="nav-link px-3"
                  to={path}
                  onClick={closeMobileMenu}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Desktop Ecosystem Menu */}
            <li
              className="nav-item position-relative ms-lg-2 d-none d-lg-block"
              ref={menuRef}
            >
              <button
                className="btn nav-link px-3 border-0 bg-transparent"
                type="button"
                onClick={() =>
                  setIsEcosystemOpen((prev) => !prev)
                }
                aria-label="Toggle ecosystem menu"
                aria-expanded={isEcosystemOpen}
              >
                <i className="fa fa-bars fs-5" aria-hidden="true"></i>
              </button>

              {/* Ecosystem Dropdown */}
              {isEcosystemOpen && (
                <div className="ecosystem-dropdown p-4">
                  <div className="row">

                    {/* Products */}
                    <div className="col-md-6 col-12 mb-3 mb-md-0">
                      <p className="ecosystem-heading">
                        Products
                      </p>

                      {products.map(([image, title, description]) => (
                        <Link
                          to="/products"
                          className="dropdown-item-link mb-2"
                          key={title}
                        >
                          <img
                            src={`/media/images/${image}`}
                            alt={title}
                          />

                          <div>
                            <div className="fw-medium">{title}</div>
                            <small className="text-muted">
                              {description}
                            </small>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Utilities */}
                    <div className="col-md-6 col-12">
                      <p className="ecosystem-heading">
                        Utilities & Tools
                      </p>

                      <Link
                        to="/pricing"
                        className="dropdown-item-link mb-2"
                      >
                        <i className="fa fa-calculator text-primary me-3"></i>
                        <div>
                          <div className="fw-medium">
                            Brokerage calculator
                          </div>
                          <small className="text-muted">
                            Calculate charges & taxes
                          </small>
                        </div>
                      </Link>

                      <Link
                        to="/pricing"
                        className="dropdown-item-link mb-3"
                      >
                        <i className="fa fa-percent text-primary me-3"></i>
                        <div>
                          <div className="fw-medium">
                            Margin calculator
                          </div>
                          <small className="text-muted">
                            SPAN & exposure margins
                          </small>
                        </div>
                      </Link>

                      <p className="ecosystem-heading border-top pt-3">
                        Universe Platforms
                      </p>

                      <div className="d-flex flex-wrap gap-2">
                        {platforms.map((platform) => (
                          <Link
                            to="/products"
                            key={platform}
                            className="badge bg-light text-secondary text-decoration-none p-2 border"
                          >
                            {platform}
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;