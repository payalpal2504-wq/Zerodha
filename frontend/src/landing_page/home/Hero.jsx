import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className='container p-5 mb-5'>
      <div className='row text-center'>
        <img
          src='/media/images/homeHero.png'
          alt='Zerodha Ecosystem Preview'
          className='mb-5 mx-auto d-block img-fluid'
          style={{ maxWidth: "70%" }}
        />
        <h1 className='mt-4 fs-1 fw-medium'>Invest in everything</h1>
        <p className='text-muted fs-5 mt-2 mb-4'>
          Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.
        </p>
        <Link
          to="/signup"
          className='btn btn-primary fs-5 py-2 px-4 mb-5'
          style={{ width: "20%", minWidth: "180px", margin: "0 auto", textDecoration: "none" }}
        >
          Sign up for free
        </Link>
      </div>
    </div>
  );
}

export default Hero;
