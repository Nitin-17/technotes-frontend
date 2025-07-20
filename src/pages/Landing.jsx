import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import CTA from "../../public/assets/Company.png";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const HeroSection = ({ isLoggedIn }) => {
  return (
    <section className="relative bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 text-white min-h-screen overflow-hidden">
      {/* Blurry gradient blobs */}
      <div className="absolute -top-24 -left-32 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 opacity-20 rounded-full blur-3xl animate-pulse -z-10" />

      <div className="container mx-auto px-6 py-28 grid md:grid-cols-2 items-center gap-16">
        {/* TEXT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Streamline Your{" "}
            <span className="text-teal-400 drop-shadow-lg">
              Technical Workflow
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-xl text-gray-200">
            Say goodbye to sticky notes. Centralize, assign, and manage your
            tech support notes with ease — all in one secure platform.
          </p>

          <Link
            to={isLoggedIn ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
          >
            {isLoggedIn ? "Enter Dashboard" : "Explore Tech Notes"}
            <FaArrowRight />
          </Link>
        </motion.div>

        {/* IMAGE OR VISUAL */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="z-10"
        >
          <div className="w-full h-auto  overflow-hidden    flex items-center justify-center p-4">
            <motion.img
              src={CTA}
              alt="Tech Illustration"
              className="w-full max-w-md object-contain"
              animate={{ scale: [0.8, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CallToAction = () => {
  return (
    <section className="relative bg-white text-gray-900 py-24 text-center overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl opacity-50 -z-10" />
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Empower Your Support Team
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        >
          Improve note ownership, accountability, and collaboration with
          role-based access, automated logins, and clear status tracking.
        </motion.p>
        {/*         <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
             to={isLoggedIn ? "/dashboard" : "/login"}
            className="bg-teal-600 text-white font-bold py-3 px-10 rounded-full text-lg shadow-lg transition duration-300 hover:scale-105"
          >
            Start Managing Notes
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
};

function Landing() {
  const token = useSelector(selectCurrentToken);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="font-sans antialiased text-gray-900 min-h-screen flex flex-col">
      <div className="flex-grow">
        <HeroSection isLoggedIn={isAuthenticated} />
        <CallToAction />
      </div>
    </div>
  );
}

export default Landing;
