// UserModal.js
import React from 'react';

function UserModal({ user, onAccept, onReject, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white p-4 w-1/3 rounded-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex justify-center">
            <img
              src={user.image || '/noavatar.png'} // Provide a default image URL
              alt={user.name}
              className="w-64 h-44 object-contain mt-4"
            />
        </div>
        <h2 className="text-xl font-semibold mb-4">{user.name}</h2>
        <p className="p-2 text-base"><strong>Gender:</strong> {user.gender}</p>
        <p className="p-2 text-base"><strong>Status:</strong> {user.status}</p>
        <p className="p-2 text-base"><strong>Username:</strong> {user.username}</p>
        <p className="p-2 text-base"><strong>School ID:</strong> {user.school_id}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => onAccept(user.user_id)}
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Send Verification
          </button>
          <button
            onClick={() => onReject(user.user_id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
