import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { selectCurrentToken } from "./authSlice";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

const RequireNoAuth = ({ children }) => {
  const token = useSelector(selectCurrentToken);
  const { isAuthenticated } = useAuth();

  console.log(token, isAuthenticated);

  if (token && isAuthenticated) {
    // already logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireNoAuth;
