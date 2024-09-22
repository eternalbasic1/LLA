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
}

const YoutubePlayerView: React.FC<YoutubePlayerViewProps> = ({
  setSelectedVideoId,
  selectedVideoId,
}) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const timeSpentRef = useRef(timeSpent);
  const userIdRef = useRef(userId);
  const [isPlaying, setIsPlaying] = useState(false);
  const validVideoIds: string[] = ["zOIr3WNaTVY", "Rj8bxm0fERw"];
  // const userId = "user123";

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // setUserId(user.uid);
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
        timeSpentRef.current = newTimeSpent; // Update the ref
        return newTimeSpent;
      });
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
      handleSaveProgress({
        videoId: selectedVideoId,
        actualUserId: userIdRef.current ?? "",
        totalTimeSpent: timeSpentRef.current, // Use the ref here
      });
    };
  }, []); // Only run once when the component mounts
  // const auth = getAuth();
  // const unsubscribe = onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setUserId(user.uid);
  //   }
  // });
  console.log("WTFFFFuserId", userId);
  const handleSaveProgress = async ({
    videoId,
    totalTimeSpent,
    actualUserId,
  }: {
    videoId: string | null;
    totalTimeSpent: number;
    actualUserId: string;
  }) => {
    try {
      // CHECK IFCONFIG, Look for the en0 or en1 Interface (usually en0 for Wi-Fi), You see inet 192.168.1.2 netmask 0xffffff00 broadcast 192.168.1.255 replace what you see in this case 192.168.1.2

      // https://chatgpt.com/c/66efd9b1-e390-8013-bf57-59ab2b7e889e
      const response = await fetch("http://192.168.1.7:3000/api/saveProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: actualUserId,
          moduleId: "module123",
          videoId,
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
        {/* Only render the Quiz component if selectedVideoId is one of the valid video IDs */}
        {validVideoIds.includes(
          selectedVideoId as (typeof validVideoIds)[number]
        ) && (
          <Quiz videoId={selectedVideoId as "zOIr3WNaTVY" | "Rj8bxm0fERw"} />
        )}
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
