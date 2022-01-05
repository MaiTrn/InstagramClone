import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
require("firebase/firestore");
import { FONTS, SIZES, COLORS } from "../../constants";

const Feed = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
    console.log(posts);
  }, [props.usersFollowingLoaded, props.feed]);

  const onLikePress = (uid, postID) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postID)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (uid, postID) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postID)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete({});
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Text style={{ ...FONTS.body3 }}>{item.user.name}</Text>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("ViewImage", { image: item.downloadURL })
        }
      >
        <Image source={{ uri: item.downloadURL }} style={styles.image} />
      </TouchableOpacity>
      <View style={{ flexDirection: "row" }}>
        {item.currentUserLike ? (
          <TouchableOpacity
            onPress={() => onDislikePress(item.user.uid, item.id)}
          >
            <Text
              style={{
                paddingRight: 10,
                color: COLORS.darkgray,
                ...FONTS.body4,
              }}
            >
              Dislike
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onLikePress(item.user.uid, item.id)}>
            <Text
              style={{
                paddingRight: 10,
                color: COLORS.darkgray,
                ...FONTS.body4,
              }}
            >
              Like
            </Text>
          </TouchableOpacity>
        )}

        <Text
          onPress={() =>
            props.navigation.navigate("Comment", {
              postID: item.id,
              uid: item.user.uid,
            })
          }
          style={{ color: COLORS.darkgray, ...FONTS.body4 }}
        >
          View comments...
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerPost}>
        <FlatList
          data={posts}
          numColumns={1}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  containerInfo: {
    margin: SIZES.padding,
  },
  containerPost: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  imageContainer: {
    margin: SIZES.padding,
  },
  button: {
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
});
