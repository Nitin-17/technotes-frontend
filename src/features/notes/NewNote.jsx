import NewNoteForm from "./NewNoteForm";
import { selectAllUsers, useGetUsersQuery } from "../users/usersApiSlice";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
//import useTitle from '../../hooks/useTitle'

const NewNote = () => {
  //useTitle("techNotes: New Note");
  const { email, roles } = useAuth();
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  const currentUser = users?.find((user) => user?.email === email);

  const content = currentUser ? (
    <NewNoteForm user={currentUser} />
  ) : (
    <p>Loading...</p>
  );

  return content;
};
export default NewNote;
