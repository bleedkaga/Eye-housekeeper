import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/assetStream';
// import Tools from 'client/utils/tools';

const model = {

  namespace: 'assetStream',
  state: {
    cashList: {},
    companyList: {},
    personalDetailList: {},
    isLoad: false, //当前是否正在加载
    cssShow: true,
    type: '1',
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
    paramCompany: {
      channel: '',
      collectionSubject: '',
      startDate: '',
      endDate: '',
      financialType: '',
      orderWater: '',
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
    setParamCompany(state, {payload}) { //单位账户的
      return {...state, paramCompany: {...state.paramCompany, ...payload}};
    },
    resetParamCompany(state) {
      return {...state, paramCompany: {...model.state.paramCompany}};
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
      // const aaa = yield select(state => state.assetStream.paramCompany);
      // console.log(payload, aaa, 'payloadpayloadpayload');
      yield put({type: 'set', payload: {isLoad: true}});
      const res1 = yield call(() => AJAX.send(ajaxMap.originPullCash, {...payload}));
      if (res1.code === 0) {
        yield put({type: 'set', payload: {cashList: res1 || []}});
        // console.log(res1, 'res1res1res1');
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
    * originPullCompany({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res2 = yield call(() => AJAX.send(ajaxMap.originPullCompany, {...payload}));
      if (res2.code === 0) {
        yield put({type: 'set', payload: {companyList: res2 || {}}});
        // console.log(res2, 'res2res2res2');
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    * companyExport({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res4 = yield call(() => AJAX.send(ajaxMap.companyExport, {...payload}));
      if (res4.code === 0) {
        // console.log(res4, '导出2222');
        if (callback) { callback(res4); }
      // yield put({type: 'set', payload: {listOfCash: res1 || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    * originPullDetail({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res3 = yield call(() => AJAX.send(ajaxMap.originPullDetail, {...payload}));
      if (res3.code === 0) {
        yield put({type: 'set', payload: {personalDetailList: res3 || {}}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
