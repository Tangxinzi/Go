import {
  StyleSheet,
  Dimensions
} from 'react-native';

let {
	width,
	height
} = Dimensions.get('window');

const lotteryList = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height
  },
  image: {
    width: 90,
    height: 90,
  },
  status: {
    position: 'absolute',
    alignSelf: 'center',
    left: 60 * 0.73,
    top: 60 * 0.6,
    width: 20,
    height: 20
  },
  listViewStyle: {
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems: 'center',
  },
  section: {
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemDetailContent: {
    position: 'relative',
    flex: 1,
    width: Dimensions.get('window').width,
    paddingLeft: 10,
    paddingRight: 10
  },
  innerViewStyle: {
    position: 'relative',
    width: width,
    borderWidth: 1,
    borderColor: '#eaeaea',
    marginLeft: -1,
    marginTop: -1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  multiple: {
    position: 'absolute',
    left: 2.8,
    top: 3,
    zIndex: 1,
    padding: 4,
    width: 23,
    height: 23,
    backgroundColor: 'rgba(100, 53, 201, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  itemHeader: {
    fontSize: 15,
    fontFamily: 'Helvetica Neue',
    fontWeight: '500',
  },
  itemMeta: {
    fontSize: 11.5,
    letterSpacing: -0.3,
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '400',
    marginBottom: 4,
  },
  itemContent: {
    flex: 1,
    height: 90,
    padding: 10,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  user: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionText: {
    fontSize: 11.5,
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '800'
  },
  iconUser: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  go: {
    height: 46,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  itemHeaderSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  copyright: {
    margin: 10,
    fontSize: 11.5,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  nickname: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: 'Helvetica Neue',
    fontWeight: '500',
  },
  description: {
    color: '#909090',
    fontSize: 12.5
  }
});

export {lotteryList as default};
