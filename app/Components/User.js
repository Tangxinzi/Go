import React, { Component } from 'react';
import icon from '../Assets/Icons';
import CryptoJS from 'crypto-js';
import styles from '../Styles/User';
import Storage from './Storage';

import {
  View,
  Text,
  Image,
  Button,
  WebView,
  AlertIOS,
  TextInput,
  Dimensions,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  RefreshControl,
  ActionSheetIOS,
  ActivityIndicator,
  TouchableHighlight,
  DeviceEventEmitter,
} from 'react-native';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loaded: false,
      isRefreshing: false,
      membership: null,
      coupon: '-',
      member: null,
      version: '1.1.0',
      opacity: 0,
      opacityMembership: 0
    }

    this.fetchCount()
    if (this.state.user) {
      this.membership(this.state.user.uid)
    }
  }

  fetchCount() {
    AsyncStorage.getItem('session')
    .then((value) => {
      if (value) {
        let session = null; // 存储 session
        Storage.load("user", data => {
          const formData = new FormData();
          formData.append("mobile", data.mobile);
          formData.append("password", CryptoJS.SHA256(`${data.password}`).toString());
          fetch('https://api.jiyuegou.cn/user/signin', { // 登录
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: formData
          })
          .then(responseData => {
            if (responseData.headers.map['set-cookie']) {
              const cookie = (responseData.headers.map['set-cookie']).toString();
              session = cookie.split(/session=(([\w\d-.])+); HttpOnly; Path=\//);
            }
          })
          .then(() => {
            fetch('https://api.jiyuegou.cn/user/count', { // Get Count
              method: 'GET',
              headers: {
                'session': session
              },
            })
            .then(response => response.json())
            .then(responseData => {
              if (responseData.msg == 'ok') {
                this.setState({
                  coupon: responseData.data.coupon,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            })
            .done();
          })
          .catch((error) => {
            console.log(error);
          })
          .done();
        });
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .done();
  }

  componentDidMount() {
    Storage.getStorage();
    Storage.load("user", data => {
      this.setState({
        user: data.user,
        membership: data.membership
      });
      this.membership(data.user['uid']);
    });
  }

  membership(value) {
    fetch("https://api.duobaotech.com/yuegou/user.php?uid=" + value + "&user=" + this.state.user.mobile)
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          member: responseData.result,
          membership: responseData.result.membership,
          opacity: this.state.version == responseData.result.version ? 0 : 1,
          opacityMembership: responseData.result.opacityMembership,
        })
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  }

  clearStorage() {
    AsyncStorage.removeItem('session');
    AsyncStorage.clear();
    Storage._remove('user');
    this.setState({
      user: null,
      session: null
    })
  }

  out() {
    AlertIOS.alert(
      `注销`,
      '',
      [
        {text: '取消'},
        {text: '确定', onPress: () => this.clearStorage()},
      ]
    );
  }

  onRefresh() {
    this.fetchCount()
    this.membership(this.state.user.uid)
    this.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      this.setState({
        isRefreshing: false,
      });
    }, 1000);
  }

  render() {
    if (!this.state.user) {
      return (
        <UserLogin { ...this.props } />
      );
    }

    return (
      <ScrollView
        automaticallyAdjustContentInsets={true}
        refreshControl={
          <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
              tintColor="#000"
            />
        }
      >
        <View style={styles.head}>
          <View style={{position: 'relative'}}>
            <Image
              source={{uri: this.state.user['avatar']}}
              style={styles.avatar}
            />
            <Image
              source={{uri: icon.status}}
              style={[styles.status, {tintColor: this.state.membership == 'General' ? '#ded9d9' : 'rgb(255, 230, 0)'}]}
            />
          </View>
          <View style={styles.info}>
            <Text allowFontScaling={false} style={styles.nickname}>{this.state.user.nickname}</Text>
            <Text allowFontScaling={false} style={styles.uid}>{this.state.user.uid}</Text>
          </View>
        </View>
        <View style={styles.lists}>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>账号</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.user.mobile}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>积分</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.coupon}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>会员身份</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.membership == 'General' ? '普通用户' : 'VIP 会员'}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>开通时间</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.membership == 'VIP' ? this.state.member.start : '无'}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>到期时间</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.membership == 'VIP' ? this.state.member.end : '无'}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>剩余天数</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.membership == 'VIP' ? this.state.member.day : '无'}</Text>
          </View>
        </View>
        <View style={styles.lists}>
          <TouchableHighlight
            style={styles.touch}
            activeOpacity={0.5}
            underlayColor="#FFF"
            onPress={() => {
              this.props.navigation.navigate('Web', { title: '会员服务', uri: 'http://www.duobaotech.com/ios/pay.html' })
            }}
          >
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text allowFontScaling={false} style={styles.text}>会员服务</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{height: 6, width: 6, borderRadius: 3, backgroundColor: '#ff0000', marginRight: 10, opacity: this.state.opacityMembership}}></View>
                <Image
                  source={{uri: icon.arrow_right}}
                  style={{tintColor: 'rgba(0, 0, 0, 0.37)', width: 8, height: 15}}
                />
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.touch}
            activeOpacity={0.5}
            underlayColor="#FFF"
            onPress={() => {
              this.props.navigation.navigate('Web', { title: '使用条款', uri: 'http://www.duobaotech.com/ios/terms.html' })
            }}
          >
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text allowFontScaling={false} style={styles.text}>使用条款</Text>
              <Image
                source={{uri: icon.arrow_right}}
                style={{tintColor: 'rgba(0, 0, 0, 0.37)', width: 8, height: 15}}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.touch}
            activeOpacity={0.5}
            underlayColor="#FFF"
            onPress={() => {
              this.props.navigation.navigate('Web', { title: '提交反馈', uri: 'http://www.duobaotech.com/ios/feedback.html' })
            }}
          >
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text allowFontScaling={false} style={styles.text}>提交反馈</Text>
              <Image
                source={{uri: icon.arrow_right}}
                style={{tintColor: 'rgba(0, 0, 0, 0.37)', width: 8, height: 15}}
              />
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.lists}>
          <TouchableHighlight
            style={styles.touch}
            activeOpacity={0.7}
            underlayColor="#FFF"
            onPress={() => {
              this.props.navigation.navigate('Web', { title: '关于助手', uri: "http://www.duobaotech.com/ios/version.php?v=" + this.state.version })
            }}
          >
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text allowFontScaling={false} style={styles.text}>关于助手</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{height: 6, width: 6, borderRadius: 3, backgroundColor: '#ff0000', marginRight: 10, opacity: this.state.opacity}}></View>
                <Image
                  source={{uri: icon.arrow_right}}
                  style={{tintColor: 'rgba(0, 0, 0, 0.37)', width: 8, height: 15}}
                />
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.lists}>
          <TouchableHighlight
            style={styles.touch}
            activeOpacity={0.7}
            underlayColor="#FFF"
            onPress={this.out.bind(this)}
          >
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text allowFontScaling={false} style={styles.text}>退出账号</Text>
              <Image
                source={{uri: icon.arrow_right}}
                style={{tintColor: 'rgba(0, 0, 0, 0.37)', width: 8, height: 15}}
              />
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      password: '',
      activity: true,
      disabled: true,
      opacity: 0,
      loaded: false,
      check: false
    }
  }

  componentDidMount() {
    // if (this.state.check) {
      AsyncStorage.getItem('check')
        .then((token) => {
          if (token == '1') {
            this.setState({
              check: true
            });
          }
        })
    // }
  }

  pushNotifications(value) {
    this.setState({
      activity: true,
      opacity: 0,
    });

    if (value == 0) { // 帐号不存在
      AlertIOS.alert(
        `警告`,
        '帐号不存在，请检查。',
        [
          {text: '确定'},
        ]
      );
    } else if (value == 1) { // 手机号码不正确
      AlertIOS.alert(
        `警告`,
        '手机号码不正确，请检查。',
        [
          {text: '确定'},
        ]
      );
    } else if (value == 2) { // 密码错误
      AlertIOS.alert(
        `警告`,
        '密码不正确，请检查。',
        [
          {text: '确定'},
        ]
      );
    } else if (value == 3) { // 成功
      this.setState({
        loaded: true
      })
    } else if (value == 4) { // 意外情况，请检查。
      AlertIOS.alert(
        `警告`,
        '意外情况，请检查。',
        [
          {text: '确定'},
        ]
      );
    }
  }

  fetchLogin() {
    if (!this.state.check) {
      AlertIOS.alert(
        `警告`,
        '使用本平台项目，需接受使用条款协议。',
        [
          {text: '确定'},
        ]
      );
      return;
    }
    let session = null; // 存储 session
    const formData = new FormData();
    formData.append("mobile", this.state.mobile);
    formData.append("password", CryptoJS.SHA256(`${this.state.password}`).toString());
    this.setState({
      activity: false,
      opacity: 1,
      disabled: false
    });
    fetch('https://api.jiyuegou.cn/user/signin', { // Get Async Storage
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: formData
    })
    .then(responseData => {
      if (responseData.headers.map['set-cookie']) {
        const cookie = (responseData.headers.map['set-cookie']).toString();
        session = cookie.split(/session=(([\w\d-.])+); HttpOnly; Path=\//);
      }
    })
    .then(() => {
      fetch('https://api.jiyuegou.cn/user/signin', { // 登录
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: formData
      })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.msg == '帐号不存在') {
          this.pushNotifications(0);
        } else if (responseData.msg == '手机号码不正确') {
          this.pushNotifications(1);
        } else if (responseData.msg == '密码错误') {
          this.pushNotifications(2);
        } else if (responseData.msg == 'ok') {
          this.pushNotifications(3);
          Storage.save("user", {
            mobile: this.state.mobile,
            password: this.state.password,
            user: responseData.data.user,
            session: session[1]
          });
          AsyncStorage.setItem('session', session[1]);
        } else {
          this.pushNotifications(4);
        }
      })
      .catch(error => {
        this.fetchLogin();
        console.log(error);
      })
      .done();
    })
    .catch(error => {
      this.fetchLogin();
      console.log(error);
    })
    .done();
  }

  checked() {
    this.setState({
      check: !this.state.check
    })

    if (!this.state.check) {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['记住', '下次再说', '取消'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 3,
        title: '记住这次选择吗？',
        message: '登录使用即表明您已阅读并接受“软件使用许可协议”及“个人信息使用授权书”！',
      }, index => {
        if (index == 0) {
          AsyncStorage.setItem('check', '1');
        } else if (index > 0) {
          AsyncStorage.setItem('check', '0');
        }
      })
    }
  }

  render() {
    if (this.state.loaded) {
      return (
        <UserProfile { ...this.props } />
      );
    }

    return (
      <ScrollView automaticallyAdjustContentInsets={true} style={{backgroundColor: '#FFF'}}>
        <View style={styles.main}>
          <TextInput
            allowFontScaling={false}
            style={styles.input}
            placeholder="请输入手机号"
            clearButtonMode="while-editing"
            keyboardType="numeric"
            defaultValue=""
            onChangeText={(params) => {
              this.setState({
                mobile: params
              });
            }}
          />
          <TextInput
            allowFontScaling={false}
            style={styles.input}
            placeholder="请输入密码"
            clearButtonMode="while-editing"
            returnKeyType="send"
            secureTextEntry
            onChangeText={(params) => {
              this.setState({
                password: params
              });
            }}
            onSubmitEditing={this.fetchLogin.bind(this)}
          />
          <ActivityIndicator
            size="small"
            color="#6435c9"
            animating={!this.state.activity}
            style={{
              position: 'absolute',
              right: 25,
              top: 50,
              opacity: this.state.opacity
            }}
          />
          <TouchableHighlight
            style={styles.sectionButton}
            underlayColor="rgba(34, 26, 38, 0.1)"
            onPress={this.fetchLogin.bind(this)}
          >
            <Text allowFontScaling={false} style={styles.sectionButtonText}>
              登录
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#FFF"
            onPress={() => this.checked()}
          >
            <View style={styles.readText}>
              <Image
                source={{uri: !this.state.check ? icon.check : icon.checked}}
                style={{width: 20, height: 20, marginRight: 2}}
              />
              <Text allowFontScaling={false} style={{fontSize: 13, color: 'rgba(0, 0, 0, 0.6)', marginRight: 2, letterSpacing: -0.8}}>
                阅读并同意
              </Text>
              <View
                style={{borderBottomWidth: 0.5, borderColor: '#000', marginBottom: -1}}
              >
                <Text allowFontScaling={false}
                  style={{fontSize: 13, letterSpacing: -0.8, display: 'flex', height: 15, lineHeight: 15}}
                  onPress={() => {
                    this.props.navigation.navigate('Web', { title: '使用条款', uri: 'http://www.duobaotech.com/ios/terms.html' })
                  }}
                >
                  “软件使用许可协议”及“个人信息使用授权书”
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

export default class User extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <Text allowFontScaling={false} style={{
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, .9)',
        textAlign: 'center',
        marginHorizontal: 16
      }}>{navigation.state.params.title}</Text>
    ),
  });

  componentWillUnmount() {
    DeviceEventEmitter.emit('Change');
  }

  render() {
    if (this.props.navigation.state.params.user ? true : false) {
      return (
        <UserProfile { ...this.props } />
      );
    } else {
      return (
        <UserLogin { ...this.props } />
      );
    }
  }
}

module.exports = User;
