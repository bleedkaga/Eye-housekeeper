import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/administrator';
import ajaxMapDepart from 'client/services/depart';

const model = {

  namespace: 'administrator',

  state: {
    //条件
    condition: {
      pageIndex: 1,
      pageSize: 10,
      realName: '',
    },
    list: [],
    totalCount: 0, //总数
    isLoad: false, //当前是否正在加载
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

  effects: {
    * get({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      if (!payload.realName) delete payload.realName;

      const res = yield call(() => AJAX.send(ajaxMap.accountList, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {
            list: res.data || [],
            totalCount: res.totalCount || 0,
          },
        });
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

    * deleteAccountById({payload}, {call, put, select}) {
      const {index} = payload;
      delete payload.index;

      const res = yield call(() => AJAX.send(ajaxMap.deleteAccountById, {...payload}));
      if (res.code === 0) {
        const {list} = yield select(state => state.administrator);
        list.splice(index, 1);
        yield put({type: 'set', payload: {list}});
      }
    },

    * queryManager({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMapDepart.queryManager, {...payload}));
      callback && callback(res);
    },

    * queryDepartment({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMapDepart.queryDepartment, {...payload}));
      callback && callback(res);
    },

    * handOverManager({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMap.handOverManager, {...payload}));
      callback && callback(res);
    },
  },
};

export default model;
