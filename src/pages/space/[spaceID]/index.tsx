import DOMPurify from "isomorphic-dompurify";
import prisma from "lib/prisma";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (typeof context.query.spaceID !== "string")
    return { props: { space: null } };

  const space = await prisma.space.findUnique({
    where: { id: context.query.spaceID },
    select: {
      source: true,
    },
  });
  return { props: { space } };
};

const SpacePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ space }) => {
  if (space === null) return <h1>Space does not exist</h1>;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(space.source) }}
    />
  );
};

export default SpacePage;
