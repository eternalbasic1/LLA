import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";

const fetchUserProgress = async (actualUserId: string) => {
  try {
    const response = await fetch(
      `http://192.168.1.7:3000/api/progress/${actualUserId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const progressData = await response.json();
    return progressData; // Return the fetched data
  } catch (error) {
    console.error("Failed to fetch user progress:", error);
  }
};

const UserProgressComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [progressData, setProgressData] = useState<any[]>([]);

  useEffect(() => {
    const loadUserProgress = async () => {
      const data = await fetchUserProgress(userId);
      if (data) {
        setProgressData(data);
      }
    };

    loadUserProgress();
  }, [userId]);

  const chartData = {
    labels: progressData.map((item) => item.videoId),
    datasets: [
      {
        data: progressData.map((item) => item.timeSpent),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {progressData.length > 0 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get("window").width * 1.5} // Increased width for scrolling
            height={320}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#2c3e50",
              backgroundGradientFrom: "#2c3e50",
              backgroundGradientTo: "#34495e",
              color: (opacity = 1) => `rgba(236, 240, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(236, 240, 241, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "4",
                stroke: "#ecf0f1",
              },
            }}
            style={{
              marginVertical: 10,
              borderRadius: 9,
            }}
          />
        ) : (
          <Text style={styles.noDataText}>No progress data available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#ecf0f1",
    fontSize: 24,
    marginBottom: 20,
  },
  noDataText: {
    color: "#ecf0f1",
    fontSize: 16,
    marginTop: 20,
  },
});

export default UserProgressComponent;
