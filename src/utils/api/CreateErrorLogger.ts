import { NextApiRequest, NextApiResponse } from "next";
import { NormalErrorType } from "utils/api/ErrorTypes";

export type ErrorLogger = (
  statusCode: number,
  { code, messages }: NormalErrorType
) => void;

const CreateErrorLogger =
  (res: NextApiResponse, req: NextApiRequest): ErrorLogger =>
  (statusCode: number, { code, messages }: NormalErrorType) => {
    const error = {
      code,
      messages,
    };

    console.error({ req, error });

    res.status(statusCode).json({ error });
  };

export default CreateErrorLogger;
