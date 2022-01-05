import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES } from "../../constants";

const ViewImage = (props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={{ uri: props.route.params.image }}
        resizeMode="contain"
        style={{ width: SIZES.width - 5, height: SIZES.height - 120 }}
      />
    </View>
  );
};
export default ViewImage;
