import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Button,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { supabase } from "../../../supabaseClient"; // Adjust based on your project structure

const DATA = [
  { id: "1", prompt: "What are you grateful for?", detail: "Persian" },
  { id: "2", prompt: "What are you craving right now?", detail: "Baking" },
  { id: "3", prompt: "What are your current goals?", detail: "Newborn" },
  { id: "4", prompt: "What does support look like today?", detail: "Empty-Nester" },
  { id: "5", prompt: "What makes you happy today?", detail: "Single" },
  { id: "6", prompt: "Who inspires you the most?", detail: "Working" },
  { id: "7", prompt: "What do you need to let go of?", detail: "Single" },
  { id: "8", prompt: "What gives you energy?", detail: "Newborn" },
];

const Gallery = () => {
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // Track the selected card
  const [cardPaths, setCardPaths] = useState({}); // Map cardId to its paths
  const [strokeColor, setStrokeColor] = useState("black");
  const currentPath = useRef("");

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    currentPath.current = `M${locationX},${locationY}`;
  };

  const handleTouchMove = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    currentPath.current += ` L${locationX},${locationY}`;
    setCardPaths((prev) => ({
      ...prev,
      [selectedCard.id]: [
        ...(prev[selectedCard.id] || []).slice(0, -1),
        { path: currentPath.current, color: strokeColor },
      ],
    }));
  };

  const handleTouchEnd = () => {
    setCardPaths((prev) => ({
      ...prev,
      [selectedCard.id]: [
        ...(prev[selectedCard.id] || []),
        { path: currentPath.current, color: strokeColor },
      ],
    }));
    currentPath.current = "";
  };

  const clearCanvas = () => {
    setCardPaths((prev) => ({ ...prev, [selectedCard.id]: [] }));
  };

  const saveCanvas = async () => {
    try {
      const pathsToSave = cardPaths[selectedCard.id] || [];
      const { error } = await supabase.from("canvases").insert([
        {
          cardId: selectedCard.id,
          paths: pathsToSave, // Save only the paths for the selected card
          prompt: selectedCard.prompt,
          detail: selectedCard.detail,
        },
      ]);
      if (error) throw error;
      alert("Canvas saved successfully!");
    } catch (error) {
      console.error("Error saving canvas:", error.message);
      alert("Failed to save canvas. Please try again.");
    }
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedCard(item);
        setIsCanvasVisible(true);
      }}
    >
      <Text style={styles.cardText}>{item.prompt}</Text>
      <Text style={styles.cardDetail}>{item.detail}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isCanvasVisible ? (
        <View style={styles.canvasContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setIsCanvasVisible(false);
            }}
          >
            <Text style={styles.backButtonText}>Back to Gallery</Text>
          </TouchableOpacity>
          <Text style={styles.promptText}>{selectedCard.prompt}</Text>
          <View
            style={styles.canvas}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderStart={handleTouchStart}
            onResponderMove={handleTouchMove}
            onResponderEnd={handleTouchEnd}
          >
            <Svg style={styles.svgCanvas}>
              {(cardPaths[selectedCard.id] || []).map((item, index) => (
                <Path
                  key={index}
                  d={item.path}
                  stroke={item.color}
                  strokeWidth={3}
                  fill="none"
                />
              ))}
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
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>MUSE</Text>
          </View>
          <FlatList
            data={DATA}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#6200EE",
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  grid: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  card: {
    width: Dimensions.get("window").width / 2 - 40,
    height: Dimensions.get("window").width / 2 - 40,
    margin: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  canvasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  canvas: {
    width: Dimensions.get("window").width - 20,
    height: 400,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
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
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  promptText: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
  },
});

export default Gallery;



