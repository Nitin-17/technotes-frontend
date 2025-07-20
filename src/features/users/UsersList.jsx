import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User.jsx";
import { Link } from "react-router-dom";
//import useTitle from "../../hooks/useTitle";

const UsersList = () => {
  //useTitle("techNotes: Users List");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loader"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-600 text-center font-semibold mt-4">
        {error?.data?.message || "Something went wrong"}
      </p>
    );
  }

  if (isSuccess) {
    const { ids } = users;

    return (
      <div className="overflow-x-auto p-4 flex flex-col gap-4">
        <div className="flex flex-row justify-end">
          <Link
            to="/dashboard/users/new"
            className="inline-block px-4 py-2 bg-[#1c7ed6]  hover:bg-[#1864ab]  text-white font-semibold rounded-lg shadow-md"
          >
            Add a New User
          </Link>
        </div>
        <div>
          <table className="min-w-full border border-gray-300 rounded-md shadow-sm text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Username
                </th>
                <th className="px-4 py-2 font-medium text-gray-700">Roles</th>
                <th className="px-4 py-2 font-medium text-gray-700">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ids?.length > 0 ? (
                ids.map((userId) => <User key={userId} userId={userId} />)
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

export default UsersList;
