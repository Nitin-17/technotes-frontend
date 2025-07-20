import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetNotesQuery, selectNoteById } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import useAuth from "../../hooks/useAuth";

const EditNote = () => {
  const { id } = useParams();
  const { email, isManager, isAdmin } = useAuth();

  // Fetch notes and users
  const {
    data: notesData,
    isLoading: isNotesLoading,
    isSuccess: isNotesSuccess,
    isError: isNotesError,
    error: notesError,
  } = useGetNotesQuery("notesList");

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    isError: isUsersError,
    error: usersError,
  } = useGetUsersQuery("usersList");

  // Select note only after notes are fetched

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  let content;

  if (isNotesLoading || isUsersLoading) {
    content = <p>Loading...</p>;
  } else if (isNotesError) {
    content = <p>Error loading note: {notesError?.data?.message}</p>;
  } else if (isUsersError) {
    content = <p>Error loading users: {usersError?.data?.message}</p>;
  } else if (!note) {
    content = <p>Note not found.</p>;
  } else if (!isAdmin && !isManager) {
    console.log("usernamenot", isAdmin, isManager);
    if (note?.user?.email !== email) {
      return <p>No access</p>;
    }
  } else {
    //const users = Object.values(usersData.entities);
    content = <EditNoteForm note={note} users={users} />;
  }

  return content;
};

export default EditNote;
