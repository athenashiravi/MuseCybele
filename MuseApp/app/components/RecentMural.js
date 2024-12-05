import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import Theme from "../../assets/theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RecentMural = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/recentmural.png")} // Replace with your actual image path
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.recentlyOnMind}>
        <Text style={styles.cardText}>What are your current goals?</Text>
        <Text style={styles.communityText}>Persian Community Mural</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: windowWidth * 0.92,
    height: windowHeight * 0.3,
    justifyContent: "center",
    padding: 20,
    borderRadius: 100,
  },
  recentlyOnMind: {
    borderRadius: 10,
    padding: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "Manrope",
    fontWeight: "bold",
    paddingBottom: 10,
  },
  communityText: {
    fontSize: 20,
    color: Theme.colors.textGray,
    textAlign: "center",
  },
});

export default RecentMural;
