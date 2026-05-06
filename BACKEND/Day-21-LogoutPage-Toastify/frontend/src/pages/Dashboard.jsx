import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const {user} = useAuth()
  return (
    <>
      <h1>This is Dashboard</h1>
      <h2>
        {user?.name}
      </h2>
    </>
  );
};

export default Dashboard;
