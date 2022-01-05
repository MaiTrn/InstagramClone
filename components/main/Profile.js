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

const Profile = (props) => {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });

      if (props.following.indexOf(props.route.params.uid) > -1) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
  }, [props.route.params.uid, props.following]);

  if (user === null) {
    return <View />;
  }

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
    setFollowing(false);
  };

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});

    setFollowing(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() =>
        props.navigation.navigate("ViewImage", { image: item.downloadURL })
      }
    >
      <Image source={{ uri: item.downloadURL }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text style={{ ...FONTS.h3 }}>{user?.name}</Text>
        <Text style={{ marginVertical: SIZES.padding, ...FONTS.h4 }}>
          {user?.email}
        </Text>

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View style={{ marginVertical: SIZES.padding }}>
            {following ? (
              <TouchableOpacity
                onPress={() => onUnfollow()}
                style={{ ...styles.button, ...styles.shadow }}
              >
                <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                  Following
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onFollow()}
                style={{ ...styles.button, ...styles.shadow }}
              >
                <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                  Follow
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>
      <View style={styles.containerPost}>
        <FlatList
          data={userPosts}
          numColumns={3}
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
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    paddingLeft: SIZES.padding,
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
    flex: 1 / 3,
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
