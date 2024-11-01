import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const funFactsList = {
  english: [
    "🌎 There are over 7,000 languages spoken worldwide! Imagine all the ways people say 'hello'! 🌎",
    "🔥 The longest word in English has 189,819 letters! It's the chemical name for a protein. 🔥",
    "🎨 Did you know? English borrows words from over 350 different languages! 🎨",
    "🧠 Learning new languages can increase your brain size and improve memory! 🧠",
    "💬 Shakespeare invented over 1,700 words in English. Ever heard of 'bedazzled'? 💬",
    "🚀 Bilingual people can switch tasks faster! It’s like a superpower for the brain! 🚀",
    "✨ English is the most widely spoken language as a second language in the world. ✨",
    "🌐 The word 'robot' comes from the Czech word 'robota', meaning 'forced labor'! 🌐",
    "📜 The most translated book in the world is the Bible, available in over 3,000 languages! 📜",
    "🎉 Knowing a second language can help you think more creatively and make better decisions! 🎉",
  ],
  spanish: [
    "🌎 ¡En el mundo se hablan más de 7,000 idiomas! ¡Imagina cuántas maneras hay de decir 'hola'! 🌎",
    "🔥 La palabra más larga en español tiene 23 letras: 'anticonstitucionalmente'. 🔥",
    "🎨 ¿Sabías que? El español proviene del latín, como el italiano y el portugués. 🎨",
    "🧠 Aprender nuevos idiomas puede aumentar el tamaño del cerebro y mejorar la memoria. 🧠",
    "💬 En español, la letra más común es la 'e'. ¡Intenta escribir sin usarla! 💬",
    "🚀 Las personas bilingües cambian de tareas más rápido. ¡Es como un superpoder! 🚀",
    "✨ El español es el idioma oficial en 21 países. ¡Es el segundo idioma más hablado en el mundo! ✨",
    "🌐 La palabra 'robot' viene del checo 'robota', que significa 'trabajo forzado'. 🌐",
    "📜 El libro más traducido del mundo es la Biblia, disponible en más de 3,000 idiomas. 📜",
    "🎉 Conocer un segundo idioma puede ayudarte a pensar más creativamente y tomar mejores decisiones. 🎉",
  ],
  french: [
    "🌎 Il y a plus de 7 000 langues parlées dans le monde ! Imaginez toutes les façons de dire 'bonjour' ! 🌎",
    "🔥 Le mot le plus long en français est 'anticonstitutionnellement' avec 25 lettres. 🔥",
    "🎨 Saviez-vous ? Le français est une langue latine comme l'italien et l'espagnol. 🎨",
    "🧠 Apprendre de nouvelles langues peut augmenter la taille du cerveau et améliorer la mémoire. 🧠",
    "💬 En français, la lettre la plus fréquente est le 'e'. Essayez d'écrire sans l'utiliser ! 💬",
    "🚀 Les personnes bilingues passent plus vite d'une tâche à l'autre ! 🚀",
    "✨ Le français est parlé comme langue officielle dans 29 pays. 🌍",
    "🌐 Le mot 'robot' vient du tchèque 'robota', qui signifie 'travail forcé'. 🌐",
    "📜 Le livre le plus traduit au monde est la Bible, disponible en plus de 3 000 langues. 📜",
    "🎉 Connaître une seconde langue peut aider à penser plus créativement et à mieux décider. 🎉",
  ],
};

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [crazyContent, setCrazyContent] = useState("");
  const timeSpentRef = useRef(timeSpent);
  const userIdRef = useRef(userId);

  // Determine the content list based on the video title
  const getContentListByLanguage = () => {
    if (selectedVideoTitle.includes("English")) return funFactsList.english;
    if (selectedVideoTitle.includes("Spanish")) return funFactsList.spanish;
    if (selectedVideoTitle.includes("French")) return funFactsList.french;
    return []; // Default if no match
  };

  const changeCrazyContent = () => {
    const contentList = getContentListByLanguage();
    const randomIndex = Math.floor(Math.random() * contentList.length);
    setCrazyContent(contentList[randomIndex]);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const newUserId = user.uid;
        setUserId(newUserId);
        userIdRef.current = newUserId;
      }
      setLoading(false);
    });

    const interval = setInterval(() => {
      setTimeSpent((prev) => {
        const newTimeSpent = prev + 1;
        timeSpentRef.current = newTimeSpent;
        return newTimeSpent;
      });
    }, 1000);

    // Set initial crazy content
    changeCrazyContent();

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
      const response = await fetch(
        "http://192.168.1.15:3000/api/saveProgress",
        {
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
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Progress saved successfully:", data);
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
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

        {/* Crazy Content Section */}
        <View style={styles.crazyContentContainer}>
          <Text style={styles.crazyContentText}>{crazyContent}</Text>
          <TouchableOpacity
            style={styles.changeContentButton}
            onPress={changeCrazyContent}
          >
            <Text style={styles.buttonText}>✨ Change Content! ✨</Text>
          </TouchableOpacity>
        </View>
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
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  videoTitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  crazyContentContainer: {
    marginTop: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FF00FF",
    borderRadius: 10,
    backgroundColor: "#222",
    alignItems: "center",
  },
  crazyContentText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  changeContentButton: {
    padding: 10,
    backgroundColor: "#FF00FF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default YoutubePlayerView;
