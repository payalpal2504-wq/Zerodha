import React from 'react';

function CreateTicket() {
  return (
    <div className='container'>
      <div className='row p-5 mt-4 mb-5'>
        <h1 className='fs-4 text-muted mb-5'>
          To create a ticket, select a relevant topic
        </h1>

        <div className='col-lg-4 col-md-6 col-12 mb-4'>
          <h4>
            <i className="fa fa-plus-circle me-2" aria-hidden="true"></i> Account Opening
          </h4>
          <div className='d-flex flex-column gap-2 mt-3' style={{ lineHeight: "1.8", fontSize: "14px" }}>
            <a href='#' style={{ textDecoration: "none" }}>Getting Started</a>
            <a href='#' style={{ textDecoration: "none" }}>Online</a>
            <a href='#' style={{ textDecoration: "none" }}>Offline</a>
            <a href='#' style={{ textDecoration: "none" }}>Charges</a>
            <a href='#' style={{ textDecoration: "none" }}>Company, Partnership and HUF</a>
            <a href='#' style={{ textDecoration: "none" }}>Non Resident Indian (NRI)</a>
          </div>
        </div>

        <div className='col-lg-4 col-md-6 col-12 mb-4'>
          <h4>
            <i className="fa fa-user me-2" aria-hidden="true"></i> Your Zerodha Account
          </h4>
          <div className='d-flex flex-column gap-2 mt-3' style={{ lineHeight: "1.8", fontSize: "14px" }}>
            <a href='#' style={{ textDecoration: "none" }}>Login credentials</a>
            <a href='#' style={{ textDecoration: "none" }}>Your Profile</a>
            <a href='#' style={{ textDecoration: "none" }}>Account modification and segment addition</a>
            <a href='#' style={{ textDecoration: "none" }}>CMR &amp; DP ID</a>
            <a href='#' style={{ textDecoration: "none" }}>Nomination</a>
            <a href='#' style={{ textDecoration: "none" }}>Transfer and conversion of shares</a>
          </div>
        </div>

        <div className='col-lg-4 col-md-6 col-12 mb-4'>
          <h4>
            <i className="fa fa-bar-chart me-2" aria-hidden="true"></i> Trading and Markets
          </h4>
          <div className='d-flex flex-column gap-2 mt-3' style={{ lineHeight: "1.8", fontSize: "14px" }}>
            <a href='#' style={{ textDecoration: "none" }}>Trading FAQs</a>
            <a href='#' style={{ textDecoration: "none" }}>Kite</a>
            <a href='#' style={{ textDecoration: "none" }}>Margins</a>
            <a href='#' style={{ textDecoration: "none" }}>Product and order types</a>
            <a href='#' style={{ textDecoration: "none" }}>Corporate actions</a>
            <a href='#' style={{ textDecoration: "none" }}>Kite features</a>
          </div>
        </div>

        <div className='col-lg-4 col-md-6 col-12 mt-lg-4 mb-4'>
          <h4>
            <i className="fa fa-credit-card me-2" aria-hidden="true"></i> Funds
          </h4>
          <div className='d-flex flex-column gap-2 mt-3' style={{ lineHeight: "1.8", fontSize: "14px" }}>
            <a href='#' style={{ textDecoration: "none" }}>Fund withdrawal</a>
            <a href='#' style={{ textDecoration: "none" }}>Adding funds</a>
            <a href='#' style={{ textDecoration: "none" }}>Adding bank accounts</a>
            <a href='#' style={{ textDecoration: "none" }}>eMandates</a>
          </div>
        </div>

        <div className='col-lg-4 col-md-6 col-12 mt-lg-4 mb-4'>
          <h4>
            <i className="fa fa-circle-o-notch me-2" aria-hidden="true"></i> Console
          </h4>
          <div className='d-flex flex-column gap-2 mt-3' style={{ lineHeight: "1.8", fontSize: "14px" }}>
            <a href='#' style={{ textDecoration: "none" }}>IPO</a>
            <a href='#' style={{ textDecoration: "none" }}>Portfolio</a>
            <a href='#' style={{ textDecoration: "none" }}>Funds statement</a>
            <a href='#' style={{ textDecoration: "none" }}>Profile</a>
            <a href='#' style={{ textDecoration: "none" }}>Reports</a>
            <a href='#' style={{ textDecoration: "none" }}>Referral program</a>
          </div>
        </div>

        <div className='col-lg-4 col-md-6 col-12 mt-lg-4 mb-4'>
          <h4>
            <i className="fa fa-circle-thin me-2" aria-hidden="true"></i> Coin
          </h4>
          <div className='d-flex flex-column gap-2 mt-3' style={{ lineHeight: "1.8", fontSize: "14px" }}>
            <a href='#' style={{ textDecoration: "none" }}>Understanding mutual funds and Coin</a>
            <a href='#' style={{ textDecoration: "none" }}>Coin app</a>
            <a href='#' style={{ textDecoration: "none" }}>Coin web</a>
            <a href='#' style={{ textDecoration: "none" }}>Transactions and reports</a>
            <a href='#' style={{ textDecoration: "none" }}>National Pension Scheme (NPS)</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
