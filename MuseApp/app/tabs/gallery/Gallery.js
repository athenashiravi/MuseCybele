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
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import * as Sharing from 'expo-sharing';

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
      let muralid = uuid.v4()
      try {
        const { data, error: uploadError } = await supabase.storage
        .from("mural-screenshots")
        .upload(`mural-${(muralid)}.png`, {
          uri: uri, // Use the original file URI
          type: "image/png",
          name: `mural-${muralid}.png`,
        });
  
      if (uploadError) throw uploadError;
      console.log("Upload Success:", data);
      } catch (error) {
        console.error("error, upload", error)
        
      }
      // Get public URL
      const { data } = supabase.storage
        .from("mural-screenshots").getPublicUrl(`mural-${muralid}.png`);
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setIsCanvasVisible(false)}
        >
          <Text style={styles.backButtonText}>Back to Gallery</Text>
        </TouchableOpacity>
        <Text style={styles.promptText}>{selectedMural.prompt}</Text>
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
          <TouchableOpacity style={styles.button} onPress={captureAndShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={saveCanvas}>
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
      <TouchableOpacity
        style={styles.shareIcon}
        onPress={() => captureAndShare(item)}
      >
        <Text style={styles.shareIconText}>Share</Text>
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
  viewShot: {
    width: "100%", // Full width of the parent
    height: 300, // Set the desired height
    backgroundColor: "#fff", // Ensure a white background for the screenshot
  },
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




