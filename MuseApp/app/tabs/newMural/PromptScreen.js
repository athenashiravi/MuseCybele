import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PromptScreen = ({ route, navigation }) => {
  const { identity, inputs } = route.params || {}; // Get the passed parameters, if available

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Prompt:</Text>
      <Text style={styles.prompt}>What was the hardest part of my day?</Text>

      <Text style={styles.subtitle}>Happy with your prompt?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Navigate to a potential Drawing Screen
          navigation.navigate("DrawingScreen", { identity, inputs });
        }}
      >
        <Text style={styles.buttonText}>Yes, Let’s go draw!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Go back to ExpressScreen
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>Can I rework that...</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Navigate back to the Home screen
          navigation.navigate("Home");
        }}
      >
        <Text style={styles.buttonText}>Nevermind! Back to home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7B4B94",
    marginBottom: 10,
  },
  prompt: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#7B4B94",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7B4B94",
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: "center",
    width: "70%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PromptScreen;


