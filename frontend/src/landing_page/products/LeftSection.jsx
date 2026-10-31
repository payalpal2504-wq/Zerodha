import React from 'react';

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className='container mt-5'>
      <div className='row align-items-center'>
        <div className='col-lg-6 col-12 p-4 text-center'>
          <img src={imageURL} alt={productName} className='img-fluid' />
        </div>
        <div className='col-lg-6 col-12 p-4'>
          <h1>{productName}</h1>
          <p className='text-muted mt-3' style={{ lineHeight: "1.8" }}>
            {productDescription}
          </p>
          <div className='mt-3'>
            {tryDemo && (
              <a href={tryDemo} style={{ textDecoration: "none" }} className="me-5">
                Try Demo <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </a>
            )}
            {learnMore && (
              <a href={learnMore} style={{ textDecoration: "none" }}>
                Learn More <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </a>
            )}
          </div>
          <div className='mt-4'>
            {googlePlay && (
              <a href={googlePlay} className="me-3">
                <img src="/media/images/googlePlayBadge.svg" alt="Google Play" />
              </a>
            )}
            {appStore && (
              <a href={appStore}>
                <img src="/media/images/appstoreBadge.svg" alt="App Store" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
