import { NextPage } from "next";
import { Login } from "../components/Login";
import useUser from "../hooks/useUser";

const LoginPage: NextPage = () => {
  const [user, loading] = useUser();

  return (
    <>
      {loading ? "Loading..." : user?.email ?? "Not logged in"}
      <Login />
    </>
  );
};

export default LoginPage;
