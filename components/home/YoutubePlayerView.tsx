import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Quiz from "../../features/Quiz";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface YoutubePlayerViewProps {
  setSelectedVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedVideoId: string | null;
  selectedVideoTitle: string;
}

const YoutubePlayerView: React.FC<YoutubePlayerViewProps> = ({
  setSelectedVideoId,
  selectedVideoId,
  selectedVideoTitle,
}) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const timeSpentRef = useRef(timeSpent);
  const userIdRef = useRef(userId);
  const [isPlaying, setIsPlaying] = useState(false);
  console.log("selectedVideoTitle", selectedVideoTitle);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(() => {
          const newUserId = user.uid;
          userIdRef.current = newUserId;
          return newUserId;
        });
      }
    });

    const interval = setInterval(() => {
      setTimeSpent((prev) => {
        const newTimeSpent = prev + 1;
        timeSpentRef.current = newTimeSpent;
        return newTimeSpent;
      });
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
      handleSaveProgress({
        videoId: selectedVideoId,
        actualUserId: userIdRef.current ?? "",
        totalTimeSpent: timeSpentRef.current,
        videoName: selectedVideoTitle,
      });
    };
  }, [selectedVideoId]);

  const handleSaveProgress = async ({
    videoId,
    totalTimeSpent,
    videoName,
    actualUserId,
  }: {
    videoId: string | null;
    totalTimeSpent: number;
    videoName: string | null;
    actualUserId: string;
  }) => {
    try {
      const response = await fetch("http://192.168.1.3:3000/api/saveProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: actualUserId,
          moduleId: "module123",
          videoId,
          videoName,
          timeSpent: totalTimeSpent,
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
        <Text style={styles.videoTitle}>{selectedVideoTitle}</Text>
        <YoutubePlayer
          height={300}
          play={isPlaying}
          videoId={selectedVideoId ?? ""}
          onChangeState={(event) => {
            if (event === "playing") {
              setIsPlaying(true);
            } else if (event === "paused" || event === "ended") {
              setIsPlaying(false);
            }
          }}
        />
        {/* {selectedVideoId && <Quiz videoId={selectedVideoId} />} */}
      </View>
    </ScrollView>
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
  videoTitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginVertical: 10,
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

export default YoutubePlayerView;
