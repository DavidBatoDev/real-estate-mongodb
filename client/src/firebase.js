// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-b4ef5.firebaseapp.com",
  projectId: "mern-estate-b4ef5",
  storageBucket: "mern-estate-b4ef5.appspot.com",
  messagingSenderId: "8653926726",
  appId: "1:8653926726:web:d6d8fa9364da8a742bf547"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);