import React from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom"; // useNavigate and useNavigation are not used here, but kept if you need them elsewhere
import Header from "../components/Header";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  return (
    // This outer div now acts as the main flex container
    // min-h-screen ensures it takes at least the full viewport height
    // flex flex-col stacks its children (Header, main content, Footer) vertically
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Header />}

      {/* This div wraps your main content (rendered by Outlet)
          and uses flex-grow to push the footer down. */}
      <div className="flex-grow">
        <Outlet /> {/* This is where your routed components will render */}
      </div>

      <Footer />
    </div>
  );
};

export default AppLayout;
