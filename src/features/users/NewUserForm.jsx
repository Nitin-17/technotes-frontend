import { useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ROLES } from "../../config/roles";
//import useTitle from "../../hooks/useTitle";
import { FaSave } from "react-icons/fa";

/* const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/; */
const USER_REGEX = /^[A-Za-z_ ]{3,20}$/;
const PWD_REGEX = /^[A-Za-z0-9!@#$%]{4,20}$/;
const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

const validationSchema = Yup.object({
  username: Yup.string()
    .matches(USER_REGEX, "Username must be 3-20 letters")
    .required("Username is required"),

  email: Yup.string()
    .matches(EMAIL_REGEX, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(PWD_REGEX, "Password must be 4-12 characters and include !@#$%")
    .notRequired(),

  roles: Yup.array()
    .min(1, "At least one role is required")
    .required("Roles are required"),
});

const NewUserForm = () => {
  //useTitle("techNotes: New User");

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard/users");
    }
  }, [isSuccess, navigate]);

  const initialValues = {
    username: "",
    password: "",
    email: "",
    roles: ["Employee"],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await addNewUser(values);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New User</h2>
      {isError && (
        <p className="text-red-600 text-center mb-2">{error?.data?.message}</p>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="username" className="block font-semibold">
                Username{" "}
                <span className="text-sm text-gray-500">[3-20 letters]</span>
              </label>
              <Field
                name="username"
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-500 mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold">
                Password{" "}
                <span className="text-sm text-gray-500">
                  [4-12 chars incl. !@#$%]
                </span>
              </label>
              <Field
                name="password"
                type="password"
                className="w-full p-2 border rounded focus:outline-none focus:ring"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="roles" className="block font-semibold mb-1">
                Assigned Roles
              </label>
              <Field
                as="select"
                name="roles"
                multiple={true}
                size="3"
                className="w-full p-2 border rounded focus:outline-none focus:ring"
                onChange={(e) =>
                  setFieldValue(
                    "roles",
                    Array.from(e.target.selectedOptions, (opt) => opt.value)
                  )
                }
              >
                {Object.values(ROLES).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Field>

              <ErrorMessage
                name="roles"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
              >
                <FaSave />
                Save User
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewUserForm;
