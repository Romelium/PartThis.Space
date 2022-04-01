import { Login } from "components/Login";
import useUser from "hooks/useUser";
import { NextPage } from "next";

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
