// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "southern-house-473210-i3.firebaseapp.com",
  projectId: "southern-house-473210-i3",
  storageBucket: "southern-house-473210-i3.firebasestorage.app",
  messagingSenderId: "1091584699417",
  appId: "1:1091584699417:web:5b31993d2618074761ce88",
  measurementId: "G-FDCT2R94SC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);