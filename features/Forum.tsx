import React, { useEffect, useState } from "react";
import {
  FlatList,
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

interface Message {
  _id: string;
  userId: string;
  text: string;
  timestamp: string;
}

const socket: Socket = io("http://192.168.1.3:3000");

interface Props {
  userId: string;
}

const Forum: React.FC<Props> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(
          "http://192.168.1.3:3000/api/messages"
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

  const handleSend = () => {
    if (text.trim()) {
      socket.emit("newMessage", { userId, text }, (response: any) => {
        if (response.error) {
          console.error("Error sending message:", response.error);
        }
      });
      setText("");
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.welcomeText}>Discuss Here</Text>
          <Image
            source={{
              uri: "https://img.icons8.com/?size=100&id=118374&format=png&color=FFFFFF",
            }}
            style={styles.image}
          />
          <FlatList
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>
                  <Text style={styles.userId}>{item.userId}: </Text>
                  {item.text}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    marginBottom: 120,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
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
    marginTop: 10,
  },
  image: {
    width: 40, // Set width of the image
    height: 40, // Set height of the image
    marginBottom: 20, // Add space below the image
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
  listContent: {
    paddingBottom: 60,
  },
});

export default Forum;
