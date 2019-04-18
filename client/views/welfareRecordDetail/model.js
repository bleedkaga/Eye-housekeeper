import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/welfareRecords'; //该模块的ajax


const model = {
  namespace: 'welfareRecordDetail',

  state: {
    detail1: {
      userName: '',
      mobilePhone: '',
      totalCount: 0,
      list: [],
      isLoad: false, //当前是否正在加载
      pageIndex: 1,
      pageSize: 10,
    },

    detail2: {
      totalCount: 0,
      list: [],
      isLoad: false, //当前是否正在加载
      pageIndex: 1,
      pageSize: 10,
    },

    detail3: {
      totalCount: 0,
      list: [],
      isLoad: false, //当前是否正在加载
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

    setDetail1(state, {payload}) {
      return {...state, detail1: {...state.detail1, ...payload}};
    },
    setDetail2(state, {payload}) {
      return {...state, detail2: {...state.detail2, ...payload}};
    },
    setDetail3(state, {payload}) {
      return {...state, detail3: {...state.detail3, ...payload}};
    },
  },

  effects: {
    // 获取清单数据
    * getDetail1({payload = {}}, {call, put, select}) {
      const {detail1} = yield select(state => state.welfareRecordDetail);
      const companyGroupType = window.__themeKey === 'union' ? 3 : '';

      yield put({type: 'setDetail1', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.enquiriesAreIssuedForDetails, {
        userName: detail1.userName,
        mobilePhone: detail1.mobilePhone,
        pageIndex: detail1.pageIndex,
        pageSize: detail1.pageSize,
        outTradeNo: payload.outTradeNo,
        companyGroupType,
      }));
      if (res.code === 0) {
        const {data = [], totalCount} = res;
        yield put({type: 'setDetail1', payload: {list: data, totalCount}});
      }
      yield put({type: 'setDetail1', payload: {isLoad: false}});
    },

    * getExportUrl1({payload = {}}, {call, select}) {
      const {welfareRecordDetail} = yield select(state => state);
      const {detail1} = welfareRecordDetail;

      const res = yield call(() => AJAX.send(ajaxMap.sendRecordDetailExport, {
        userName: detail1.userName,
        mobilePhone: detail1.mobilePhone,
        outTradeNo: payload.outTradeNo,
      }));
      if (res.code === 0) {
        return res.data.url;
      }
    },

    //部门清单
    * getDetail2({payload = {}}, {call, put, select}) {
      const {detail2} = yield select(state => state.welfareRecordDetail);
      yield put({type: 'setDetail2', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.findMoneyQuotaDetailedList, {
        pageIndex: detail2.pageIndex,
        pageSize: detail2.pageSize,
        recordId: payload.recordId,
      }));
      if (res.code === 0) {
        const {data = [], totalCount} = res;
        yield put({type: 'setDetail2', payload: {list: data, totalCount}});
      }
      yield put({type: 'setDetail2', payload: {isLoad: false}});
    },

    * getExportUrl2({payload = {}}, {call, select}) {
      const {global} = yield select(state => state);

      const res = yield call(() => AJAX.send(ajaxMap.exportReleaseList, {
        companyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId, //ok
        type: 2,
        recordId: payload.recordId,
      }));
      if (res.code === 0) {
        return res.data.url;
      }
    },

    //单位清单
    * getDetail3({payload = {}}, {call, put, select}) {
      const {detail3} = yield select(state => state.welfareRecordDetail);
      yield put({type: 'setDetail3', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.findMoneyQuotaDetailedList, {
        pageIndex: detail3.pageIndex,
        pageSize: detail3.pageSize,
        recordId: payload.recordId,
      }));
      if (res.code === 0) {
        const {data = [], totalCount} = res;
        yield put({type: 'setDetail3', payload: {list: data, totalCount}});
      }
      yield put({type: 'setDetail3', payload: {isLoad: false}});
    },

    * getExportUrl3({payload = {}}, {call, select}) {
      const {global} = yield select(state => state);

      const res = yield call(() => AJAX.send(ajaxMap.exportReleaseList, {
        companyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId, //ok
        type: 1,
        recordId: payload.recordId,
      }));
      if (res.code === 0) {
        return res.data.url;
      }
    },

    // 获取导出地址
    * getExportUrl({payload = {}}, {call, select}) {
      const {active} = yield select(state => state.welfareRecords);
      const keys = active === '0' ? ['userName', 'mobilePhone', 'outTradeNo'] : ['companyId', 'recordId'];
      const req = {};
      active !== '0' && (req.companyId = yield select(state => state.global.account[window.__themeKey === 'org' ? 'companyId' : 'groupId'])); //ok
      active === '1' && (req.type = 2);
      active === '2' && (req.type = 1);
      Object.keys(payload).forEach(key => keys.indexOf(key) !== -1 && payload[key] && (req[key] = payload[key]));
      const res = yield call(() => AJAX.send(ajaxMap.exports[active], req));
      if (res.code === 0) {
        return res.data.url;
      }
    },
  },
};

export default model;
