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

function pronunciationUI(
  word: string,
  meaning: string,
  speakText: (value: string) => void
) {
  return (
    <View style={styles.wordContainer} key={word}>
      <Text style={styles.wordText}>{word}</Text>
      <Text style={styles.meaningText}>{meaning}</Text>

      <TouchableOpacity
        onPress={() => speakText(word)}
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

const getWordsByDifficulty = (
  wordsWithMeanings: { word: string; meaning: string; difficulty: string }[],
  difficulty: string
) => {
  return wordsWithMeanings.filter(
    (wordObj) => wordObj.difficulty === difficulty
  );
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
  const [selectDictionary, setSelectDictionary] = useState(false);
  const [selectManualSpell, setSelectManualSpell] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  const [text, setText] = useState("");
  const [wordsToDisplay, setWordsToDisplay] = useState<
    { word: string; meaning: string }[]
  >([]);

  const wordsWithMeanings = [
    // Easy
    {
      word: "Sunrise",
      meaning: "The first appearance of the sun in the morning",
      difficulty: "Easy",
    },
    {
      word: "Castle",
      meaning: "A large building typically fortified",
      difficulty: "Easy",
    },
    {
      word: "River",
      meaning: "A natural stream of water flowing",
      difficulty: "Easy",
    },
    {
      word: "Garden",
      meaning: "A piece of ground used for growing flowers or vegetables",
      difficulty: "Easy",
    },
    {
      word: "Bridge",
      meaning: "A structure built to span a physical obstacle",
      difficulty: "Easy",
    },

    // Medium
    {
      word: "Journey",
      meaning: "An act of traveling from one place to another",
      difficulty: "Medium",
    },
    {
      word: "Harmony",
      meaning: "A pleasing combination or arrangement of parts",
      difficulty: "Medium",
    },
    {
      word: "Exquisite",
      meaning: "Extremely beautiful or delicate",
      difficulty: "Medium",
    },
    {
      word: "Enigmatic",
      meaning: "Difficult to interpret or understand",
      difficulty: "Medium",
    },
    {
      word: "Cascade",
      meaning: "A process whereby something is passed on successively",
      difficulty: "Medium",
    },

    // Hard
    {
      word: "Pernicious",
      meaning: "Having a harmful effect, especially in a gradual way",
      difficulty: "Hard",
    },
    {
      word: "Antithesis",
      meaning: "A contrast or opposition between two things",
      difficulty: "Hard",
    },
    {
      word: "Ephemeral",
      meaning: "Lasting for a very short time",
      difficulty: "Hard",
    },
    {
      word: "Labyrinthine",
      meaning: "Complicated and difficult to find one's way",
      difficulty: "Hard",
    },
    {
      word: "Imbroglio",
      meaning: "An extremely confused, complicated, or embarrassing situation",
      difficulty: "Hard",
    },
  ];

  const speakText = (value: string) => {
    Speech.speak(value);
  };

  const handleDictionaryMode = () => {
    setSelectDictionary(true);
    setSelectManualSpell(false);
    setWordsToDisplay(
      getWordsByDifficulty(wordsWithMeanings, selectedDifficulty)
    );
  };

  const handleManualMode = () => {
    setSelectManualSpell(true);
    setSelectDictionary(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text id="PronunciationGuide" style={styles.title}>
        Pronunciation Guide
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleDictionaryMode}
          style={styles.modeButton}
        >
          <Text style={styles.buttonText}>Dictionary</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleManualMode} style={styles.modeButton}>
          <Text style={styles.buttonText}>Pronunciation</Text>
        </TouchableOpacity>
      </View>

      {selectDictionary && (
        <View style={styles.difficultyContainer}>
          {["Easy", "Medium", "Hard"].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                selectedDifficulty === level && styles.selectedDifficultyButton,
              ]}
              onPress={() => {
                setSelectedDifficulty(level);
                setWordsToDisplay(
                  getWordsByDifficulty(wordsWithMeanings, level)
                );
              }}
            >
              <Text style={styles.difficultyText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectDictionary &&
        wordsToDisplay.map(({ word, meaning }) =>
          pronunciationUI(word, meaning, speakText)
        )}

      {selectManualSpell && (
        <View style={styles.manualSpellContainer}>
          <Text style={styles.inputLabel}>Enter text:</Text>
          <TextInput
            style={styles.textInput}
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
    paddingHorizontal: 16,
    marginBottom: 120,
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
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  difficultyLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  difficultyButton: {
    backgroundColor: "#e9ecef",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedDifficultyButton: {
    backgroundColor: "green",
  },
  difficultyText: {
    color: "#333",
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
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  meaningText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  speakerIconContainer: {
    paddingTop: 10,
  },
  speakerIcon: {
    width: 30,
    height: 30,
  },
});
