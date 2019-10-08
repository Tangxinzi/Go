
import React, { Component } from 'react';
import {
  Text,
  WebView,
  CameraRoll,
  TouchableHighlight
} from 'react-native';

class Web extends React.Component {
  saveImg() {
    console.log(1);
    var promise = CameraRoll.saveToCameraRoll('http://www.duobaotech.com/img/pay.png');
    promise.then(function(result) {
      alert('保存成功！地址如下：\n' + result);
    }).catch(function(error) {
      alert('保存失败！\n' + error);
    });
  }

  static navigationOptions = ({navigation, screenProps}) => ({
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

  render() {
    return (
      <WebView
        source={{uri: this.props.navigation.state.params.uri ? this.props.navigation.state.params.uri : ''}}
      />
    );
  }
}

module.exports = Web;
