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
      <Text style={styles.title}>Your Prompt: {inputs?.selectedOption}</Text>
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
          style={[styles.colorOption, { backgroundColor: "blue" }]}
          onPress={() => setStrokeColor("blue")}
        />
        <TouchableOpacity
          style={[styles.colorOption, { backgroundColor: "green" }]}
          onPress={() => setStrokeColor("green")}
        />
      </View>
      <View style={styles.buttons}>
        <Button title="Clear" onPress={clearCanvas} />
        <Button title="Save" onPress={saveCanvas} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#7B4B94",
  },
  canvas: {
    width: Dimensions.get("window").width - 20,
    height: 400,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    marginVertical: 20,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
  },
});

export default DrawingScreen;




