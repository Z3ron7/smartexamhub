// VerificationComplete.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Verify from '../assets/images/pngegg.png'

const VerificationComplete = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
      <div className='flex justify-center'>
      <img src={Verify} className='h-auto w-32 sm:w-44 md:w-52 lg:w-72' alt='verify' />
      </div> 
        <p className="text-3xl font-semibold mb-6">You are now verified and can log in.</p>
        <Link to="/Log-in" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </Link>
      </div>
    </div>
  );
};

export default VerificationComplete;
