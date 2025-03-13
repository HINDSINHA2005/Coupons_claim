import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBISEg5LN0sDDkIiHPddgNI_RKs1IUH9gM",
  authDomain: "couponsite-5aedf.firebaseapp.com",
  projectId: "couponsite-5aedf",
  storageBucket: "couponsite-5aedf.firebasestorage.app",
  messagingSenderId: "231882429151",
  appId: "1:231882429151:web:521192519fb46e8f5fcf6a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔹 Sign in users anonymously when they visit
signInAnonymously(auth)
  .then(() => {
    console.log("Guest signed in successfully");
  })
  .catch((error) => {
    console.error("Anonymous login failed", error);
  });
