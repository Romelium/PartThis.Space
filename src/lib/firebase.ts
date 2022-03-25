// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import isBrowser from "../utils/isBrowser";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSbdK0NyK_IHJ7AFqh8c72ILaiCUfhh8Y",
  authDomain: "partthis-space.firebaseapp.com",
  projectId: "partthis-space",
  storageBucket: "partthis-space.appspot.com",
  messagingSenderId: "874876325925",
  appId: "1:874876325925:web:8ac065e5bbb459b16aefcc",
  measurementId: "G-W0RGBXKW2E",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = isBrowser ? getAnalytics(app) : undefined;
