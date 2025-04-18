import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Hello, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
