import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

const DATA = [
  { id: "1", label: "Persian" },
  { id: "2", label: "Single" },
  { id: "3", label: "Rural" },
  { id: "4", label: "Newborn" },
  { id: "5", label: "Yoga" },
];

const Mural = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("ExpressScreen", { identity: item.label })}
    >
      <Text style={styles.buttonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's get drawing!</Text>
      <Text style={styles.subtitle}>
        First pick which identity you'd like to delve deeper into today
      </Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7B4B94",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7B4B94",
    textAlign: "center",
  },
  list: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#D1A1D1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "80%",
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
});

export default Mural;

