import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
//import PulseLoader from "react-spinners/PulseLoader";

const NotesList = () => {
  useTitle("Tech-Notes: Notes List");

  const { email, isManager, isAdmin } = useAuth();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loader"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-600 text-center font-medium py-4">
        {error?.data?.message}
      </p>
    );
  }

  if (isSuccess) {
    const { ids, entities } = notes;

    console.log("idd---", ids);
    console.log("edtities---", entities);
    console.log("email is", email);

    const filteredIds =
      isManager || isAdmin
        ? [...ids]
        : ids.filter((noteId) => entities[noteId]?.user?.email === email);

    console.log("-------", filteredIds);

    return (
      <div className="overflow-x-auto p-4 flex flex-col gap-4">
        <div className="flex flex-row justify-end">
          <Link
            to="/dashboard/notes/new"
            className="inline-block px-4 py-2 bg-[#1c7ed6]  hover:bg-[#1864ab]  text-white font-semibold rounded-lg shadow-md"
          >
            Add a New Note
          </Link>
        </div>
        <table className="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg overflow-hidden bg-white">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Created
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Updated
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                Title
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                Owner
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredIds?.map((noteId) => (
              <Note key={noteId} noteId={noteId} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default NotesList;
