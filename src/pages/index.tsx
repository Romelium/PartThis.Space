import type { InferGetServerSidePropsType, NextPage } from "next";
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

  console.log(spaces);
  return (
    <div>
      <a href="/login">
        {loading ? "Loading..." : user?.email ?? "Not logged in"}
      </a>
      <hr />
      <ul>
        {spaces.map((space) => (
          <li key={space.id}>
            <h2>{space.title}</h2>
            <div style={{ whiteSpace: "pre-wrap" }}>{space.source}</div>
            <hr />
            <pre>
              Made by {space.creator.email} <br />
              Creator ID: {space.creator.id} <br />
              Space ID: {space.id} <br />
            </pre>
          </li>
        ))}
      </ul>
      <hr />
      <Publish />
    </div>
  );
};

export default Home;
