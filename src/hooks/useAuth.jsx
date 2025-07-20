import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";
  let isAuthenticated = false;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      const { username, roles = [], email } = decoded?.UserInfo || {};

      isAuthenticated = roles.length > 0;
      isManager = roles.includes("Manager");
      isAdmin = roles.includes("Admin");

      if (isManager) status = "Manager";
      if (isAdmin) status = "Admin";

      return {
        username,
        email,
        roles,
        status,
        isManager,
        isAdmin,
        isAuthenticated,
      };
    }
  } catch (err) {
    console.error("Invalid token:", err);
    // fall through to return defaults below
  }

  return {
    username: "",
    email: "",
    roles: [],
    status,
    isManager,
    isAdmin,
    isAuthenticated,
  };
};

export default useAuth;
