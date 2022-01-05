import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import * as Font from "expo-font";

import Landing from "./components/auth/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import rootReducer from "./redux/reducers/index";
import Main from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import ViewImage from "./components/main/ViewImage";
import CommentScreen from "./components/main/Comment";

const Stack = createStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyAudSivZ-OLphNBzSSsU7lGHyoz8kERwcE",
  authDomain: "clonestagram-79008.firebaseapp.com",
  projectId: "clonestagram-79008",
  storageBucket: "clonestagram-79008.appspot.com",
  messagingSenderId: "1054456082627",
  appId: "1:1054456082627:web:22c59afc13398eb5bdf276",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const store = createStore(rootReducer, applyMiddleware(thunk));

let customFonts = {
  "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
  "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
      fontsLoaded: false,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ loggedIn: false, loaded: true });
      } else {
        this.setState({ loggedIn: true, loaded: true });
      }
    });
    this._loadFontsAsync();
  }

  render() {
    const { loggedIn, loaded, fontsLoaded } = this.state;

    if (!fontsLoaded) {
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (!loaded) {
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              component={Landing}
              name="Landing"
              options={{ headerShown: false }}
            />
            <Stack.Screen component={Register} name="Register" />
            <Stack.Screen component={Login} name="Login" />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={"Main"}>
            <Stack.Screen
              component={Main}
              name="Main"
              options={{ headerShown: false }}
            />
            <Stack.Screen component={AddScreen} name="Add" />
            <Stack.Screen component={SaveScreen} name="Save" />
            <Stack.Screen
              component={ViewImage}
              name="ViewImage"
              options={{ headerShown: false }}
            />
            <Stack.Screen component={CommentScreen} name="Comment" />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
