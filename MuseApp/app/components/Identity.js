import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const Identity = ({ title }) => {
  return (
    <TouchableOpacity style={styles.box}>
      <ImageBackground
        source={require("../../assets/images/identity-popout.png")}
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
    borderRadius: 45,
    height: "100%", // Update to desired height
    overflow: "hidden",
    padding: 10,
  },
  imageBackground: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
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
