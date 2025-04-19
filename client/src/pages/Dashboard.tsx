import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <p>Your email: {user?.email}</p>
      {/* <img src={user?.picture} alt="avatar" width={80} /> */}
      <button onClick={logout} className="mt-4">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
