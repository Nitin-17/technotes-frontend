// src/features/auth/PersistLogin.js
import { Outlet, Link } from "react-router-dom"; // Keep Link if you need to display an error and a manual link
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken); // Access token from Redux store
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    // Only run this effect once on mount, or in development strict mode
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          // Attempt to refresh the token. If successful, RTK Query will update the Redux store.
          await refresh();
          setTrueSuccess(true); // Indicate successful refresh
        } catch (err) {
          console.error("Failed to refresh token:", err);
          // An error here means no valid session could be established via refresh token.
          // Redux state will remain without an accessToken.
        }
      };

      // If no access token is currently in Redux and 'persist' is enabled, try to refresh.
      if (!token && persist) {
        verifyRefreshToken();
      }
    }

    // Cleanup function for strict mode
    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;

  // Scenario 1: User chose not to persist login.
  // In this case, we don't even try to refresh. Just pass through to child routes.
  if (!persist) {
    console.log("no persist - rendering outlet directly");
    content = <Outlet />;
  }
  // Scenario 2: Refresh mutation is currently loading. Show a loading indicator.
  else if (isLoading) {
    console.log("persist: yes, refresh is loading");
    content = (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading authentication...
        </p>
      </div>
    );
  }
  // Scenario 3: Refresh mutation finished with an error.
  // This means no valid session could be re-established.
  // We simply render the Outlet. The nested RequireAuth/RequireNoAuth will then
  // evaluate the 'token' (which will be null due to the error) and redirect accordingly.
  else if (isError) {
    console.log("persist: yes, refresh failed. Token is likely null.");
    // Do NOT show an error message and link to login here directly.
    // The responsibility to redirect to /login falls on RequireAuth.
    // We just allow the routing to proceed so the other auth guards can act.
    content = <Outlet />;
  }
  // Scenario 4: Refresh mutation succeeded and 'trueSuccess' is confirmed.
  // The Redux store now has the new access token.
  else if (isSuccess && trueSuccess) {
    console.log("persist: yes, refresh success. Token available.");
    content = <Outlet />;
  }
  // Scenario 5: Token exists (e.g., from a recent login or previous successful refresh)
  // and no new refresh mutation is currently uninitialized (not waiting to run).
  else if (token && isUninitialized) {
    console.log("persist: yes, token exists and refresh is uninitialized.");
    content = <Outlet />;
  } else {
    // Fallback for any unhandled state, should ideally not be reached.
    console.log("PersistLogin: Unhandled state, rendering outlet as fallback.");
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
