import Config from 'client/config';
// import Tools from 'client/utils/tools';
import AJAX from 'client/utils/ajax';
import ajaxMapPublic from 'client/services/public';

const DictCache = {};

const DictMaps = {};
Object.keys(Config.dict_codes).forEach((k) => {
  DictMaps[k] = [];
});

const model = {
  namespace: 'dict',


  state: {
    ...DictMaps, //各种字典
    pcasData: [], //省市区街道
    pcaData: [], //省市区
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },
  },

  effects: {
    //查找字典所有一级字典通过它获取
    * find({payload}, {call, put}) {
      const dcs = filterCache(payload.dict_codes);
      if (dcs.length) {
        const res = yield call(() => AJAX.send(ajaxMapPublic.findFirstValListNoAll, {
          ...payload,
          dict_codes: dcs.join(','),
        }));
        if (res.code === 0) {
          const {data = {}} = res;
          const keys = Object.keys(data);
          const opt = {};
          keys.forEach((k) => {
            DictCache[k] = 1;
            const item = findName(k);
            opt[k] = formatDicList(data[k], isNext(item, 1));
          });
          yield put({
            type: 'set',
            payload: opt,
          });
        }
      }
    },


    //获取下一级（初始化时，第一级需要自行获取）
    * findNext({payload}, {call, put, select}) {
      const {dict_code, selectedOptions, tierType = 'value'} = payload;
      const dict = yield select(state => state.dict);
      const original = dict[dict_code] || [];
      const map = findName(dict_code); //字典map
      let list = original;
      for (let i = 1; i < map.tier; i++) {
        let v = selectedOptions[i - 1];
        if (v === undefined || v === '') break;
        if (typeof v === 'object') v = v[tierType];
        const item = list.find(o => o[tierType] === v);
        if (!item) break;
        //查看缓存
        if (item.end && item.children) {
          //已经请求过了
          list = item.children;
        } else {
          item.loading = true;
          const res = yield call(AJAX.send, ajaxMapPublic.findSecondValList, {dict_code, parentId: item.value});
          if (res.code === 0) {
            formatValList(item, res.data || [], i !== map.tier - 1);
            list = item.children;
            item.end = true;
          } else {
            item.loading = false;
            break;
          }
        }
      }
      yield put({type: 'set', payload: {[dict_code]: original}});
    },
    //获取下一级（级联组件专属）
    * findCNext({payload}, {call, put, select}) {
      const {dict_code, selectedOptions} = payload;
      const map = findName(dict_code); //字典map
      const length = selectedOptions.length;
      const item = selectedOptions.pop();
      const dict = yield select(state => state.dict);
      const original = dict[dict_code] || [];

      if (!item.end || !item.children) {
        //没有缓存
        item.loading = true;
        const res = yield call(AJAX.send, ajaxMapPublic.findSecondValList, {dict_code, parentId: item.value});
        if (res.code === 0) {
          formatValList(item, res.data || [], length !== map.tier - 1);
          item.end = true;
        } else {
          item.loading = false;
        }
      }

      yield put({type: 'set', payload: {[dict_code]: original}});
    },
    //获取省市区[街道]（初始化时）
    * findPCAS({payload}, {call, put, select}) {
      const {selectedOptions = [], tierType = 'value', street = false} = payload;
      const dict = yield select(state => state.dict);
      let original = street ? dict.pcasData : dict.pcaData;
      let list = original;
      let item = null;
      const size = street ? 4 : 3;
      for (let i = 0; i < size; i++) {
        const urlMap = PCASUrl[i];
        let v = selectedOptions[i];
        if (typeof v === 'object') v = v[tierType];
        if (!item && list.length) {
          //获取省，并且有缓存
          if (v === undefined || v === '') break;
          item = list.find(o => o[tierType] === v);
          if (!item) break;
        } else if (item && item.end && item.children) {
          //获取市区或者街道 // 有缓存
          list = item.children;
          if (v === undefined || v === '') break;
          item = list.find(o => o[tierType] === v);
          if (!item) break;
        } else {
          item && (item.loading = true);

          const res = yield call(AJAX.send, urlMap, (item ? i === 3 ? {adCode: item.value} : {adcode: item.value} : {}));
          if (res.code === 0) {
            const temp = formatPCAS(item, res.data || [], i !== size - 1);
            if (item) {
              list = item.children;
              item.end = true;
            } else {
              original = temp;
              list = temp;
            }
            if (v === undefined || v === '') break;
            item = list.find(o => o[tierType] === v);
            if (!item) break;
          } else {
            if (item) item.loading = false;
            break;
          }
        }
      }
      if (street) {
        yield put({type: 'set', payload: {pcasData: original}});
      } else {
        yield put({type: 'set', payload: {pcaData: original}});
      }
    },
    //获取省市区[街道]（级联组件专属）
    * findCPCAS({payload}, {call, put, select}) {
      const {selectedOptions, street = false} = payload;
      const length = selectedOptions.length;
      const item = selectedOptions.pop();
      const dict = yield select(state => state.dict);
      const original = street ? dict.pcasData : dict.pcaData;
      const size = street ? 4 : 3;

      if (!item.end || !item.children) {
        //没有缓存
        item.loading = true;
        const res = yield call(AJAX.send, PCASUrl[length], length === 3 ? {adCode: item.value} : {adcode: item.value});
        if (res.code === 0) {
          formatPCAS(item, res.data || [], length !== size - 1);
          item.end = true;
        } else {
          item.loading = false;
        }
      }

      if (street) {
        yield put({type: 'set', payload: {pcasData: original}});
      } else {
        yield put({type: 'set', payload: {pcaData: original}});
      }
    },
  },
};

const PCASUrl = [
  ajaxMapPublic.findProvince,
  ajaxMapPublic.findCity,
  ajaxMapPublic.findArea,
  ajaxMapPublic.findStreet,
];

const findName = (name) => {
  if (Config.dict_codes[name]) {
    return Config.dict_codes[name];
  } else {
    return Config.dict_codes.find(item => item.key === name);
  }
};

const isNext = (item, current = 1) => !(item.tier === undefined || item.tier === current);

const filterCache = (dict_codes) => {
  const dcs = Array.isArray(dict_codes) ? dict_codes : dict_codes.split(',');
  return dcs.filter(item => !DictCache[item]);
};

const formatDicList = (arr = [], isLeaf) => arr.map((item) => {
  const opt = {label: item.label || item.dicname, value: item.value || item.dicval};
  isLeaf !== undefined && (opt.isLeaf = !isLeaf);
  return opt;
});

const formatValList = (item, temp, isLeaf = true) => {
  const arr = [];
  if (Array.isArray(temp)) {
    temp.forEach((o) => {
      arr.push({
        label: o.dicname,
        value: o.dicval,
        isLeaf: !isLeaf,
      });
    });
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr;
};

const formatPCAS = (item, str, isLeaf = true) => {
  let arr = [];
  if (typeof str === 'string') {
    const temp = str.split(';');
    temp.forEach((o) => {
      const d = o.split(',');
      arr.push({
        label: d[0],
        value: d[1],
        isLeaf: !isLeaf,
      });
    });
  } else if (Array.isArray(str) && str[0] && str[0].areaName) {
    str.forEach((d) => {
      arr.push({
        label: d.areaName,
        value: d.adcode,
        isLeaf: !isLeaf,
      });
    });
  } else {
    arr = str;
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr || [];
};


export default model;
