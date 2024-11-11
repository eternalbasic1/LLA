import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PronunciationGuide from "../PronunciationGuide";

// Mock the Speech module from expo-speech
jest.mock("expo-speech", () => ({
  speak: jest.fn(),
}));

describe("PronunciationGuide Component", () => {
  it("renders the title and buttons correctly", () => {
    const { getByText } = render(<PronunciationGuide />);

    // Check if the title is rendered
    expect(getByText("Guide")).toBeTruthy();

    // Check if the mode buttons are rendered
    expect(getByText("Dictionary")).toBeTruthy();
    expect(getByText("Pronunciation")).toBeTruthy();
  });

  it("shows difficulty buttons when Dictionary mode is selected", () => {
    const { getByText } = render(<PronunciationGuide />);

    // Click on Dictionary mode
    fireEvent.press(getByText("Dictionary"));

    // Check if difficulty buttons are rendered
    expect(getByText("Easy")).toBeTruthy();
    expect(getByText("Medium")).toBeTruthy();
    expect(getByText("Hard")).toBeTruthy();
  });

  it("displays words for the selected difficulty level", () => {
    const { getByText } = render(<PronunciationGuide />);

    // Click on Dictionary mode
    fireEvent.press(getByText("Dictionary"));

    // Select "Easy" difficulty
    fireEvent.press(getByText("Easy"));

    // Check if words for "Easy" difficulty are displayed
    expect(getByText("Sunrise")).toBeTruthy();
    expect(getByText("Castle")).toBeTruthy();
    expect(getByText("River")).toBeTruthy();
  });

  it("shows manual spell input and speak button when Pronunciation mode is selected", () => {
    const { getByText, getByPlaceholderText } = render(<PronunciationGuide />);

    // Click on Pronunciation mode
    fireEvent.press(getByText("Pronunciation"));

    // Check if input field and speak button are rendered
    expect(getByPlaceholderText("Type here")).toBeTruthy();
    expect(getByText("Speak")).toBeTruthy();
  });

  it("calls Speech.speak when the Speak button is pressed", () => {
    const { getByText, getByPlaceholderText } = render(<PronunciationGuide />);

    // Click on Pronunciation mode
    fireEvent.press(getByText("Pronunciation"));

    // Enter text and press the Speak button
    fireEvent.changeText(getByPlaceholderText("Type here"), "Hello");
    fireEvent.press(getByText("Speak"));

    // Check if Speech.speak is called with the correct argument
    const Speech = require("expo-speech");
    expect(Speech.speak).toHaveBeenCalledWith("Hello");
  });
});
