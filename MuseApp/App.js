import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Gallery from "./Gallery"; // Import Gallery component

// Define the Stack Navigator
const Stack = createStackNavigator();

// Home Page Component
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Page!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Gallery")}
      >
        <Text style={styles.buttonText}>Go to Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

// Initial Screen Component
function InitialScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("./assets/blob.png")}
      // Replace with your image URL or local image asset
      style={styles.background}
    >
      <View style={styles.initialContainer}>
        <Text style={styles.title}>MUSE</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Get Drawing</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Initial">
        <Stack.Screen
          name="Initial"
          component={InitialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Gallery" component={Gallery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 60, // Larger font size for the title
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 100, // Adjust margin for spacing
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent button background
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
