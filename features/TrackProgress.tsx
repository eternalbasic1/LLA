import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";

const fetchUserProgress = async (actualUserId: string) => {
  try {
    const response = await fetch(
      `http://192.168.1.5:3000/api/progress/${actualUserId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const progressData = await response.json();
    return progressData;
  } catch (error) {
    console.error("Failed to fetch user progress:", error);
  }
};

const fetchQuizProgress = async (userId: string) => {
  try {
    const response = await fetch(
      `http://192.168.1.5:3000/api/getQuizProgress/${userId}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const quizProgressData = await response.json();
    return quizProgressData;
  } catch (error) {
    console.error("Failed to fetch quiz progress:", error);
  }
};

const UserProgressComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [quizProgressData, setQuizProgressData] = useState<any[]>([]);

  useEffect(() => {
    const loadUserProgress = async () => {
      const data = await fetchUserProgress(userId);
      if (data) setProgressData(data);
    };

    const loadQuizProgress = async () => {
      const quizData = await fetchQuizProgress(userId);
      if (quizData) setQuizProgressData(quizData);
    };

    loadUserProgress();
    loadQuizProgress();
  }, [userId]);

  const correctCount = quizProgressData.filter(
    (item) => item.result === true
  ).length;
  const incorrectCount = quizProgressData.length - correctCount;

  const quizChartData = [
    {
      name: "Correct",
      count: correctCount,
      color: "green",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Incorrect",
      count: incorrectCount,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const chartData = {
    labels: progressData.map(
      (item) =>
        `${item.videoName.split(" ")[0]} ${
          item.videoName.split(" ")[1] === "Advance" ? "A" : "B"
        }`
    ),
    datasets: [{ data: progressData.map((item) => item.timeSpent) }],
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>User Progress Overview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {progressData.length > 0 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get("window").width * 1.5}
            height={320}
            yAxisLabel=""
            yAxisSuffix=" secs"
            chartConfig={{
              backgroundColor: "#000",
              backgroundGradientFrom: "#000",
              backgroundGradientTo: "#000",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffffff" },
              propsForVerticalLabels: { fill: "#ffffff", fontSize: 12 },
            }}
            style={{
              marginVertical: 10,
              borderRadius: 16,
              marginLeft: 3,
              marginRight: 3,
              paddingRight: 100,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 4,
            }}
          />
        ) : (
          <Text style={styles.noDataText}>No progress data available.</Text>
        )}
      </ScrollView>
      <View style={{ marginBottom: 100 }}>
        <Text style={styles.title}>Quiz Progress</Text>
        {quizProgressData.length > 0 ? (
          <PieChart
            data={quizChartData}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No quiz attempts made.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#121212",
    padding: 20,
    alignItems: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  noDataText: {
    color: "#ecf0f1",
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default UserProgressComponent;
