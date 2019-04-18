import AJAX from 'client/utils/ajax';
import API from 'client/services/govHandle';


const model = {

  namespace: 'govHandle',

  state: {
    //需要的参数对象
    condition: {
      keyword: '',
      pageIndex: 1,
      pageSize: 10,
    },

    list: [],
    isLoad: false, //当前是否正在加载

  },


  effects: {
    //sage 调用例子
    * findDocumentByKeyword({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(API.findDocumentByKeyword, {...payload}));
      if (res.code === 0) {
        const _ret = res.data || [];
        for (let i = 0; i < _ret.length; i++) {
          _ret[i].id = i;
          _ret[i].key = i;
        }
        yield put({type: 'set', payload: {list: _ret || []}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
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
    resetCondition(state) {
      return {...state, condition: {...model.state.condition}};
    },
  },
};


export default model;
