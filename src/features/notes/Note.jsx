import { FaPen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

const Note = ({ noteId }) => {
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  if (!note) return null;

  const created = new Date(note.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  const updated = new Date(note.updatedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
      <td className="px-4 py-3 font-medium text-center">
        {note.completed ? (
          <span className="text-green-600 font-semibold">Completed</span>
        ) : (
          <span className="text-yellow-500 font-semibold">Open</span>
        )}
      </td>

      <td className="px-4 py-3 text-gray-700 text-center">{created}</td>
      <td className="px-4 py-3 text-gray-700 text-center">{updated}</td>
      <td className="px-4 py-3 text-gray-900">{note.title}</td>
      <td className="px-4 py-3 text-gray-700">
        {note.user?.username || note.username}
      </td>

      <td className="px-4 py-3 text-center">
        <Link
          to={`/dashboard/notes/${noteId}`}
          className="text-blue-600 hover:text-blue-800 transition duration-150"
        >
          <FaPen className="inline w-4 h-4" />
        </Link>
      </td>
    </tr>
  );
};

export default memo(Note);
