// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxUOQ5kZRFbs9M8tLCXKHLvXLOVuV8lF8",
  authDomain: "prepview-9d897.firebaseapp.com",
  projectId: "prepview-9d897",
  storageBucket: "prepview-9d897.firebasestorage.app",
  messagingSenderId: "623138426599",
  appId: "1:623138426599:web:84bb63c4e07f2ef7a0dc42",
  measurementId: "G-0M1Z8XFVZB"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);