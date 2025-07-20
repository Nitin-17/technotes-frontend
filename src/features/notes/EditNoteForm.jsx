import { useEffect, useState } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
//import useTitle from "../../hooks/useTitle"; // Uncomment if you use this hook
import { FaSave, FaTrash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth.jsx";

const TITLE_REGEX = /^[A-Za-z_ ]{3,20}$/;
const DESCRIPTION_REGEX = /^[A-Za-z0-9 .,!?_'-]{5,100}$/;

const validationSchema = Yup.object({
  title: Yup.string()
    .matches(TITLE_REGEX, "Title must be 3-20 letters or spaces/underscores.")
    .notRequired("Title is required"),

  description: Yup.string()
    .matches(
      DESCRIPTION_REGEX,
      "Description must be 5-100 letters or spaces/underscores."
    )
    .notRequired("Description is required"),

  completed: Yup.boolean().optional(),
});

const EditNoteForm = ({ note, users }) => {
  //useTitle(`techNotes: Edit Note ${note.title}`); // Example useTitle
  const { isManager, isAdmin } = useAuth();

  const [
    updateNote,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: updateError,
    },
  ] = useUpdateNoteMutation();
  const [
    deleteNote,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: deleteError,
    },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [userId, setUserId] = useState(
    note.user || (users && users.length > 0 ? users[0].id : "")
  );
  useEffect(() => {
    if (isSuccessUpdate || isSuccessDelete) {
      navigate("/dashboard/notes");
    }
  }, [isSuccessUpdate, isSuccessDelete, navigate]);

  // Initial values populated from the 'note' prop
  const initialValues = {
    title: note.title,
    description: note.text,
    completed: note.completed,
  };

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      await updateNote({
        id: note.id,
        user: userId,
        title: values.title,
        text: values.description,
        completed: values.completed,
      });
    } catch (err) {
      console.error("Failed to update note:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete note "${note.title}"?`)
    ) {
      try {
        await deleteNote({ id: note.id });
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
  };

  // Options for the user select dropdown
  /*   const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  )); */

  const errorMessage =
    updateError?.data?.message ||
    deleteError?.data?.message ||
    "An unknown error occurred";

  const content = (
    <div className="max-w-xl mx-auto my-10 p-8 bg-gray-50 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Edit Note: {note.title}
      </h2>

      {(isErrorUpdate || isErrorDelete) && (
        <p className="p-3 mb-4 rounded-md bg-red-100 text-red-700 border border-red-200 text-center font-medium">
          Error: {errorMessage}
        </p>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
        enableReinitialize={true}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Note ID - Read Only */}
            <div>
              <label
                htmlFor="noteId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Note ID:
              </label>
              <input
                id="noteId"
                type="text"
                value={note.id}
                readOnly
                className="
                  shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                  bg-gray-100 cursor-not-allowed
                "
              />
            </div>

            {/* Created At / Updated At - Read Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="createdAt"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Created At:
                </label>
                <input
                  id="createdAt"
                  type="text"
                  value={new Date(note.createdAt).toLocaleString("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                  readOnly
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="updatedAt"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Updated At:
                </label>
                <input
                  id="updatedAt"
                  type="text"
                  value={new Date(note.updatedAt).toLocaleString("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                  readOnly
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

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

            {/* User Selection Dropdown/optional */}
            {/*     <div>
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

            {/* Completed Checkbox */}
            <div className="flex items-center">
              <Field
                type="checkbox"
                name="completed"
                id="completed"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="completed"
                className="ml-2 block text-gray-700 text-sm font-bold"
              >
                Completed
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting || isLoadingUpdate}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-fullshadow-lg hover:shadow-xlfocus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-75transition duration-300 ease-in-outtransform hover:scale-105disabled:opacity-50 disabled:cursor-not-allowe"
              >
                <FaSave className="mr-2" />
                {isLoadingUpdate ? (
                  <span className="loader"></span>
                ) : (
                  "Save Changes"
                )}
              </button>

              {(isAdmin || isManager) && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoadingDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-fullshadow-lg hover:shadow-xlfocus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-75transition duration-300 ease-in-outtransform hover:scale-105disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTrash className="mr-2" />
                  {isLoadingDelete ? (
                    <span className="loader"></span>
                  ) : (
                    "Delete Note"
                  )}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );

  return content;
};

export default EditNoteForm;
