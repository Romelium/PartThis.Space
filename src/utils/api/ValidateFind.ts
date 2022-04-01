import { PrismaPromise } from "@prisma/client";
import { ErrorLogger } from "./CreateErrorLogger";

const ValidateFind = async <T>(
  prismaFind: PrismaPromise<T>,
  logError: ErrorLogger,
  name: string
) => {
  const space = await prismaFind.catch((error) => {
    console.error(error);
    return undefined;
  });
  if (space === undefined)
    return logError(500, {
      code: "error find space",
      messages: [`Something went wrong when trying to find the ${name}.`],
    });
  if (space === null)
    return logError(404, {
      code: "not found",
      messages: [`We couldn't find the ${name} that you were looking for.`],
    });
  return space;
};

export default ValidateFind;
