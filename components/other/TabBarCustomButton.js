import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

const TabBarCustomButton = ({ children, onPress }) => {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <TouchableOpacity
        style={{
          top: -10,
          justifyContent: "center",
          alignItems: "center",
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#ffff",
        }}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default TabBarCustomButton;
