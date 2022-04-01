import { auth } from "lib/firebase-admin";
import { ErrorLogger } from "utils/api/CreateErrorLogger";

const ValidateIdToken = async (
  idToken: string,
  logError: ErrorLogger,
  checkEmailVerified: boolean = true
) => {
  const decodedIdToken = await auth
    .verifyIdToken(idToken)
    .catch((error) => console.error(error));

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
  if (!decodedIdToken.email_verified && checkEmailVerified)
    return logError(401, {
      code: "not verified",
      messages: ["Your email is not verified."],
    });

  return decodedIdToken;
};

export default ValidateIdToken;
