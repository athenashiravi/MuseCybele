import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

// Replace 'require' with your actual image paths
const IDENTITIES = {
  "Persian Moms": require("./assets/persian_moms.png"),
  "Newborn Moms": require("./assets/newborn_moms.png"),
  "Single Moms": require("./assets/single_moms.png"),
  "Military Moms": require("./assets/military_moms.png"),
  "Rural Moms": require("./assets/rural_moms.png"),
  "Working Moms": require("./assets/working_moms.png"),
};

const Identity = ({ title }) => {
  return (
    <TouchableOpacity style={styles.box}>
      <ImageBackground
        source={IDENTITIES[title]} // Using the images from assets
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Text style={styles.boxText}>{title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    height: 100, // Set a fixed height for the boxes
  },
  imageBackground: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  imageStyle: {
    borderRadius: 10,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black", // Change color as needed
  },
});

export default Identity;
