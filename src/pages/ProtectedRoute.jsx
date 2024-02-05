import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('token') !== null;
  const isVerified = localStorage.getItem('isVerified') === '1'; // Assuming '1' means verified
  const userRole = localStorage.getItem('role');

  // Check if the user's role is allowed for this route
  const isRoleAllowed = allowedRoles.includes(userRole);

  if (!isLoggedIn) {
    // Redirect to the login page if not logged in
    return <Navigate to="/Log-in" />;
  }

  if (userRole === 'Super Admin') {
    // If the user is a Super Admin, no verification is required
    return isRoleAllowed ? element : <Navigate to="/super-dashboard" />;
  }

  if (userRole === 'Admin') {
    // If the user is a Super Admin, no verification is required
    return isRoleAllowed ? element : <Navigate to="/admin-dashboard" />;
  }

  if (!isVerified) {
    // Redirect to an unauthorized page if the user is not verified
    return <Navigate to="/verification" />;
  }

  if (!isRoleAllowed) {
    // Redirect to an unauthorized page if the user's role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
