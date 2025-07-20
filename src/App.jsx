import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import AppLayout from "./layout/app-layout";
import Landing from "./pages/Landing";
import Login from "./features/auth/Login";
import WelcomePage from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import RequireAuth from "./features/auth/RequireAuth";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import ErrorPage from "./pages/Error";
import PersistLogin from "./features/auth/PersistLogin";
import RequireNoAuth from "./features/auth/RequireNoAuth";
import { ROLES } from "./config/roles";
import DashLayout from "./layout/dash-layout";
import "./App.css";

const App = () => {
  const router = createBrowserRouter([
    {
      element: <AppLayout />, // Your highest-level layout
      errorElement: <ErrorPage />,
      children: [
        // ---------- Place PersistLogin HERE to wrap EVERYTHING that needs auth state ----------
        {
          element: <PersistLogin />, // <--- Moved PersistLogin here
          children: [
            // ---------- 🌐 Public Routes (Accessible only when NOT logged in) ----------
            {
              element: (
                <RequireNoAuth>
                  <DashLayout />
                </RequireNoAuth>
              ),
              children: [
                { path: "/", element: <Landing /> },
                { path: "/login", element: <Login /> },
                // Add any other routes that should only be visible to unauthenticated users
              ],
            },

            // ---------- 🔐 Private Routes (Accessible only when LOGGED IN) ----------
            {
              // Note: No PersistLogin here anymore, as it's higher up
              element: (
                <RequireAuth allowedRoles={[...Object.values(ROLES)]}>
                  <Prefetch>
                    <AppLayout />
                  </Prefetch>
                </RequireAuth>
              ),
              children: [
                { path: "/dashboard", element: <WelcomePage /> },
                {
                  path: "/dashboard/notes",
                  children: [
                    { index: true, element: <NotesList /> },
                    { path: ":id", element: <EditNote /> },
                    { path: "new", element: <NewNote /> },
                  ],
                },
                {
                  path: "/dashboard/users",
                  element: (
                    <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]}>
                      <Outlet />
                    </RequireAuth>
                  ),
                  children: [
                    { index: true, element: <UsersList /> },
                    { path: ":id", element: <EditUser /> },
                    { path: "new", element: <NewUserForm /> },
                  ],
                },
              ],
            },

            // ---------- 🚧 Fallback/Redirect Logic ----------
            {
              path: "*",
              element: <Navigate to="/login" replace />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
