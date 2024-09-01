import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from "react-native";
import SignupForm from "../components/signupScreen/SignupForm";

const INSTAGRAM_LOGO =
  "https://cdn0.iconfinder.com/data/icons/apple-apps/100/Apple_Books-1024.png";

interface SignupScreenProps {
  navigation: any; // Replace `any` with the correct type if using navigation prop types
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image source={{ uri: INSTAGRAM_LOGO }} style={styles.logo} />
    </View>
    <SignupForm navigation={navigation} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 12,
  } as ViewStyle,
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  } as ViewStyle,
  logo: {
    height: 100,
    width: 100,
  } as ImageStyle,
});

export default SignupScreen;
