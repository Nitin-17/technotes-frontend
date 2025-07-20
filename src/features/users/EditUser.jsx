import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
  useTitle("techNotes: Edit User");

  const { id } = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  if (!user) return <span className="loader"></span>;

  const content = <EditUserForm user={user} />;

  return content;
};
export default EditUser;
