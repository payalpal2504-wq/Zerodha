import React from 'react';

function Hero() {
  return (
    <section
      className='container-fluid py-5'
      id='supportHero'
      style={{ backgroundColor: "#387ed1", color: "white" }}
    >
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center mb-5'>
          <h4 className='m-0'>Support Portal</h4>
          <a href='#' style={{ color: "white", textDecoration: "underline" }}>
            Track tickets
          </a>
        </div>
        <div className='row align-items-center'>
          <div className='col-lg-7 col-12 mb-4 mb-lg-0'>
            <h1 className='fs-3 mb-4'>
              Search for an answer or browse help topics to create a ticket
            </h1>
            <input
              className='form-control py-3 px-4 mb-3'
              placeholder='Eg: how do i activate F&amp;O, why is my order getting rejected ...'
              style={{ borderRadius: "5px" }}
            />
            <div className='d-flex flex-wrap gap-3'>
              <a href='#' style={{ color: "white", textDecoration: "underline" }}>
                Track account opening
              </a>
              <a href='#' style={{ color: "white", textDecoration: "underline" }}>
                Track segment activation
              </a>
              <a href='#' style={{ color: "white", textDecoration: "underline" }}>
                Intraday margins
              </a>
              <a href='#' style={{ color: "white", textDecoration: "underline" }}>
                Kite user manual
              </a>
            </div>
          </div>
          <div className='col-lg-5 col-12 ps-lg-5'>
            <h1 className='fs-4 mb-3'>Featured</h1>
            <ol style={{ lineHeight: "2.2" }}>
              <li>
                <a href='#' style={{ color: "white", textDecoration: "underline" }}>
                  Current Takeovers and Delisting - January 2026
                </a>
              </li>
              <li>
                <a href='#' style={{ color: "white", textDecoration: "underline" }}>
                  Surveillance measure on scrips - January 2026
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
