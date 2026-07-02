import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
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
  limit,
  setIndexConfiguration
} from "firebase/firestore";

// Config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyBM-VnANG9AHmjOvSKHCQpfZaBK5HwExgM",
  authDomain: "woven-tune-lcf5x.firebaseapp.com",
  projectId: "woven-tune-lcf5x",
  storageBucket: "woven-tune-lcf5x.firebasestorage.app",
  messagingSenderId: "950460776119",
  appId: "1:950460776119:web:e7a7fa8ce9f294473e1732"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
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
export type { User };
