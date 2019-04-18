import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/unionAssetStream';
// import Tools from 'client/utils/tools';

const model = {

  namespace: 'unionAssetStream',
  state: {
    listOfCash: {},
    listOfDetail: {},
    isLoad: false, //当前是否正在加载
    urlSuffix: '',
    paramCash: {
      channel: '', //打款渠道
      collectionSubject: '', //收款主体
      startDate: '',
      endDate: '',
      financialType: '', //财务类型
      orderWater: '', //订单流水
      pageIndex: 1,
      pageSize: 10,
    },
    paramDetail: {
      orderWater: '',
      pageIndex: 1,
      pageSize: 10,
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
    setParamDetail(state, {payload}) { //单位账户的
      return {...state, paramDetail: {...state.paramDetail, ...payload}};
    },
    resetParamDetail(state) {
      return {...state, paramDetail: {...model.state.paramDetail}};
    },

  },

  effects: {
    * originPullCash({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res1 = yield call(() => AJAX.send(ajaxMap.originPullCash, {...payload}));
      if (res1.code === 0) {
        yield put({type: 'set', payload: {listOfCash: res1 || {}}});
        // console.log(res1, 'res1res1res1');
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    * originPullDetail({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res2 = yield call(() => AJAX.send(ajaxMap.originPullDetail, {...payload}));
      if (res2.code === 0) {
        yield put({type: 'set', payload: {listOfDetail: res2 || {}}});
        // console.log(res2, 'res2res2res2');
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    * cashExport({payload, callback}, {call, put}) {
      // console.log(payload, '导出payload');
      yield put({type: 'set', payload: {isLoad: true}});
      const res3 = yield call(() => AJAX.send(ajaxMap.cashExport, {...payload}));
      if (res3.code === 0) {
        // console.log(res3, '导出11111');
        if (callback) { callback(res3); }
        // yield put({type: 'set', payload: {listOfCash: res1 || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
