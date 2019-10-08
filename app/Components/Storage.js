import React, {Component} from 'react';
import RNStorage from 'react-native-storage';
import SYNC from './Sync';
import {
  AppRegistry,
  View,
  AsyncStorage
} from 'react-native'; // http://blog.csdn.net/zach_zhou/article/details/72654690
var storage;
var defaultExpires = 1000 * 3600 * 24;

export default class Sorage extends Component {
  static getStorage() {
    if (storage == undefined) {
      storage = new RNStorage({
        size: 1000, // // 最大容量，默认值1000条数据循环存储
        storageBackend: AsyncStorage, // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage, 如果不指定则数据只会保存在内存中，重启后即丢失
        defaultExpires: defaultExpires, // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
        enableCache: true, // 读写时在内存中缓存数据。默认启用
        sync: SYNC // 这个sync文件是要你自己写的
      });
    }
    return storage;
  }

  static _save(key, object, expires) {
    this.init();
    storage.save({
      key: key, // 注意:请不要在key中使用_下划线符号!
      data: object,
      expires: expires // 如果不指定过期时间，则会使用defaultExpires参数, 如果设为null，则永不过期
    });
  }

  static save(key, object) {
    this._save(key, object, defaultExpires);
  }

  static _remove(key) {
    this.init();
    storage.remove({key: key}); // 删除单个数据
  }

  static _removeAll() {
    this.init();
    storage.clearMap(); // 移除所有"key-id"数据（但会保留只有key的数据）
  }

  static _clearDataByKey(key) {
    this.init();
    storage.clearMapForKey(key); // 清除某个key下的所有数据
  }

  static load(key, callBack) {
    this._load(key, null, null, callBack);
  }

  static _load(key, params, someFlag, callBack) {
    this.init();
    storage.load({
      key: key,
      autoSync: true, // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
      syncInBackground: true, // syncInBackground(默认为true)意味着如果数据过期，在调用sync方法的同时先返回已经过期的数据。设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
      syncParams: { // 你还可以给sync方法传递额外的参数
        params,
        someFlag: someFlag
      }
    }).then(ret => {
      callBack(ret);
      return ret;
    }).catch(err => {
      console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          break;
      }
    });
  }

  static init() {
    if (storage == undefined) {
      throw "请先调用getStorage()进行初始化";
    }
  }
}
