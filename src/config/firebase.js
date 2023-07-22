// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// getAuth allows you to implement authentication
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCceudNyNAkPZBQPJD9thBRWOl4HJEiCuM",
  authDomain: "pawmance-f453a.firebaseapp.com",
  projectId: "pawmance-f453a",
  storageBucket: "pawmance-f453a.appspot.com",
  messagingSenderId: "962010390030",
  appId: "1:962010390030:web:4244556bb74a38d28a265f",
  measurementId: "G-QMPGDF790L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const db = getFirestore(app)
export { auth, googleProvider, facebookProvider, db }
