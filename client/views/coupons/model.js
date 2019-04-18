import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/coupons'; //该模块的ajax
import ajaxMapSendStaff from 'client/services/sendstaff';
import API from '../../services/capacityTax'; //该模块的ajax

const model = {

  namespace: 'coupons',

  state: {
    //需要的参数对象
    showBalance: 0, // 积分
    quotaList: [], //部门配额走马灯显示
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setCondition(state, {payload}) {
      return {...state, condition: {...state.condition, ...payload}};
    },

  },

  effects: {
    //sage 调用例子
    * findBalance({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let moneyId = ''; //ok
      let pageType = '';
      if (window.__themeKey === 'org') {
        moneyId = global.companyId; //ok
        pageType = '1';
      } else {
        moneyId = global.groupId; //ok
        pageType = '2';
      }
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.findBalance, {...payload, moneyId, pageType})); //ok
      if (res.code === 0) {
        yield put({type: 'set', payload: {showBalance: res.data.showBalance || 0, quotaList: res.data.quotaList || []}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

    * checkIsPassword({payload, callback}, {call, select}) {
      const account = yield select(state => state.global.account);
      const res = yield call(() => AJAX.send(ajaxMapSendStaff.checkIsPassword, {
        moneyId: account.companyId, //ok
        accountId: account.accountId, //ok
        ...payload,
      }));
      callback && callback(res);
    },
    // 支付成功?
    * paymentIsSuccess({payload}, {call, select}) {
      const app = yield select(state => state.global.account);
      payload.moneyId = app.companyId; //ok
      return yield call(() => AJAX.send(API.paymentIsSuccess, {...payload}));
    },
  },
};

export default model;
