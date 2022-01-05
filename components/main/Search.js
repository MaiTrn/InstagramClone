import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { FONTS, SIZES, COLORS } from "../../constants";

const Search = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const getNextLetter = (str) => {
    return (
      str.substring(0, str.length - 1) +
      String.fromCharCode(str.charCodeAt(str.length - 1) + 1)
    );
  };

  const firstLetterUpperCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", firstLetterUpperCase(search))
      .where("name", "<", getNextLetter(firstLetterUpperCase(search)))
      .get()
      .then((snapshot) => {
        let usersList = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        setUsers(usersList);
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Profile", { uid: item.id })}
    >
      <Text style={{ paddingLeft: 10 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={(search) => fetchUsers(search)}
        placeholder="Search..."
      />

      <FlatList
        data={users}
        numColumns={1}
        horizontal={false}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: SIZES.padding,
  },

  containerPost: {
    flex: 1,
  },

  saveButton: {
    paddingVertical: SIZES.padding * 0.8,
    paddingHorizontal: SIZES.padding,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textInput: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.darkgray,
    padding: SIZES.padding * 0.8,
    marginVertical: SIZES.padding,
    justifyContent: "center",
    alignItems: "center",
  },
});
