'use strict';

import React, {Component} from 'react';
import icon from '../Assets/Icons';
import styles from '../Styles/LotteryDetail';
import Echarts from 'native-echarts';
import Moment from 'moment';
import IdleTimerManager from 'react-native-idle-timer';
import {
  View,
  Text,
  Image,
  Modal,
  AlertIOS,
  TextInput,
  ScrollView,
  AsyncStorage,
  ProgressViewIOS,
  TouchableHighlight,
  DeviceEventEmitter,
  KeyboardAvoidingView,
} from 'react-native';

class WarpChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lottery_number: 50, // 显示期数
      backgroundColor: 2,
      chart: 1,
      uid: this.props.navigation.state.params.user ? this.props.navigation.state.params.user.uid : null
    };

    this.chart = {}
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('Change');

    clearInterval(this.interval);
  }

  componentWillMount() {
    this.fetchGetCharts(this.state.lottery_number);
  }

  fetchGetCharts(value) {
    const formData = new FormData();
    // formData.append("platform", 'jiyuegou');
    formData.append("gid", this.props.navigation.state.params.lottery.goods_id);
    formData.append("lottery_number", value
      ? value
      : this.state.lottery_number);
    formData.append('uid', this.state.uid);
    fetch('https://api.duobaotech.com/yuegou/charts.php', { // Get Chart Data
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: formData
    }).then(response => response.json()).then(responseData => {
      this.chart = {
        'xAxis': responseData.result.xAxis,
        'yAxis': responseData.result.yAxis,
        'frequency': responseData.result.frequency,
        'lottery_number': responseData.result.lottery_number,
        'data': responseData.result.data,
        'description': responseData.result.description,
        'finish_quantity': this.props.navigation.state.params.lottery['finish_quantity']
      }
      this.setState({
        chart: 1
      })
    })
    .catch(error => {
      console.log(error);
    })
    .done();
  }

  setNumber(value) {
    var num = new Array(10, 20, 50);
    this.fetchGetCharts(num[value]);
    this.setState({backgroundColor: value})
  }

  render() {
    let option = null;
    if (this.chart.finish_quantity) {
      let finish = this.chart.finish_quantity;
      option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'axis',
          padding: [3],
          borderWidth: 1,
          borderColor: '#fced66',
          backgroundColor: '#fced66',
          formatter: function(params) {
            // return '入场位置：' + params[0]['data']['value'] + '%<br />买入次数：' + params[0]['data']['buy_num'] + '<br />买入位置：' + params[0]['data']['location'] + '<br />买入时间：' + params[0]['data']['entime'] + '<br />揭晓时间：' + params[0]['data']['announced_time'] + '<br />中奖信息：' + (params[0]['data']['description']).substring(0, 15) + '...'
            return 'Location: ' + params[0]['data']['value'] + '%<br />Buy Number: ' + params[0]['data']['buy_num'] + '<br />Buy Location: ' + params[0]['data']['location'] + '<br />Buy Time: ' + params[0]['data']['entime'] + '<br />Announced Time: ' + params[0]['data']['announced_time'] + '<br />Description: ' + (params[0]['data']['description']).substring(0, 19) + '...'
          },
          textStyle: {
            fontWeight: 400,
            fontSize: 9,
            color: '#000'
          }
        },
        legend: {
          icon: 'rect',
          // data: ['位置'],
          right: '0%',
          top: '0%',
          textStyle: {
            fontSize: 9,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: '1.9%',
          left: '1.9%',
          right: '1.9%',
          bottom: '1.9%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            borderWidth: 1,
            borderColor: '#000000',
            boundaryGap: false,
            axisTick: {
              show: true
            },
            data: this.chart.xAxis
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value}'
              // formatter: function(value, index) {
              //   var area = finish / 10;
              //   return parseInt(area * index)
              // }
            },
            axisTick: {
              show: true
            }
          }, {
            type: 'category',
            data: this.chart.frequency,
            // name: '频率',
            axisLabel: {
              formatter: '{value}'
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            // name: '入场位置',
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(196, 66, 66)'
              }
            },
            data: this.chart.data
          }
        ]
      };
    }

    return (
      <View style={[
        styles.section, {
          padding: 0
        }
      ]}>
        <View style={[
          styles.itemHeaderSub, {
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 10,
            marginBottom: 5
          }
        ]}>
          <Text allowFontScaling={false} style={styles.itemMeta}>{this.chart.description}</Text>
          <Text allowFontScaling={false} style={[
            styles.itemMeta, {
              textAlign: 'right'
            }
          ]}>{this.chart.lottery_number}</Text>
        </View>
        <Echarts option={option} height={250}/>
        <View style={styles.warpLottery}>
          <TouchableHighlight style={[
            styles.switchLottery, {
              borderRightWidth: 1
            }
          ]} onPress={() => this.setNumber(0)}>
            <Text allowFontScaling={false} style={[
              styles.textLottery, {
                backgroundColor: this.state.backgroundColor == 0
                  ? '#FFF'
                  : '#ececec'
              }
            ]}>近10期</Text>
          </TouchableHighlight>
          <TouchableHighlight style={[
            styles.switchLottery, {
              borderRightWidth: 1
            }
          ]} onPress={() => this.setNumber(1)}>
            <Text allowFontScaling={false} style={[
              styles.textLottery, {
                backgroundColor: this.state.backgroundColor == 1
                  ? '#FFF'
                  : '#ececec'
              }
            ]}>近20期</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.switchLottery} onPress={() => this.setNumber(2)}>
            <Text allowFontScaling={false} style={[
              styles.textLottery, {
                backgroundColor: this.state.backgroundColor == 2
                  ? '#FFF'
                  : '#ececec'
              }
            ]}>近50期</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

