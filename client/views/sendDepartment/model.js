import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/sendDepartment'; //该模块的ajax

const cloneTree = (tree) => {
  const arr = [];
  if (!tree || tree.length <= 0) {
    return arr;
  }

  for (const item of tree) {
    const newChildren = cloneTree(item.children);
    arr.push({ ...item, children: newChildren });
  }

  return arr;
};

const model = {

  namespace: 'sendDepartment',

  state: {
    //需要的参数对象
    condition: {},
    list: [],
    isLoad: false, //当前是否正在加载
    departmentInfos: [], //部门查询返回的数据
    cacheDepartmentInfos: [], //缓存部门返回的数据，目前还不知道有什么用，但是老项目有 也就保留下来了
    totalMoney: 0, // 总积分--表格里面的总金额
    showBalance: 0, // 积分
    incomeBalanceQuota: 0,

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

    updateDepartmentByKey(state, { payload }) {
      const { key } = payload;
      const genNewDepartmentInfos = (tree, key1) =>
        // const arr = [];
        // if (!tree || tree.length <= 0) {
        //   return arr;
        // }
        tree.map((item) => {
          if (item.id === key1) {
            item = {...item, ...payload};
            return item;
          } else if (item.children !== null) {
            const newArr = genNewDepartmentInfos(item.children, key1);
            item.children = newArr;
          }
          return item;
        });

      const newDepartmentInfos = genNewDepartmentInfos(state.departmentInfos, key);
      return { ...state, departmentInfos: newDepartmentInfos };
    },

    updateDepartmentAmount(state, { payload }) {
      //算出总的表格里面的金额
      const { key, amount } = payload;
      let totalMoney = 0;

      const genNewDepartmentInfos = (tree, key1) => {
        if (!tree || tree.length <= 0) {
          return;
        }

        for (const item of tree) {
          genNewDepartmentInfos(item.children, key);

          if (item.id === key1) {
            totalMoney += amount;
          } else {
            totalMoney += Number(item.amount) || 0;
          }
        }

        return -1;
      };

      genNewDepartmentInfos(state.departmentInfos, key);

      return {
        ...state,
        totalMoney,
      };
    },

    updateCacheDepartment(state) {
      const clonedData = cloneTree(state.departmentInfos);
      return { ...state, cacheDepartmentInfos: clonedData };
    },

    //取消发放配额
    cancelSend(state) {
      const setAmountZero = tree =>
        // const arr = []
        // if (!tree || tree.length <= 0) {
        //   return arr;
        // }
        //
        // for (const item of tree) {
        //   const newChildren = setAmountZero(item.children)
        //   arr.push({
        //     ...item,
        //     amount: 0,
        //     children: newChildren,
        //   });
        // }
        // return arr;
        tree.map((item) => {
          // if (item.id === key1) {
          //   item = {...item, ...payload};
          //   return item;
          // } else if (item.children !== null) {
          //   const newArr = genNewDepartmentInfos(item.children, key1);
          //   item.children = newArr;
          // }
          // return item;
          item = {...item, amount: 0};
          if (item.children !== null) {
            const newArr = setAmountZero(item.children);
            item.children = newArr;
          }
          return item;
        });
      const newDepartmentInfos = setAmountZero(state.departmentInfos);
      const newCacheDepartmentInfos = setAmountZero(state.cacheDepartmentInfos);

      return {
        ...state,
        departmentInfos: newDepartmentInfos,
        cacheDepartmentInfos: newCacheDepartmentInfos,
        totalMoney: 0,
      };
    },

  },

  effects: {
    //sage 查询部门
    * getDeptMenu({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      // 清空缓存
      yield put({
        type: 'set',
        payload: {
          totalMoney: 0,
          departmentInfos: [],
          cacheDepartmentInfos: [],
        },
      });
      const res = yield call(() => AJAX.send(ajaxMap.getDeptMenu, {...payload, companyId: global.companyId}));
      if (res.code === 0) {
        yield put({type: 'set', payload: {departmentInfos: res.data || [], cacheDepartmentInfos: res.data || []}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    //查询积分
    * findBalance({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let moneyId = ''; //ok
      let pageType = '';
      if (window.__themeKey === 'org') {
        moneyId = global.companyId;
        pageType = '1'; //ok
      } else {
        moneyId = global.groupId; //ok
        pageType = '2';
      }
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.findBalance, {...payload, moneyId, pageType})); //ok
      if (res.code === 0) {
        yield put({type: 'set', payload: {showBalance: res.data.showBalance || 0, incomeBalanceQuota: res.data.incomeBalanceQuota || 0}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    //发放配额给部门
    * insertBatchMoneyDeptQuota({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      let moneyId = ''; //ok
      const operationer = `${global.accountId}_${global.realName}`; //ok
      if (window.__themeKey === 'org') {
        moneyId = global.companyId;//ok
      } else {
        moneyId = global.groupId;//ok
      }
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.insertBatchMoneyDeptQuota, {
        ...payload,
        companyId: moneyId, //ok
        accountId: global.accountId, //ok
        operationer, //ok
      }));
      if (res.code === 0) {
        // console.log(res);
      }

      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
  },
};

export default model;
