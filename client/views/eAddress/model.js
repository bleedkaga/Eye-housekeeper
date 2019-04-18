import AJAX from 'client/utils/ajax';
import ajaxMapInvoices from 'client/services/invoices'; //该模块的ajax
import { message } from 'antd';


const model = {

  namespace: 'eaddress',

  state: {
    //需要的参数对象
    condition: {},
    list: [],
    isLoad: false, //当前是否正在加载
    money: '0',
    edit: false,
    initable: true,
    info: {
      addressData: undefined,
      recipientPhone: null,
      recipientName: null,
      recipientAddress: null,
      recipientProvince: null,
      recipientCity: null,
      recipientArea: null,
      recipientDetailAddress: null,
    },
    areaAddressData: [],
    defaultAddressData: [],
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setFrom(state, {payload}) {
      return {...state, info: {...state.info, ...payload}};
    },
    setProvince(state, {payload}) {
      return {
        ...state,
        address: {
          ...state.address,
          ...payload,
        },
      };
    },
    setReceivceAddress(state, { payload}) {
      return {
        ...state,
        recevice: {
          ...payload,
        },
      };
    },
  },

  effects: {
    * queryRecipientInfo({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMapInvoices.queryRecipientInfo, {...payload}));
      if (res.code === 0) {
        yield put({type: 'set', payload: {info: res.data, edit: !res.data.recipientAddress }});
        if (res.data.recipientAddress) {
          callback && callback(res);
        }
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

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
