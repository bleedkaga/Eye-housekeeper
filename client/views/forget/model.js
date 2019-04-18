import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/goodSoGood';

const model = {

  namespace: 'forget',

  state: {
    from: {
      phone: '',
      code: '',
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

    setFrom(state, {payload}) {
      return {
        ...state,
        from: {
          ...state.from,
          ...payload,
        },
      };
    },
  },

  effects: {
    * getVerificationCode({payload, callback}, {call, select}) {
      const {tokenVfcode} = yield select(state => state.global);
      const res = yield call(() => AJAX.send(ajaxMap.getVerificationCode, {...payload, type: 2, tokenVfcode}));
      callback && callback(res);
    },
  },
};

export default model;
