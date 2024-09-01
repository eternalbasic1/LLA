import "./firebase";
import React from "react";
import AuthNavigation from "./AuthNavigation";
import { expo as appName } from "./app.json";
import { AppRegistry } from "react-native";

export default function App() {
  return (
    //<HomeScreen/>
    // <NewPostScreen/>
    //<SignedInStack/>
    <AuthNavigation />
  );
}

// import "./firebase"; // Ensure this path is correct and points to your Firebase setup file
// import { AppRegistry } from "react-native";
// import App from "./App"; // Your main App component
// import { expo as appName } from "./app.json"; // Ensure this file is in the root directory

AppRegistry.registerComponent(appName.name, () => App);
