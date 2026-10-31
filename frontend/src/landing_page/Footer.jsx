import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#fbfbfb" }}>
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col-lg-3 col-md-6 col-12 mb-4">
            <img
              src="/media/images/logo.svg"
              style={{ width: "50%" }}
              alt="Zerodha Logo"
            />
            <p className="text-muted mt-3" style={{ fontSize: "14px" }}>
              &copy; 2010 - 2024, Not Zerodha Broking Ltd. All rights reserved.
            </p>
            <div className="text-muted fs-5 mt-3">
              <a href="#" className="text-muted me-3"><i className="fa fa-twitter-square" aria-hidden="true"></i></a>
              <a href="#" className="text-muted me-3"><i className="fa fa-facebook-square" aria-hidden="true"></i></a>
              <a href="#" className="text-muted me-3"><i className="fa fa-instagram" aria-hidden="true"></i></a>
              <a href="#" className="text-muted me-3"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a>
              <a href="#" className="text-muted"><i className="fa fa-telegram" aria-hidden="true"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-12 mb-4">
            <p className="fs-5 text-muted">Company</p>
            <a href="/about" className="text-muted d-block text-decoration-none mb-2">About</a>
            <a href="/products" className="text-muted d-block text-decoration-none mb-2">Products</a>
            <a href="/pricing" className="text-muted d-block text-decoration-none mb-2">Pricing</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">Referral programme</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">Careers</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">Zerodha.tech</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">Press &amp; media</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">Zerodha Cares (CSR)</a>
          </div>
          <div className="col-lg-3 col-md-6 col-12 mb-4">
            <p className="fs-5 text-muted">Support</p>
            <a href="/support" className="text-muted d-block text-decoration-none mb-2">Contact us</a>
            <a href="/support" className="text-muted d-block text-decoration-none mb-2">Support portal</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">Z-Connect blog</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">List of charges</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">Downloads &amp; resources</a>
          </div>
          <div className="col-lg-3 col-md-6 col-12 mb-4">
            <p className="fs-5 text-muted">Account</p>
            <a href="/signup" className="text-muted d-block text-decoration-none mb-2">Open an account</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">Fund transfer</a>
            <a href="#" className="text-muted d-block text-decoration-none mb-2">60 day challenge</a>
          </div>
        </div>
        <div className="mt-5 text-muted" style={{ fontSize: "12px", lineHeight: "1.8" }}>
          <p>
            Zerodha Broking Ltd.: Member of NSE, BSE &amp; MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL: Depository services through Zerodha Broking Ltd. – SEBI Registration no.: IN-DP-431-2019 Commodity Trading through Zerodha Commodities Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration no.: INZ000038238 Registered Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India.
          </p>
          <p>
            Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of the grievances.
          </p>
          <p>
            Investments in securities market are subject to market risks; read all the related documents carefully before investing.
          </p>
          <p>
            "Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. Issued in the interest of investors."
          </p>
        </div>
        <div className="d-flex justify-content-center flex-wrap gap-4 mt-4 pb-4" style={{ fontSize: "13px" }}>
          <a href="#" className="text-muted text-decoration-none">NSE</a>
          <a href="#" className="text-muted text-decoration-none">BSE</a>
          <a href="#" className="text-muted text-decoration-none">MCX</a>
          <a href="#" className="text-muted text-decoration-none">Terms &amp; conditions</a>
          <a href="#" className="text-muted text-decoration-none">Policies &amp; procedures</a>
          <a href="#" className="text-muted text-decoration-none">Privacy policy</a>
          <a href="#" className="text-muted text-decoration-none">Disclosure</a>
          <a href="#" className="text-muted text-decoration-none">For investor's attention</a>
          <a href="#" className="text-muted text-decoration-none">Investor charter</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
