import React from 'react';
import { Link } from 'react-router-dom';

function OpenAccount() {
  return (
    <div className='container p-5 mb-5'>
      <div className='row text-center'>
        <h1 className='mt-5 fs-2'>Open a Zerodha account</h1>
        <p className='text-muted mt-3 fs-5'>
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&amp;O trades.
        </p>
        <Link
          to="/signup"
          className='btn btn-primary fs-5 py-2 px-4 mb-5 mt-3'
          style={{ width: "20%", minWidth: "180px", margin: "0 auto", textDecoration: "none" }}
        >
          Sign up for free
        </Link>
      </div>
    </div>
  );
}

export default OpenAccount;
