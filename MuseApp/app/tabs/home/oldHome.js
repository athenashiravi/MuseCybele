// HomeScreen.js
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
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
];

function Home({ navigation }) {
  const renderCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{item.prompt}</Text>
        <Text style={styles.cardDetail}>{item.detail}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Be your own muse...</Text>

      <View style={styles.identitiesSection}>
        <Text style={styles.subHeader}>Identities</Text>
        <Text style={styles.subtitle}>I am a ___ mom...</Text>
        <View style={styles.tagContainer}>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Persian</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Empty-Nester</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Single</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Military</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Newborn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Yoga</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mindSection}>
        <Text style={styles.subHeader}>The last things on your mind...</Text>
        <FlatList
          data={DATA}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.cardContainer}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Gallery")}>
          <Ionicons name="images-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  identitiesSection: {
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "#000",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  tagText: {
    color: "#fff",
    fontSize: 14,
  },
  mindSection: {
    marginBottom: 20,
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  card: {
    width: Dimensions.get("window").width / 2 - 25,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardDetail: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#000",
  },
});

export default Home;
