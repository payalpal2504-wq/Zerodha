import React from 'react';

function Awards() {
  return (
    <div className='container mt-5'>
      <div className='row align-items-center'>
        <div className='col-lg-6 col-12 p-5 text-center'>
          <img
            src='/media/images/largestBroker.svg'
            alt='Largest stock broker'
            className='img-fluid'
          />
        </div>
        <div className='col-lg-6 col-12 p-5'>
          <h1>Largest stock broker in India</h1>
          <p className='mb-4 text-muted'>
            2+ million Zerodha clients contribute to over 15% of all retail order
            volumes in India daily by trading and investing in:
          </p>
          <div className='row'>
            <div className='col-6'>
              <ul>
                <li><p className='text-muted'>Futures and Options</p></li>
                <li><p className='text-muted'>Commodity derivatives</p></li>
                <li><p className='text-muted'>Currency derivatives</p></li>
              </ul>
            </div>
            <div className='col-6'>
              <ul>
                <li><p className='text-muted'>Stocks &amp; IPOs</p></li>
                <li><p className='text-muted'>Direct mutual funds</p></li>
                <li><p className='text-muted'>Bonds and Govt. Securities</p></li>
              </ul>
            </div>
          </div>
          <img
            src='/media/images/pressLogos.png'
            alt='Press Logos'
            style={{ width: "90%" }}
            className='img-fluid mt-3'
          />
        </div>
      </div>
    </div>
  );
}

export default Awards;
