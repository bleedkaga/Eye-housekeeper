import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/sendstaff';

const model = {

  namespace: 'uploadWelfare',

  state: {
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    list: [],
    isLoad: false, //当前是否正在加载
    isFormLoad: false,
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },
  },

  effects: {
    * get({payload}, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const {uploadWelfare, global} = yield select(state => state);
      const {pageIndex, pageSize} = uploadWelfare;
      const {account} = global;
      const res = yield call(() => AJAX.send(ajaxMap.listSourceUploadMes, {
        pageIndex,
        pageSize,
        companyId: window.__themeKey === 'org' ? account.companyId : account.groupId, //ok
        ...payload,
      }));
      if (res.code === 0) {
        yield put({type: 'set', payload: {list: res.data || [], totalCount: res.totalCount || 0}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },

    * add({payload, callback}, {call, put, select}) {
      const {global} = yield select(state => state);
      yield put({type: 'set', payload: {isFormLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.insertUploadSource, {
        companyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId, //ok
        ...payload,
      }));
      if (res.code === 0) {
        callback && callback(res);
      }
      yield put({type: 'set', payload: {isFormLoad: false}});
    },
  },
};

export default model;
