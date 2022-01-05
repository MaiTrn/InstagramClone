import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Add = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      if (Platform.OS !== "web") {
        const galleryStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === "granted");
      }
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      navigation.navigate("Save", { image: data.uri });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      navigation.navigate("Save", { image: result.uri });
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === null) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {isFocused && (
          <Camera
            style={styles.camera}
            type={type}
            ratio={"4:3"}
            ref={(ref) => setCamera(ref)}
          />
        )}
      </View>
      <TouchableOpacity
        style={{
          height: 70,
          width: 70,
          backgroundColor: "#ffffff",
          borderRadius: 35,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginBottom: 20,
        }}
        onPress={() => takePicture()}
      >
        <View
          style={{
            height: 60,
            width: 60,
            borderRadius: 30,
            backgroundColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: 56,
              width: 56,
              borderRadius: 28,
              backgroundColor: "#ffff",
            }}
          ></View>
        </View>
      </TouchableOpacity>
      <View style={styles.menuButton}>
        <TouchableOpacity onPress={pickImage}>
          <MaterialCommunityIcons name="camera-image" size={40} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <MaterialCommunityIcons name="camera-retake" size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    aspectRatio: 0.75,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 5,
  },
});
