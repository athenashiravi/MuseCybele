import * as React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from "./components/SplashScreen";
import Home from "./tabs/home/Home";
import Gallery from "./tabs/gallery/Gallery";
import Mural from "./tabs/newMural/mural";
import ExpressScreen from "./tabs/newMural/ExpressScreen";
import DrawingScreen from "./tabs/newMural/DrawingScreen";
import PromptScreen from "./tabs/newMural/PromptScreen";
import * as Font from "expo-font";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Theme from "../assets/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    "Emilys Candy": require("../assets/fonts/EmilysCandy-Regular.ttf"),
  });
  await Font.loadAsync({
    Manrope: require("../assets/fonts/Manrope.ttf"),
  });
};

const headerStyle = {
  backgroundColor: Theme.colors.backgroundPrimary,
  shadowColor: Theme.colors.backgroundSecondary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 3,
  elevation: 5,
  paddingTop: 0,
};

const headerTitleStyle = {
  fontFamily: "Emilys Candy",
  fontSize: 40,
  color: Theme.colors.textSecondary,
};

const screenOptions = {
  headerBackTitle: "Back",
  headerTintColor: Theme.colors.textSecondary, // Change back button color
  headerStyle,
  headerTitleStyle,
};

function PlusStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Mural"
        component={Mural}
        options={{
          headerTitle: "MUSE",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ExpressScreen"
        component={ExpressScreen}
        options={{
          headerTitle: "MUSE",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="PromptScreen"
        component={PromptScreen}
        options={{
          headerTitle: "MUSE",
        }}
      />
      <Stack.Screen
        name="DrawingScreen"
        component={DrawingScreen}
        options={{
          headerTitle: "MUSE",
        }}
      />
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Theme.colors.backgroundPrimary,
        },
        tabBarActiveTintColor: Theme.colors.tabBarActive,
        tabBarInactiveTintColor: Theme.colors.tabBarInactive,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: "MUSE",
          ...screenOptions,
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
          headerShown: false, // Hide the header for the tab, shown in PlusStack screens
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
          headerTitle: "MUSE",
          ...screenOptions,
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

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={screenOptions}
        >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
