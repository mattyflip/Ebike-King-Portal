import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtuguwWyHdSbRzv5lyVkyXEIhZgyOeiSw",
  authDomain: "ebk-master-diagnostic-portal.firebaseapp.com",
  projectId: "ebk-master-diagnostic-portal",
  storageBucket: "ebk-master-diagnostic-portal.firebasestorage.app",
  messagingSenderId: "1044497196393",
  appId: "1:1044497196393:web:e191e8f2eae25b20e789f8",
  measurementId: "G-VDYTTPZYN4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
