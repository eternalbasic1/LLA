import React from "react";
import { View, Text, Button } from "react-native";
import * as Speech from "expo-speech";

export default function PronunciationGuide() {
  const speakText = () => {
    Speech.speak("Hello, welcome to the text-to-speech demo");
  };

  return (
    <View>
      <Text style={{ color: "white", marginTop: 300, marginLeft: 115 }}>
        Pronunciation Guide
      </Text>
      <View style={{ padding: 20 }}>
        <Text>Press the button to hear the pronunciation</Text>
        <Button title="Speak" onPress={speakText} />
      </View>
    </View>
  );
}
