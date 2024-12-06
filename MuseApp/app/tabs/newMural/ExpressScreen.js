import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import the Picker
import Theme from "../../../assets/theme";

const DATA = [
  { id: "1", prompt: "What are you grateful for?", detail: "Persian" },
  { id: "2", prompt: "What are you craving right now?", detail: "Baking" },
  { id: "3", prompt: "What are your current goals?", detail: "Newborn" },
  {
    id: "4",
    prompt: "What does support look like today?",
    detail: "Empty-Nester",
  },
  { id: "5", prompt: "What makes you happy today?", detail: "Single" },
  { id: "6", prompt: "Who inspires you the most?", detail: "Working" },
  { id: "7", prompt: "What do you need to let go of?", detail: "Single" },
  { id: "8", prompt: "What gives you energy?", detail: "Newborn" },
];

const ExpressScreen = ({ route, navigation }) => {
  const { identity } = route.params; // Get the selected identity
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [selectedOption, setSelectedOption] = useState(DATA[0].prompt); // Default to the first option

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>What do you want to express today?</Text>
        <Text style={styles.subtitle}>
          Here are some questions to get you started
        </Text>
      </View>
      <View style={styles.promptGroup}>
        <Text style={styles.subheading}>My Identity . . .</Text>
        <Text style={styles.responseText}>{identity} Moms</Text>
      </View>
      <Text style={styles.subheading}>I want to feel . . .</Text>
      <View style={styles.userInput}>
        <TextInput
          style={styles.input}
          placeholder="I want to feel..."
          value={input1}
          onChangeText={setInput1}
        />
      </View>
      <Text style={styles.subheading}>I would love . . .</Text>

      <TextInput
        style={styles.input}
        placeholder="I would love..."
        value={input2}
        onChangeText={setInput2}
      />
      <View style={styles.dropView}>
        <Text style={styles.subheading}>Today, I want to explore</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => setSelectedOption(itemValue)}
          >
            {DATA.map((item) => (
              <Picker.Item
                key={item.id}
                label={item.prompt}
                value={item.prompt}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("PromptScreen", {
              identity,
              inputs: { input1, input2, selectedOption },
              prompt: selectedOption,
            })
          }
        >
          <Text style={styles.buttonText}>Let’s Reflect!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 40,
  },
  userInput: {
    alignItems: "center",
    paddingBottom: 50,
  },
  promptGroup: {
    paddingBottom: 40,
  },
  dropView: {
    paddingTop: 50,
  },
  buttonView: {
    alignItems: "center",
  },
  heading: {
    alignItems: "left",
    paddingBottom: 25,
  },
  title: {
    fontSize: 45,
    color: Theme.colors.textPrimary,
    marginBottom: 10,
    fontFamily: "Emilys Candy",
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 25,
    color: Theme.colors.textGray,
    marginBottom: 20,
    marginLeft: 5,
    fontFamily: "Manrope",
  },
  subheading: {
    fontSize: 30,
    color: Theme.colors.textPrimary,
    marginBottom: 20,
  },
  responseText: {
    fontSize: 25,
    color: Theme.colors.textPrimary,
    marginLeft: 5,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: Theme.colors.backgroundSecondary,
    fontSize: 25,
    padding: 5,
  },

  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: Theme.colors.backgroundSecondary,
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  button: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 20,
    borderRadius: 45,
    marginTop: 20,
    height: 75,
    width: 180,
    alignItems: "center",
    width: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Spread of shadow
    elevation: 5, // Shadow effect on Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Manrope",
  },
});

export default ExpressScreen;
