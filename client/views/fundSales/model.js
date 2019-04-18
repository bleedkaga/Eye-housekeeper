import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/fundSales';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';

const tabCondition = {
  tab1: {
    pageIndex: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    status: '',
    financialType: '', //账务类型
    channel: '', //打款渠道
    collectionSubject: '', //收款主体,
    orderWater: '', //订单流水号
  },
  tab2: {
    pageIndex: 1,
    pageSize: 10,
    createTimeStart: '',
    createTimeEnd: '',

  },
};
const model = {
  namespace: 'fundSales',
  state: {
    active: '0',
    exportIsLoad: false,
    tab1: {
      condition: {
        ...tabCondition.tab1,
      },
      __condition: {
        pageIndex: ['number'],
        pageSize: ['number'],
      },
      list: [],
      isLoad: false,
      statistical: {
        failure: 0,
        pendingpayment: 0,
        success: 0,
        total: 0,
        underreview: 0,
      },
      statisticalAmount: {
        actualArrival: 0,
        totalamount: 0,
      },
    },
    tab2: {
      condition: {
        ...tabCondition.tab2,
      },
      __condition: {
        pageIndex: ['number'],
        pageSize: ['number'],
      },
      list: [],
      isLoad: false,
      statistical: {
        failure: 0,
        pendingpayment: 0,
        success: 0,
        total: 0,
        underreview: 0,
      },
      statisticalAmount: {
        actualArrival: 0,
        totalamount: 0,
      },
    },
  },
  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },
    setTab(state, { payload, index}) {
      return {...state, [`tab${index}`]: {...state[`tab${index}`], ...payload}};
    },
    setTabCondition(state, { payload, index}) {
      const params = Mapping.toParams(payload, state[`tab${index}`].__condition, tabCondition[`tab${index}`], true);
      return {
        ...state,
        [`tab${index}`]: {...state[`tab${index}`], condition: {...state[`tab${index}`].condition, ...params}},
      };
    },
  },
  effects: {
    * getTab1Data(_, { put, call, select}) {
      yield put({type: 'setTab', payload: {isLoad: true}, index: 1});
      const { global, fundSales } = yield select(state => state);
      const { companyId } = global.account;
      const { tab1 } = fundSales;

      const urlResult = Mapping.toAjaxQuery(tab1.condition, tab1.__condition);

      //这里是为了加上让第几个tab显示
      urlResult.search += `&t=${fundSales.active}`;
      RH(null, 'fundSales', `/${window.__themeKey}/cloud/fundSales`, {
        search: urlResult.search,
        replace: true,
      });

      const result = yield call(() => AJAX.send(ajaxMap.rmbAccountinquiry, {
        moneyId: companyId,
        ...fundSales.tab1.condition,
      }));


      if (result.code === 0) {
        const { data = [], totalCount } = result;
        yield put({ type: 'setTab', payload: { list: data, totalCount}, index: 1});
      }
      yield put({type: 'setTab', payload: {isLoad: false}, index: 1});
    },

    * getTab2Data(_, { put, call, select}) {
      const tabIndex = 2;
      yield put({type: 'setTab', payload: {isLoad: true}, index: tabIndex});
      const { global, fundSales } = yield select(state => state);
      const { companyId } = global.account;
      const { tab2 } = fundSales;

      const urlResult = Mapping.toAjaxQuery(tab2.condition, tab2.__condition);

      //这里是为了加上让第几个tab显示
      urlResult.search += `&t=${fundSales.active}`;
      RH(null, 'fundSales', `/${window.__themeKey}/cloud/fundSales`, {
        search: urlResult.search,
        replace: true,
      });

      const result = yield call(() => AJAX.send(ajaxMap.conditionalQuery, {
        moneyId: companyId,
        ...fundSales.tab2.condition,
      }));

      if (result.code === 0) {
        const { data = [], totalCount } = result;
        yield put({ type: 'setTab',
          payload: { list: data, totalCount},
          index: tabIndex});
      }
      yield put({type: 'setTab', payload: {isLoad: false}, index: tabIndex});
    },

    //导出现金账户充值记录
    * cashExport({callback}, {call, put, select}) {
      yield put({type: 'set', payload: {exportIsLoad: true}});
      const {global, fundSales} = yield select(state => state);
      const { companyId } = global.account;
      const { tab1 } = fundSales;
      const urlResult = Mapping.toAjaxQuery(tab1.condition, tab1.__condition);

      const res = yield call(() => AJAX.send(ajaxMap.cashExport, {...urlResult.params, moneyId: companyId}));

      if (res.code === 0) {
        if (callback) { callback(res); }
        callback && callback(res);
      }
      yield put({type: 'set', payload: {exportIsLoad: false}});
    },

    //导出单位福利账户充值记录
    * companyExport({callback}, {call, put, select}) {
      yield put({type: 'set', payload: {exportIsLoad: true}});
      const {global, fundSales} = yield select(state => state);
      const { companyId } = global.account;
      const { tab2 } = fundSales;
      const urlResult = Mapping.toAjaxQuery(tab2.condition, tab2.__condition);
      const res = yield call(() => AJAX.send(ajaxMap.companyExport, {...urlResult.params, moneyId: companyId}));

      if (res.code === 0) {
        if (callback) { callback(res); }
        callback && callback(res);
      }
      yield put({type: 'set', payload: {exportIsLoad: false}});
    },
  },
};

export default model;
