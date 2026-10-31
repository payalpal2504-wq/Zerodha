import React from 'react';
import { Link } from 'react-router-dom';

function Stats() {
  return (
    <div className='container p-3'>
      <div className='row p-5 align-items-center'>
        <div className='col-lg-6 col-12 p-4'>
          <h1 className='fs-2 mb-5'>Trust with confidence</h1>
          <h2 className='fs-4'>Customer-first always</h2>
          <p className='text-muted'>
            That's why 1.3+ crore customers trust Zerodha with ₹3.5+ lakh crores
            worth of equity investments.
          </p>
          <h2 className='fs-4 mt-4'>No spam or gimmicks</h2>
          <p className='text-muted'>
            No gimmicks, spam, "gamification", or annoying push notifications.
            High quality apps that you use at your pace, the way you like.
          </p>
          <h2 className='fs-4 mt-4'>The Zerodha universe</h2>
          <p className='text-muted'>
            Not just an app, but a whole ecosystem. Our investments in 30+
            fintech startups offer you tailored services specific to your needs.
          </p>
          <h2 className='fs-4 mt-4'>Do better with money</h2>
          <p className='text-muted'>
            With initiatives like Nudge and Kill Switch, we don't just facilitate
            transactions, but actively help you do better with your money.
          </p>
        </div>
        <div className='col-lg-6 col-12 p-4 text-center'>
          <img
            src='/media/images/ecosystem.png'
            style={{ width: "95%" }}
            alt="Ecosystem"
            className='img-fluid'
          />
          <div className='text-center mt-4'>
            <Link to="/products" className="mx-4 text-decoration-none">
              Explore our products <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </Link>
            <Link to="/products" className="text-decoration-none">
              Try Kite demo <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
