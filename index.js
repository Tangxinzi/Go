import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';

import icon from './app/Assets/Icons';
import Web from './app/Components/Web';
import User from './app/Components/User';
import Swiper from './app/Components/Swiper';
import Featured from './app/Components/Featured';
import UserInfo from './app/Components/UserInfo';
import LotteryDetail from './app/Components/LotteryDetail';
import LotteryInitiate from './app/Components/LotteryInitiate';

import {
  StackNavigator,
  TabNavigator
} from 'react-navigation';

import {
  AppRegistry,
  View,
  Text,
  Image,
  StyleSheet,
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';

class Feature extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <Text allowFontScaling={false} style={{
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, .9)',
        textAlign: 'center',
        marginHorizontal: 16
      }}>月光宝盒</Text>
    ),
    tabBarVisible: false,
    // headerTitleStyle: {color: '#000'},
    // headerStyle: {
    //   // backgroundColor: '#FFF',
    //   borderBottomWidth: 0
    // },
  });

  componentDidMount() {
    this.interval = setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }

  render() {
    return (
      <Featured { ...this.props } />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});

const Root = TabNavigator({
  Featured: {
    screen: Feature,
    navigationOptions: {
      tabBarLabel: '首页',
      headerBackTitle: null,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={{uri: icon.star}}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    },
  }}, {
    initialRouteName: 'Featured',
    swipeEnabled: false,
    animationEnabled: true
  });

const App = StackNavigator({
  Root: { screen: Root },
  Featured: { screen: Featured },
  LotteryDetail: { screen: LotteryDetail },
  LotteryInitiate: { screen: LotteryInitiate },
  User: { screen: User },
  UserInfo: { screen: UserInfo },
  Web: { screen: Web },
  Swiper: { screen: Swiper },
}, {
  headerMode: 'screen',
  ransitionConfig: (() => ({
      screenInterpolator: CardStackStyleInterpolator.forHorizontal,
  })),
  mode: 'card'
});

AppRegistry.registerComponent('Go', () => App);
