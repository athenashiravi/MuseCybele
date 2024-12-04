import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

const RecentMural = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/mural-recent.png")} // Replace with your actual image path
      style={styles.background}
    >
      <View style={styles.recentlyOnMind}>
        <Text style={styles.subtitle}>Recently on your mind</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>What are your current goals?</Text>
          <Text style={styles.communityText}>Persian Community Mural</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: undefined,
    justifyContent: "center",
    padding: 20,
  },
  recentlyOnMind: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background
    borderRadius: 10,
    padding: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  cardText: {
    fontSize: 16,
  },
  communityText: {
    fontSize: 14,
    color: "#999",
  },
});

export default RecentMural;
