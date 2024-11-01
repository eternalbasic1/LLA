import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import Constants from "expo-constants";

interface Message {
  _id: string;
  userId: string;
  text: string;
}
const host = Constants?.expoConfig?.hostUri.split(":").shift(); // Get the host dynamically

const socket: Socket = io(`http://${host}:3000`);

interface Props {
  userId: string;
}

const Forum: React.FC<Props> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          `http://${host}:3000/api/messages`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("message", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      socket.emit("newMessage", { userId, text });
      setText("");
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.innerContainer}>
      <Text style={styles.welcomeText}>Discuss Here</Text>
      <Image
        source={{
          uri: "https://img.icons8.com/?size=100&id=118374&format=png&color=FFFFFF",
        }}
        style={styles.image}
      />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((item) => (
          <View key={item._id} style={styles.messageContainer}>
            <Text style={styles.messageText}>
              <Text style={styles.userId}>{item.userId}: </Text>
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  image: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  messageContainer: {
    marginBottom: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 12,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  userId: {
    fontWeight: "bold",
    color: "#4caf50",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 110,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 20,
    padding: 10,
    marginRight: 8,
    backgroundColor: "#2a2a2a",
    color: "#fff",
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Forum;
