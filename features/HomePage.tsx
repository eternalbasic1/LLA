import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import YoutubePlayerView from "../components/home/YoutubePlayerView";

interface Video {
  id: string;
  title: string;
  videoId: string;
}

const HomePage: React.FC = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const videos: Video[] = [
    { id: "1", title: "How to Learn a Language Fast", videoId: "zOIr3WNaTVY" },
    { id: "2", title: "5 Language Learning Tips", videoId: "Rj8bxm0fERw" },
    // Add more videos...
  ];

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
      {selectedVideoId ? (
        <YoutubePlayerView
          selectedVideoId={selectedVideoId}
          setSelectedVideoId={setSelectedVideoId}
        />
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
