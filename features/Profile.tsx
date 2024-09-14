import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Animated } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Fade-in animation value
  const bounceAnim = useRef(new Animated.Value(0)).current; // Bounce animation for title

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData([
          {
            key: "1",
            title: "Display Name",
            value: user.displayName || "Not set",
          },
          { key: "2", title: "Email", value: user.email },
          { key: "3", title: "User ID", value: user.uid },
          {
            key: "4",
            title: "Profile Picture",
            value: user.photoURL || "No photo",
          },
        ]);
      } else {
        setUserData(null);
      }
    });

    // Run bounce animation for the title
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Run fade-in animation for the list
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => unsubscribe();
  }, [fadeAnim, bounceAnim]);

  const renderItem = ({ item }: { item: any }) => (
    <Animated.View style={[styles.item, { opacity: fadeAnim }]}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.title}:</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.heading,
          { transform: [{ scale: bounceAnim }] }, // Add bounce effect
        ]}
      >
        Profile
      </Animated.Text>
      {userData ? (
        <FlatList
          data={userData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
        />
      ) : (
        <Text style={styles.noUserText}>No user logged in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  heading: {
    color: "white",
    fontSize: 28,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    fontWeight: "bold",
  },
  item: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1e1e1e", // Dark gray background for contrast
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  itemContainer: {
    flexDirection: "row", // Align title and value side by side
    justifyContent: "space-between", // Space between title and value
  },
  title: {
    color: "#aaa", // Lighter gray for titles
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold", // Bold the value to make it stand out
  },
  noUserText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});
