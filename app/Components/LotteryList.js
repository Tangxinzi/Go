'use strict';

import React, { Component } from 'react';
import icon from '../Assets/Icons';
import styles from '../Styles/LotteryList';
import Swiper from './Swiper';
import Storage from './Storage';
import CryptoJS from 'crypto-js';
import {
  StyleSheet,
  Image,
  View,
  Text,
  StatusBar,
  ListView,
  ScrollView,
  AsyncStorage,
  RefreshControl,
  ProgressViewIOS,
  ActivityIndicator,
  TouchableHighlight,
  DeviceEventEmitter
} from 'react-native';

export default class LotteryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      isRefreshing: false,
      data: [],
      count: null,
      coupon: '-',
      user: null,
      session: null,
      mobile: null,
      password: null,
      membership: null
    };

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.initStorage();
    this.fetchData();
    this.fetchCount();
  }

  fetchData() {
    fetch(`https://api.duobaotech.com/yuegou/product.php`)
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        loaded: true,
        count: responseData.result.data.lottery_list.length,
        data: responseData.result.data
      });
    })
    .catch((error) => {
      console.log('err:', error);
      this.fetchData();
      this.fetchCount();
      this.setState({
        loaded: false,
      })
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
              if (responseData.msg == 'ok') {
                this.setState({
                  coupon: responseData.data.coupon,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.fetchData();
              this.fetchCount();
            })
            .done();
          })
          .catch((error) => {
            console.log(error);
            this.fetchData();
            this.fetchCount();
          })
          .done();
        });
      }
    })
    .catch((error) => {
      console.log(error);
      this.fetchData();
      this.fetchCount();
    })
    .done();
  }

  initStorage() {
    Storage.getStorage();
    AsyncStorage.getItem('session')
    .then((value) => {
      if (value) {
        Storage.load("user", data => {
          this.setState({
            mobile: data.mobile,
            password: data.password,
            user: data.user,
            session: value,
            membership: data.membership
          });
          this.membership(data.user['uid']);
        });
      } else {
        this.setState({
          user: null,
          session: null,
          membership: null
        });
      }
    })
    .done();
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('Change', () => {
      this.fetchData();
      this.fetchCount();
      this.initStorage();
    });
    // this.interval = setInterval(() => {
    //   this.initStorage();
    // }, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  membership(value) {
    fetch("https://api.duobaotech.com/yuegou/user.php?uid=" + value + "&user=" + this.state.mobile)
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          membership: responseData.result.membership
        })
      })
      .catch((error) => {
        console.log(error);
        this.fetchData();
        this.fetchCount();
      })
      .done();
  }

  renderLotteryList(lottery) {
    return (
      <TouchableHighlight
        underlayColor="rgba(245, 245, 245, 0.1)"
        onPress={() => {
          this.props.navigation.navigate('LotteryDetail', { lottery: lottery, user: this.state.user, session: this.state.user ? this.state.session : null });
        }}
        style={{backgroundColor: '#FFF'}}
      >
        <View style={styles.innerViewStyle}>
          <View style={styles.multiple}>
            <Text allowFontScaling={false} style={{fontSize: 8.35, color: '#FFF'}}>{lottery.lottery_multiple}</Text>
          </View>
          <Image
            style={styles.image}
            source={{uri: lottery.lottery_img}}
          />
          <View style={styles.itemContent}>
            <Text allowFontScaling={false} style={styles.itemHeader} numberOfLines={2}>{lottery.lottery_name}</Text>
            <View style={styles.warp}>
              <View style={styles.itemHeaderSub}>
                <Text allowFontScaling={false} style={styles.itemMeta}>揭晓进度 {parseFloat(lottery.join_quantity / lottery.finish_quantity * 100).toFixed(2)} %</Text>
                <Text allowFontScaling={false} style={[styles.itemMeta, {textAlign: 'right'}]}>总需 {lottery.finish_quantity} 人次</Text>
              </View>
              <ProgressViewIOS
                progressTintColor="#6435c9"
                trackTintColor="#dfd0ff"
                progress={lottery.join_quantity / lottery.finish_quantity}
                progressViewStyle="bar"
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  onRefresh() {
    this.setState({
      isRefreshing: true
    });
    setTimeout(() => {
      this.fetchData();
      this.fetchCount();
      this.setState({
        isRefreshing: false
      });
    }, 1000);
  }

  onEndReached() {
    console.log('到底了。');
  }

  go() {
    this.props.navigator.push({
      component: WinningNumber,
      passProps: {
        callback:(msg)=>{ alert(msg) }
      }
    })
  }

  render() {
    if (!this.state.loaded) {
      return (
        <ScrollView>
          <View style={styles.slide}>
            <ActivityIndicator
              size="small"
            />
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        automaticallyAdjustContentInsets={true}
        refreshControl = {
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh.bind(this)}
            tintColor="#000"
            title="下拉刷新"
          />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text allowFontScaling={false} style={styles.sectionText}>我的账户</Text>
          </View>
        </View>
        <TouchableHighlight
          underlayColor="rgba(144, 144, 144, 0.7)"
          style={{marginBottom: 10}}
          onPress={() => {
            this.props.navigation.navigate('User', { title: '账号', user: this.state.user })
          }}
        >
          <View style={styles.user}>
            <View style={{position: 'relative'}}>
              <Image
                source={{uri: this.state.user ? this.state.user.avatar : icon.contact}}
                style={styles.iconUser}
              />
            </View>
            <View style={[styles.itemHeaderSub, {flex: 1}]}>
              <View style={styles.go}>
                <Text allowFontScaling={false} style={styles.nickname}>{this.state.user ? (this.state.user.nickname + '，' + this.state.coupon + ' 积分') : '登录集悦购开始积分抢购'}</Text>
                <Text allowFontScaling={false} style={styles.description}>{this.state.user ? '读秒、卡位及动态买入，实时趋势分析。' : '购买会员，可享实时趋势图、下单买入功能。'}</Text>
              </View>
              <Image
                source={{uri: icon.arrow_right}}
                style={{tintColor: 'rgba(0, 0, 0, 0.37)', width: 12, height: 22}}
              />
            </View>
          </View>
        </TouchableHighlight>
        <Swiper { ...this.props } value={this.state.data.swiper} />
        <View style={{display: this.state.loaded ? 'flex' : 'none'}}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text allowFontScaling={false} style={styles.sectionText}>热门积分抢购商品</Text>
            </View>
          </View>
            <View style={{height: this.state.count == 0 ? 350 : 0, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={{uri: icon.error}}
                style={{height: 45, width: 45, marginBottom: 10, tintColor: '#999898', display: this.state.count == 0 ? 'flex' : 'none'}}
              />
              <Text allowFontScaling={false} style={{textAlign: 'center', color: '#c2c2c2', display: this.state.count == 0 ? 'flex' : 'none'}}>没有更多了</Text>
            </View>
          <ListView
            onEndReached={this.onEndReached.bind(this)}
            pageSize={this.state.count}
            initialListSize={this.state.count}
            dataSource={this.dataSource.cloneWithRows(this.state.data.lottery_list)}
            renderRow={this.renderLotteryList.bind(this)}
            contentContainerStyle={styles.listViewStyle}
          />
          <Text allowFontScaling={false} style={styles.copyright}>抢购活动由集悦购发起，与苹果公司（Apple Inc.）及本平台无关</Text>
        </View>
      </ScrollView>
    );
  }
}

module.exports = LotteryList;
