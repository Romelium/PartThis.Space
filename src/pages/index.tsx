import type { InferGetServerSidePropsType, NextPage } from "next";
import { Login } from "../components/Login";
import useUser from "../hooks/useUser";
import prisma from "../lib/prisma";

export const getServerSideProps = async () => {
  const spaces = await prisma.space.findMany({
    take: 10,
    select: {
      title: true,
      source: true,
    },
  });
  return { props: { spaces } };
};

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ spaces }) => {
  const [user, loading] = useUser();

  return (
    <div>
      {loading ? "Loading..." : user?.email ?? "Not logged in"}
      <Login />
      Spaces:
      <ul>
        {spaces.map((space) => (
          <li>
            <h2>{space.title}</h2>
            <div>{space.source}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
