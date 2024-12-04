import * as React from "react";
import { StyleSheet, View, Image, Text, Dimensions } from "react-native";
import Theme from "../../assets/theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MuralPopout = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.bgParent, styles.bgChildLayout]}>
        <View style={[styles.bgChild, styles.bgChildLayout]} />
        <Image
          style={styles.image}
          resizeMode="cover"
          source={require("../../assets/images/mural-recent.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bgChildLayout: {
    width: windowWidth * 1.2,
    height: windowHeight * 1.1,
    borderRadius: 37,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: Theme.colors.shadowColor,
    position: "absolute",
  },

  whatAreYourLayout: {
    height: 124,
    width: 517,
    display: "flex",
    fontFamily: "Emilys Candy",
    letterSpacing: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  labelClr: {
    color: "#5c5c5c",
    textAlign: "center",
    lineHeight: 22,
  },
  bgChild: {
    top: 228,
    left: 230,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "#fff",
  },
  image: {
    alignSelf: "center",
    width: windowWidth * 1.2,
    height: windowHeight * 1.1,
  },
  bg: {
    top: -228,
    left: -230,
    width: 953,
    height: 900,
    position: "absolute",
  },

  whatAreYour: {
    top: 98,
    left: 103,
    fontSize: 40,
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
    height: 124,
    width: 517,
    display: "flex",
    fontFamily: "Emilys Candy",
    letterSpacing: 1,
  },
  persianCommunityMural: {
    top: 236,
    left: 84,
    fontSize: 28,
    height: 124,
    width: 517,
    display: "flex",
    fontFamily: "Emilys Candy",
    letterSpacing: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    color: "#5c5c5c",
  },
  userIcon: {
    width: 30,
    height: 30,
  },
  label: {
    fontSize: 25,
    letterSpacing: 0,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
  },
  bgParent: {
    top: 8,
    overflow: "hidden",
    elevation: 4,
    shadowRadius: 4,
    width: 723,
    borderRadius: 37,
    left: 20,
  },
  container: {
    flex: 1,
    width: "100%",
    height: 339,
  },
});

export default MuralPopout;
