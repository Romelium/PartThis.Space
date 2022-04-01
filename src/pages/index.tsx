import Publish from "components/Publish";
import useUser from "hooks/useUser";
import DOMPurify from "isomorphic-dompurify";
import prisma from "lib/prisma";
import type { InferGetServerSidePropsType, NextPage } from "next";
import Router from "next/router";

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
      <a href="/login">
        {loading ? "Loading..." : user?.email ?? "Not logged in"}
      </a>
      <hr />
      <ul>
        {spaces.map((space) => (
          <li key={space.id}>
            <h2>{space.title}</h2>
            <iframe srcDoc={DOMPurify.sanitize(space.source)} />
            <hr />
            <pre>
              Made by {space.creator.email} <br />
              Creator ID: {space.creator.id} <br />
              Space ID: {space.id} <br />
            </pre>
            <button
              style={{
                display:
                  loading || user?.uid !== space.creator.id
                    ? "none"
                    : undefined,
              }}
              onClick={async () => {
                const res = await fetch(`/api/space/${space.id}`, {
                  method: "DELETE",
                  body: JSON.stringify({
                    idToken: await user!.getIdToken(),
                  }),
                });
                console.log(await res.json());
                Router.reload();
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <Publish />
    </div>
  );
};

export default Home;
