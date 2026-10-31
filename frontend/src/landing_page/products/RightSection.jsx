import React from 'react';

function RightSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <div className='container mt-5'>
      <div className='row align-items-center'>
        <div className='col-lg-6 col-12 p-4'>
          <h1>{productName}</h1>
          <p className='text-muted mt-3' style={{ lineHeight: "1.8" }}>
            {productDescription}
          </p>
          <div className='mt-3'>
            {learnMore && (
              <a href={learnMore} style={{ textDecoration: "none" }}>
                Learn More <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </a>
            )}
          </div>
        </div>
        <div className='col-lg-6 col-12 p-4 text-center'>
          <img src={imageURL} alt={productName} className='img-fluid' />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
