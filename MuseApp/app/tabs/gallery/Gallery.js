import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  Modal,
  TextInput,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { supabase } from "../../../supabaseClient";
import Theme from "../../../assets/theme";
import { MaterialIcons } from "@expo/vector-icons";

const Gallery = () => {
  const [murals, setMurals] = useState([]);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [selectedMural, setSelectedMural] = useState(null);
  const [drawingPaths, setDrawingPaths] = useState([]);
  const [strokeColor, setStrokeColor] = useState("black");
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareLink, setShareLink] = useState("");

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

  const openShareModal = (link) => {
    setShareLink(link);
    setIsShareModalVisible(true);
  };

  const closeShareModal = () => {
    setIsShareModalVisible(false);
    setShareLink("");
  };

  const renderShareModal = () => (
    <Modal
      visible={isShareModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeShareModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Share Modal</Text>
          <Text style={styles.modalSubtitle}>Share this link via</Text>
          <View style={styles.shareIcons}>
            <MaterialIcons name="facebook" size={30} color="#4267B2" />
            <MaterialIcons name="twitter" size={30} color="#1DA1F2" />
            <MaterialIcons name="instagram" size={30} color="#C13584" />
            <MaterialIcons name="whatsapp" size={30} color="#25D366" />
            <MaterialIcons name="telegram" size={30} color="#0088cc" />
          </View>
          <Text style={styles.modalSubtitle}>Or copy link</Text>
          <View style={styles.copyLinkContainer}>
            <TextInput
              style={styles.shareLink}
              value={shareLink}
              editable={false}
            />
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                navigator.clipboard.writeText(shareLink);
                alert("Link copied!");
              }}
            >
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeShareModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
        onPress={() => openShareModal(`https://yourapp.com/mural/${item.id}`)}
      >
        <MaterialIcons name="share" size={24} color={Theme.colors.textGray} />
      </TouchableOpacity>
    </View>
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
      {renderShareModal()}
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
  shareIcon: {
    position: "absolute",
    bottom: 10,
    left: 10,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  shareIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  copyLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  shareLink: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  copyButton: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 10,
    borderRadius: 5,
  },
  copyButtonText: {
    color: Theme.colors.backgroundPrimary,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: Theme.colors.textGray,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Gallery;
