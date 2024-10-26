import React, { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { View, SafeAreaView, StyleSheet } from "react-native";
import BottomTabs from "../components/home/BottomTabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import Header from "../components/home/Header";
import HomePage from "../features/HomePage";
import TrackProgress from "../features/TrackProgress";
import DailyChallenge from "../features/DailyChallenge";
import Profile from "../features/Profile";
import PronunciationGuide from "../features/PronunciationGuide";
import Forum from "../features/Forum";

// Define bottom tab icons
const bottomtabicons = [
  {
    name: "Home",
    active: "https://img.icons8.com/fluency-systems-filled/144/ffffff/home.png",
    inactive:
      "https://img.icons8.com/fluency-systems-regular/48/ffffff/home.png",
  },
  {
    name: "TrackProgress",
    active: "https://img.icons8.com/?size=100&id=8309&format=png&color=FFFFFF",
    inactive: "https://img.icons8.com/?size=100&id=375&format=png&color=FFFFFF",
  },
  {
    name: "DailyChallenge",
    active: "https://img.icons8.com/?size=100&id=8092&format=png&color=FFFFFF",
    inactive:
      "https://img.icons8.com/?size=100&id=3979&format=png&color=FFFFFF",
  },
  {
    name: "PronunciationGuide",
    active: "https://img.icons8.com/?size=100&id=10482&format=png&color=FFFFFF",
    inactive:
      "https://img.icons8.com/?size=100&id=2672&format=png&color=FFFFFF",
  },
  {
    name: "Profile",
    active: "https://img.icons8.com/?size=100&id=20749&format=png&color=000000",
    inactive:
      "https://img.icons8.com/?size=100&id=7820&format=png&color=FFFFFF",
  },
  {
    name: "Chat", // New chat icon
    active:
      "https://img.icons8.com/?size=100&id=118374&format=png&color=FFFFFF",
    inactive: "https://img.icons8.com/?size=100&id=143&format=png&color=FFFFFF",
  },
];

// Define navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [visibleScreen, setVisibleScreen] = useState("Home");
  const [userId, setUserId] = useState<string | null>(null);
  const userIdRef = useRef(userId);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(() => {
          const newUserId = user.uid;
          userIdRef.current = newUserId;
          return newUserId;
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={Styles.container}>
      <Header navigation={navigation} />
      <View style={{ position: "static", width: "auto", height: "100%" }}>
        {visibleScreen === "Home" ? (
          <HomePage />
        ) : visibleScreen === "TrackProgress" ? (
          <TrackProgress userId={userIdRef.current ?? ""} />
        ) : visibleScreen === "DailyChallenge" ? (
          <DailyChallenge />
        ) : visibleScreen === "Profile" ? (
          <Profile />
        ) : visibleScreen === "Chat" ? ( // New Chat screen rendering
          <Forum userId={userIdRef.current ?? ""} /> // Pass userId here
        ) : (
          <PronunciationGuide />
        )}
      </View>

      <BottomTabs icons={bottomtabicons} setVisibleScreen={setVisibleScreen} />
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
});

export default HomeScreen;
