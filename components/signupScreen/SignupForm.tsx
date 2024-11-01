import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  setDoc,
  doc,
} from "../../firebase"; // Adjust the path as needed
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignupScreen"
>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupForm: React.FC<Props> = ({ navigation }) => {
  const SignupFormSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    username: Yup.string()
      .min(2, "A username is required")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const getRandomProfilePicture = async () => {
    const response = await fetch("https://randomuser.me/api");
    const data = await response.json();
    return data.results[0].picture.large;
  };

  const onSignup = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const authUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Firebase user created successfully", email);
      await setDoc(doc(db, "users", authUser.user.email), {
        owner_uid: authUser.user.uid,
        username: username,
        email: authUser.user.email,
        profile_picture: await getRandomProfilePicture(),
      });
      console.log("User document written");
      Alert.alert("Signup Successful", "Welcome to the app!");
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={(values) =>
          onSignup(values.email, values.password, values.username)
        }
        validationSchema={SignupFormSchema}
        validateOnMount
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
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
                placeholder="Email"
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
            </View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor: values.username.length >= 2 ? "#000" : "gray",
                },
              ]}
            >
              <TextInput
                placeholder="Username"
                placeholderTextColor="#666"
                autoCapitalize="none"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
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
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: isValid ? "#000" : "#ccc" },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
            <View style={styles.loginContainer}>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.push("LoginScreen")}>
                <Text style={styles.loginText}> Log In</Text>
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
    backgroundColor: "#fff",
  },
  inputField: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
    borderWidth: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 4,
  },
  buttonText: {
    fontWeight: "600",
    color: "#fff",
    fontSize: 17,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
  },
  loginText: {
    color: "#000",
    fontWeight: "600",
  },
});

export default SignupForm;
