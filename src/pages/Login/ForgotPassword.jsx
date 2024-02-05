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
    <div className="bg-blue-300 items-center justify-center flex h-screen bg-gradient-to-r from-blue-400 to-indigo-700">
    <div className="flex flex-col items-center w-5/12 h-64 shadow-lg shadow-black p-4">
      <h2 className="mb-2 text-2xl font-mono font-semibold">Forgot Password</h2>
      <p className="mb-4 text-lg font-mono">Enter your username to receive a password reset link.</p>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-3 p-2 w-52 border rounded"
      />
      <button onClick={handleForgotPassword} className="bg-indigo-800 p-2 text-white rounded">
        Submit
      </button>
      {message && <p className="text-m font-mono">{message}</p>}
    </div>
  </div>
  );
};

export default ForgotPassword;
