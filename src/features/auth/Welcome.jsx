import { Link } from "react-router-dom";
import { FaUsers, FaStickyNote, FaUserPlus } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import useTitle from "../../hooks/useTitle";

const WelcomePage = () => {
  const { username, roles, email } = useAuth();
  useTitle("Tech-Notes: Dashboard");

  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isAdmin = roles.includes("Admin");
  const isManager = roles.includes("Manager");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute w-72 h-72 bg-indigo-400 opacity-20 rounded-full -top-10 -left-10 blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 bg-pink-400 opacity-20 rounded-full bottom-0 right-0 blur-3xl animate-pulse" />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 backdrop-blur-xl bg-white/80 border border-white/30 shadow-2xl rounded-3xl p-10 max-w-3xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center tracking-tight">
          Welcome, {username}!
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">{email}</p>
        <p className="text-center text-lg text-gray-700 mb-10">
          Today is{" "}
          <span className="text-indigo-600 font-semibold">{formattedDate}</span>
        </p>

        {/* Animated Grid Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/dashboard/notes"
            className="group bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-5 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 text-lg font-semibold"
          >
            <FaStickyNote className="text-2xl group-hover:rotate-6 transition-transform duration-300" />
            Go to Notes
          </Link>

          {(isAdmin || isManager) && (
            <Link
              to="/dashboard/users"
              className="group bg-gradient-to-r from-teal-500 to-green-500 text-white p-5 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 text-lg font-semibold"
            >
              <FaUsers className="text-2xl group-hover:scale-110 transition-transform duration-300" />
              View Users
            </Link>
          )}

          {(isAdmin || isManager) && (
            <Link
              to="/dashboard/users/new"
              className="group bg-gradient-to-r from-pink-500 to-rose-500 text-white p-5 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 text-lg font-semibold"
            >
              <FaUserPlus className="text-2xl group-hover:rotate-[-6deg] transition-transform duration-300" />
              Add New User
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
