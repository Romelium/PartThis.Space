import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FormEventHandler } from "react";
import { auth } from "../lib/firebase";

type AuthError = { code: string; message: string };

const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch(({ message }: AuthError) => {
    window.alert(message.replace("Firebase: ", ""));
    return null;
  });
  if (userCredential) {
    sendEmailVerification(userCredential.user);
    window.alert(
      `We just sent an email to ${userCredential.user.email}. Click the link in the email to verify your account.`
    );
  }
  return userCredential;
};

/**
 * Asynchronously signs in or signs up using an email and password.
 *
 * Will use window.alert on failure.
 * @param email The users email address.
 * @param password The users password.
 * @returns The users UserCredential.
 */

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password).catch(
    ({ code, message }: AuthError) => {
      switch (code) {
        case "auth/user-not-found":
          return signUp(email, password);
        default:
          window.alert(message.replace("Firebase: ", ""));
      }
      return null;
    }
  );
};

const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
  event.preventDefault(); // don't redirect the page

  const { email, password } = event.target as EventTarget & {
    email: HTMLInputElement;
    password: HTMLInputElement;
  };

  login(email.value, password.value);
};

export function Login() {
  return (
    <form onSubmit={onSubmit}>
      <label>
        email:
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          required
        />
      </label>
      <label>
        password:
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />
      </label>
      <label>
        <input type="submit" value="Submit" />
      </label>
    </form>
  );
}
