import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import BottomTabs from "../components/home/BottomTabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import Header from "../components/home/Header";
// import Post from '../components/home/Post'
// import Stories from '../components/home/Stories'
// import { POSTS } from '../data/posts'
// import {db} from '../firebase'

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

  return (
    <SafeAreaView style={Styles.container}>
      <Header navigation={navigation} />

      <Text style={{ color: "white", marginTop: 310, marginLeft: 125 }}>
        {visibleScreen === "Home"
          ? "HOME PAGE"
          : visibleScreen === "TrackProgress"
          ? "TRACK PROGRESS"
          : visibleScreen === "DailyChallenge"
          ? "DAILY CHALLENGE"
          : visibleScreen === "Profile"
          ? "PROFILE"
          : "PRONUNCIATION GUIDE"}
      </Text>
      {/* <Text style={{ color: "black", marginTop: 30, marginLeft: 85 }}>
        Malla Next week kaludham
      </Text>
      <Text style={{ color: "black", marginTop: 30, marginLeft: 85 }}>
        OK BYE freinds...👋
      </Text> */}
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
