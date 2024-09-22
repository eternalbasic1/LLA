import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";

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

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.videoId}>{item.videoId}</Text>
      <Text style={styles.timeSpent}>{item.timeSpent} sec</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Progress</Text>
      {progressData.length > 0 ? (
        <FlatList
          data={progressData}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noDataText}>No progress data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
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
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#34495e",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: Dimensions.get("window").width - 40, // Responsive width
  },
  videoId: {
    color: "#ecf0f1",
    fontSize: 18,
  },
  timeSpent: {
    color: "#ecf0f1",
    fontSize: 16,
    marginTop: 5,
  },
});

export default UserProgressComponent;
