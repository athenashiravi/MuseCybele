import React from "react";
import { View, StyleSheet } from "react-native";
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
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {DATA.map((item) => (
          <View style={styles.column} key={item.id}>
            <Identity title={item.title} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  column: {
    width: "50%", // Two columns
    height: 370, // Set a fixed height for each cell
    marginBottom: 10,
  },
});

export default IdentityFeed;
