import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const auth = getAuth();

setPersistence(auth, getReactNativePersistence(AsyncStorage))
  .then(() => {})
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

const LoginForm: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const LoginFormSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("🔥 Firebase login successful", email);
      Alert.alert("Login Successful", "Welcome back!");
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = (isValid: boolean): StyleProp<ViewStyle> => ({
    backgroundColor: isValid ? "#000" : "#ccc",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 4,
  });

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => onLogin(values.email, values.password)}
        validationSchema={LoginFormSchema}
        validateOnMount
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
          setFieldTouched,
        }) => (
          <>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.email.length < 1 || Validator.validate(values.email)
                      ? "#000"
                      : "gray",
                },
              ]}
            >
              <TextInput
                placeholder="Phone Number, Username, or Email"
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus
                accessibilityLabel="Email input"
                accessibilityHint="Enter your email address"
                onChangeText={(text) => {
                  handleChange("email")(text);
                  setFieldTouched("email", true, true);
                }}
                onBlur={handleBlur("email")}
                value={values.email}
                returnKeyType="next"
                onSubmitEditing={() => setFieldTouched("password", true)}
              />
            </View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor: values.password.length >= 6 ? "#000" : "gray",
                },
              ]}
            >
              <TextInput
                placeholder="Password"
                placeholderTextColor="#666"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                textContentType="password"
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
            </View>
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Forgot Password",
                    "Reset instructions sent to email"
                  )
                }
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <Pressable
              style={({ pressed }) => [
                buttonStyle(isValid),
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleSubmit as () => void}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log in</Text>
              )}
            </Pressable>
            <View style={styles.signupContainer}>
              <Text>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.push("SignupScreen")}>
                <Text style={styles.signupText}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
    paddingHorizontal: 16,
    backgroundColor: "#fff", // Background in white for contrast
  },
  inputField: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#f8f8f8", // Light gray background
    marginBottom: 10,
    borderWidth: 1,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#000", // Black text
    fontWeight: "600",
  },
  buttonText: {
    fontWeight: "600",
    color: "#fff", // White text on black button
    fontSize: 17,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
  },
  signupText: {
    color: "#000", // Black text for consistency
    fontWeight: "600",
  },
});

export default LoginForm;
