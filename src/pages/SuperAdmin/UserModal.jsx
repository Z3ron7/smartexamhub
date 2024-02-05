// UserModal.js
import React from 'react';

function UserModal({ user, onAccept, onReject, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white p-4 w-96 rounded-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          src={user.image || '/noavatar.jpg'} // Provide a default image URL
          alt={user.name}
          className="w-full h-32 object-cover mt-4"
        />
        <h2 className="text-xl font-semibold mb-4">{user.name}</h2>
        <p className="p-2"><strong>Gender:</strong> {user.gender}</p>
        <p className="p-2"><strong>Status:</strong> {user.status}</p>
        <p className="p-2"><strong>Username:</strong> {user.username}</p>
        <p className="p-2"><strong>School ID:</strong> {user.school_id}</p>
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
