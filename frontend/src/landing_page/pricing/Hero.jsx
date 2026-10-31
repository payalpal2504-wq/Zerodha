import React from 'react';

function Hero() {
  return (
    <div className='container'>
      <div className='row p-5 mt-5 border-bottom text-center'>
        <h1>Pricing</h1>
        <h3 className='text-muted mt-3 fs-5'>
          Free equity investments and flat ₹20 intraday and F&amp;O trades
        </h3>
      </div>
      <div className='row p-5 mt-5 text-center'>
        <div className='col-lg-4 col-12 p-4'>
          <img
            src='/media/images/pricing0.svg'
            alt='Free equity delivery'
            style={{ width: "70%" }}
            className='img-fluid'
          />
          <h1 className='fs-3 mt-3'>Free equity delivery</h1>
          <p className='text-muted mt-3'>
            All equity delivery investments (NSE, BSE), are absolutely free — ₹0
            brokerage.
          </p>
        </div>
        <div className='col-lg-4 col-12 p-4'>
          <img
            src='/media/images/intradayTrades.svg'
            alt='Intraday and F&O'
            style={{ width: "70%" }}
            className='img-fluid'
          />
          <h1 className='fs-3 mt-3'>Intraday and F&amp;O trades</h1>
          <p className='text-muted mt-3'>
            Flat ₹20 or 0.03% (whichever is lower) per executed order on
            intraday trades across equity, currency, and commodity trades.
          </p>
        </div>
        <div className='col-lg-4 col-12 p-4'>
          <img
            src='/media/images/pricing0.svg'
            alt='Free direct MF'
            style={{ width: "70%" }}
            className='img-fluid'
          />
          <h1 className='fs-3 mt-3'>Free direct MF</h1>
          <p className='text-muted mt-3'>
            All direct mutual fund investments are absolutely free — ₹0
            commissions &amp; DP charges.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
