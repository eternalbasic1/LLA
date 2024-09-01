import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { SignedInStack, SignedOutStack } from "./navigation";
import { firebase } from "./firebase"; // Assuming you've exported `firebase` from your firebase.js

const AuthNavigation = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const userHandler = (user: User | null) => setCurrentUser(user);

  useEffect(() => {
    const auth = getAuth(firebase);
    const unsubscribe = onAuthStateChanged(auth, (user) => userHandler(user));

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return <>{currentUser ? <SignedInStack /> : <SignedOutStack />}</>;
};

export default AuthNavigation;