class Progress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lottery: this.props.navigation.state.params.lottery,
      value: this.props.value,
      lottery_number: 0
    };

    this.fetchLotteryInfo();
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.fetchLotteryInfo();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchLotteryInfo() {
    fetch('https://api.jiyuegou.cn/lottery/info?lottery_id=' + this.state.lottery.lottery_id, { // Get Count
      headers: {
        'session': this.props.navigation.state.params.session
      }
    })
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        lottery: responseData.data.lottery_data.lottery,
        lottery_number: responseData.data.my_lottery_number.length
      });
    })
    .catch(error => {
      console.log(error);
    })
    .done();

    // fetch('https://api.jiyuegou.cn/lottery/info?lottery_id=' + this.state.lottery.lottery_id, { // Get Count
    //   headers: {
    //     'session': this.state.session
    //   }
    // })
    // .then(response => response.json())
    // .then(responseData => {
    //   this.setState({
    //     lottery: responseData.data.lottery_data.lottery,
    //     lottery_number: responseData.data.my_lottery_number
    //   });
    //   console.log(this.state.lottery_number);
    // })
    // .done();
  }

  render() {
    return (
      <View style={styles.itemDetailContent, styles.section}>
        <View style={styles.sectionHeader}>
          <Text allowFontScaling={false}>期号 {this.state.lottery['lottery_section']}</Text>
          <Text allowFontScaling={false}>{this.props.navigation.state.params.session != null ? (this.state.lottery_number ? `已抢购 ${this.state.lottery_number} 人次` : '尚未参与') : '尚未登录'}</Text>
        </View>
        <View style={styles.itemHeaderSub}>
          <Text allowFontScaling={false} style={[styles.itemMeta, {marginTop: 0}]}>当前进度 {parseFloat(this.state.lottery['join_quantity'] / this.state.lottery['finish_quantity'] * 100).toFixed(2)}%</Text>
          <Text allowFontScaling={false} style={[styles.itemMeta, {marginTop: 0}]}>已售 {this.state.lottery['join_quantity']}</Text>
        </View>
        <View style={{position: 'relative'}}>
          <View style={[
            styles.point, {
              left: this.state.value / this.state.lottery['finish_quantity'] * 100 + '%',
              opacity: this.state.value ? 1 : 0
            }
          ]}></View>
          <ProgressViewIOS
            style={styles.speedProgress}
            progressTintColor="#6435c9"
            trackTintColor="#e2d8f7"
            progress={parseFloat(this.state.lottery['join_quantity'] / this.state.lottery['finish_quantity'])}
            progressViewStyle="bar"
          />
        </View>
        <View style={styles.itemHeaderSub}>
          <Text allowFontScaling={false} style={styles.itemMeta}>总需 {this.state.lottery['finish_quantity']} 人次（{this.state.lottery['lottery_multiple']} 积分／人次）</Text>
          <Text allowFontScaling={false} style={styles.itemMeta}>剩余 {this.state.lottery['remain_quantity']}</Text>
        </View>
      </View>
    )
  }
}

