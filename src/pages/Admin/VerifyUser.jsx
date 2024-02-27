// VerifyUser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserModal from './UserModal'; // Import the UserModal component
import error from '../../assets/images/error.png';

function VerifyUser() {
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch a list of unverified users from the server
    axios.get('https://smartexam.cyclic.app/verify/unverified-users').then((response) => {
      setUnverifiedUsers(response.data);
    });
  }, []);

  const handleAcceptUser = (userId) => {
    const confirmAccept = window.confirm('Are you sure you want to accept this user?');
    // Send a request to the server to accept the user
    if (confirmAccept) {
      axios.post(`https://smartexam.cyclic.app/verify/send-verification/${userId}`).then(() => {
        // Update the list of unverified users
        setUnverifiedUsers((users) => users.filter((user) => user.user_id !== userId));
        localStorage.setItem('isVerified', 'true');
      });
    }
  };

  const handleRejectUser = (userId) => {
    const confirmReject = window.confirm('Are you sure you want to reject this user?');
    // Send a request to the server to reject the user
    if (confirmReject) {
      axios.post(`https://smartexam.cyclic.app/verify/reject-user/${userId}`).then(() => {
        // Update the list of unverified users
        setUnverifiedUsers((users) => users.filter((user) => user.user_id !== userId));
        localStorage.setItem('isVerified', 'false');
      });
    }
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex items-center justify-center font-mono">
      <div className="w-full p-2 mb-2">
        <div className="max-h-96 overflow-y-auto">
          {unverifiedUsers.length === 0 ? (
            <div className="text-center">
              <img src={error} alt="" className="scale-[135%]" />
              <p className="mt-[15px] text-center font-mono text-semibold text-gray-500">
                Searching...
              </p>
            </div>
          ) : (
            <table className="dark:text-white w-full">
              <thead className=''>
                <tr className="bg-slate-600 text-white font-mono font-semibold">
                  <th className='flex items-start justify-start p-2 lg:p-3 md:p-2 sm:p-2 mx-4'>Name</th>
                  <th className='p-2 lg:p-3 md:p-2 sm:p-2'>Email</th>
                  <th className="p-2 lg:p-3 md:p-2 sm:p-2">Action</th>
                </tr>
              </thead>
              <tbody className="p-4">
                {unverifiedUsers.map((user) => (
  <tr
    key={user.user_id}
    className="border-b border-gray-200 p-5 cursor-pointer" // Increase padding to p-6
    onClick={() => handleRowClick(user)}
  >
    <td className="flex p-1 lg:3 md:p-2 sm:p-2 text-xs lg:text-base md:text-sm sm:text-sm py-2 mx-0">{user.name}</td>
    <td className="text-center p-2 lg:p-3 md:p-2 text-xs lg:text-base md:text-sm sm:text-sm sm:p-2">{user.username}</td>
    <td className="text-center text-[green] p-2 lg:p-3 md:p-2 sm:p-2 text-xs lg:text-base md:text-sm sm:text-sm">
      View
    </td>
  </tr>
))}

              </tbody>
            </table>
          )}
        </div>
      </div>
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onAccept={handleAcceptUser}
          onReject={handleRejectUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default VerifyUser;
