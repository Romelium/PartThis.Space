import { ErrorLogger } from "./CreateErrorLogger";
import Try from "../Try";

const ValidateBody = <R>(
  body: string,
  logError: ErrorLogger,
  requiredKeys: (keyof R)[]
): (R & { [key: string]: unknown }) | void => {
  // Check is valid
  if (!body)
    return logError(400, {
      code: "body is missing",
      messages: ["Your request needs to have a body."],
    });

  const parsedBody = Try(
    () => JSON.parse(body),
    () => undefined
  );

  // Check is valid
  if (parsedBody === undefined)
    return logError(400, {
      code: "body is invalid",
      messages: ["Your request body needs to be a valid JSON object."],
    });

  // Check is valid
  const errorMessages: string[] = [];
  for (const key of requiredKeys)
    if ((<any>parsedBody)[key] === undefined)
      errorMessages.push(`Your request body need to have ${key}`);
  if (errorMessages.length !== 0)
    return logError(400, {
      code: "missing body properties",
      messages: errorMessages,
    });

  return parsedBody;
};

export default ValidateBody;
