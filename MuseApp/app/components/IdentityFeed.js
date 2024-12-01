import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
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
    <View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
  },
});

export default IdentityFeed;
