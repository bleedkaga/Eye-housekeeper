import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/home'; //该模块的ajax
import ajaxMapInvoices from 'client/services/invoices';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';
// import { object } from 'prop-types';

const model = {

  namespace: 'applyRecord',

  state: {
    //需要的参数对象
    condition: {
      pageIndex: 1,

      pageSize: 10,
      startTime: '',
      endTime: '',
      // 账务类型
      accountType: [],
      // 发票申请编号
      applyInvoiceCode: '',
      // 运单号
      expressCode: '',
      // 开票状态
      status: '',
    },
    __condition: {
      pageIndex: ['number'],
      pageSize: ['number'],
      startTime: ['string'],
      endTime: ['string'],
      accountType: ['array'],
      applyInvoiceCode: ['string'],
      expressCode: ['string'],
      status: ['string'],
    },
    // 列表数据
    list: [],
    isLoad: false, //当前是否正在加载
    totalCount: 0,
    totalPages: 1,
    showInvoiceDetail: {},
    // AdvancedQueryVisible: false
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
    //sage 调用例子
    * getData({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.getData, {...payload}));
      if (res.code === 0) {
        yield put({type: 'set', payload: {list: res.data || []}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

    // 获取申请记录列表
    * getApplyRecordList({payload = {}}, {call, put, select}) {
      yield put({type: 'set', payload: { isLoad: true}});

      const { global, applyRecord} = yield select(state => state);
      const result = Mapping.toAjaxQuery(applyRecord.condition, applyRecord.__condition, true);
      const companyId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok

      RH(null, 'applyRecord', `/${window.__themeKey}/taxation/record`, {search: result.search, replace: true});

      // console.log(payload);
      const res = yield call(() => AJAX.send(ajaxMapInvoices.invoiceDetailPageList, {
        ...result.params,
        companyId,
      }));

      if (res.code === 0) {
        const {totalCount, totalPages} = res;
        yield put({type: 'set', payload: { list: res.data || [], totalCount, totalPages }});
      }

      yield put({type: 'set', payload: { isLoad: false}});
    },
    // 查看记录 发票详情
    * showInvoiceDetail({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: { loading: true}});
      const res = yield call(() => AJAX.send(ajaxMapInvoices.showInvoiceDetail, { ...payload }));
      if (res.code === 0) {
        yield put({type: 'set', payload: { showInvoiceDetail: res.data || {}}});
        callback && callback();
      }
      yield put({type: 'set', payload: { loading: false}});
    },
  },
};

export default model;
