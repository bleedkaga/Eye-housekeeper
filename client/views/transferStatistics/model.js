import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/transferStatistics'; //该模块的ajax


const model = {

  namespace: 'transferStatistics',

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
    dataSource: [],
    deptName: '',
    totalCount: 0,
    detailDataSource: [], //详情页面的数据
    detailTotalCount: 0, //详情页总数据
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
      const newUnits = state.units.map(item => {
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
      state.units.forEach(item => {
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
    //查询部门配额余量
    * quotaAllowanceDepartment({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let companyId = ''; //ok
      let pageType = '';
      if (window.__themeKey === 'org') {
        companyId = global.companyId;//ok
        pageType = '1';
      } else {
        companyId = global.groupId;//ok
        pageType = '2';
      }
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.quotaAllowanceDepartment, {...payload, companyGroupStatus: pageType, companyId}));//ok
      if (res.code === 0) {
        const newArr = res.data && res.data.map((item, index) => {
          item.index = index + 1;
          return item;
        });
        yield put({type: 'set', payload: {dataSource: newArr || [], totalCount: res.totalCount || 0}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    //单位转账额度查询
    * queryAssociatedUnitIssueBalance({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let companyId = ''; //ok
      if (window.__themeKey === 'org') {
        companyId = global.companyId; //ok
      } else {
        companyId = global.groupId; //ok
      }
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.queryAssociatedUnitIssueBalance, {...payload, companyId})); //ok
      if (res.code === 0) {
        const newArr = res.data && res.data.map((item, index) => {
          item.index = index + 1;
          return item;
        });
        yield put({type: 'set', payload: {dataSource: newArr || [], totalCount: res.totalCount || 0}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    //获取单位转账额度详细查询
    * getReleaseDetailedData({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let companyId = ''; //ok
      if (window.__themeKey === 'org') {
        companyId = global.companyId; //ok
      } else {
        companyId = global.groupId; //ok
      }
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.getReleaseDetailedData, {...payload, companyId})); //ok
      if (res.code === 0) {
        const newArr = res.data && res.data.map((item, index) => {
          item.index = index + 1;
          return item;
        });
        yield put({type: 'set', payload: {detailDataSource: newArr || [], detailTotalCount: res.totalCount || 0}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
