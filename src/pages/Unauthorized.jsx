const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-red-600">
      <h1 className="text-4xl font-bold">403 - Unauthorized</h1>
      <p className="mt-4">You do not have permission to access this page.</p>
    </div>
  );
};
export default Unauthorized;
