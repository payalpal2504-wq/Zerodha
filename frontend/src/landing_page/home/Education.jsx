import React from 'react';

function Education() {
  return (
    <div className='container mt-5'>
      <div className='row align-items-center'>
        <div className='col-lg-6 col-12 text-center p-4'>
          <img
            src="/media/images/education.svg"
            style={{ width: "70%" }}
            alt="Education"
            className='img-fluid'
          />
        </div>
        <div className='col-lg-6 col-12 p-4'>
          <h1 className="mb-3 fs-2">Free and open market education</h1>
          <p className='text-muted'>
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>
          <a href="#" style={{ textDecoration: "none" }}>
            Varsity <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
          <p className='mt-4 text-muted'>
            TradingQ&amp;A, the most active trading and investment community in India
            for all your market related queries.
          </p>
          <a href="#" style={{ textDecoration: "none" }}>
            TradingQ&amp;A <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Education;
