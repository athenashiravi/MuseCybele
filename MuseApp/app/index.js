import * as React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from "./components/SplashScreen";
import Home from "./tabs/home/Home";
import Gallery from "./tabs/gallery/Gallery";
import Mural from "./tabs/newMural/mural"; // Import the Mural screen
import ExpressScreen from "./tabs/newMural/ExpressScreen"; // Import the ExpressScreen
import DrawingScreen from "./tabs/newMural/DrawingScreen"; // Import the ExpressScreen

import PromptScreen from "./tabs/newMural/PromptScreen";
import * as Font from "expo-font";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import Theme from "../assets/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "./components/Header"; // Import the custom Header component

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PlusStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Mural" component={Mural} />
      <Stack.Screen name="ExpressScreen" component={ExpressScreen} />
      <Stack.Screen name="PromptScreen" component={PromptScreen} /> 
      <Stack.Screen name="DrawingScreen" component={DrawingScreen} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Theme.colors.backgroundPrimary, // Customize bottom tab background color
        },
        tabBarActiveTintColor: Theme.colors.tabBarActive, // Color of active tab icons
        tabBarInactiveTintColor: Theme.colors.tabBarInactive, // Color of inactive tab icons
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          header: () => <Header />, // Use the reusable Header component
          headerShown: true, // Ensure header is shown
          tabBarLabel: () => null,
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="home"
              size={size}
              color={
                focused ? Theme.colors.iconSecondary : Theme.colors.iconPrimary
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Plus"
        component={PlusStack}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              size={size}
              color={
                focused ? Theme.colors.iconSecondary : Theme.colors.iconPrimary
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={Gallery}
        options={{
          header: () => <Header />, // Use the reusable Header component
          headerShown: true, // Ensure header is shown
          tabBarLabel: () => null,
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={size}
              color={
                focused ? Theme.colors.iconSecondary : Theme.colors.iconPrimary
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const loadFonts = async () => {
  await Font.loadAsync({
    "Emilys Candy": require("../assets/fonts/EmilysCandy-Regular.ttf"), // Replace with your font file path
  });
};

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MyTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Emilys Candy",
    fontSize: 24,
  },
});

export default App;


