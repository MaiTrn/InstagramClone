import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import firebase from "firebase";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
    };
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password } = this.state;
    const name =
      this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
          style={styles.textInput}
        />
        <TextInput
          placeholder="name"
          onChangeText={(name) => this.setState({ name })}
          style={styles.textInput}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={() => this.onSignUp()}>
          <Text>Sign Up </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },

  textInput: {
    height: 30,
    width: 150,
    borderRadius: 5,
    alignItems: "center",
    paddingLeft: 5,
    marginVertical: 5,
  },
});
