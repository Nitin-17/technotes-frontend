import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaSignInAlt } from "react-icons/fa"; // Icon for the sign-in button

const PWD_REGEX = /^[A-Za-z0-9!@#$%]{4,20}$/;
const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .matches(EMAIL_REGEX, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

const Login = () => {
  const errRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [persist, setPersist] = usePersist();

  const [login, { isLoading, error: apiError }] = useLoginMutation(); // Renamed error to apiError

  // Effect to clear API error message when username or password changes
  // Formik handles individual field error messages
  useEffect(() => {
    if (apiError) {
      errRef.current.focus();
    }
  }, [apiError]);

  // Initial values for Formik
  const initialValues = {
    email: "",
    password: "",
  };

  const handleToggle = () => setPersist((prev) => !prev);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const { accessToken } = await login(values).unwrap();
      dispatch(setCredentials({ accessToken }));
      navigate("/dashboard");
    } catch (err) {
      // Set a general status message for API errors
      if (!err.status) {
        setStatus({ error: "No Server Response" });
      } else if (err.status === 400) {
        setStatus({ error: "Missing Email or Password" });
      } else if (err.status === 401) {
        setStatus({ error: "Unauthorized" });
      } else {
        setStatus({ error: err.data?.message || "Login failed" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="flex items-center mt-10 flex-grow justify-center  py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-2">
            Employee Login
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Display API-related errors here */}
        {apiError && (
          <p
            ref={errRef}
            className="p-3 mb-4 rounded-md bg-red-100 text-red-700 border border-red-200 text-center font-medium"
            aria-live="assertive"
          >
            {apiError?.data?.message || "Login failed. Please try again."}
          </p>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="mt-8 space-y-6">
              {/* Display general status messages (e.g., server errors) */}
              {status && status.error && (
                <p
                  className="p-3 rounded-md bg-red-100 text-red-700 border border-red-200 text-center font-medium"
                  aria-live="assertive"
                >
                  {status.error}
                </p>
              )}

              {/* Email Field */}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-xs mt-1 px-1"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-xs mt-1 px-1"
                  />
                </div>
              </div>

              {/* Remember Me / Forgot Password (if applicable, uncomment and style) */}
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div> */}

              {/* Sign In Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="group relative w-full h-10 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isSubmitting ? (
                    <span className="loader h-10"></span>
                  ) : (
                    <>
                      <FaSignInAlt className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center">
                <Field
                  type="checkbox"
                  id="persist"
                  onChange={handleToggle}
                  checked={persist}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="persist"
                  className="ml-2 block text-gray-700 text-sm font-bold"
                >
                  Trust This Device
                </label>
              </div>
            </Form>
          )}
        </Formik>

        <footer className="mt-8 text-center text-sm">
          <Link
            to="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );

  return content;
};

export default Login;
