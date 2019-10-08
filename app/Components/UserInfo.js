import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
import Storage from './Storage';
import {
  View,
  Text,
  Image,
  ScrollView,
  AsyncStorage
} from 'react-native';

class UserInfo extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    // headerTitle: navigation.state.params.title
    headerTitle: (
      <Text allowFontScaling={false} style={{
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, .9)',
        textAlign: 'center',
        marginHorizontal: 16
      }}>{navigation.state.params.title}</Text>
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.navigation.state.params.user,
      count: null,
      status: null,
      membership: null,
      member: null,
      coupon: '-',
    }

    this.fetchCount();
  }

  componentDidMount() {
    fetch("https://api.duobaotech.com/yuegou/user.php?uid=" + this.state.user.uid)
    .then(response => response.json())
    .then(responseData => {
      if (responseData.status == 200) {
        console.log(responseData);
        this.setState({
          membership: responseData.result.membership,
          member: responseData.result
        })
      }
    })
    .catch(error => {
      console.log(error);
    })
    .done();
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
              console.log(responseData);
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

  render() {
    return (
      <ScrollView
        automaticallyAdjustContentInsets={true}
        style={{position: 'relative', flex: 1}}
      >
        <View style={styles.container}>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>头像</Text>
            <Image
              source={{uri: this.state.user.avatar}}
              style={styles.avatar}
            />
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>ID</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.user.uid}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>昵称</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.user.nickname}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>号码</Text>
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
            <Text allowFontScaling={false} style={styles.text}>{this.state.membership == 'VIP' ? this.state.member['start'] : '无'}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>到期时间</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.membership == 'VIP' ? this.state.member['end'] : '无'}</Text>
          </View>
          <View style={styles.list}>
            <Text allowFontScaling={false} style={styles.text}>剩余天数</Text>
            <Text allowFontScaling={false} style={styles.text}>{this.state.membership == 'VIP' ? this.state.member['day'] : '无'}</Text>
          </View>
        </View>
        <View style={[styles.list, {backgroundColor: 'transparent', borderBottomWidth: 0}]}>
          <Text allowFontScaling={false} style={{fontSize: 11.5, color: '#9e9e9e', display: 'flex'}}>获取积分，需在集悦购 App 内购买项目；不支持使用“红包”功能。</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  list: {
    position: 'relative',
    paddingTop: 12.5,
    paddingRight: 15,
    paddingBottom: 12.5,
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderColor: 'rgba(204, 204, 204, 0.25)',
    // marginBottom: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    height: 40
  },
  text: {
    fontSize: 13.2
  },
  avatar: {
    position: 'absolute',
    width: 34,
    height: 34,
    top: 3,
    right: 15,
    borderRadius: 17
  }
}

module.exports = UserInfo;
