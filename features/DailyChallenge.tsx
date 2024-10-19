import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";

// Define TypeScript interfaces for the quiz structure
interface Answer {
  answerId: number;
  text: string;
}

interface Question {
  questionText: string;
  answers: Answer[];
  correctAnswerId: number;
}

interface Quiz {
  quizTitle: string;
  questions: Question[];
}

export default function DailyChallenge() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // State to hold the list of quizzes
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null); // State for the selected quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Fetch all quiz data from the backend
    fetch("http://192.168.1.7:3000/api/quiz")
      .then((res) => res.json())
      .then((data) => setQuizzes(data)); // Store the array of quizzes
  }, []);

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswer(answerId);
  };

  const handleNextQuestion = () => {
    if (
      selectedQuiz &&
      currentQuestionIndex < selectedQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0); // Reset question index for new quiz
    setSelectedAnswer(null); // Reset selected answer
    setIsSubmitted(false); // Reset submitted status
  };

  // Render the quiz selection if no quiz is selected
  if (!selectedQuiz) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "white", fontSize: 24, marginBottom: 20 }}>
          Select a Quiz
        </Text>
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.quizTitle}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: "gray",
                marginVertical: 10,
                padding: 10,
              }}
              onPress={() => handleQuizSelect(item)}
            >
              <Text style={{ color: "white" }}>{item.quizTitle}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Render the selected quiz
  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: "white", fontSize: 24, marginBottom: 20 }}>
        {selectedQuiz.quizTitle}
      </Text>

      <Text style={{ color: "white", fontSize: 18 }}>
        {currentQuestion.questionText}
      </Text>

      <FlatList
        data={currentQuestion.answers}
        keyExtractor={(item) => item.answerId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor:
                selectedAnswer === item.answerId ? "blue" : "gray",
              marginVertical: 10,
              padding: 10,
            }}
            onPress={() => handleAnswerSelect(item.answerId)}
          >
            <Text style={{ color: "white" }}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />

      {isSubmitted && (
        <Text style={{ color: "white", marginTop: 20 }}>
          {selectedAnswer === currentQuestion.correctAnswerId
            ? "Correct!"
            : "Incorrect!"}
        </Text>
      )}

      <Button
        title={isSubmitted ? "Next Question" : "Submit"}
        onPress={isSubmitted ? handleNextQuestion : handleSubmit}
      />
    </View>
  );
}
