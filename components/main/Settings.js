import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import firebase from "firebase";

export default function Home() {
  const onLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <View style={{ marginTop: 30 }}>
      <TouchableOpacity onPress={() => onLogout()}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
