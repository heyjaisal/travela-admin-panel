import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }


  if (!allowedRoles.includes(role)) {
    return <Navigate to="/no-access" />;
  }

  return children;
};

export default ProtectedRoute;
