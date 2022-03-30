import { NextApiRequest, NextApiResponse } from "next";
import { NormalErrorType } from "./ErrorTypes";

const CreateErrorLogger =
  (res: NextApiResponse, req: NextApiRequest) =>
  (statusCode: number, { code, messages }: NormalErrorType) => {
    const error = {
      code,
      messages,
    };

    console.error({ req, error });

    res.status(statusCode).json({ error });
  };

export default CreateErrorLogger;
