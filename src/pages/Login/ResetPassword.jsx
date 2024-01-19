import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      // Send a request to the backend to reset the password
      const response = await axios.post('https://smartexam.cyclic.app/reset-password', {
        token: resetToken,
        newPassword,
      });

      setMessage(response.data.Status);
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('Reset password process failed');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <p>Enter your new password.</p>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
