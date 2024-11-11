import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginForm from "../LoginForm";
import { Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation";

// Mock the navigation prop with all necessary methods
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();
const mockNavigation: Partial<
  StackNavigationProp<RootStackParamList, "LoginScreen">
> = {
  navigate: mockNavigate,
  push: mockNavigate,
  goBack: mockGoBack,
  reset: mockReset,
  // Add any other methods used by your component as needed
};

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { email: "test@example.com" } })
  ),
  setPersistence: jest.fn(() => Promise.resolve()),
  getReactNativePersistence: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("LoginForm Component", () => {
  it("renders input fields and login button", () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginForm
        navigation={
          mockNavigation as StackNavigationProp<
            RootStackParamList,
            "LoginScreen"
          >
        }
      />
    );

    expect(
      getByPlaceholderText("Phone Number, Username, or Email")
    ).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log in")).toBeTruthy();
  });

  it("displays validation errors for invalid email and password", async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <LoginForm
        navigation={
          mockNavigation as StackNavigationProp<
            RootStackParamList,
            "LoginScreen"
          >
        }
      />
    );

    fireEvent.changeText(
      getByPlaceholderText("Phone Number, Username, or Email"),
      "invalidEmail"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "123");
    fireEvent.press(getByText("Log in"));

    expect(await findByText("Enter a valid email")).toBeTruthy();
    expect(
      await findByText("Password must be at least 6 characters")
    ).toBeTruthy();
  });

  it("shows a success alert when login is successful", async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginForm
        navigation={
          mockNavigation as StackNavigationProp<
            RootStackParamList,
            "LoginScreen"
          >
        }
      />
    );

    fireEvent.changeText(
      getByPlaceholderText("Phone Number, Username, or Email"),
      "test@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Log in"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Login Successful",
        "Welcome back!"
      );
    });
  });

  it("shows an error alert when login fails", async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginForm
        navigation={
          mockNavigation as StackNavigationProp<
            RootStackParamList,
            "LoginScreen"
          >
        }
      />
    );

    jest
      .spyOn(require("firebase/auth"), "signInWithEmailAndPassword")
      .mockImplementationOnce(() => {
        throw new Error("Login failed");
      });

    fireEvent.changeText(
      getByPlaceholderText("Phone Number, Username, or Email"),
      "test@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Log in"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Login Error", "Login failed");
    });
  });

  it('navigates to SignupScreen when "Sign Up" is pressed', () => {
    const { getByText } = render(
      <LoginForm
        navigation={
          mockNavigation as StackNavigationProp<
            RootStackParamList,
            "LoginScreen"
          >
        }
      />
    );

    fireEvent.press(getByText("Sign Up"));
    expect(mockNavigate).toHaveBeenCalledWith("SignupScreen");
  });
});
