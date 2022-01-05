import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "firebase";

import {
  fetchUser,
  fetchUserPosts,
  fetchFollowing,
  clearData,
} from "../redux/actions/index";
import HomeScreen from "./main/Feed";
import SettingsScreen from "./main/Settings";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/Search";
import TabBarCustomButton from "./other/TabBarCustomButton";

const Tab = createBottomTabNavigator();

const EmptyScreen = () => null;

export class Main extends Component {
  componentDidMount() {
    this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchFollowing();
  }
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          keyboardHidesTabBar: true,
          showLabel: false,
          borderTopWidth: 0,
          style: {
            elevation: 0,
            borderTopWidth: 0,
          },
          activeTintColor: "#000000",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={focused ? 30 : 26}
              />
            ),
            tabBarColor: "#297951",
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <MaterialCommunityIcons
                name="magnify"
                color={color}
                size={focused ? 30 : 26}
              />
            ),
            tabBarColor: "#297951",
          }}
        />
        <Tab.Screen
          name="AddTitle"
          component={EmptyScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Add");
            },
          })}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <MaterialCommunityIcons
                name="plus-circle-outline"
                color={color}
                size={50}
              />
            ),
            tabBarButton: (props) => <TabBarCustomButton {...props} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Profile", {
                uid: firebase.auth().currentUser.uid,
              });
            },
          })}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <MaterialCommunityIcons
                name={focused ? "account-circle" : "account-circle-outline"}
                color={color}
                size={focused ? 30 : 26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <MaterialCommunityIcons
                name={focused ? "cog" : "cog-outline"}
                color={color}
                size={focused ? 30 : 26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { fetchUser, fetchUserPosts, fetchFollowing, clearData },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
