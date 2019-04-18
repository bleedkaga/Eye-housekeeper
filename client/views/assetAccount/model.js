import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/assetAccount';
// import Tools from 'client/utils/tools';

const model = {

  namespace: 'assetAccount',

  state: {
    listOfCash: [], //接口获取到的现金账户数据
    listOfCompany: [], ////接口获取到的单位福利账户数据
    isLoad: false, //当前是否正在加载
    type: '1',
    paramCash: {
      startDate: '',
      endDate: '',
      channelType: '', //打款渠道
      pageIndex: 1,
      pageSize: 10,
      financialType: '', //财务类型
      status: '', //状态
    },
    paramCompany: {
      startDate: '',
      endDate: '',
      channelType: '', //打款渠道
      pageIndex: 1,
      pageSize: 10,
      financialType: '', //财务类型
      status: '', //状态
    },
  },

  reducers: {

    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },
    setParamCash(state, {payload}) { //现金账户的
      return {...state, paramCash: {...state.paramCash, ...payload}};
    },
    resetParamCash(state) {
      return {...state, paramCash: {...model.state.paramCash}};
    },
    setParamCompany(state, {payload}) {
      return {...state, paramCompany: {...state.paramCompany, ...payload}};
    },
    resetParamCompany(state) { //单位账户的
      return {...state, paramCompany: {...model.state.paramCompany}};
    },

  },

  effects: {
    * originPullCash({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res1 = yield call(() => AJAX.send(ajaxMap.originPullCash, {...payload}));
      if (res1.code === 0) {
        yield put({type: 'set', payload: {listOfCash: res1 || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    * cashExport({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res3 = yield call(() => AJAX.send(ajaxMap.cashExport, {...payload}));
      if (res3.code === 0) {
        if (callback) { callback(res3); }
        // yield put({type: 'set', payload: {listOfCash: res1 || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },

    * originPullCompany({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res2 = yield call(() => AJAX.send(ajaxMap.originPullCompany, {...payload}));
      if (res2.code === 0) {
        yield put({type: 'set', payload: {listOfCompany: res2 || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    * companyExport({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res4 = yield call(() => AJAX.send(ajaxMap.companyExport, {...payload}));
      if (res4.code === 0) {
        if (callback) { callback(res4); }
        // yield put({type: 'set', payload: {listOfCash: res1 || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
