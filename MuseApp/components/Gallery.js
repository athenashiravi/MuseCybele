import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const DATA = [
  { id: "1", prompt: "What are you grateful for?", detail: "Persian" },
  { id: "2", prompt: "What are you craving right now?", detail: "Baking" },
  { id: "3", prompt: "What are your current goals?", detail: "Newborn" },
  {
    id: "4",
    prompt: "What does support look like today?",
    detail: "Empty-Nester",
  },
  { id: "5", prompt: "What makes you happy today?", detail: "Single" },
  { id: "6", prompt: "Who inspires you the most?", detail: "Working" },
  { id: "7", prompt: "What do you need to let go of?", detail: "Single" },
  { id: "8", prompt: "What gives you energy?", detail: "Newborn" },
];

export default function Gallery() {
  const [selectedTab, setSelectedTab] = useState("Live Murals");
  const [likedCards, setLikedCards] = useState({});
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const toggleLike = (id) => {
    setLikedCards((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the liked state for the card with this id
    }));
  };

  const openShareAlert = () => {
    Alert.alert("Share Link?", "Invite a friend to join this mural!", [
      { text: "Oops! Nevermind", style: "cancel" },
      { text: "Share", onPress: () => setIsShareModalVisible(true) },
    ]);
  };

  const closeShareModal = () => {
    setIsShareModalVisible(false);
  };

  const renderCard = ({ item }) => {
    const isLiked = likedCards[item.id] || false; // Check if the card is liked
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{item.prompt}</Text>
        <Text style={styles.cardDetail}>{item.detail}</Text>

        {/* Share Icon */}
        <TouchableOpacity style={styles.shareButton} onPress={openShareAlert}>
          <Ionicons name="share-outline" size={20} color="#000" />
        </TouchableOpacity>

        {/* Heart Icon */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => toggleLike(item.id)}
        >
          <Ionicons
            name="heart"
            size={20}
            color={isLiked ? "lightpink" : "gray"} // Change color based on liked state
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>MUSE</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "Live Murals" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Live Murals")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Live Murals" && styles.activeTabText,
            ]}
          >
            Live Murals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Archive" && styles.activeTab]}
          onPress={() => setSelectedTab("Archive")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Archive" && styles.activeTabText,
            ]}
          >
            Archive
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <FlatList
        data={DATA}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display items in two columns
        contentContainerStyle={styles.grid}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="images-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Share Modal */}
      <Modal
        visible={isShareModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeShareModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeShareModal}
            >
              <Ionicons name="close-outline" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Share Modal</Text>
            <Text style={styles.modalSubtitle}>Share this link via</Text>
            <View style={styles.modalIcons}>
              <Ionicons name="logo-facebook" size={30} color="#4267B2" />
              <Ionicons name="logo-twitter" size={30} color="#1DA1F2" />
              <Ionicons name="logo-instagram" size={30} color="#C13584" />
              <Ionicons name="logo-whatsapp" size={30} color="#25D366" />
              <Ionicons name="send-outline" size={30} color="#007AFF" />
            </View>
            <Text style={styles.modalSubtitle}>Or copy link</Text>
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>example.com/share-link</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#000",
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
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
    position: "relative",
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
  shareButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  likeButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 20,
    backgroundColor: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  modalIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    marginTop: 10,
  },
  linkText: {
    color: "#000",
    flex: 1,
    marginRight: 10,
  },
  copyButton: {
    backgroundColor: "#6200EE",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  copyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
