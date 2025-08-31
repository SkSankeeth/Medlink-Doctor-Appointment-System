// frontend/src/routes/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  // If there's a token, render the children (the protected page)
  // Otherwise, navigate them to the login page
  return token ? children : <Navigate to="/login" replace />;
};

// New component for admin-only routes
const AdminRoute = ({ children }) => {
  const { token, role } = useContext(AuthContext);

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If not admin, redirect to home
  if (role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  // If admin, render the children
  return children;
};

export default ProtectedRoute;
export { AdminRoute };
