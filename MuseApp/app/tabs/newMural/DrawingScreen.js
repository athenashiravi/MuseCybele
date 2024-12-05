import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { supabase } from "../../../supabaseClient";
import Theme from "../../../assets/theme";

const DrawingScreen = ({ route, navigation }) => {
  const { identity, inputs } = route.params || {};
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [strokeColor, setStrokeColor] = useState("black");

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPath(`M${locationX},${locationY}`);
  };

  const handleTouchMove = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPath((prevPath) => `${prevPath} L${locationX},${locationY}`);
  };

  const handleTouchEnd = () => {
    setPaths((prevPaths) => [
      ...prevPaths,
      { path: currentPath, color: strokeColor },
    ]);
    setCurrentPath("");
  };

  const clearCanvas = () => {
    setPaths([]);
  };

  const saveCanvas = async () => {
    try {
      // Save the new mural to Supabase
      const newCanvas = {
        cardId: inputs.selectedOption,
        paths,
        prompt: inputs.selectedOption,
        detail: identity,
      };
      const { error } = await supabase.from("canvases").insert([newCanvas]);
      if (error) throw error;

      // Pass the new canvas back to the gallery
      navigation.navigate("Gallery", { newCanvas });
      alert("Canvas saved successfully!");
    } catch (error) {
      console.error("Error saving canvas:", error.message);
      alert("Failed to save canvas. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Your Prompt, Your Muse . . . </Text>
        <Text style={styles.title2}> {inputs?.selectedOption}</Text>
      </View>
      <View
        style={styles.canvas}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderStart={handleTouchStart}
        onResponderMove={handleTouchMove}
        onResponderEnd={handleTouchEnd}
      >
        <Svg style={styles.svgCanvas}>
          {paths.map((item, index) => (
            <Path
              key={index}
              d={item.path}
              stroke={item.color}
              strokeWidth={3}
              fill="none"
            />
          ))}
          {currentPath && (
            <Path
              d={currentPath}
              stroke={strokeColor}
              strokeWidth={3}
              fill="none"
            />
          )}
        </Svg>
      </View>
      <View style={styles.colorPalette}>
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: "black" }]}
          onPress={() => setStrokeColor("black")}
        />
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: "red" }]}
          onPress={() => setStrokeColor("red")}
        />
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: "purple" }]}
          onPress={() => setStrokeColor("purple")}
        />
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: "blue" }]}
          onPress={() => setStrokeColor("blue")}
        />

        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: "green" }]}
          onPress={() => setStrokeColor("green")}
        />
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: "yellow" }]}
          onPress={() => setStrokeColor("yellow")}
        />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button1} onPress={clearCanvas}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={saveCanvas}>
          <Text style={styles.buttonText}>Done!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    padding: 35,
  },
  heading: {
    alignItems: "left",
    paddingBottom: 25,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginVertical: 10,
    color: Theme.colors.textSecondary,
    fontFamily: "Emilys Candy",
  },
  title2: {
    fontSize: 45,
    fontWeight: "bold",
    marginVertical: 8,
    color: Theme.colors.textPrimary,
    fontFamily: "Emilys Candy",
  },
  canvas: {
    alignItems: "center",
    width: Dimensions.get("window").width - 70,
    height: 600,
    backgroundColor: "#fff",
    borderColor: Theme.colors.backgroundSecondary,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: Theme.colors.backgroundSecondary,
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
  },
  svgCanvas: {
    flex: 1,
  },
  colorPalette: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Theme.colors.backgroundPrimary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },

  button1: {
    backgroundColor: Theme.colors.buttonSecondary,
    padding: 20,
    borderRadius: 45,
    marginTop: 20,
    height: 75,
    alignItems: "center",
    width: "26%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
  },
  button2: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 20,
    borderRadius: 45,
    marginTop: 20,
    height: 75,
    alignItems: "center",
    width: "26%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Manrope",
  },
});

export default DrawingScreen;
