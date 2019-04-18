import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/goodSoGood'; //该模块的ajax

const model = {

  namespace: 'demo',

  state: {
    //需要的参数对象
    condition: {},
    list: [],
    isLoad: false, //当前是否正在加载
    money: '21,200,200.00元'
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setCondition(state, {payload}) {
      return {...state, condition: {...state.condition, ...payload}};
    },

  },

  effects: {
    //sage 调用例子
    * getData({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.getData, {...payload}));
      if (res.code === 0) {
        yield put({type: 'set', payload: {list: res.data || []}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
