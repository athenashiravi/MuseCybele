import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  PanResponder,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { supabase } from "../../../supabaseClient";
import Theme from "../../../assets/theme";

const Gallery = () => {
  const [murals, setMurals] = useState([]);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [selectedMural, setSelectedMural] = useState(null);
  const [drawingPaths, setDrawingPaths] = useState([]);
  const [strokeColor, setStrokeColor] = useState("black");

  const screenWidth = Dimensions.get("window").width;
  const numColumns = screenWidth < 768 ? 1 : 2;

  useEffect(() => {
    const fetchMurals = async () => {
      try {
        const { data, error } = await supabase.from("canvases").select("*");
        if (error) throw error;
        const combinedData = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setMurals(combinedData);
      } catch (error) {
        console.error("Error fetching murals:", error.message);
      }
    };
    fetchMurals();
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setDrawingPaths((prevPaths) => [
          ...prevPaths,
          { path: `M ${locationX} ${locationY}`, color: strokeColor },
        ]);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setDrawingPaths((prevPaths) => {
          const updatedPaths = [...prevPaths];
          updatedPaths[
            updatedPaths.length - 1
          ].path += ` L ${locationX} ${locationY}`;
          return updatedPaths;
        });
      },
    })
  ).current;

  const saveCanvas = async () => {
    if (!selectedMural) return;

    try {
      // Combine existing paths with the new drawing paths
      const updatedPaths = [...(selectedMural.paths || []), ...drawingPaths];

      // Update the selected mural in the database
      const { error } = await supabase
        .from("canvases")
        .update({ paths: updatedPaths })
        .eq("id", selectedMural.id);

      if (error) throw error;

      // Update the local state for the selected mural and murals list
      setSelectedMural((prev) => ({ ...prev, paths: updatedPaths }));
      setMurals((prevMurals) =>
        prevMurals.map((mural) =>
          mural.id === selectedMural.id
            ? { ...mural, paths: updatedPaths }
            : mural
        )
      );

      // Clear the temporary drawing paths
      setDrawingPaths([]);
      alert("Canvas saved successfully!");
    } catch (error) {
      console.error("Error saving canvas:", error.message);
      alert("Failed to save canvas. Please try again.");
    }
  };

  const clearCanvas = async () => {
    if (!selectedMural) return;

    try {
      // Clear paths in the database
      const { error } = await supabase
        .from("canvases")
        .update({ paths: [] })
        .eq("id", selectedMural.id);

      if (error) throw error;

      // Update the local state for the selected mural and murals list
      setSelectedMural((prev) => ({ ...prev, paths: [] }));
      setMurals((prevMurals) =>
        prevMurals.map((mural) =>
          mural.id === selectedMural.id ? { ...mural, paths: [] } : mural
        )
      );

      // Clear the temporary drawing paths
      setDrawingPaths([]);
      alert("Canvas cleared successfully!");
    } catch (error) {
      console.error("Error clearing canvas:", error.message);
      alert("Failed to clear canvas. Please try again.");
    }
  };

  const renderCanvas = () => {
    if (!selectedMural) return null;

    return (
      <View style={styles.canvasContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setIsCanvasVisible(false)}
        >
          <Text style={styles.backButtonText}>Back to Gallery</Text>
        </TouchableOpacity>
        <Text style={styles.promptText}>{selectedMural.prompt}</Text>
        <View style={styles.canvas} {...panResponder.panHandlers}>
          <Svg style={styles.svgCanvas}>
            {/* Render the existing paths */}
            {selectedMural.paths &&
              selectedMural.paths.map((pathObj, index) => (
                <Path
                  key={`saved-${index}`}
                  d={pathObj.path}
                  stroke={pathObj.color}
                  strokeWidth={3}
                  fill="none"
                />
              ))}
            {/* Render the current drawing paths */}
            {drawingPaths.map((pathObj, index) => (
              <Path
                key={`drawing-${index}`}
                d={pathObj.path}
                stroke={pathObj.color}
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
          <TouchableOpacity style={styles.button} onPress={clearCanvas}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={saveCanvas}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMural = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedMural(item);
        setIsCanvasVisible(true);
      }}
    >
      <ImageBackground
        source={require("../../../assets/images/liveMural.png")}
        style={styles.imageBackground}
      >
        <View style={styles.textContainer}>
          <Text style={styles.cardText}>{item.prompt}</Text>
          <Text style={styles.cardDetail}>{item.detail}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isCanvasVisible ? (
        renderCanvas()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Live Murals</Text>
          </View>
          <FlatList
            key={numColumns.toString()}
            data={murals}
            renderItem={renderMural}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
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
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
  },
  grid: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textContainer: {
    alignItems: "center",
    padding: 5,
    borderRadius: 8,
    width: "100%",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: Theme.colors.muralBackground,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: Theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  cardText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  cardDetail: {
    fontSize: 20,
    color: Theme.colors.textGray,
    textAlign: "center",
  },
  canvasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  canvas: {
    width: "90%",
    height: 300,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    marginVertical: 20,
  },
  svgCanvas: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: Theme.colors.backgroundPrimary,
    fontWeight: "bold",
  },
  promptText: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
  },
  colorPalette: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "80%",
  },
  button: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: Theme.colors.backgroundPrimary,
    fontWeight: "bold",
  },
});

export default Gallery;
