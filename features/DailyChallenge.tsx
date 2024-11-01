import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface Answer {
  answerId: number;
  text: string;
}

interface Question {
  _id: string; // Add _id to uniquely identify each question
  questionText: string;
  answers: Answer[];
  correctAnswerId: number;
}

interface Quiz {
  quizTitle: string;
  questions: Question[];
}

interface DailyChallengeProps {
  userId: string;
}
export default function DailyChallenge({ userId }: DailyChallengeProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://192.168.1.15:3000/api/quiz")
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmit = async () => {
    if (selectedQuiz) {
      const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correctAnswerId;

      // Save quiz progress with questionId from MongoDB
      try {
        await fetch("http://192.168.1.15:3000/api/saveQuizProgress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId, // Replace with actual user ID
            questionId: currentQuestion._id, // Use unique question _id from MongoDB
            result: isCorrect,
          }),
        });

        setFeedback(isCorrect ? "Correct!" : "Incorrect!");
      } catch (error) {
        console.error("Error saving quiz progress:", error);
      }

      setIsSubmitted(true);
    }
  };

  const handleNextQuestion = () => {
    if (
      selectedQuiz &&
      currentQuestionIndex < selectedQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setFeedback(null);
    }
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setFeedback(null);
  };

  const handleCompleteQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setFeedback(null);
  };

  if (!selectedQuiz) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Select a Quiz</Text>
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.quizTitle}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quizCard}
              onPress={() => handleQuizSelect(item)}
            >
              <Text style={styles.quizTitle}>{item.quizTitle}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{selectedQuiz.quizTitle}</Text>
      <Text style={styles.questionText}>{currentQuestion.questionText}</Text>

      <FlatList
        data={currentQuestion.answers}
        keyExtractor={(item) => item.answerId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.answerButton,
              selectedAnswer === item.answerId && styles.selectedAnswer,
            ]}
            onPress={() => handleAnswerSelect(item.answerId)}
          >
            <Text style={styles.answerText}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />

      {isSubmitted && (
        <Text
          style={[
            styles.feedbackText,
            feedback === "Correct!"
              ? styles.correctAnswer
              : styles.incorrectAnswer,
          ]}
        >
          {feedback}
        </Text>
      )}

      {isSubmitted &&
      currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteQuiz}
        >
          <Text style={styles.completeButtonText}>Complete Quiz</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={isSubmitted ? handleNextQuestion : handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitted ? "Next Question" : "Submit"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  quizCard: {
    backgroundColor: "#1f1f1f",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  quizTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  questionText: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedAnswer: {
    backgroundColor: "#4e90d6",
  },
  answerText: {
    color: "white",
    fontSize: 16,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  correctAnswer: {
    color: "green",
  },
  incorrectAnswer: {
    color: "red",
  },
  submitButton: {
    backgroundColor: "#4e90d6",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 230,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 150,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
