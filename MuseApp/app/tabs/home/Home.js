import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import RecentMural from "../../components/RecentMural";
import IdentityFeed from "../../components/IdentityFeed";
import Theme from "../../../assets/theme";

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
      <View>
        <Text style={styles.subtitle}>Recently On Your Mind . . .</Text>
        <RecentMural />
      </View>
      <View style={styles.identity}>
        <Text style={styles.subtitle2}> Your Identities</Text>
        <View style={styles.listContainer}>
          <IdentityFeed />
        </View>
      </View>
    </ScrollView>
  );
};
//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
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
  identity: {
    flex: 1,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Emilys Candy",
    paddingBottom: 10,
  },
  subtitle2: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Emilys Candy",
    paddingTop: 50,
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
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: Theme.colors.backgroundSecondary,
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
    fontSize: 16,
  },
  communityText: {
    fontSize: 14,
    color: "#999",
  },
});

export default Home;
