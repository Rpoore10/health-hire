// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCI76viqyt0MtD8zwbD8006WHXCpz8nA6M",
  authDomain: "health-hire.firebaseapp.com",
  projectId: "health-hire",
  // Important: for web, storageBucket should be "<projectId>.appspot.com"
  storageBucket: "health-hire.appspot.com",
  messagingSenderId: "840132593032",
  appId: "1:840132593032:web:d3bc4bd19559bae159a63d",
  // measurementId is optional; safe to keep or remove
  measurementId: "G-NN98GWEP59",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

