// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "capstonedesign-12cb0.firebaseapp.com",
  projectId: "capstonedesign-12cb0",
  storageBucket: "capstonedesign-12cb0.appspot.com",
  messagingSenderId: "540659105327",
  appId: "1:540659105327:web:5ec61296f40e35fd0790da",
  measurementId: "G-KWDEQ95XX5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 구글 인증
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(app);

// 파이어
export const db = getFirestore(app);

