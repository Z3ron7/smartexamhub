import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      // Send a request to the backend to initiate the password reset
      const response = await axios.post('https://smartexam.cyclic.app/forgot-password', { username });
      setMessage(response.data.Status);

      console.log('Response from forgot password:', response.data.resetToken); // Check the entire response

    const resetToken = response.data.resetToken; // Access resetToken from the response
    localStorage.setItem('resetToken', resetToken);
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('Forgot password process failed');
    }
  };

  return (
    <div className="bg-blue-300  items-center justify-center flex h-screen bg-gradient-to-r from-blue-400 to-indigo-700">
      <div className="flex justify-center mt-32 w-5/12  h-32 items-center border shadow-lg shadow-black">
        <div className="flex">
      <h2>Forgot Password</h2>
      <p>Enter your username to receive a password reset link.</p>
      </div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Submit</button>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default ForgotPassword;
