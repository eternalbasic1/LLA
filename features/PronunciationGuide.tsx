import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";

function pronunciationUI(value: string, speakText: (value: string) => void) {
  return (
    <View
      style={{
        backgroundColor: "white",
        position: "relative",
        margin: 20,
        padding: 19,
        borderRadius: 5,
      }}
      id={value}
    >
      <Text
        style={{
          color: "black",
          position: "absolute",
          fontFamily: "sans-serif",
          fontSize: 18,
          paddingLeft: 10,
          paddingTop: 4,
        }}
      >
        {value}
      </Text>

      <TouchableOpacity
        onPress={() => speakText(value)}
        style={{
          paddingLeft: 280,
          paddingTop: 5,
          borderColor: "white",
          position: "absolute",
        }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/?size=100&id=11475&format=png&color=1A1A1A",
          }}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function PronunciationGuide() {
  const speakText = (value: string) => {
    Speech.speak(value);
  };
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
  ];

  return (
    <ScrollView>
      <View style={{ marginBottom: 40 }}>
        <Text
          style={{
            color: "white",
            marginTop: 10,
            marginLeft: 100,
            fontSize: 18,
          }}
        >
          Pronunciation Guide
        </Text>
        {/* <View style={{ padding: 20 }}>
        <Text>Press the button to hear the pronunciation</Text>
        <Button title="Speak" onPress={() => speakText("i don't know")} />
      </View> */}
        {randomWords.map((word) => pronunciationUI(word, speakText))}
        {/* <View
        style={{
          backgroundColor: "red",
          position: "relative",
          margin: 20,
          padding: 19,
        }}
      >
        <Text
          style={{
            color: "white",
            position: "absolute",
            fontFamily: "sans-serif",
            fontSize: 18,
            paddingLeft: 10,
            paddingTop: 4,
          }}
        >
          Testing
        </Text>

        <TouchableOpacity
          onPress={() => speakText("hallo motto")}
          style={{
            paddingLeft: 280,
            paddingTop: 5,
            borderColor: "white",
            position: "absolute",
          }}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/fluency-systems-filled/144/ffffff/home.png",
            }}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View> */}
      </View>
    </ScrollView>
  );
}
