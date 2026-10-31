import React from 'react';
import { Link } from 'react-router-dom';

function Pricing() {
  return (
    <div className='container my-5 py-4'>
      <div className='row align-items-center'>
        <div className='col-lg-4 col-12'>
          <h1 className='mb-3 fs-2'>Unbeatable pricing</h1>
          <p className='text-muted' style={{ lineHeight: "1.7" }}>
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>
          <Link to="/pricing" style={{ textDecoration: "none" }}>
            See pricing <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>
        <div className='col-lg-2 col-12'></div>
        <div className='col-lg-6 col-12 mt-4 mt-lg-0'>
          <div className='row text-center'>
            <div className='col-6 p-4 border me-2 rounded'>
              <h1 className="mb-3">
                <i className="fa fa-inr" aria-hidden="true"></i> 0
              </h1>
              <p className='text-muted mb-0' style={{ fontSize: "14px" }}>
                Free equity delivery and direct mutual funds
              </p>
            </div>
            <div className='col p-4 border rounded'>
              <h1 className="mb-3">
                <i className="fa fa-inr" aria-hidden="true"></i> 20
              </h1>
              <p className='text-muted mb-0' style={{ fontSize: "14px" }}>
                Intraday and F&amp;O
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
