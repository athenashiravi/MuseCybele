import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";

import Theme from "../../../assets/theme";

const DATA = [
  { id: "1", label: "Persian" },
  { id: "2", label: "Single" },
  { id: "3", label: "Rural" },
  { id: "4", label: "Newborn" },
  { id: "5", label: "Yoga" },
  { id: "6", label: "Working" },
  { id: "7", label: "Gym" },
];

const Mural = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        navigation.navigate("ExpressScreen", { identity: item.label })
      }
    >
      <Text style={styles.buttonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Let's get drawing!</Text>
        <Text style={styles.subtitle}>
          First pick which identity you'd like to delve deeper into today
        </Text>
      </View>
      <View style={styles.identities}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 35,
    alignItems: "left",
  },
  heading: {
    width: Dimensions.get("window").width / 2 + 100,
    paddingBottom: Dimensions.get("window").height / 10,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    fontFamily: "Emilys Candy",
    color: Theme.colors.textPrimary,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 25,
    color: Theme.colors.textGray,
    textAlign: "left",
    fontFamily: "Manrope",
  },
  list: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  identities: {
    overflow: "hidden",
    height: "62%",
  },
  button: {
    backgroundColor: Theme.colors.buttonBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 45,
    width: 285,
    height: 80,
    marginBottom: 30, // Increased margin bottom for more space under the button
    alignItems: "center",
    justifyContent: "center", // Ensure text is vertically centered
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
  },
  buttonText: {
    fontSize: 25, // Increased font size for better visibility
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
});

export default Mural;
