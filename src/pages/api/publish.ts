import { auth } from "lib/firebase-admin";
import prisma from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import CreateErrorLogger from "utils/api/CreateErrorLogger";
import { NormalErrorType } from "utils/api/ErrorTypes";
import Try from "utils/Try";

type ReqData = {
  title?: string;
  source?: string;
  idToken?: string;
};

type ResData = {
  success?: any;
  error?: NormalErrorType;
};

export default async (req: NextApiRequest, res: NextApiResponse<ResData>) => {
  const logError = CreateErrorLogger(res, req);

  // Check is valid
  if (req.method !== "POST")
    return logError(405, {
      code: "method not allowed",
      messages: ["Your Html method needs to be POST."],
    });
  if (!req.body)
    return logError(400, {
      code: "body is missing",
      messages: ["Your request needs to have a body."],
    });

  const body = Try(
    () => JSON.parse(req.body) as ReqData,
    () => null
  );

  // Check is valid
  if (!body)
    return logError(400, {
      code: "body is invalid",
      messages: ["Your request body needs to be a valid JSON object."],
    });

  const { title, source, idToken } = body;

  // Check is valid
  const errorMessages: string[] = [];
  for (const key in { title, source, idToken })
    if (!(<any>body)[key])
      errorMessages.push(`Your request body need to have ${key}`);
  if (errorMessages.length !== 0)
    return logError(400, {
      code: "missing body properties",
      messages: errorMessages,
    });

  const decodedIdToken = await auth.verifyIdToken(idToken!);

  // Check is valid
  if (!decodedIdToken)
    return logError(500, {
      code: "couldn't verify idToken",
      messages: ["We couldn't verify your idToken in your POST body."],
    });
  if (!decodedIdToken.email)
    return logError(401, {
      code: "email missing",
      messages: ["You for some reason have no email."],
    });
  if (!decodedIdToken.email_verified)
    return logError(401, {
      code: "not verified",
      messages: ["Your email is not verified."],
    });

  const Space = await prisma.space
    .create({
      data: {
        title: title!,
        source: source!,
        creator: {
          connectOrCreate: {
            where: {
              id: decodedIdToken.uid,
            },
            create: {
              id: decodedIdToken.uid,
              email: decodedIdToken.email!,
            },
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        title: true,
        creator: true,
      },
    })
    .catch((error) => console.error(error));

  // Check is valid
  if (!Space)
    return logError(500, {
      code: "couldn't create Space",
      messages: ["We couldn't create a Space. Please try again later."],
    });

  console.log("Space created successfully:\n", { Space, decodedIdToken });
  return res.status(200).json({ success: "Space created successfully!" });
};
