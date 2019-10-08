import React, {Component} from 'react';
import ViewSwiper from 'react-native-swiper';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

class Swiper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: this.props.value
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ViewSwiper
          autoplay
          autoplayTimeout={6}
          dot={<View style={{backgroundColor: '#E0E1E2', width: 6, height: 6, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
          activeDot={<View style={{backgroundColor: '#2abaff', width: 6, height: 6, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
          paginationStyle={{bottom: 10}}
        >
          {
            this.state.items.map((item, key) => {
              if (!item.web) {
                return (
                  <TouchableHighlight
                    key={key}
                    underlayColor="rgba(34, 26, 38, 0.5)"
                  >
                    <Image resizeMode='cover' style={styles.image} source={{uri: item.uri}} />
                  </TouchableHighlight>
                )
              } else {
                return (
                  <TouchableHighlight
                    key={key}
                    underlayColor="rgba(34, 26, 38, 0.5)"
                    onPress={() => {
                      this.props.navigation.navigate('Web', { title: item.title, uri: item.web });
                    }}
                  >
                    <Image resizeMode='cover' style={styles.image} source={{uri: item.uri}} />
                  </TouchableHighlight>
                )
              }
            })
          }
        </ViewSwiper>
      </View>
    );
  }
}

const styles = {
  container: {
    height: Dimensions.get('window').width / 2.3,
    backgroundColor: '#ffffff'
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width / 2.3
  }
}

module.exports = Swiper;
