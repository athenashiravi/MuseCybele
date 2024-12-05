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
import Theme from "../../assets/theme";

function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../../assets/images/musesplash.png")}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>MUSE</Text>
          <Text style={styles.subtitle}>mindful art for moms</Text>
          <View style={styles.lowbutton}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace("Main")}
            >
              <Text style={styles.buttonText}>Let's Draw!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 120,
    color: Theme.colors.textSecondary,
    fontWeight: "bold",
    fontFamily: "Emilys Candy",
    paddingTop: 150,
  },
  subtitle: {
    fontSize: 50,
    paddingTop: 20,
    color: "#7F397A",
    fontFamily: "Emilys Candy",
  },
  button: {
    backgroundColor: Theme.colors.backgroundSecondary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
  },
  buttonText: {
    fontSize: 40,
    color: "#fff",
    fontFamily: "Emilys Candy",
  },
  lowbutton: {
    justifyContent: "flex-end",
    paddingTop: 450,
  },
  safeArea: {
    flex: 1,
  },
});

export default SplashScreen;
