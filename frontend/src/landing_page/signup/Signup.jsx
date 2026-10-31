import React from 'react';

function Signup() {
  return (
    <div className='container mt-5'>
      <div className='row p-5 align-items-center'>
        <div className='col-lg-7 col-12 text-center p-4'>
          <img
            src='/media/images/signup.png'
            alt='Signup Banner'
            className='img-fluid'
            style={{ maxWidth: "85%" }}
          />
        </div>
        <div className='col-lg-5 col-12 p-4'>
          <h1>Signup now</h1>
          <p className='text-muted mt-2'>Or track your existing application.</p>
          <form className='mt-4' onSubmit={(e) => e.preventDefault()}>
            <div className='input-group mb-3'>
              <span className='input-group-text'>+91</span>
              <input
                type='tel'
                className='form-control py-2'
                placeholder='Your 10 digit mobile number'
                maxLength='10'
                pattern='[0-9]{10}'
                required
              />
            </div>
            <p className='text-muted' style={{ fontSize: "12px" }}>
              You will receive an OTP on your number
            </p>
            <button type='submit' className='btn btn-primary px-4 py-2 mt-2'>
              Continue
            </button>
          </form>
          <div className='mt-4'>
            <p className='text-muted' style={{ fontSize: "12px" }}>
              By submitting your contact details, you authorize Zerodha to
              contact you even if you are registered on DND &amp; agree to our{" "}
              <a href='#' style={{ textDecoration: "none" }}>Terms &amp; conditions</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
