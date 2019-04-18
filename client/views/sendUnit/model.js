import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/sendUnit'; //该模块的ajax


const model = {

  namespace: 'sendUnit',

  state: {
    //需要的参数对象
    showBalance: 0, // 积分
    incomeBalanceQuota: 0, // 配额
    units: [], //查询的关联单位
    pageIndex: 1,
    pageSize: 10,
    cacheUnits: [], // 将要编辑的数据先存入这里以便取消时候用
    totalMoney: 0, // 总积分
    inputPayPassVisible: false,
    loading: false,
    sendLoading: false,

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

    updateUnitsById(state, { payload }) {
      const { id } = payload;
      const newUnits = state.units.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...payload,
          };
        } else {
          return item;
        }
      });
      return {
        ...state,
        units: newUnits,
      };
    },

    updateUnitAmount(state, { payload }) {
      const { id, amount } = payload;
      let totalMoney = 0;
      state.units.forEach((item) => {
        if (item.id === id) {
          totalMoney += amount;
        } else {
          totalMoney += Number(item.amount) || 0;
        }
      });

      return {
        ...state,
        totalMoney,
      };
    },

  },

  effects: {
    //sage 查询的关联单位
    * getCompanyAssociatedByIdOrTotalPeople({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let moneyId = '';
      let auditStatus = 0;
      if (window.__themeKey === 'org') {
        // 判断是否是工会
        moneyId = global.companyId;
        auditStatus = 1;
      } else {
        moneyId = global.groupId;
        auditStatus = 2;
      }
      yield put({type: 'set', payload: {isLoad: true}});
      // 清空缓存
      yield put({
        type: 'set',
        payload: {
          totalMoney: 0,
          units: [],
          cacheUnits: [],
        },
      });
      const res = yield call(() => AJAX.send(ajaxMap.getCompanyAssociatedByIdOrTotalPeople, {...payload, id: moneyId, auditStatus}));
      if (res.code === 0) {
        yield put({type: 'set', payload: {units: res.data || [], cacheUnits: res.data || []}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    //查询积分
    * findBalance({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let moneyId = '';
      let pageType = '';
      if (window.__themeKey === 'org') {
        moneyId = global.companyId;
        pageType = '1';
      } else {
        moneyId = global.groupId;
        pageType = '2';
      }
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.findBalance, {...payload, moneyId, pageType}));
      if (res.code === 0) {
        yield put({type: 'set', payload: {showBalance: res.data.showBalance || 0, incomeBalanceQuota: res.data.incomeBalanceQuota || 0}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    //发放配额给关联单位
    * insertBatchMoneyCompanyQuota({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let moneyId = ''; //ok
      const operationer = `${global.accountId}_${global.realName}`; //ok
      if (window.__themeKey === 'org') {
        moneyId = global.companyId; //ok
      } else {
        moneyId = global.groupId; //ok
      }
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.insertBatchMoneyCompanyQuota, {
        ...payload,
        companyId: moneyId, //ok
        accountId: global.accountId, //ok
        operationer, //ok
      }));
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
  },
};

export default model;
