import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1v4dfhoORhOmR_sepK929URLPLnvPQcc",
  authDomain: "rnative-instagram-clone.firebaseapp.com",
  projectId: "rnative-instagram-clone",
  storageBucket: "rnative-instagram-clone.appspot.com",
  messagingSenderId: "586711367775",
  appId: "1:586711367775:web:09b2b48c3ff3cfe3085bea",
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const auth = getAuth(firebase);

export {
  firebase,
  auth,
  db,
  createUserWithEmailAndPassword,
  setDoc,
  doc,
  collection,
};
