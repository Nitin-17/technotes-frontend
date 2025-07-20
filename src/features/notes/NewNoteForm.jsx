import { useEffect, useState } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
//import useTitle from "../../hooks/useTitle"; // Keep if you use it elsewhere
import { FaSave } from "react-icons/fa"; // Assuming you have react-icons installed

const TITLE_REGEX = /^[A-Za-z_ -]{3,20}$/;
const DESCRIPTION_REGEX = /^[A-Za-z_ -]{5,100}$/;

const validationSchema = Yup.object({
  title: Yup.string()
    .matches(TITLE_REGEX, "Title must be 3-20 letters or spaces/underscores.")
    .required("Title is required"),

  description: Yup.string()
    .matches(
      DESCRIPTION_REGEX,
      "Description must be 5-100 letters or spaces/underscores."
    )
    .required("Description is required"),
});

const NewNoteForm = ({ user }) => {
  //useTitle("techNotes: New Note"); // Corrected title for 'New Note'
  const [userId, setUserId] = useState(user?.id);

  console.log("user", user);

  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard/notes");
    }
  }, [isSuccess, navigate]);

  const initialValues = {
    title: "",
    description: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Ensure userId is selected before attempting to add note
      await addNewNote({
        user: userId,
        title: values.title,
        text: values.description,
      });
      //resetForm();
    } catch (err) {
      console.error("Failed to add new note:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Options for the user select dropdown
  /*   const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  )); */

  const content = (
    <div className="max-w-xl mx-auto my-10 p-8 bg-gray-50 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Add New Note
      </h2>

      {isError && (
        <p className="p-3 mb-4 rounded-md bg-red-100 text-red-700 border border-red-200 text-center font-medium">
          Error: {error?.data?.message || "An unknown error occurred"}
        </p>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Title:{" "}
                <span className="text-xs text-gray-500 font-normal">
                  (3-20 letters, spaces, underscores)
                </span>
              </label>
              <Field
                name="title"
                type="text"
                id="title"
                className="
                  shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  transition duration-200 ease-in-out
                "
                placeholder="Enter note title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Description:{" "}
                <span className="text-xs text-gray-500 font-normal">
                  (5-20 letters, spaces, underscores)
                </span>
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                rows="4"
                className="
                  shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  transition duration-200 ease-in-out
                "
                placeholder="Enter note description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            {/* User Selection Dropdown/optional*/}
            {/*             <div>
              <label
                htmlFor="user"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Assigned User:
              </label>
              <select
                id="user"
                name="user" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="
                  shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  transition duration-200 ease-in-out
                "
              >
                {userOptions}
              </select>
            </div> */}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="
                  flex items-center gap-2
                  bg-teal-600 hover:bg-teal-700
                  text-white font-bold py-3 px-6 rounded-full
                  shadow-lg hover:shadow-xl
                  focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-75
                  transition duration-300 ease-in-out
                  transform hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <FaSave className="mr-2" />
                {isLoading ? "Saving..." : "Save Note"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );

  return content;
};

export default NewNoteForm;
