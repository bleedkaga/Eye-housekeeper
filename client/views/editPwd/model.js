import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/goodSoGood';
import RH from 'client/routeHelper';

const model = {

  namespace: 'editPwd',

  state: {
    from: {
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
    * updatePassWord({payload, callback}, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const {phone = '', code = ''} = yield select((state) => {
        const {forget = {}} = state;
        return forget.from || {};
      });
      const res = yield call(() => AJAX.send(ajaxMap.updatePassWord, {...payload, phone, vfcode: code}));
      callback && callback(res);
      // if (res.code === 0) RH(null, 'login', '/login');
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
