import * as admin from "firebase-admin";

export const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!)
      ),
    })
  : admin.app();
export const auth = admin.auth();
