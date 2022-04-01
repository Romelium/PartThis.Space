import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import CreateErrorLogger from "utils/api/CreateErrorLogger";
import { NormalErrorType } from "utils/api/ErrorTypes";
import ValidateBody from "utils/api/ValidateBody";
import ValidateFind from "utils/api/ValidateFind";
import ValidateIdToken from "utils/api/ValidateIdToken";

type ReqData = {
  idToken: string;
};

type ResData = {
  success?: any;
  error?: NormalErrorType;
};
export default async (req: NextApiRequest, res: NextApiResponse<ResData>) => {
  const logError = CreateErrorLogger(res, req);

  if (req.method === "DELETE") {
    const body = ValidateBody<ReqData>(req.body, logError, ["idToken"]);
    if (!body) return;
    const decodedIdToken = await ValidateIdToken(body.idToken, logError);
    if (!decodedIdToken) return;

    const space = await ValidateFind(
      prisma.space.findUnique({
        where: {
          id: req.query.spaceID as string,
        },
        select: {
          creatorId: true,
        },
      }),
      logError,
      "Space"
    );
    if (!space) return;
    if (space.creatorId !== decodedIdToken.uid)
      return logError(401, {
        code: "not owner",
        messages: ["Your not the owner of this space."],
      });

    const deleteSpace = await prisma.space
      .delete({
        where: {
          id: req.query.spaceID as string,
        },
      })
      .catch((error) => console.error(error));
    if (!deleteSpace)
      return logError(500, {
        code: "error delete",
        messages: ["Something went wrong when trying to delete the Space."],
      });

    console.log("Deleted:\n", { deleteSpace, decodedIdToken });
    return res.status(200).json({ success: space });
  }

  return logError(405, {
    code: "method not allowed",
    messages: [
      `Your Html method needs to be all capital letters and something else than ${req.method}.`,
    ],
  });
};
