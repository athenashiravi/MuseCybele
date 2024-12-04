import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { supabase } from "../../../supabaseClient";
import Theme from "../../../assets/theme";

const Gallery = () => {
  const [murals, setMurals] = useState([]); // Store murals fetched from Supabase
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [selectedMural, setSelectedMural] = useState(null);

  // Fetch murals from Supabase
  useEffect(() => {
    const fetchMurals = async () => {
      try {
        const { data, error } = await supabase.from("canvases").select("*");
        console.log(data);
        if (error) throw error;

        // Combine hardcoded data with dynamically added data
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

  // Render a single mural card
  const renderMural = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedMural(item);
        setIsCanvasVisible(true);
      }}
    >
      <ImageBackground
        source={require("../../../assets/images/liveMural.png")} // Assuming item.image contains the image URL
        style={styles.imageBackground}
      >
        <View style={styles.textContainer}>
          <Text style={styles.cardText}>{item.prompt}</Text>
          <Text style={styles.cardDetail}>{item.detail}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  // Render the canvas for a selected mural
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
        <View style={styles.canvas}>
          <Svg style={styles.svgCanvas}>
            {selectedMural.paths &&
              selectedMural.paths.map((pathObj, index) => (
                <Path
                  key={index}
                  d={pathObj.path}
                  stroke={pathObj.color}
                  strokeWidth={3}
                  fill="none"
                />
              ))}
          </Svg>
        </View>
      </View>
    );
  };

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
            data={murals}
            renderItem={renderMural}
            keyExtractor={(item) => item.id.toString()} // Use unique IDs from Supabase
            numColumns={2} // Display in two columns
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
    paddingTop: 35,
    paddingVertical: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "Emilys Candy",
    color: Theme.colors.textPrimary,
  },
  grid: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  textContainer: {
    alignItems: "center", // Align text center horizontally
    padding: 10,
    borderRadius: 10,
    width: Dimensions.get("window").width / 2 - 80,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width / 2 - 40,
    height: Dimensions.get("window").width / 2 - 50,
    marginTop: -15,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  card: {
    width: Dimensions.get("window").width / 2 - 40,
    height: Dimensions.get("window").width / 2 - 40,
    margin: 10,
    backgroundColor: Theme.colors.muralBackground,
    borderRadius: 10,
    overflow: "hidden", // This ensures children are clipped to the border radius
    shadowColor: Theme.colors.shadowColor,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cardText: {
    fontSize: 35,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    fontFamily: "Manrope",
  },
  cardDetail: {
    fontSize: 25,
    color: Theme.colors.textGray,
    textAlign: "center",
    fontFamily: "Manrope",
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
    marginVertical: 20,
  },
  svgCanvas: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
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
});

export default Gallery;
