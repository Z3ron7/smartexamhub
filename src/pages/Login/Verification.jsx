import React from 'react';
import Verify from '../../assets/images/verify.png'

function Verification() {
  return (
    <div className="h-[83vh] flex justify-center">
      <div className="text-center">
        <div className='flex justify-center'>
      <img src={Verify} className='h-auto w-72' alt='verify' />
      </div> 
        <h2 className="text-4xl font-bold font-mono dark:text-white">Verification Required</h2>
        <div>
          <p className="text-3xl font-semibold font-mono dark:text-white">Please wait for verification from the Super Admin.</p>
        </div>
      </div>
    </div>
  );
}

export default Verification;
