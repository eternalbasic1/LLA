import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import LoginForm from "../components/LoginScreen/LoginForm";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation"; // Adjust the path as needed

// Define the type for the navigation prop
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const INSTAGRAM_LOGO =
  "https://cdn0.iconfinder.com/data/icons/apple-apps/100/Apple_Books-1024.png";

const LoginScreen: React.FC<Props> = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image source={{ uri: INSTAGRAM_LOGO, height: 100, width: 100 }} />
    </View>
    <LoginForm navigation={navigation} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
});

export default LoginScreen;
