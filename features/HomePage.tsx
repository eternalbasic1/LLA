import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Quiz from "./Quiz"; // Import the Quiz component

interface Video {
  id: string;
  title: string;
  videoId: string;
}

const HomePage: React.FC = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const userId = "user123";

  const videos: Video[] = [
    { id: "1", title: "How to Learn a Language Fast", videoId: "zOIr3WNaTVY" },
    { id: "2", title: "5 Language Learning Tips", videoId: "Rj8bxm0fERw" },
    // Add more videos...
  ];

  // List of valid video IDs from quizData
  const validVideoIds = ["zOIr3WNaTVY", "Rj8bxm0fERw"] as const;

  const renderItem = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => setSelectedVideoId(item.videoId)}
    >
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1); // Increment time spent each second
      }, 1000);
    }

    // Clear the interval if the video is paused or ended
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  const handleSaveProgress = async () => {
    try {
      const response = await fetch("http://192.168.1.2:3000/api/saveProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          moduleId: "module123",
          videoId: "zOIr3WNaTVY",
          timeSpent,
          completed: true,
          quizResults: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Progress saved successfully:", data);
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  return (
    <View style={styles.container}>
      {selectedVideoId ? (
        <ScrollView>
          <View style={{ marginBottom: 100 }}>
            <TouchableOpacity
              onPress={() => setSelectedVideoId(null)}
              style={styles.backButton}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=40217&format=png&color=FFFFFF",
                }}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <YoutubePlayer
              height={300}
              play={isPlaying}
              videoId={selectedVideoId}
              onChangeState={(event) => {
                if (event === "playing") {
                  setIsPlaying(true);
                } else if (event === "paused" || event === "ended") {
                  setIsPlaying(false);
                  handleSaveProgress();
                }
              }}
            />

            {/* Only render the Quiz component if selectedVideoId is one of the valid video IDs */}
            {validVideoIds.includes(
              selectedVideoId as (typeof validVideoIds)[number]
            ) && (
              <Quiz
                videoId={selectedVideoId as "zOIr3WNaTVY" | "Rj8bxm0fERw"}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  item: {
    flex: 1,
    padding: 20,
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
  },
  backButton: {
    marginBottom: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  row: {
    justifyContent: "space-between",
  },
  gridContainer: {
    flexGrow: 1,
  },
});

export default HomePage;
