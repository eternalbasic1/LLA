import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageStyle,
} from "react-native";
import { Divider } from "react-native-elements";

interface IconType {
  name: string;
  active: string;
  inactive: string;
}

interface BottomTabsProps {
  icons: IconType[];
  setVisibleScreen: React.Dispatch<React.SetStateAction<string>>;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ icons, setVisibleScreen }) => {
  const [activeTab, setActiveTab] = useState<string>("Home");

  useEffect(() => {
    setVisibleScreen(activeTab);
  }, [activeTab]);

  const Icon: React.FC<{ icon: IconType }> = ({ icon }) => (
    <TouchableOpacity onPress={() => setActiveTab(icon.name)}>
      <Image
        source={{ uri: activeTab === icon.name ? icon.active : icon.inactive }}
        style={[
          styles.icon,
          icon.name === "Profile" ? styles.profilePic : null,
          icon.name === "TrackProgress" ? styles.progress : null,
          activeTab === "Profile" && icon.name === activeTab
            ? styles.activeProfilePic
            : null,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Divider width={1} orientation="vertical" />
      <View style={styles.container}>
        {icons.map((icon, index) => (
          <Icon key={index} icon={icon} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "absolute",
    bottom: 0, // Stick to the bottom
    zIndex: 99,
    backgroundColor: "#000", // Black background for the entire bottom tab
    paddingBottom: 10, // Optional: Add padding if needed
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 60, // Increased height for better touch target
    alignItems: "center", // Center icons vertically
  },

  icon: {
    width: 30,
    height: 30,
  },

  profilePic: {
    borderRadius: 50,
  } as ImageStyle,

  activeProfilePic: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  } as ImageStyle,

  progress: {
    bottom: 3,
  },
});

export default BottomTabs;
