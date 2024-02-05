// VerificationLink.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerificationLink = () => {
  const { userId, otp } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Send a request to verify the user using the provided OTP
        const response = await axios.post(`https://smartexam.cyclic.app/verify/verify/${userId}/${otp}`);
        console.log(response.data);

        // Update isVerified status to 1 after successful verification
        const updateResponse = await axios.post(`https://smartexam.cyclic.app/verify/update-is-verified/${userId}`);
        console.log(updateResponse.data);

        // Optionally, you can redirect the user to the login page or display a success message
        navigate('/verification-complete');
      } catch (error) {
        console.error(error.response.data);
        // Optionally, you can redirect the user to an error page or display an error message
      }
    };

    // Call the verifyUser function
    verifyUser();
  }, [userId, otp, navigate]);

  return (
    <div>
      <p>You are now verified. You can now login.</p>
      {/* Add a button to navigate to VerificationComplete.jsx */}
      <button onClick={() => navigate('/verification-complete')}>
        Verify
      </button>
    </div>
  );
};

export default VerificationLink;
