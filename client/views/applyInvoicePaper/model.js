import AJAX from 'client/utils/ajax';
import ajaxMapInvoices from 'client/services/invoices'; //该模块的ajax
import Tools from 'client/utils/tools';
import { message } from 'antd';

// 发票
const invoiceModel = {
  invoiceId: '',
  invoiceExplain: '',
  invoiceTaxRate: 0, //税率
  invoiceMoney: 0, //金额
  invoiceTaxMoney: 0, //税额
  invoiceType: '',
  invoiceServiceType: '',
  invoiceServiceTypeDesc: '',
  invoiceDetailAccount: '',
  remarks: '',
  invoiceTaxTotalMoney: 0,
  uuid: Tools.createUUID(1, ''),
};

const model = {
  namespace: 'applyInvoicesPaper',
  state: {
    //发票类型与服务类型
    applyInvoice: {
      invoiceTypeList: [
        {invoiceType: null, invoiceTypeDesc: null},
      ],
      invoiceScopeList: [],

    },
    defaultType: {key: '', label: ''},
    submitApplyInvoice: [
      {...invoiceModel},
    ],
    invoiceInfo: {
      companyName: '',
      taxpayerType: undefined,
    },
    invoiceExplain: '',
    // 提交申请前的确认
    preSubmit: {
      step: 0, //0 不显示 1 发票详情 2 发票预览 3 修改纳税人类型 4 修改邮寄地址
      EAddressIsFirstEdit: false,
    },
    eaddress: {},

    // 接收地址信息
    receivceInfo: {
      addressData: undefined,
      recipientPhone: null,
      recipientName: null,
      recipientAddress: null,
      recipientProvince: null,
      recipientCity: null,
      recipientArea: null,
      recipientDetailAddress: null,
    },
  },
  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state };
    },

    setCondition(state, payload) {
      return {...state, condition: { ...state.condition, ...payload}};
    },
    resetCondition(state) {
      return {...state, condition: {...model.state.condition}};
    },
    deleteInvoice(state, { payload }) {
      state.submitApplyInvoice.splice(payload.index, 1);
      return { ...state };
    },
    setInvoiceType(state, { payload }) {
      state.submitApplyInvoice[payload.index].invoiceType = payload.value.key;
      state.submitApplyInvoice[payload.index].invoiceTypeDesc = payload.value.label;
      return { ...state };
    },
    setRate(state, { payload }) {
      state.submitApplyInvoice[payload.index].invoiceMoney = payload.money;
      state.submitApplyInvoice[payload.index].invoiceTaxMoney = payload.rateMoney;
      state.submitApplyInvoice[payload.index].invoiceTaxTotalMoney = payload.value;
      state.submitApplyInvoice[payload.index].invoiceDetailAccount = payload.value;
      state.submitApplyInvoice[payload.index].uuid = payload.uuid;

      return { ...state };
    },
    updateReceive(state, { payload }) {
      state.submitApplyInvoice.forEach((item) => {
        item.recipientName = payload.recipientName;
        item.recipientAddress = payload.recipientAddress;
        item.recipientDetailAddress = payload.recipientDetailAddress;
        item.recipientPhone = payload.recipientPhone;
      });
      return {...state, applyInvoice: {...state.applyInvoice, ...payload}};
    },
    resetInvoices(state) {
      return {...state, submitApplyInvoice: [{...invoiceModel}]};
    },
    setRemarks(state, { payload }) {
      state.submitApplyInvoice[payload.index].remarks = payload.value;
      return { ...state };
    },
  },

  effects: {
    * applyInvoice({payload}, {call, put}) {
      yield put({type: 'set', payload: { applyLoading: true}});
      const res = yield call(() => AJAX.send(ajaxMapInvoices.applyInvoice, { ...payload }));
      if (res.code === 0) {
        yield put({type: 'set', payload: { applyInvoice: res.data || {}}});
        yield put({type: 'set', payload: { defaultType: {key: res.data.invoiceTypeList[0].invoiceType, label: res.data.invoiceTypeList[0].invoiceTypeDesc}}});
      }
      yield put({type: 'set', payload: { applyLoading: false}});
    },
    * calculator({payload}, {put}) {
      const { value = 0, index, taxrate, uuid} = payload;
      // 金额计算
      const money = (parseFloat(value || 0) / (1 + taxrate)).toFixed(2);

      // 税额
      const rateMoney = (parseFloat(value || 0) / (1 + taxrate) * taxrate).toFixed(2);

      yield put({ type: 'setRate', payload: { money, rateMoney, index, value, uuid}});
    },
    // 提交申请
    * submit({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: { loading: true}});
      let copyed = [];
      payload.forEach((item) => {
        copyed.push({
          companyId: item.companyId,
          invoiceId: item.invoiceId,
          recipientPhone: item.recipientPhone,
          recipientName: item.recipientName,
          recipientAddress: item.recipientAddress,
          recipientDetailAddress: item.recipientDetailAddress,
          invoiceExplain: item.invoiceExplain,
          invoiceType: item.invoiceType,
          invoiceServiceType: item.invoiceServiceType,
          invoiceDetailAccount: item.invoiceDetailAccount * 100,
          remarks: item.remarks,
        });
      });

      const res = yield call(() => AJAX.send(ajaxMapInvoices.submitApplyInvoice, { invoiceListStr: JSON.stringify([...copyed])}));
      if (res.code === 0) {
        message.success('提交成功');
        copyed = [];
        callback && callback();
      }
      yield put({type: 'set', payload: { submitApplyLoading: false }});
    },

    //保存邮寄信息
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
