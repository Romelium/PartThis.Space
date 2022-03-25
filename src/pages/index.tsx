import type { NextPage } from "next";
import { Login } from "../components/Login";
import useUser from "../hooks/useUser";

const Home: NextPage = () => {
  const [user, loading] = useUser();

  return (
    <div>
      {loading ? "Loading..." : user?.email ?? "Not logged in"}
      <Login />
    </div>
  );
};

export default Home;
