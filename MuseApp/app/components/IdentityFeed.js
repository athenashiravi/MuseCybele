import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import Identity from "./Identity";

const DATA = [
  { id: "1", title: "Persian Moms" },
  { id: "2", title: "Newborn Moms" },
  { id: "3", title: "Single Moms" },
  { id: "4", title: "Military Moms" },
  { id: "5", title: "Rural Moms" },
  { id: "6", title: "Working Moms" },
];

const IdentityFeed = () => {
  const renderItem = ({ item }) => <Identity title={item.title} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10, // Add spacing between rows
  },
  listContentContainer: {
    paddingBottom: 20, // Add padding to the bottom of the list to prevent cut-off
  },
});

export default IdentityFeed;
