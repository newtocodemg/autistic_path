import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  getDocs, 
  where, 
  deleteDoc,
  orderBy,
  limit
} from "firebase/firestore";

import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Enable Firestore persistent offline cache
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Firestore offline persistence enablement warning:", err.message);
  });
}

// Custom simple User interface for Version 1 Demo
export interface User {
  uid: string;
  email: string;
  displayName: string;
}

export { 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  getDocs,
  where,
  deleteDoc,
  orderBy,
  limit
};
