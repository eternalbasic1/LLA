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
      <Text style={styles.title}>User Progress Overview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {progressData.length > 0 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get("window").width * 1.5} // Increased width for scrolling
            height={320}
            yAxisLabel=""
            yAxisSuffix=" secs"
            chartConfig={{
              backgroundColor: "#000", // Black background
              backgroundGradientFrom: "#000", // Black
              backgroundGradientTo: "#000", // Black
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White bars
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White labels
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffffff", // White stroke for dots
              },
              // Adjust Y-axis settings to prevent clipping
              propsForVerticalLabels: {
                fill: "#ffffff", // White color for vertical labels
                fontSize: 12,
              },
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Darker background for contrast
    padding: 20,
    justifyContent: "center",
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
