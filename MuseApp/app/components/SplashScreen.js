// InitialScreen.js
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from "react-native";

function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../../assets/images/blob.png")}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>MUSE</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace("Main")}
          >
            <Text style={styles.buttonText}>Get Drawing</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 60,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 100,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  safeArea: {
    flex: 1,
  },
});

export default SplashScreen;
