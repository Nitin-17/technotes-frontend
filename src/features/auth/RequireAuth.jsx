// src/features/auth/requireAuth.js
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Adjust path as needed

const RequireAuth = ({ allowedRoles }) => {
  const { roles, isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is NOT authenticated or roles are missing, redirect to login
  if (!isAuthenticated || !roles || roles?.length === 0) {
    // Pass current location to login so user can be redirected back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ensure allowedRoles is an array and check if the user has any of the allowed roles
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [];
  const isAuthorized = rolesToCheck.some((role) => roles?.includes(role));

  // If authenticated but NOT authorized (doesn't have allowed roles)
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If authenticated AND authorized, render the child routes (Outlet)
  return <Outlet />;
};

export default RequireAuth;
