// TODO: 1st Variation
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  initializeAuth,
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
// const auth = initializeAuth(firebase, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

export {
  firebase,
  auth,
  db,
  createUserWithEmailAndPassword,
  setDoc,
  doc,
  collection,
};

// TODO: 2nd Variation
// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyD1v4dfhoORhOmR_sepK929URLPLnvPQcc",
//   authDomain: "rnative-instagram-clone.firebaseapp.com",
//   projectId: "rnative-instagram-clone",
//   storageBucket: "rnative-instagram-clone.appspot.com",
//   messagingSenderId: "586711367775",
//   appId: "1:586711367775:web:09b2b48c3ff3cfe3085bea",
// };

// // Initialize Firebase App
// const firebaseApp = initializeApp(firebaseConfig);

// // Initialize Firestore
// const db = getFirestore(firebaseApp);

// // Initialize Auth
// const auth = getAuth(firebaseApp);

// // Manual persistence with AsyncStorage
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     // User is signed in, save user data to AsyncStorage
//     await AsyncStorage.setItem("user", JSON.stringify(user));
//   } else {
//     // User is signed out, remove user data from AsyncStorage
//     await AsyncStorage.removeItem("user");
//   }
// });

// // Function to retrieve user from AsyncStorage on app load
// const retrieveUser = async () => {
//   // Attempt to get the user string from AsyncStorage
//   const userString = await AsyncStorage.getItem("user");

//   // Check if userString is null
//   if (userString) {
//     // Parse the string if it's not null
//     const user = JSON.parse(userString);
//     console.log("User restored from AsyncStorage:", user);

//     // Return the user object
//     return user;
//   } else {
//     // Handle the case where no user is stored (null case)
//     console.log("No user found in AsyncStorage.");
//     return null;
//   }
// };

// export {
//   firebaseApp as firebase,
//   auth,
//   db,
//   createUserWithEmailAndPassword,
//   setDoc,
//   doc,
//   collection,
//   retrieveUser, // Export the retrieveUser function if needed
// };

// TODO: 3rd Variation

// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   initializeAuth,
//   // @ts-ignore
//   getReactNativePersistence,
// } from "firebase/auth";
// import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyD1v4dfhoORhOmR_sepK929URLPLnvPQcc",
//   authDomain: "rnative-instagram-clone.firebaseapp.com",
//   projectId: "rnative-instagram-clone",
//   storageBucket: "rnative-instagram-clone.appspot.com",
//   messagingSenderId: "586711367775",
//   appId: "1:586711367775:web:09b2b48c3ff3cfe3085bea",
// };

// // Initialize Firebase App
// const firebaseApp = initializeApp(firebaseConfig);

// // Initialize Firestore
// const db = getFirestore(firebaseApp);

// // Initialize Auth with AsyncStorage persistence
// const auth = initializeAuth(firebaseApp, {
//   // ts-ignore
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// // You can also use getAuth(firebaseApp) if needed for some legacy methods
// // const legacyAuth = getAuth(firebaseApp);

// export {
//   firebaseApp as firebase,
//   auth,
//   db,
//   createUserWithEmailAndPassword,
//   setDoc,
//   doc,
//   collection,
// };
