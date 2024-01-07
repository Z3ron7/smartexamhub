import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      // Send a request to the backend to initiate the password reset
      const response = await axios.post('https://smartexamhub.vercel.app/forgot-password', { username });
      setMessage(response.data.Status);
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('Forgot password process failed');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <p>Enter your username to receive a password reset link.</p>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
