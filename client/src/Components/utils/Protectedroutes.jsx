import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles }) => {
  const role = useSelector((state) => state.auth.role);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PrivateRoute;
