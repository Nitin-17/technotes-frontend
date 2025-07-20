import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = ({ statusCode = 404, message = "Page Not Found" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="text-center space-y-6 bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700 max-w-md mx-auto">
        <h1 className="text-9xl font-extrabold text-red-500 tracking-wider">
          {statusCode}
        </h1>
        <p className="text-2xl font-semibold text-gray-300">Oops! {message}</p>
        <p className="text-lg text-gray-400">
          It looks like you've stumbled upon a page that doesn't exist or an
          unexpected error occurred.
        </p>
        <div className="mt-8">
          <Link
            to="/" // Link back to the home page or a safe default route
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
