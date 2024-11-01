import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import YoutubePlayerView from "../components/home/YoutubePlayerView";

interface Video {
  _id: string;
  title: string;
  videoId: string;
}

const HomePage: React.FC = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [numColumns, setNumColumns] = useState<number>(1); // State for numColumns

  // Fetch videos from the server
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://192.168.1.5:3000/api/videos");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Get title of the selected video
  const selectedVideoTitle =
    videos.find((video) => video.videoId === selectedVideoId)?.title || "";

  const renderItem = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => setSelectedVideoId(item.videoId)}
    >
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : selectedVideoId ? (
        <YoutubePlayerView
          selectedVideoId={selectedVideoId}
          selectedVideoTitle={selectedVideoTitle}
          setSelectedVideoId={setSelectedVideoId}
        />
      ) : (
        <FlatList
          data={videos}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={numColumns} // Use numColumns state here
          contentContainerStyle={styles.gridContainer}
          key={numColumns} // Add key prop based on numColumns
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
    marginTop: 20,
  },
  item: {
    padding: 25,
    marginVertical: 10, // Adjusted margin for vertical spacing
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  gridContainer: {
    flexGrow: 1,
  },
});

export default HomePage;
