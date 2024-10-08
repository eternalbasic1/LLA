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

// Define navigation prop types
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
    email: Yup.string().email().required("An email is required"),
    username: Yup.string().required().min(2, "A username is required"),
    password: Yup.string()
      .required()
      .min(6, "Your password has to have at least 6 characters"),
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
      console.log("Firebase user created successfully", email, password);

      // await setDoc(doc(db, "users", authUser.user.email), {
      //   owner_uid: authUser.user.uid,
      //   username: username,
      //   email: authUser.user.email,
      //   profile_picture: await getRandomProfilePicture(),
      // });

      if (authUser.user.email) {
        await setDoc(doc(db, "users", authUser.user.email), {
          owner_uid: authUser.user.uid,
          username: username,
          email: authUser.user.email,
          profile_picture: await getRandomProfilePicture(),
        });
      }

      console.log("User document written");
    } catch (error: any) {
      console.log(error.message);
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{
          email: "test2@gmail.com",
          username: "test123",
          password: "1234567",
        }}
        onSubmit={(values) => {
          onSignup(values.email, values.password, values.username);
        }}
        validationSchema={SignupFormSchema}
        validateOnMount={true}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.email.length < 1 || Validator.validate(values.email)
                      ? "#ccc"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus={true}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
            </View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.username.length < 1 || values.username.length >= 6
                      ? "#ccc"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Username"
                autoCapitalize="none"
                textContentType="username"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
            </View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.password.length < 1 || values.password.length >= 6
                      ? "#ccc"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry={true}
                textContentType="password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
            </View>
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: isValid ? "#0096F6" : "#9ACAF7",
                },
              ]}
              onPress={() => handleSubmit()} // No type casting needed
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
            <View style={styles.loginContainer}>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.push("LoginScreen")}>
                <Text style={{ color: "#6BB0F5" }}> Log In</Text>
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
  },
  inputField: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#FAFAFA",
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
    width: "100%",
    justifyContent: "center",
    marginTop: 50,
  },
});

export default SignupForm;
