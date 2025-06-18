import { initializeApp } from "firebase/app";

const firebaseConfig = {
  authDomain: "inripaintwall.firebaseapp.com",
  projectId: "inripaintwall",
  storageBucket: "inripaintwall.firebasestorage.app",
  messagingSenderId: "378827206004",
  appId: "1:378827206004:web:fcedf79b97ba3a90799021",
  measurementId: "G-GQDYB4LSKV",
  databaseURL: "https://inripaintwall-default-rtdb.firebaseio.com/",
};

export const app = initializeApp(firebaseConfig);
