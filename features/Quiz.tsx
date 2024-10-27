import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  videoId: string;
}

const Quiz: React.FC<QuizProps> = ({ videoId }) => {
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("QUIXXX", quiz);
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.3:3000/api/quiz/${videoId}`
        );
        const data = await response.json();
        setQuiz(data.questions);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [videoId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  if (quiz.length === 0) {
    return (
      <Text style={{ color: "white" }}>No quiz available for this video.</Text>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % quiz.length);
  };

  return (
    <ScrollView>
      <Text style={styles.heading}>Quiz Time</Text>
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
  heading: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
    marginHorizontal: 20,
    marginBottom: 20,
  },
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
