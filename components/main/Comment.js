import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions";

import { COLORS, FONTS, SIZES } from "../../constants";

const Comment = (props) => {
  const [comments, setComments] = useState([]);
  const [postID, setPostID] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (!comments[i].hasOwnProperty("user")) {
          const user = props.users.find((x) => x.uid == comments[i].creator);
          if (user == undefined) {
            props.fetchUsersData(comments[i].creator, false);
          } else {
            comments[i].user = user;
          }
        }
      }
      setComments(comments);
    }

    if (props.route.params.postID !== postID) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postID)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostID(props.route.params.postID);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postID, props.users]);

  const sendComment = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postID)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text: newComment,
      });
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: "row", paddingLeft: 10 }}>
      {item.user !== undefined ? (
        <Text style={{ fontWeight: "bold", ...FONTS.body4 }}>
          {item.user.name}
        </Text>
      ) : null}
      <Text style={{ paddingLeft: 10, ...FONTS.body4 }}>{item.text}</Text>
    </View>
  );

  return (
    <View>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        horizontal={false}
        numColumns={1}
      />
      <View style={styles.captionContainer}>
        <TextInput
          style={{
            ...styles.textInput,
            ...FONTS.body3,
          }}
          placeholder="Insert caption here..."
          onChangeText={(comment) => setNewComment(comment)}
          value={newComment}
        />
        <TouchableOpacity
          style={{ ...styles.saveButton, ...styles.shadow }}
          onPress={() => sendComment()}
        >
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const mapStateToProps = (store) => ({
  users: store.usersState.users,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);

const styles = StyleSheet.create({
  captionContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: SIZES.width,
    marginVertical: SIZES.padding * 1.8,
    paddingHorizontal: SIZES.padding,
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
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
});
