// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "movieshub-fbee4.firebaseapp.com",
  projectId: "movieshub-fbee4",
  storageBucket: "movieshub-fbee4.appspot.com",
  messagingSenderId: "624892072155",
  appId: "1:624892072155:web:b2b8f90c3955398dc6bcfe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const moviesRefrence = collection(db, "movies");
export const reviewRefrence = collection(db, "reviews");
export const usersRefrence = collection(db, "users");

export default app;
