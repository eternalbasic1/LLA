import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

interface QuizProps {
  videoId: keyof typeof quizData; // Use keyof to restrict the type to keys in quizData
}

const quizData = {
  zOIr3WNaTVY: [
    {
      question: "What is the fastest way to learn a language?",
      options: [
        "Practice daily",
        "Memorize vocabulary",
        "Ignore grammar",
        "Speak to a native",
      ],
      correctAnswer: "Speak to a native",
    },
    {
      question: "How much time should you spend learning a new language daily?",
      options: ["1 hour", "10 minutes", "2 hours", "30 minutes"],
      correctAnswer: "30 minutes",
    },
  ],
  Rj8bxm0fERw: [
    {
      question: "What is the best way to improve listening skills?",
      options: ["Watch movies", "Read books", "Speak more", "Write essays"],
      correctAnswer: "Watch movies",
    },
    // More questions for other videos...
  ],
};

const Quiz: React.FC<QuizProps> = ({ videoId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuiz = quizData[videoId]; // Now videoId is correctly typed
  const currentQuestion = currentQuiz[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(
      (prevIndex) => (prevIndex + 1) % currentQuiz.length
    );
  };

  return (
    <ScrollView>
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 25,
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        Quiz Time
      </Text>
      <View style={styles.quizContainer}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption,
            ]}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        {showAnswer && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>
              {selectedAnswer === currentQuestion.correctAnswer
                ? "Correct!"
                : `Wrong! The correct answer is ${currentQuestion.correctAnswer}.`}
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
              <Text style={styles.nextButtonText}>Next Question</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  quizContainer: {
    padding: 20,
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 20,
  },
  question: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#555",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: "#888",
  },
  optionText: {
    color: "white",
  },
  answerContainer: {
    marginTop: 10,
  },
  answerText: {
    color: "#0f0",
    fontSize: 16,
  },
  nextButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#0a84ff",
    borderRadius: 5,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Quiz;
