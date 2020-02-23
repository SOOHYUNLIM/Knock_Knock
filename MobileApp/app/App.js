import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'
import firebase from 'react-native-firebase'

import Home from './Home'
import Pick from './Pick'
import Setting from './Setting'
import About from './About'
import Login from './Login'
import * as Utils from './util/Util'


const Hidden = () => {
  return (
    null
  )
}

const drawerNav = createDrawerNavigator(
  {
    Home: { screen: Home, navigationOptions: { drawerIcon: <Icon name="md-cart" size={20} color="black" />, drawerLabel: "전단지" } },
    Pick: { screen: Pick, navigationOptions: { drawerIcon: <Icon name="md-checkmark-circle" size={20} color="black" />, drawerLabel: "Pick" } },
    Setting: { screen: Setting, navigationOptions: { drawerIcon: <Icon name="md-construct" size={20} color="black" />, drawerLabel: "설정" } },
    About: { screen: About, navigationOptions: { drawerLabel: <Hidden /> } },
    Login: { screen: Login, navigationOptions: { drawerLabel: <Hidden /> } }
  },

  { initialRouteName: 'Home', drawerWidth: "40%" }
)

const firebaseConfig = async () => {
    const messaging = firebase.messaging()
    await messaging.requestPermission()
    
    const fcmToken = await messaging.getToken()

    console.log(fcmToken);
    // Alert.alert("TEST", fcmToken)
    Utils.postFetch("token", decodeURIComponent(fcmToken))
}

firebaseConfig()

const App = createAppContainer(drawerNav);

export default App;