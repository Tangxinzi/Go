let SYNC = {};

SYNC.value = (params) => {
  let {
    id, resolve, reject, syncParams: {
      extraFetchOptions,
      someFlag
    }
  } = params;
  if (params == null) return;
  fetch('value/', {
    method: 'GET',
    body: 'id=' + id,
    ...extraFetchOptions
  }).then(response => {
    return response.json();
  }).then(json => {
    // console.log(json);
    if (json && json.value) {
      storage.save({
        key: 'value', id,
        data: json.value
      });
      if (someFlag) {} // 根据 syncParams 中的额外参数做对应处理
      resolve && resolve(json.value); // 成功则调用 resolve
    } else { // 失败则调用reject
      reject && reject(new Error('data parse error'));
    }
  }).catch(err => {
    console.warn(err);
    reject && reject(err);
  });
}

export default SYNC
