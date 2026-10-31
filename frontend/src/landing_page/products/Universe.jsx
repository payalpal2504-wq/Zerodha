import React from 'react';
import { Link } from 'react-router-dom';

function Universe() {
  return (
    <div className='container mt-5'>
      <div className='row text-center'>
        <h1 className='mt-5'>The Zerodha Universe</h1>
        <p className='text-muted mt-2'>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className='col-lg-4 col-md-6 col-12 p-4 mt-4'>
          <img
            src='/media/images/zerodhaFundhouse.png'
            style={{ width: "60%" }}
            alt='Zerodha Fundhouse'
            className='img-fluid'
          />
          <p className='text-muted mt-3' style={{ fontSize: "13px" }}>
            Our asset management venture that is creating simple and transparent
            index funds to help you save for your goals.
          </p>
        </div>
        <div className='col-lg-4 col-md-6 col-12 p-4 mt-4'>
          <img
            src='/media/images/sensibullLogo.svg'
            style={{ width: "65%" }}
            alt='Sensibull'
            className='img-fluid'
          />
          <p className='text-muted mt-3' style={{ fontSize: "13px" }}>
            Options trading platform that lets you create strategies, analyze
            positions, and examine key metrics like open interest.
          </p>
        </div>
        <div className='col-lg-4 col-md-6 col-12 p-4 mt-4'>
          <img
            src='/media/images/goldenpiLogo.png'
            style={{ width: "55%" }}
            alt='GoldenPi'
            className='img-fluid'
          />
          <p className='text-muted mt-3' style={{ fontSize: "13px" }}>
            Bonds trading platform to discover and invest in government and
            corporate bonds online.
          </p>
        </div>

        <div className='col-lg-4 col-md-6 col-12 p-4 mt-4'>
          <img
            src='/media/images/streakLogo.png'
            style={{ width: "45%" }}
            alt='Streak'
            className='img-fluid'
          />
          <p className='text-muted mt-3' style={{ fontSize: "13px" }}>
            Systematic trading platform that allows you to create and backtest
            strategies without coding.
          </p>
        </div>
        <div className='col-lg-4 col-md-6 col-12 p-4 mt-4'>
          <img
            src='/media/images/smallcaseLogo.png'
            style={{ width: "60%" }}
            alt='Smallcase'
            className='img-fluid'
          />
          <p className='text-muted mt-3' style={{ fontSize: "13px" }}>
            Thematic investing platform that helps you invest in diversified
            baskets of stocks on ETFs.
          </p>
        </div>
        <div className='col-lg-4 col-md-6 col-12 p-4 mt-4'>
          <img
            src='/media/images/dittoLogo.png'
            style={{ width: "35%" }}
            alt='Ditto'
            className='img-fluid'
          />
          <p className='text-muted mt-3' style={{ fontSize: "13px" }}>
            Personalized advice on life and health insurance. No spam and no
            mis-selling.
          </p>
        </div>

        <Link
          to="/signup"
          className='p-2 btn btn-primary fs-5 mb-5 mt-4'
          style={{ width: "20%", minWidth: "180px", margin: "0 auto", textDecoration: "none" }}
        >
          Sign up for free
        </Link>
      </div>
    </div>
  );
}

export default Universe;
