import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "inripaintwall.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "inripaintwall",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "inripaintwall.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "378827206004",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:378827206004:web:fcedf79b97ba3a90799021",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GQDYB4LSKV",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://inripaintwall-default-rtdb.firebaseio.com/",
};

// Initialize Firebase Auth
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export { app, auth };
