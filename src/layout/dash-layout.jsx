import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const DashLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default DashLayout;
