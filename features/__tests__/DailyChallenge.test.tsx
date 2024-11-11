import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import DailyChallenge from "../DailyChallenge";
import Constants from "expo-constants";

// Mock the Constants module from expo-constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    hostUri: "localhost:3000",
  },
}));

// Mock fetch to prevent actual API calls
// Mock fetch to return a Response-like object
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          quizTitle: "Sample Quiz",
          questions: [
            {
              _id: "1",
              questionText: "What is 2 + 2?",
              answers: [
                { answerId: 1, text: "3" },
                { answerId: 2, text: "4" },
              ],
              correctAnswerId: 2,
            },
          ],
        },
      ]),
    // Add these properties to make it Response-like
    ok: true,
    status: 200,
    statusText: "OK",
    headers: new Headers(),
    redirected: false,
    type: "basic",
    url: "",
    clone: jest.fn(),
    text: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    arrayBuffer: jest.fn(),
  } as unknown as Response)
);

describe("DailyChallenge Component", () => {
  it("renders the heading and prompts to select a quiz", () => {
    const { getByText } = render(<DailyChallenge userId="testUser" />);

    // Check if the heading and initial text are displayed
    expect(getByText("Select a Quiz")).toBeTruthy();
  });

  it("loads and displays quizzes from API", async () => {
    const { getByText } = render(<DailyChallenge userId="testUser" />);

    // Wait for the quiz data to be loaded and displayed
    await waitFor(() => {
      expect(getByText("Sample Quiz")).toBeTruthy();
    });
  });

  it("selects a quiz and displays the first question", async () => {
    const { getByText } = render(<DailyChallenge userId="testUser" />);

    // Wait for the quiz data to be loaded
    await waitFor(() => {
      fireEvent.press(getByText("Sample Quiz"));
    });

    // Check if the quiz title and first question are displayed
    expect(getByText("Sample Quiz")).toBeTruthy();
    expect(getByText("What is 2 + 2?")).toBeTruthy();
  });

  it("selects an answer and submits, displaying feedback", async () => {
    const { getByText } = render(<DailyChallenge userId="testUser" />);

    // Wait for the quiz data to be loaded and select the quiz
    await waitFor(() => {
      fireEvent.press(getByText("Sample Quiz"));
    });

    // Select an answer and submit
    fireEvent.press(getByText("4"));
    fireEvent.press(getByText("Submit"));

    // Check if feedback is displayed
    await waitFor(() => {
      expect(getByText("Correct!")).toBeTruthy();
    });
  });
});
