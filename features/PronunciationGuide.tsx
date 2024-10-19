import React, { useState } from "react";
import {
  View,
  Text,
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
        id={value}
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
  const shuffled = words.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const handleSubmit = (
  e: GestureResponderEvent,
  text: string,
  speakText: (value: string) => void
) => {
  e.preventDefault();
  Keyboard.dismiss();
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
    setRandomWordsToDisplay(getRandomWords(randomWords, 5));
  };

  const handleManualMode = () => {
    setSelectManualSpell(true);
    setSelectRandom(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text id="PronunctionGuide" style={styles.title}>
        Pronunciation Guide
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRandomMode} style={styles.modeButton}>
          <Text style={styles.buttonText}>Random Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleManualMode} style={styles.modeButton}>
          <Text style={styles.buttonText}>Manual Mode</Text>
        </TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => speakText(text)}
            style={styles.speakButton}
          >
            <Text style={styles.speakButtonText}>Speak</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16, // Light background for better contrast
  },
  title: {
    color: "#f8f9fa",
    marginTop: 30,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  modeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  manualSpellContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 20,
  },
  inputLabel: {
    color: "#333",
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "#e9ecef",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  speakButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  speakButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  wordContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  wordText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  speakerIconContainer: {
    paddingLeft: 10,
  },
  speakerIcon: {
    width: 30,
    height: 30,
  },
});
