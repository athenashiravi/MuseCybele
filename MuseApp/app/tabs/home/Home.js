import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import MuralPopout from "../../components/MuralPopout";
import RecentMural from "../../components/RecentMural";
//import IdentityFeed from "./IdentityFeed";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Home = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/corner-watercolor.png")} // Using the images from assets
          style={styles.image} // Apply image style
          resizeMode="cover" // Adjust how the image fills the container
        />
        <Text style={styles.heading}> Welcome Esha</Text>
      </View>
      <MuralPopout />
    </ScrollView>
  );
};
//      <IdentityFeed />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1, // Take up full height of the header
    aspectRatio: 1, // Adjust according to the image's aspect ratio
    height: "140%", // Set the height as needed
    width: "70%",
    position: "absolute",
    top: "-50%",
    left: "-5%",
  },
  header: {
    width: windowWidth, // Full width or specify a fixed width
    height: windowWidth * 0.3, // Increase height to make the view bigger
    position: "relative", // Keep the position relative for absolute children
    justifyContent: "center", // Center content vertically (optional)
    marginBottom: windowWidth * 0.1,
  },
  heading: {
    marginTop: -20,
    fontSize: 45,
    fontFamily: "Emilys Candy",
  },
  recentlyOnMind: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
  },
  communityText: {
    fontSize: 14,
    color: "#999",
  },
});

export default Home;
