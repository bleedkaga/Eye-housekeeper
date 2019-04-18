import AJAX from 'client/utils/ajax';
import ajaxMapInvoices from 'client/services/invoices'; //该模块的ajax
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';

const model = {

  namespace: 'applyInvoices',

  state: {
    //需要的参数对象
    condition: {
      pageIndex: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
      accountType: [],
    },
    __condition: {
      pageIndex: ['number'],
      pageSize: ['number'],
      startTime: ['string'],
      endTime: ['string'],
      accountType: ['array'],
    },
    page: {},
    isLoad: false, //当前是否正在加载
    totalCount: 0,
    amountMoney: 0,
    taxpayerTypeList: [],

    // 开票记录列表
    record: {
      loading: false,
      list: [],
    },

    showInvoiceDetail: {
      InvoiceDetailList: [],
    }, //发票详情
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setCondition(state, {payload}) {
      const params = Mapping.toParams(payload, state.__condition, model.state.condition);
      return {...state, condition: {...state.condition, ...params}};
    },
    resetCondition(state) {
      return {...state, condition: {...model.state.condition}};
    },

  },

  effects: {
    * setInvoiceInfo({payload, callback}, { put }) {
      yield put({type: 'set', payload: { ...payload}});
      callback && callback();
    },

    //sage 调用例子
    * getData({ payload }, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});
      // 由于单位管理与工会管理涉及的账务类型不同，做一下区分

      const { global, applyInvoices } = yield select(state => state);
      const result = Mapping.toAjaxQuery(applyInvoices.condition, applyInvoices.__condition, true);
      const companyId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok

      RH(null, 'applyInvoices', `/${window.__themeKey}/taxation/applyInvoices`, {search: result.search, replace: true});

      const res = yield call(() => AJAX.send(ajaxMapInvoices.invoicesInfoList, {
        ...result.params,
        companyId,//ok
      }));

      if (res.code === 0) {
        yield put({type: 'set', payload: {page: res || {}}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },


    * applyInvoice({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapInvoices.applyInvoice, { ...payload }));
      if (res.code === 0) {
        yield put({type: 'set', payload: { applyInvoiceInfo: res.data }});
      }
    },

    * queryInvoiceBaseInfo({payload}, {call, put}) {
      yield put({type: 'set', payload: { isLoad: true }});
      const res = yield call(() => AJAX.send(ajaxMapInvoices.queryInvoiceBaseInfo, { ...payload }));
      if (res.code === 0) {
        yield put({type: 'set', payload: { invoiceInfo: res.data}});
      }
      yield put({type: 'set', payload: { isLoad: false }});
    },
  },
};

export default model;
