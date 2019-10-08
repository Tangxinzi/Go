import {
  StyleSheet,
  Dimensions
} from 'react-native';

const screenW = Dimensions.get('window').width / 2;
const screenH = Dimensions.get('window').height;
const User = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenH
  },
  main: {
    // position: 'relative',
    // height: screenH / 1.35,
  },
  input: {
    marginLeft: 20,
    marginRight: 20,
    height: 40,
    fontSize: 14,
    borderColor: "rgba(100, 53, 201, 0.1)",
    borderBottomWidth: 1,
  },
  button: {
    borderColor: "rgba(224, 40, 40, 1)",
    backgroundColor: 'rgba(224, 40, 40, 1)', // crimson
    borderRadius: 4,
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 12,
    color: "rgb(139, 139, 139)",
    textAlign: 'center'
  },
  sectionButton: {
    backgroundColor: 'rgba(145, 130, 230, 1)',
    borderRadius: 3,
    padding: 10,
    margin: 20,
  },
  sectionButtonText: {
    alignSelf: 'center',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    width: 33,
    height: 33,
    tintColor: '#000'
  },
  touch: {
    display: 'flex',

    position: 'relative',
    paddingTop: 12,
    paddingRight: 15,
    paddingBottom: 12,
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderColor: 'rgba(204, 204, 204, 0.25)',
    // marginBottom: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    height: 40
  },
  readText: {
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  head: {
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  nickname: {
    fontSize: 17,
    marginTop: 4,
    marginBottom: 7,
  },
  uid: {
    fontSize: 15,
    fontWeight: '400'
  },
  avatar: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: "rgba(233, 233, 233, 1)",
    borderRadius: 5
  },
  status: {
    position: 'absolute',
    alignSelf: 'center',
    left: 90 * 0.46,
    top: 90 * 0.46,
    width: 18,
    height: 18,
    zIndex: 1
  },
  info: {
    marginVertical: 15,
    marginLeft: 14
  },
  item: {
    flexDirection: 'row',
    width: screenW,
    justifyContent: 'space-between',
    padding: 8
  },
  lists: {
    marginBottom: 10,
  },
  list: {
    position: 'relative',
    paddingTop: 12,
    paddingRight: 15,
    paddingBottom: 12,
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
    fontSize: 14.5
  },
});

export {User as default};
