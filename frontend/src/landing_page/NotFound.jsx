import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className='container p-5 mb-5'>
      <div className='row text-center'>
        <h1 className='mt-5'>404 Not Found</h1>
        <p className='text-muted mt-3'>
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className='p-2 btn btn-primary fs-5 mb-5 mt-2'
          style={{ width: "20%", minWidth: "160px", margin: "0 auto", textDecoration: "none" }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
