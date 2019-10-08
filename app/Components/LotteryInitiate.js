import React, { Component } from 'react';
import Moment from 'moment';
import Echarts from 'native-echarts';
import styles from '../Styles/LotteryDetail';
import IdleTimerManager from 'react-native-idle-timer';
import {
  Text,
  View,
  AlertIOS,
  ScrollView,
  ProgressViewIOS,
  TouchableHighlight
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
    clearInterval(this.interval);
  }

  componentWillMount() {
    this.fetchGetCharts(this.state.lottery_number);
  }

  fetchGetCharts(value) {
    const formData = new FormData();
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
        'description': responseData.result.description
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
    let option = {
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
      session: this.props.navigation.state.params.session,
      randomNumber: this.props.navigation.state.params.randomNumber,
      num: this.props.navigation.state.params.num,
      value: this.props.value,
      user: this.props.navigation.state.params.user
    };

    console.log(this.state);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.fetchLotteryInfo();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  pushNotifications(value) {
    if (value == 0) { // 尚未登录
      AlertIOS.alert(`您还没有登录！`, '未登录，无法享受买入服务。', [
        {
          text: '取消'
        }, {
          text: '去登录',
          onPress: () => {
            this.props.navigation.navigate('User', {title: '账号'})
          }
        }
      ]);
    } else if (value == 1) { // 开启失败
      AlertIOS.alert(`开启失败`, '请检测您填写的区间是否符合要求，范围应在已售至总需之间。', [
        {
          text: '好'
        }
      ]);
    } else if (value == 2) { // 区间买入
      fetch("https://api.duobaotech.com/yuegou/buy.php?uid=" + this.state.user.uid + "&lottery_id=" + this.state.lottery.lottery_id)
        .then(responseData => {
          console.log(responseData);
        })
        .catch((error) => {
          console.log(error);
        })
        .done();

      AlertIOS.alert(`买入成功`, `${this.state.lottery['lottery_section']} 期区间卡位成功，买入 ${this.state.num} 人次`, [
        {
          text: '结束',
          onPress: () => {
            this.stopPreview()
          }
        },
        // {text: '去查看', onPress: () => {this.stopPreview()}},
      ]);
    } else if (value == 3) { // 买入失败
      AlertIOS.alert(`买入失败`, '很抱歉，请您重试购买。', [
        {
          text: '好',
          onPress: () => {
            this.stopPreview()
          }
        }
      ]);
    } else if (value == 4) { // 直接买入
      AlertIOS.alert(`买入成功`, `${this.state.lottery['lottery_section']} 期买入成功，买入 ${this.state.one_num} 人次`, [
        {
          text: '确定',
          onPress: () => {
            this.fetchLotteryInfo()
          }
        },
        // {text: '去查看', onPress: () => {this.stopPreview()}},
      ]);
    } else if (value == 5) { // 积分不足
      AlertIOS.alert(`积分不足，买入失败。`, '本次买入失败，请保持积分充足后买入。', [
        {
          text: '好',
          onPress: () => {
            this.stopPreview()
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

  stopPreview() {
    this.props.navigation.goBack()
  }

  fetchLotteryInfo() {
    fetch('https://api.jiyuegou.cn/lottery/info?lottery_id=' + this.state.lottery.lottery_id) // Get Lottery Info
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        lottery: responseData.data.lottery_data.lottery
      });
      if (this.state.randomNumber <= this.state.lottery['join_quantity']) {
        const formData = new FormData();
        formData.append("buy_num", this.state.num);
        formData.append("lottery_id", this.state.lottery['lottery_id']);
        clearInterval(this.preview);
        IdleTimerManager.setIdleTimerDisabled(false);
        if (this.state.session) {
          fetch('https://api.jiyuegou.cn/order/lottery/create', { // Get Count
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Host': 'api.jiyuegou.cn',
              'session': this.state.session
            },
            body: formData
          })
          .then(response => response.json())
          .then(responseData => {
            if (responseData.msg == 'ok') {
              clearInterval(this.interval)
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
            this.fetchLotteryInfo();
            console.log(error);
          })
          .done();
        }
      } else if (this.state.randomNumber < this.state.lottery['join_quantity']) {
        clearInterval(this.preview);
        this.pushNotifications(3);
      }
    })
    .catch(error => {
      console.log(error);
    })
    .done();
  }

  render() {
    return (
      <View style={styles.itemDetailContent, styles.section}>
        <View style={styles.sectionHeader}>
          <Text allowFontScaling={false}>期号 {this.state.lottery['lottery_section']}</Text>
          <Text allowFontScaling={false} style={{opacity: this.state.value ? 1 : 0}}>目标位置 {parseFloat(this.state.value / this.state.lottery['finish_quantity'] * 100).toFixed(2)}%</Text>
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
          <ProgressViewIOS style={styles.speedProgress} progressTintColor="#6435c9" trackTintColor="#e2d8f7" progress={parseFloat(this.state.lottery['join_quantity'] / this.state.lottery['finish_quantity'])} progressViewStyle="bar"/>
        </View>
        <View style={styles.itemHeaderSub}>
          <Text allowFontScaling={false} style={styles.itemMeta}>总需 {this.state.lottery['finish_quantity']} 人次（{this.state.lottery['lottery_multiple']} 积分／人次）</Text>
          <Text allowFontScaling={false} style={styles.itemMeta}>剩余 {this.state.lottery['remain_quantity']}</Text>
        </View>
      </View>
    )
  }
}

class LotteryInitiate extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <Text allowFontScaling={false} numberOfLines={1} style={{
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, .9)',
        textAlign: 'center',
        marginHorizontal: 16
      }}>{navigation.state.params.lottery.lottery_name}</Text>
    ),
    headerBackTitle: (
      <Text allowFontScaling={false} numberOfLines={1} style={{
        fontSize: 17,
        paddingRight: 10,
        color: '#037aff',
      }}>返回</Text>
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      time: Moment(),
      second: 0,
      switch: true,
    };
  }

  componentDidMount() {
    IdleTimerManager.setIdleTimerDisabled(true);
    this.timestamp = setInterval(() => {
      this.setState({
        second: this.state.second + 1
      })
    }, 1000);
  }

  componentWillUnmount() {
    IdleTimerManager.setIdleTimerDisabled(false);
    clearInterval(this.timestamp);
  }

  timekeeping() {
    let second = this.state.second, time = this.state.time
    if (second < 60) {
      return Moment(time).format("H:mm:ss") + ' 开始计时，已发起 ' + parseInt(second % 60) + ' 秒'
    } else if (second < 3600) {
      return Moment(time).format("H:mm:ss") + ' 开始计时，已发起 ' + parseInt(second / 60) + ' 分钟 ' + parseInt(second % 60) + ' 秒'
    } else {
      return Moment(time).format("H:mm:ss") + ' 开始计时，已发起 ' + parseInt(second / 3600) + ' 小时 ' + parseInt(second / 60) + ' 分钟 ' + parseInt(second % 60) + ' 秒'
    }
  }

  switch() {
    this.setState({
      switch: !this.state.switch
    })
  }

  stopPreview() {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <ScrollView> */}
          <WarpChart { ...this.props } />
          <Progress { ...this.props } value={this.props.navigation.state.params.randomNumber} />
          <TouchableHighlight onPress={this.stopPreview.bind(this)} underlayColor="#efeff9" style={[
            styles.sectionButton, {
              margin: 10
            }
          ]}>
            <Text allowFontScaling={false} style={{alignSelf: 'center', color: 'rgba(255, 255, 255, 0.9)'}}>结束买入</Text>
          </TouchableHighlight>
          <View style={styles.footer}>
            <TouchableHighlight onPress={this.switch.bind(this)} underlayColor="rgba(34, 26, 38, 0.1)">
              <Text allowFontScaling={false} style={[styles.itemMeta, {textAlign: 'center', letterSpacing: 0}]}>
                {this.state.switch ? this.timekeeping() : '禁止熄屏已开启'}
              </Text>
            </TouchableHighlight>
          </View>
        {/* </ScrollView> */}
      </View>
    );
  }
}

module.exports = LotteryInitiate;