class Detriment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: this.props.navigation.state.params.user ? this.props.navigation.state.params.user.uid : null,
      lottery: this.props.navigation.state.params.lottery,
      randomNumber: null, // 随机值
      start: 0,
      end: 0,
      num: 1, // 购买人次
      one_num: 1,
      period: 1,
      index: 0,
      switch: true,
      membership: null,
      session: null, // 是否登录
    };

    this.fetchLotteryInfo();
    // this.isCertification();
  }

  componentDidMount() {
    if (!this.state.session) {
      AsyncStorage.getItem('session')
      .then((session) => {
        if (session) {
          this.setState({
            session: session, // JSON.parse(token).access_token
            loaded: true
          });
        }
      })
      .done();
    }

    if (this.state.uid) {
      fetch("https://api.duobaotech.com/yuegou/user.php?uid=" + this.state.uid)
      .then(response => response.json())
      .then(responseData => {
        this.setState({membership: responseData.result.membership})
      })
      .catch(error => {
        console.log(error);
      })
      .done();
    } else {
      this.setState({membership: 'General'})
    }

    this.interval = setInterval(() => {
      this.fetchLotteryInfo();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchLotteryInfo() {
    fetch('https://api.jiyuegou.cn/lottery/info?lottery_id=' + this.state.lottery.lottery_id) // Get Lottery Info
      .then(response => response.json()).then(responseData => {
        let lottery = responseData.data.lottery_data.lottery;
        this.setState({
          lottery: lottery,
          index: lottery.remain_quantity != 0 ? Math.floor(lottery.join_quantity / lottery.finish_quantity * 10 + 1) : Math.floor(lottery.join_quantity / lottery.finish_quantity * 10)
        });
      })
      .catch(error => {
        console.log(error);
      })
      .done();
  }

  getRandomNumber() {
    let w = this.state.end - this.state.start,
      number = Math.floor(Math.random() * w + Number(this.state.start));
    return number;
  }

  pushNotifications(value) {
    if (value == 0) { // 尚未登录
      AlertIOS.alert(`您还没有登录！`, '未登录，无法享受买入服务。', [
        {
          text: '取消'
        }
        // , {
        //   text: '去登录',
        //   onPress: () => {
        //     this.props.navigation.navigate('User', {title: '账号'})
        //   }
        // }
      ]);
    } else if (value == 1) { // 开启失败
      AlertIOS.alert(`开启失败`, '请检测您填写的区间是否符合要求，范围应在已售至总需之间。', [
        {
          text: '好'
        }
      ]);
    } else if (value == 2) { // 区间买入
      AlertIOS.alert(`买入成功`, `${this.state.lottery['lottery_section']} 期区间卡位成功，买入 ${this.state.num} 人次`, [
        {
          text: '结束',
          onPress: () => {
            // this.stopPreview()
          }
        },
        // {text: '去查看', onPress: () => {this.stopPreview()}},
      ]);
    } else if (value == 3) { // 买入失败
      AlertIOS.alert(`买入失败`, '很抱歉，请您重试购买。', [
        {
          text: '好',
          onPress: () => {
            // this.stopPreview()
          }
        }
      ]);
    } else if (value == 4) { // 直接买入
      AlertIOS.alert(`买入成功`, `${this.state.lottery['lottery_section']} 期买入成功，买入 ${this.state.one_num} 人次`, [
        {
          text: '确定',
          onPress: () => {
            // this.fetchLotteryInfo()
          }
        },
        // {text: '去查看', onPress: () => {this.stopPreview()}},
      ]);
    } else if (value == 5) { // 积分不足
      AlertIOS.alert(`积分不足，买入失败。`, '本次买入失败，请保持积分充足后买入。', [
        {
          text: '好',
          onPress: () => {
            // this.stopPreview()
          }
        }
      ]);
    } else if (value == 6) {
      AlertIOS.alert('买入失败', `很抱歉，${this.state.lottery['lottery_section']} 期买入已结束，去参与新一轮抢购吧。`, [{
          text: '确定',
          onPress: () => {
            this.stopPreview()
          }
        }
      ]);
    }
  }

  isCertification() {
    if (this.state.uid) {
      fetch("https://api.duobaotech.com/yuegou/user.php?uid=" + this.state.uid)
      .then(response => response.json())
      .then(responseData => {
        this.setState({membership: responseData.result.membership})
        if (responseData.status == 200 && this.state.membership == 'General') {
          AlertIOS.alert(`非会员状态。`, '非会员状态，无法享受买入服务。', [
            {
              text: '确认'
            },
          ]);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .done();
    } else {
      this.setState({membership: 'General'})
    }
  }

  open() {
    this.preview = setInterval(() => {
      IdleTimerManager.setIdleTimerDisabled(true);
      const formData = new FormData();
      formData.append("buy_num", this.state.num);
      formData.append("lottery_id", this.state.lottery['lottery_id']);
      if (this.state.randomNumber <= this.state.lottery['join_quantity']) {
        clearInterval(this.preview);
        IdleTimerManager.setIdleTimerDisabled(false);
        if (this.state.session) {
          fetch('https://api.jiyuegou.cn/order/lottery/create', { // Get Count
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Host': 'api.jiyuegou.cn',
              'session': this.state.session,
            },
            body: formData
          })
          .then(response => response.json())
          .then(responseData => {
            if (responseData.msg == 'ok') {
              this.pushNotifications(2)
            } else if (responseData.msg == '积分不足' || responseData.msg == '账号积分不足') {
              this.pushNotifications(5)
            } else {
              clearInterval(this.preview)
              clearInterval(this.interval)
              this.pushNotifications(6)
            }
          })
          .catch(error => {
            console.log(error);
          })
          .done();
        }
      } else if (this.state.randomNumber < this.state.lottery['join_quantity']) {
        clearInterval(this.preview);
        this.pushNotifications(3);
      }
    }, 3000);
  }

  buy() {
    if (this.state.session) {
      // this.isCertification(); // 13671181879
      if (this.state.membership == 'General') {
        return;
      } else {
        const formData = new FormData();
        formData.append("buy_num", this.state.one_num);
        formData.append("lottery_id", this.state.lottery['lottery_id']);
        fetch('https://api.jiyuegou.cn/order/lottery/create', { // Get Count
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'api.jiyuegou.cn',
            'session': this.state.session,
          },
          body: formData
        })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.msg == 'ok') {
            this.pushNotifications(4)
          } else if (responseData.msg == '积分不足' || responseData.msg == '账号积分不足') {
            this.pushNotifications(5)
          } else {
            clearInterval(this.preview)
            clearInterval(this.interval)
            this.pushNotifications(6)
          }
        })
        .catch(error => {
          console.log(error);
        })
        .done();
      }
    } else {
      this.pushNotifications(0);
    }
  }

  switch() {
    this.setState({
      switch: !this.state.switch
    })
  }

  toInitiate() {
    if (!this.state.session) {
      this.pushNotifications(0);
    } else if (!(this.state.start >= this.state.lottery['join_quantity'] && this.state.end <= this.state.lottery['finish_quantity'])) {
      this.pushNotifications(1);
    } else {
      this.isCertification();
      if (this.state.membership == 'General' || this.state.membership == null) {
        return;
      } else {
        this.props.navigation.navigate('LotteryInitiate', {
          lottery: this.props.navigation.state.params.lottery,
          user: this.props.navigation.state.params.user,
          randomNumber: this.getRandomNumber(),
          num: this.state.num,
          session: this.state.session
        });
      }
    }
  }

  render() {
    return (
      <View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text allowFontScaling={false}>区间买入</Text>
          </View>
          <View style={styles.rageProgress}>
            <View style={styles.row}>
              <View style={styles.rageProgressTitle}>
                <Text allowFontScaling={false} style={{
                  fontSize: 13
                }}>
                  开始位置
                </Text>
              </View>
              <TextInput allowFontScaling={false} onChangeText={(params) => {
                this.setState({start: params});
              }} keyboardType='numeric' returnKeyType='next' style={styles.rageInput}/>
            </View>
            <View style={styles.row}>
              <View style={styles.rageProgressTitle}>
                <Text allowFontScaling={false} style={{
                  fontSize: 13
                }}>
                  结束位置
                </Text>
              </View>
              <TextInput allowFontScaling={false} onChangeText={(params) => {
                this.setState({end: params});
              }} keyboardType='numeric' returnKeyType='next' style={styles.rageInput}/>
            </View>
            <View style={[styles.row, {borderBottomWidth: 0}]}>
              <View style={styles.rageProgressTitle}>
                <Text allowFontScaling={false} style={{fontSize: 13}}>
                  购买人次
                </Text>
              </View>
              <TextInput allowFontScaling={false} onChangeText={(params) => {
                this.setState({num: params});
              }} keyboardType='numeric' returnKeyType='next' style={styles.rageInput} placeholder="1"/>
            </View>
          </View>
          <View style={[
            styles.itemHeaderSub, {
              marginBottom: 8
            }
          ]}>
            <Text allowFontScaling={false} style={[styles.itemMeta, {marginTop: 0, marginBottom: 0}]}>进度区间：{this.state.index}，范围：{Math.ceil((this.state.index - 1) / 10 * this.state.lottery['finish_quantity'])} - {Math.ceil(this.state.index / 10 * this.state.lottery['finish_quantity'])}</Text>
          </View>
          <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.sectionButton} onPress={this.toInitiate.bind(this)}>
          {/* <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.sectionButton} onPress={this.open.bind(this)}> */}
            <Text allowFontScaling={false} style={styles.sectionButtonText}>
              发起抢购
            </Text>
          </TouchableHighlight>
        </View>
        <View style={[
          styles.section, {
            marginBottom: 0
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Text allowFontScaling={false}>直接买入</Text>
          </View>
          <View style={styles.rageProgress}>
            <View style={[
              styles.row, {
                borderBottomWidth: 0
              }
            ]}>
              <View style={styles.rageProgressTitle}>
                <Text allowFontScaling={false} style={{
                  fontSize: 13
                }}>
                  购买人次
                </Text>
              </View>
              <TextInput allowFontScaling={false} onChangeText={(params) => {
                this.setState({one_num: params});
              }} keyboardType='numeric' returnKeyType='next' style={styles.rageInput} placeholder="1" onSubmitEditing={() => this.buy()}/>
            </View>
          </View>
          <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.sectionButton} onPress={() => this.buy()}>
            <Text allowFontScaling={false} style={{
              alignSelf: 'center',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              立即购买
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default class LotteryDetail extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <TouchableHighlight
        style={{right: 10}}
        underlayColor='transparent'
        onPress={() => {
          navigation.navigate('Web', { title: '实时预览', uri: 'https://duobaotech.com/ios/announce.html?gid=' + navigation.state.params.lottery.goods_id + '&lottery_id=' + navigation.state.params.lottery.lottery_id + `&uid=${navigation.state.params.user ? navigation.state.params.user.uid : null}&device=ios` })
        }}
      >
        <View>
          <Text allowFontScaling={false} numberOfLines={1} style={{
            fontSize: 17,
            fontWeight: '600',
            color: 'rgba(0, 0, 0, .9)',
            textAlign: 'center',
            marginHorizontal: 16
          }}>{navigation.state.params.lottery.lottery_name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 3}}>
            <Text allowFontScaling={false} style={{ marginRight: 5, fontSize: 11.5, textAlign: 'center', color: 'rgba(0, 0, 0, .8)' }}>实时预览，查看详细数据</Text>
            <Image
              source={{uri: icon.arrow_right}}
              style={{tintColor: 'rgba(0, 0, 0, 0.37)', width: 8, height: 12 }}
            />
          </View>
        </View>
      </TouchableHighlight>
    ),
    tabBarVisible: false,
    headerBackTitle: '返回',
    headerRight: (
      <TouchableHighlight
        style={{right: 10}}
        underlayColor='transparent'
        onPress={() => {
          navigation.navigate('Web', { title: '细则', uri: "http://www.duobaotech.com/ios/rules.html" })
        }}
      >
        <Text allowFontScaling={false}>细则</Text>
      </TouchableHighlight>
    )
  });

  render() {
    return (
      <ScrollView>
        <KeyboardAvoidingView behavior='position'>
          <WarpChart { ...this.props } />
          <Progress { ...this.props } />
          <Detriment { ...this.props } />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

module.exports = LotteryDetail;
