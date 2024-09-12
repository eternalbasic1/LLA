import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Keyboard,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";
import * as Speech from "expo-speech";

function pronunciationUI(value: string, speakText: (value: string) => void) {
  return (
    <View style={styles.wordContainer} id={value}>
      <Text style={styles.wordText} id={value}>
        {value}
      </Text>

      <TouchableOpacity
        onPress={() => speakText(value)}
        style={styles.speakerIconContainer}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/?size=100&id=11475&format=png&color=1A1A1A",
          }}
          style={styles.speakerIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const getRandomWords = (words: string[], count: number): string[] => {
  // Shuffle the array
  const shuffled = words.sort(() => 0.5 - Math.random());
  // Return the first `count` elements
  return shuffled.slice(0, count);
};

const handleSubmit = (
  e: GestureResponderEvent,
  text: string,
  speakText: (value: string) => void
) => {
  // Close the keyboard
  e.preventDefault();
  Keyboard.dismiss();

  // Submit
  speakText(text);
};

export default function PronunciationGuide() {
  const [selectRandom, setSelectRandom] = useState(false);
  const [selectManualSpell, setSelectManualSpell] = useState(false);
  const [text, setText] = useState("");
  const [randomWordsToDisplay, setRandomWordsToDisplay] = useState<string[]>(
    []
  );

  const randomWords = [
    "Sunrise",
    "Elephant",
    "Castle",
    "Harmony",
    "Journey",
    "Vision",
    "Paradise",
    "Adventure",
    "Whale",
    "Phoenix",
    "Crystal",
    "Victory",
    "Lighthouse",
    "Breeze",
    "Infinity",
    "Galaxy",
    "Forest",
    "Echo",
    "Serenity",
    "Thunder",
    "Oasis",
    "Sunset",
    "Zephyr",
    "Meteor",
    "Renaissance",
    "Orbit",
    "Horizon",
    "Voyage",
    "Nebula",
    "Aurora",
    "Quasar",
    "Tide",
    "Wilderness",
    "Cascade",
    "Eclipse",
    "Labyrinth",
    "Zenith",
    "Twilight",
    "Mirage",
    "Celestial",
    "Aurora",
    "Solstice",
    "Tranquil",
    "Cascade",
    "Mosaic",
    "Ember",
    "Glimmer",
    "Mystic",
    "Zen",
    "Horizon",
    "Epiphany",
    "Odyssey",
  ];

  const speakText = (value: string) => {
    Speech.speak(value);
  };

  const handleRandomMode = () => {
    setSelectRandom(true);
    setSelectManualSpell(false);
    // Set a random selection of 5 words
    setRandomWordsToDisplay(getRandomWords(randomWords, 5));
  };

  const handleManualMode = () => {
    setSelectManualSpell(true);
    setSelectRandom(false);
  };

  return (
    <ScrollView>
      <View style={{ marginBottom: 40 }}>
        <Text id="PronunctionGuide" style={styles.title}>
          Pronunciation Guide
        </Text>

        {/* Wrap the buttons in a View and use flexDirection: 'row' to align them side by side */}
        <View style={styles.buttonContainer}>
          <Button title="Random Mode" onPress={handleRandomMode} />
          <Button title="Manual Mode" onPress={handleManualMode} />
        </View>

        {selectRandom &&
          randomWordsToDisplay.map((word) => pronunciationUI(word, speakText))}
        {selectManualSpell && (
          <View style={styles.manualSpellContainer}>
            <Text style={styles.inputLabel} id="TextBox">
              Enter text:
            </Text>
            <TextInput
              style={styles.textInput}
              id="TextInput"
              placeholder="Type here"
              value={text}
              onChangeText={(newText) => setText(newText)}
              placeholderTextColor="#aaa"
            />
            <Button
              title="Speak"
              onPress={() => speakText(text)}
              color="#007bff" // Optional: you can choose a color for the button
            />
          </View>
        )}
        {/* {selectRandom == false && selectManualSpell == false && (
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 20,
              marginLeft: 20,
            }}
          >
            Select Any Mode{" "}
          </Text>
        )} */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "white",
    marginTop: 10,
    marginLeft: 100,
    fontSize: 18,
    fontWeight: "bold", // Add font weight
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  manualSpellContainer: {
    backgroundColor: "#333", // Dark background for contrast
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
  },
  inputLabel: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#333", // Text color in the input field
  },
  wordContainer: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Adds shadow for Android
  },
  wordText: {
    color: "black",
    fontSize: 18,
    fontFamily: "sans-serif",
    flex: 1,
  },
  speakerIconContainer: {
    paddingLeft: 10,
  },
  speakerIcon: {
    width: 30,
    height: 30,
  },
});
