import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Theme from "../../assets/theme";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>MUSE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 103, // Set a taller height for the header
    backgroundColor: Theme.colors.backgroundPrimary, // Background color of the header
    justifyContent: "center", // Vertically center the title
    alignItems: "center", // Horizontally center the title
    shadowColor: Theme.colors.backgroundSecondary, // Purple shadow
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.4, // Shadow transparency
    shadowRadius: 3, // Shadow spread
    elevation: 5, // For Android shadow effect
    paddingTop: 10,
  },
  headerTitle: {
    fontFamily: "Emilys Candy", // Your custom font
    fontSize: 45,
    color: Theme.colors.textSecondary, // Title color (purple)
  },
});

export default Header;
