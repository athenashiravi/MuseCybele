import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../assets/theme";

const Header = ({ title = "MUSE" }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color={Theme.colors.iconPrimary}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
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
    flexDirection: "row", // Align items horizontally
  },
  backButton: {
    position: "absolute",
    left: 15, // Adjust position as needed
    top: "50%",
    transform: [{ translateY: -12 }], // Adjust based on icon size
  },
  headerTitle: {
    fontFamily: "Emilys Candy", // Your custom font
    fontSize: 45,
    color: Theme.colors.textSecondary, // Title color (purple)
  },
});

export default Header;
