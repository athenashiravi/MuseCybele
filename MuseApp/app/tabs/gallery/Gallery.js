import React, { useState, useEffect, useRef } from "react";
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
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import * as Sharing from "expo-sharing";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Gallery = () => {
  const [murals, setMurals] = useState([]);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [selectedMural, setSelectedMural] = useState(null);
  const [drawingPaths, setDrawingPaths] = useState([]);
  const [strokeColor, setStrokeColor] = useState("black");

  const viewShotRef = useRef(null); // Ref for ViewShot
  const screenWidth = Dimensions.get("window").width;
  const numColumns = screenWidth < 768 ? 1 : 2;

  // Fetch murals from Supabase
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

  // when you click save, check if a mural already exists with the mural id. if it exists,

  const captureAndShare = async (mural) => {
    try {
      if (!viewShotRef.current) throw new Error("ViewShot reference is null.");

      // Capture the screenshot
      const uri = await viewShotRef.current.capture();
      console.log("Captured URI:", uri);

      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error("Captured file does not exist.");
      console.log("File Info:", fileInfo);

      // Upload directly to Supabase
      let muralid = uuid.v4();
      try {
        const { data, error: uploadError } = await supabase.storage
          .from("mural-screenshots")
          .upload(`mural-${muralid}.png`, {
            uri: uri, // Use the original file URI
            type: "image/png",
            name: `mural-${muralid}.png`,
          });

        if (uploadError) throw uploadError;
        console.log("Upload Success:", data);
      } catch (error) {
        console.error("error, upload", error);
      }
      // Get public URL
      const { data } = supabase.storage
        .from("mural-screenshots")
        .getPublicUrl(`mural-${muralid}.png`);
      console.log("Public URL:", data.publicUrl);

      // Update Supabase table
      // const { error: updateError } = await supabase
      //   .from("canvases")
      //   .update({ screenshot_url: data.publicUrl })
      //   .eq("id", muralid);
      // if (updateError) throw updateError;
      // console.log("Supabase table updated successfully");

      // Share the URL
      // await Sharing.shareAsync({
      //   //message: `Check out this mural: ${publicUrl}`,
      //   url: publicUrl,
      // });
      //console.log(publicUrl);
      await Sharing.shareAsync(data.publicUrl);

      Alert.alert("Success", "Screenshot shared successfully!");
    } catch (error) {
      console.error("Error capturing or sharing screenshot:", error.message);
      Alert.alert("Error", error.message);
    }
  };

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

      // Update only the selected mural in the state
      setMurals((prevMurals) =>
        prevMurals.map(
          (mural) =>
            mural.id === selectedMural.id
              ? { ...mural, paths: updatedPaths } // Update the specific mural
              : mural // Keep other murals unchanged
        )
      );

      // Update the local selected mural
      setSelectedMural((prev) => ({ ...prev, paths: updatedPaths }));

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

      // Update only the selected mural in the state
      setMurals((prevMurals) =>
        prevMurals.map(
          (mural) =>
            mural.id === selectedMural.id
              ? { ...mural, paths: [] } // Clear the specific mural's paths
              : mural // Keep other murals unchanged
        )
      );

      // Update the local selected mural
      setSelectedMural((prev) => ({ ...prev, paths: [] }));

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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setIsCanvasVisible(false)}
          >
            <Text style={styles.backButtonText}> {"< Back"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={captureAndShare}
          >
            <Text style={styles.shareButtonText}>Share </Text>
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={18}
              color={Theme.colors.backgroundPrimary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.heading}>
          <Text style={styles.title1}> Your Prompt, Your Muse . . . </Text>
          <Text style={styles.title2}>{" " + selectedMural.prompt}</Text>
        </View>
        <ViewShot
          ref={viewShotRef} // Reference for capturing screenshots
          options={{ format: "png", quality: 1 }}
          style={styles.viewShot} // Add this style
        >
          <View style={styles.canvas} {...panResponder.panHandlers}>
            <Svg style={styles.svgCanvas}>
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
        </ViewShot>
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
          <TouchableOpacity style={styles.button} onPress={clearCanvas}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button2} onPress={saveCanvas}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMural = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
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
    </View>
  );

  return (
    <View style={styles.container}>
      {isCanvasVisible ? (
        renderCanvas()
      ) : (
        <>
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
  promptShare: {
    flexDirection: "row", // Align children side by side
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Adjust space between items
    margin: 10, // Add margin if needed
  },
  viewShot: {
    width: "100%", // Full width of the parent
    height: 300, // Set the desired height
    backgroundColor: "#fff", // Ensure a white background for the screenshot
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row", // Align children side by side
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Adjust space between items
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  heading: {
    alignItems: "left",
    paddingBottom: 25,
    paddingTop: 0,
  },
  title1: {
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
    marginRight: 10,
    marginLeft: 10,
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
    backgroundColor: "#fff",
    padding: 35,
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
  backButton: {
    backgroundColor: Theme.colors.backgroundPrimary,
    padding: 10,
    borderRadius: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
  },
  shareButton: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 10,
    borderRadius: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
    flexDirection: "row", // Align children in a row
    alignItems: "center",
  },
  backButtonText: {
    color: Theme.colors.textSecondary,
    fontWeight: "bold",
    fontFamily: "Manrope",
    fontSize: 18,
  },
  shareButtonText: {
    color: Theme.colors.backgroundPrimary,
    fontWeight: "bold",
    fontFamily: "Manrope",
    fontSize: 18,
  },
  promptText: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
  },
  colorPalette: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 320,
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
    marginTop: 5,
    width: "100%",
  },
  button: {
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
  shareIcon: {
    alignSelf: "center",
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 5,
  },
  shareIconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },
});

export default Gallery;
