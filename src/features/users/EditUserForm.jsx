import { useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { HiTrash, HiSave } from "react-icons/hi";
import { ROLES } from "../../config/roles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const USER_REGEX = /^[A-Za-z_ ]{3,30}$/;
const PWD_REGEX = /^[A-Za-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

const validationSchema = Yup.object({
  username: Yup.string()
    .matches(USER_REGEX, "Username must be 3-20 letters")
    .notRequired("Username is required"),
  email: Yup.string()
    .matches(EMAIL_REGEX, "Invalid email format")
    .notRequired("Email is required"),
  password: Yup.string()
    .matches(PWD_REGEX, "Password must be 4-12 characters and include !@#$%")
    .notRequired(),
  roles: Yup.array().min(1, "At least one role is required"),
  active: Yup.boolean(),
});

const EditUserForm = ({ user }) => {
  const navigate = useNavigate();

  const [updateUser, { isSuccess }] = useUpdateUserMutation();
  const [deleteUser, { isSuccess: isDelSuccess }] = useDeleteUserMutation();

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      navigate("/dashboard/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const handleSubmit = async (values) => {
    const { username, email, password, roles, active } = values;
    const updateFields = { id: user.id, username, email, roles, active };
    if (password) updateFields.password = password;
    await updateUser(updateFields);
  };

  const handleDelete = async () => {
    await deleteUser({ id: user?.id });
  };

  const roleOptions = Object.values(ROLES).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      <Formik
        initialValues={{
          username: user.username || "",
          email: user.email || "",
          password: "",
          roles: user.roles || [],
          active: user.active || false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="username" className="block font-medium">
                Username
              </label>
              <Field
                name="username"
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="username"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium">
                Password
              </label>
              <Field
                name="password"
                type="password"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="roles" className="block font-medium">
                Roles
              </label>
              <Field
                as="select"
                name="roles"
                multiple={true}
                size="3"
                className="w-full border px-3 py-2 rounded h-28"
              >
                {roleOptions}
              </Field>
              <ErrorMessage
                name="roles"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Field type="checkbox" name="active" className="h-4 w-4" />
              <label htmlFor="active" className="font-medium">
                Active
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                <HiSave /> Save
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                <HiTrash /> Delete
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditUserForm;
