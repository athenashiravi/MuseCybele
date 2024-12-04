import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import the Picker

const DATA = [
  { id: "1", prompt: "What are you grateful for?", detail: "Persian" },
  { id: "2", prompt: "What are you craving right now?", detail: "Baking" },
  { id: "3", prompt: "What are your current goals?", detail: "Newborn" },
  { id: "4", prompt: "What does support look like today?", detail: "Empty-Nester" },
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
      <Text style={styles.title}>What do you want to express today?</Text>
      <Text style={styles.subtitle}>Here are some questions to get you started</Text>
      <Text style={styles.identityText}>Identity: {identity}</Text>

      <TextInput
        style={styles.input}
        placeholder="I want to feel..."
        value={input1}
        onChangeText={setInput1}
      />
      <TextInput
        style={styles.input}
        placeholder="I would love..."
        value={input2}
        onChangeText={setInput2}
      />
      <Text style={styles.dropdownLabel}>Today, I want to explore:</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={(itemValue) => setSelectedOption(itemValue)}
        >
          {DATA.map((item) => (
            <Picker.Item key={item.id} label={item.prompt} value={item.prompt} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("PromptScreen", {
            identity,
            inputs: { input1, input2, selectedOption },
          })
        }
      >
        <Text style={styles.buttonText}>Let’s Reflect!</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7B4B94",
    textAlign: "center",
    marginBottom: 20,
  },
  identityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7B4B94",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    borderBottomWidth: 1,
    borderColor: "#7B4B94",
    fontSize: 16,
    marginBottom: 20,
    padding: 5,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7B4B94",
    marginTop: 10,
  },
  dropdown: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#7B4B94",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#7B4B94",
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    width: "60%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExpressScreen;


