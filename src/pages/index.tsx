import type { InferGetServerSidePropsType, NextPage } from "next";
import { Login } from "../components/Login";
import Publish from "../components/Publish";
import useUser from "../hooks/useUser";
import prisma from "../lib/prisma";

export const getServerSideProps = async () => {
  const spaces = await prisma.space.findMany({
    take: 10,
    select: {
      id: true,
      title: true,
      source: true,
      creator: {
        select: {
          id: true,
          email: true,
        },
      },
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
      <hr />
      <em>Publish:</em> <Publish />
      <hr />
      Spaces:
      <ul>
        {spaces.map((space) => (
          <li key={space.id}>
            <h2>{space.title}</h2>
            <div>{space.source}</div>
            <hr />
            <pre>
              Made by {space.creator.email} <br />
              Creator ID: {space.creator.id} <br />
              Space ID: {space.id} <br />
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
