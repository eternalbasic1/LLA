import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import SignupForm from "../SignupForm";
import { Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation";

// Define the type for navigation
type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignupScreen"
>;

// Mock the navigation prop
const mockNavigate = jest.fn();
const mockNavigation: Partial<SignupScreenNavigationProp> = {
  navigate: mockNavigate,
  push: mockNavigate,
};

// Mock Firebase imports
jest.mock("../../../firebase", () => ({
  auth: {
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: { email: "test@example.com", uid: "12345" } })
    ),
  },
  db: {},
  setDoc: jest.fn(() => Promise.resolve()),
  doc: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("SignupForm Component", () => {
  it("renders input fields and signup button", () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupForm navigation={mockNavigation as SignupScreenNavigationProp} />
    );

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it('navigates to LoginScreen when "Log In" is pressed', () => {
    const { getByText } = render(
      <SignupForm navigation={mockNavigation as SignupScreenNavigationProp} />
    );

    fireEvent.press(getByText("Log In"));
    expect(mockNavigate).toHaveBeenCalledWith("LoginScreen");
  });
});
