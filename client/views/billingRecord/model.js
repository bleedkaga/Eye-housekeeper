import Mapping from 'client/utils/mapping';
import AJAX from 'client/utils/ajax';
import ajaxMapInvoices from 'client/services/invoices'; //该模块的ajax
import RH from 'client/routeHelper';

const model = {
  namespace: 'billingRecord',
  state: {
    invoiceDetailRecord: {
      isLoad: false, data: [], totalCount: 0,
    },
    // 开票记录查询条件
    condition: {
      pageSize: 10,
      pageIndex: 1,
    },
    __condition: {
      pageSize: ['number'],
      pageIndex: ['number'],
    },
    showInvoiceDetail: {},
  },
  reducers: {
    set(state, { payload }) {
      return {...state, ...payload};
    },
    setCondition(state, { payload}) {
      const params = Mapping.toParams(payload, state.__condition, model.state.condition);
      return {...state, condition: { ...state.condition, ...params}};
    },
    resetCondition(state) {
      return {...state,
        condition: {
          ...model.state.condition,
        },
        invoiceDetailRecord: {
          ...model.state.invoiceDetailRecord,
        },
      };
    },
  },
  effects: {
    // 获取开票记录详情
    * get({ payload }, { call, put, select}) {
      yield put({type: 'set', payload: { isLoad: true }});

      const { global, billingRecord } = yield select(state => state);
      const result = Mapping.toAjaxQuery(billingRecord.condition, billingRecord.__condition, true);
      const companyId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok

      RH(null, 'billingRecord', `/${window.__themeKey}/taxation/applyInvoices/billingRecord`, {search: result.search, replace: true});

      const res = yield call(() => AJAX.send(ajaxMapInvoices.invoiceDetailRecordList, {
        ...result.params,
        companyId, //ok
        ...payload,
      }));

      if (res.code === 0) {
        yield put({type: 'set', payload: {invoiceDetailRecord: { ...res}}});
      } else {
        yield put({type: 'reset'});
      }
      yield put({type: 'set', payload: { isLoad: false}});
    },


    // 查看记录 发票详情
    * showInvoiceDetail({payload}, {call, put}) {
      yield put({type: 'set', payload: { loading: true}});
      const res = yield call(() => AJAX.send(ajaxMapInvoices.showInvoiceDetail, { ...payload }));
      if (res.code === 0) {
        yield put({type: 'set', payload: { showInvoiceDetail: res.data || {}}});
      }
      yield put({type: 'set', payload: { loading: false}});
    },
  },
};

export default model;
