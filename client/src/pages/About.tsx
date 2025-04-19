import { useAuth } from "../context/AuthContext";

const About = () => {
  const { user } = useAuth();
  return <>{user ? <p>{user?.name}</p> : <p>No user</p>}</>;
};
export default About;
