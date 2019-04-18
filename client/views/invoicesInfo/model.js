import AJAX from 'client/utils/ajax';
import ajaxMapInvoices from 'client/services/invoices'; //该模块的ajax
import { message } from 'antd';

const model = {

  namespace: 'invoinceInfo',

  state: {
    //需要的参数对象
    isLoad: false, //当前是否正在加载
    invoiceInfo: {
      companyName: '',
      taxpayerTypeDesc: '',
      invoiceScopeList: [],
      taxpayerTypeList: [],
      bank: '',
      bankAccount: '',
      recipientPhone: '',
      recipientAddress: '',
      uniformCreditCode: '',
      recipientEmail: '',
      taxpayerType: null,
    },
    taxpayerInit: false,
    recipientEmailEdit: false,
    emailInit: false, //是否是第一次填写收件箱
    emailEdit: false, //是否需要编辑
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    saveForm(state, { payload }) {
      return { ...state, invoiceInfo: {...state.invoiceInfo, ...payload}};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setInvoiceInfo(state, {payload}) {
      return {...state, invoiceInfo: {...state.invoiceInfo, ...payload}};
    },

  },

  effects: {
    // 获取开票信息
    * queryInvoiceBaseInfo({payload}, {call, put}) {
      yield put({type: 'set', payload: { isLoad: true }});
      const res = yield call(() => AJAX.send(ajaxMapInvoices.queryInvoiceBaseInfo, { ...payload }));
      if (res.code === 0) {
        yield put({type: 'set', payload: { invoiceInfo: res.data, taxpayerInit: !res.data.taxpayerType, emailInit: !res.data.recipientEmail }});
      }
      yield put({type: 'set', payload: { isLoad: false }});
    },
    // 保存信息
    * saveForm({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMapInvoices.updateIndustrySubsidiaryInfo, {...payload}));
      if (res.code === 0) {
        yield put({type: 'set', payload: res.data});
        message.success('保存成功');
        callback && callback();
      }
      yield put({type: 'set', payload: {isLoad: false, edit: false}});
    },
  },
};

export default model;
