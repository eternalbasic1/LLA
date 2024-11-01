import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import Constants from "expo-constants";

const cleanData = (data) => {
  const cleanedData = {};
  for (const key in data) {
    // Remove surrounding quotes and trailing commas
    cleanedData[key] = data[key].replace(/^"|"|,$/g, "");
  }
  return cleanedData;
};

const firebaseConfigConstant = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId,
};
const firebaseConfig = cleanData(firebaseConfigConstant);

// Initialize Firebase App and Auth
let app, auth, db;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    db = getFirestore(app); // Initialize Firestore
    console.log(
      "Firebase app, auth, and Firestore initialized with persistence."
    );
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app); // Initialize Firestore if already initialized
}

// Handle authentication state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    console.log("User signed in:", user);
  } else {
    await AsyncStorage.removeItem("user");
    console.log("No user signed in.");
  }
});

// Function to retrieve user from AsyncStorage
const retrieveUser = async () => {
  const userString = await AsyncStorage.getItem("user");
  if (userString) {
    const user = JSON.parse(userString);
    console.log("User restored from AsyncStorage:", user);
    return user;
  } else {
    console.log("No user found in AsyncStorage.");
    return null;
  }
};

// Export necessary functions and variables
export {
  app as firebase,
  auth,
  db,
  createUserWithEmailAndPassword,
  setDoc,
  doc,
  collection,
  retrieveUser,
};
