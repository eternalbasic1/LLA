import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

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
    {
      id: "3",
      title: "Learn Any Language in Just 30 Days!",
      videoId: "zOIr3WNaTVY",
    },
    { id: "4", title: "10 Language Learning Hacks", videoId: "Rj8bxm0fERw" },
    { id: "5", title: "Master a New Language", videoId: "zOIr3WNaTVY" },
    {
      id: "6",
      title: "Fluent in 3 Months? Discover How",
      videoId: "Rj8bxm0fERw",
    },
    {
      id: "7",
      title: "One Language Learning App That Will Make You a Pro",
      videoId: "zOIr3WNaTVY",
    },
    { id: "8", title: "From Zero to Fluent", videoId: "Rj8bxm0fERw" },
    {
      id: "9",
      title: "Why Traditional Language Courses Are Failing You",
      videoId: "zOIr3WNaTVY",
    },
    {
      id: "10",
      title: "You Won't Believe How Easy Learning a Language",
      videoId: "Rj8bxm0fERw",
    },
    {
      id: "11",
      title: "You Won't Believe How Easy Learning a Language",
      videoId: "Rj8bxm0fERw",
    },
    {
      id: "12",
      title: "You Won't Believe How Easy Learning a Language",
      videoId: "Rj8bxm0fERw",
    },
    // Add more videos as needed
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
        <View>
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
          <YoutubePlayer height={300} play={true} videoId={selectedVideoId} />
        </View>
      ) : (
        <View style={{ marginBottom: 130 }}>
          <FlatList
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2} // Set to 2 for grid view
            columnWrapperStyle={styles.row} // Apply row style for spacing
            contentContainerStyle={styles.gridContainer} // Ensure the grid content is scrollable
          />
        </View>
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
    flexGrow: 1, // Ensure the content container can grow and allow scrolling
  },
});

export default HomePage;
