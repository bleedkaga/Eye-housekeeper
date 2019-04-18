import AJAX from 'client/utils/ajax';
import ajaxMapGsG from 'client/services/goodSoGood';
import ajaxMap from 'client/services/administrator';

const model = {

  namespace: 'pwd',

  state: {
    pwd1: {
      vfcode: '',
      editPassword: '',
      affirmPassword: '',
    },
    pwd2: {
      vfcode: '',
      editPassword: '',
      affirmPassword: '',
    },
    isLoad: false, //当前是否正在加载
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setPwd1(state, {payload}) {
      return {...state, pwd1: {...state.pwd1, ...payload}};
    },

    setPwd2(state, {payload}) {
      return {...state, pwd2: {...state.pwd2, ...payload}};
    },

  },

  effects: {
    * getVerificationCode({payload, callback}, {call, select}) {
      const {tokenVfcode} = yield select(state => state.global);
      const res = yield call(() => AJAX.send(ajaxMapGsG.getVerificationCode, {...payload, type: 2, tokenVfcode}));
      callback && callback(res);
    },
    * updatePassWord({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.updatePassWord, {...payload}));
      yield put({type: 'set', payload: {isLoad: false}});

      callback && callback(res);
    },

  },
};

export default model;
