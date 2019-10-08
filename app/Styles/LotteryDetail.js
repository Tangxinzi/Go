'use strict';

import {StyleSheet} from 'react-native';
import Dimensions from 'Dimensions';

let lotteryDetail = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#efeff9',
    flex: 1
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    marginBottom: 10
  },
  section: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10
  },
  sectionHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  speedProgress: {
    marginTop: 2,
    marginBottom: 2
  },
  warpLottery: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginTop: 5,
    borderBottomWidth: 1,
    borderColor: 'rgba(212, 207, 207, 0.8)'
  },
  switchLottery: {
    borderColor: 'rgba(212, 207, 207, 0.8)',
    width: '33.3%'
  },
  textLottery: {
    textAlign: 'center',
    padding: 9,
    fontSize: 12,
    fontWeight: '400',
    width: '100%'
  },
  itemDetailContent: {
    position: 'relative',
    flex: 1,
    width: Dimensions.get('window').width,
    paddingLeft: 10,
    paddingRight: 10
  },
  itemHeader: {
    fontSize: 13,
    lineHeight: 15,
    height: 40,
    fontFamily: 'Helvetica Neue',
    fontWeight: '500',
    color: '#000'
  },
  itemMeta: {
    fontSize: 12,
    letterSpacing: -.3,
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '400',
    marginTop: 4,
    marginBottom: 4
  },
  itemHeaderSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  progress: {
    position: 'relative'
  },
  point: {
    position: 'absolute',
    width: 3.5,
    height: 3.5,
    borderRadius: 45,
    left: 0,
    backgroundColor: '#ff0000',
    top: 1.3,
    zIndex: 9999
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -1,
    borderBottomWidth: 1,
    borderColor: 'rgba(226, 226, 226, 1)',
    paddingRight: 4
  },
  rageInput: {
    width: Dimensions.get('window').width / 2 * 1.3,
    height: 30,
    textAlign: 'right',
    fontSize: 13,
    paddingTop: 4,
    paddingBottom: 4
  },
  rageProgress: {
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 10,
    borderColor: 'rgba(226, 226, 226, 1)'
  },
  rageProgressTitle: {
    height: 30,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(226, 226, 226, 1)',
    paddingRight: 10,
    paddingLeft: 10
  },
  sectionButton: {
    backgroundColor: 'rgba(145, 130, 230, 1)',
    borderRadius: 3,
    padding: 10
  },
  sectionButtonText: {
    alignSelf: 'center',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)'
  },
  title: {
    fontSize: 18,
    lineHeight: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 0,
    textAlign: 'center'
  }
});

export {lotteryDetail as default};
