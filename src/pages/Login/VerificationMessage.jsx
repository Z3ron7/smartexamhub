import React from 'react';
import Verify from '../../assets/images/verify.png'

function VerificationMessage() {
  return (
    <div className="h-[83vh] flex justify-center">
      <div className="text-center">
        <div className='flex justify-center'>
      <img src={Verify} className='h-auto w-72' alt='verify' />
      </div> 
        <h2 className="text-4xl font-bold font-mono dark:text-white">Verification Required</h2>
        <div>
          <p className="text-3xl font-semibold font-mono dark:text-white">Please wait for your account to be verified by the administrator. After the verification, you will receive an email for account verification.</p>
        </div>
      </div>
    </div>
  );
}

export default VerificationMessage;
