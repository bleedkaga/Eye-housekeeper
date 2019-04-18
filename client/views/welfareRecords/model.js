import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/welfareRecords'; //该模块的ajax
import ajaxMapPublic from 'client/services/public';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';
import Tools from 'client/utils/tools';


const tabCondition = {
  tab1: {
    pageIndex: 1,
    pageSize: 10,
    createTimeStart: '',
    createTimeEnd: '',
    transferReasonName: [],
  },
  tab2: {
    pageIndex: 1,
    pageSize: 10,
    createTimeStart: '',
    createTimeEnd: '',
  },
  tab3: {
    pageIndex: 1,
    pageSize: 10,
    createTimeStart: '',
    createTimeEnd: '',
  },
};

const model = {
  namespace: 'welfareRecords',

  state: {
    tab1: {
      condition: {
        ...tabCondition.tab1,
      },

      __condition: {
        pageIndex: ['number'],
        pageSize: ['number'],
        transferReasonName: ['array', undefined, undefined, {separate: ','}],
      },

      list: [],
      isLoad: false,
      totalCount: 0,
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
      totalCount: 0,
    },


    tab3: {
      condition: {
        ...tabCondition.tab3,
      },
      __condition: {
        pageIndex: ['number'],
        pageSize: ['number'],
      },
      list: [],
      isLoad: false,
      totalCount: 0,
    },


    //获取记录需要的参数对象
    // params: [
    //   {},
    //   {
    //     pageIndex: 1,
    //     pageSize: 10,
    //     createTimeStart: '',
    //     createTimeEnd: '',
    //     sendType: 2,
    //   },
    //   {
    //     pageIndex: 1,
    //     pageSize: 10,
    //     createTimeStart: '',
    //     createTimeEnd: '',
    //     sendType: 1
    //   },
    // ],
    // // 所有列表数据
    // dataList: [],
    // // table页面信息
    // pagination: [{
    //   totalPages: 1,
    //   totalCount: 0,
    // }, {
    //   totalPages: 1,
    //   totalCount: 0,
    // }, {
    //   totalPages: 1,
    //   totalCount: 0,
    // }],

    // 激活的tab
    active: '0',
    isLoad: false, //当前是否正在加载
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },


    setTab(state, {payload, index}) {
      //index 表示是tab几
      return {...state, [`tab${index}`]: {...state[`tab${index}`], ...payload}};
    },

    resetTab(state, {index}) {
      //index 表示是tab几
      return {...state, [`tab${index}`]: {...model.state[`tab${index}`]}};
    },

    setTabCondition(state, {payload, index}) {
      //index 表示是tab几
      const params = Mapping.toParams(payload, state[`tab${index}`].__condition, tabCondition[`tab${index}`], true);
      return {
        ...state,
        [`tab${index}`]: {...state[`tab${index}`], condition: {...state[`tab${index}`].condition, ...params}},
      };
    },

    resetTabCondition(state, {index}) {
      //type 表示是tab几
      return {...state, [`tab${index}`]: {...state[`tab${index}`], condition: {...tabCondition[`tab${index}`]}}};
    },
  },

  effects: {
    //获取tab1数据
    * getTab1Data(_, {call, put, select}) {
      yield put({type: 'setTab', payload: {isLoad: true}, index: 1});
      const {welfareRecords, global, dict} = yield select(state => state);

      const {tab1} = welfareRecords;
      const result = Mapping.toAjaxQuery(tab1.condition, tab1.__condition); //获取浏览器参数

      const [sendMoneyId, companyGroupType, secondPath] = window.__themeKey === 'org' ? [global.account.companyId, 1, 'hr'] : [global.account.groupId, 2, 'spring']; //ok


      //取消的t所以要加上t
      result.search += `&t=${welfareRecords.active}`;
      RH(null, 'welfareRecords', `/${window.__themeKey}/${secondPath}/welfareRecords`, {
        search: result.search,
        replace: true,
      }); //只改变search不会触发组件刷新

      //将ID换成名称
      // result.params.transferReasonName

      const rel = getDictName(dict.releaseReason, tab1.condition.transferReasonName);

      const res = yield call(() => AJAX.send(ajaxMap.sendMoneyTaskList, {
        ...result.params,
        transferReasonName: rel.join('-'),
        sendMoneyId, //ok
        companyGroupType,
      }));
      if (res.code === 0) {
        const {data = [], totalCount} = res;
        yield put({type: 'setTab', payload: {list: data, totalCount}, index: 1});
      }
      yield put({type: 'setTab', payload: {isLoad: false}, index: 1});
    },

    // 审核发放记录，拒绝，通过，撤回
    * auditSendMoneyTask({payload = {}}, {call, select}) {
      const {accountId, realName} = yield select(state => state.global.account); //ok
      const req = {operationer: `${accountId}_${realName}`}; //ok
      ['id', 'status', 'reason'].forEach(key => payload[key] && (req[key] = payload[key]));
      const res = yield call(() => AJAX.send(ajaxMap.auditSendMoneyTask, req));
      // console.log(res);
      return res;
    },

    //获取tab2数据
    * getTab2Data(_, {call, put, select}) {
      yield put({type: 'setTab', payload: {isLoad: true}, index: 2});
      const {welfareRecords, global} = yield select(state => state);

      const {tab2} = welfareRecords;
      const result = Mapping.toAjaxQuery(tab2.condition, tab2.__condition); //获取浏览器参数

      const [sendMoneyId, companyGroupType, secondPath] = window.__themeKey === 'org' ? [global.account.companyId, 1, 'hr'] : [global.account.groupId, 2, 'spring']; //ok

      //取消的t所以要加上t
      result.search += `&t=${welfareRecords.active}`;
      RH(null, 'welfareRecords', `/${window.__themeKey}/${secondPath}/welfareRecords`, {
        search: result.search,
        replace: true,
      }); //只改变search不会触发组件刷新

      const res = yield call(() => AJAX.send(ajaxMap.findMoneyQuotaList, {
        ...result.params,
        sendType: 2, //部门类型
        sendMoneyId, //ok
        companyGroupType,
      }));
      if (res.code === 0) {
        const {data = [], totalCount} = res;
        yield put({type: 'setTab', payload: {list: data, totalCount}, index: 2});
      }
      yield put({type: 'setTab', payload: {isLoad: false}, index: 2});
    },

    //获取tab3数据
    * getTab3Data(_, {call, put, select}) {
      yield put({type: 'setTab', payload: {isLoad: true}, index: 3});
      const {welfareRecords, global} = yield select(state => state);

      const {tab3} = welfareRecords;
      const result = Mapping.toAjaxQuery(tab3.condition, tab3.__condition); //获取浏览器参数

      const [sendMoneyId, companyGroupType, secondPath] = window.__themeKey === 'org' ? [global.account.companyId, 1, 'hr'] : [global.account.groupId, 2, 'spring']; //ok

      //取消的t所以要加上t
      result.search += `&t=${welfareRecords.active}`;
      RH(null, 'welfareRecords', `/${window.__themeKey}/${secondPath}/welfareRecords`, {
        search: result.search,
        replace: true,
      }); //只改变search不会触发组件刷新

      const res = yield call(() => AJAX.send(ajaxMap.findMoneyQuotaList, {
        ...result.params,
        sendType: 1, //单位类型
        sendMoneyId, //ok
        companyGroupType,
      }));
      if (res.code === 0) {
        const {data = [], totalCount} = res;
        yield put({type: 'setTab', payload: {list: data, totalCount}, index: 3});
      }
      yield put({type: 'setTab', payload: {isLoad: false}, index: 3});
    },

    // 获取列表数据
    * getData({payload}, {call, put, select}) {
      const {active, params} = yield select(state => state.welfareRecords);
      const reqData = {...params[active], ...payload};
      const req = {};
      Object.keys(reqData).forEach((key) => {
        reqData[key] && (req[key] = reqData[key]);
      });
      // active === '0' && (req.transferReasonId = 'a111');
      yield put({type: 'set', payload: {tableLoading: true}});
      const res = yield call(() => AJAX.send(ajaxMap.data[active], req));
      if (res.code === 0) {
        const {data, totalCount, totalPages} = res;
        yield put({type: 'setData', payload: {data, pagination: {totalCount, totalPages}}});
      }
      // yield put({type: 'set', payload: {tableLoading: false}});
    },

    // 获取原因
    * getReason({payload = {}}, {call, put}) {
      const {parentId} = payload;
      const req = {};
      // parentId ? req.dict_code = 'releaseReason':req.dict_codes = 'releaseReason';
      req[parentId ? 'dict_code' : 'dict_codes'] = 'releaseReason';
      if (parentId) {
        req.isLeaf = payload.isLeaf || false;
        req.parentId = parentId;
      }
      const res = yield call(() => AJAX.send(ajaxMapPublic[parentId ? 'findSecondValList' : 'findFirstValList'], req));
      // console.log(res);
      if (res.code === 0 && res.data) {
        yield put({
          type: 'setReasonList',
          payload: {
            data: res.data.releaseReason || res.data,
            ...payload,
          },
        });
        return res.data.releaseReason || res.data;
        // const { reasonList } = yield select(state => state.welfareRecords);
        // const {checked} = payload;
        // // console.log(reasonList);
        // return {reasonList, checked};
      }
    },

    // 获取清单数据
    * getCheckList({payload = {}}, {call, put, select}) {
      const {active} = yield select(state => state.welfareRecords);
      const req = {};
      Object.keys(payload).forEach(key => payload[key] && (req[key] = payload[key]));
      req.pageIndex = parseInt(payload.pageIndex, 10);
      req.pageSize = parseInt(payload.pageSize, 10);
      const res = yield call(() => AJAX.send(ajaxMap.checkList[active], req));
      if (res.code === 0) {
        const {data, totalCount} = res;
        yield put({type: 'set', payload: {checklistData: data, checkListTotalCount: totalCount}});
      }
      // console.log(res);
    },

    // 获取导出地址
    //以后下面这个狗B写法不准在出现
    * getExportUrl({payload = {}}, {call, select}) {
      const {active} = yield select(state => state.welfareRecords);
      const keys = active === '0' ? ['userName', 'mobilePhone', 'outTradeNo'] : ['companyId', 'recordId'];
      const req = {};
      active !== '0' && (req.companyId = yield select(state => state.global.account[window.__themeKey === 'org' ? 'companyId' : 'groupId'])); //ok
      active === '1' && (req.type = 2);
      active === '2' && (req.type = 1);
      Object.keys(payload).forEach(key => keys.indexOf(key) !== -1 && payload[key] && (req[key] = payload[key]));
      const res = yield call(() => AJAX.send(ajaxMap.exports[active], req));
      if (res.code === 0) {
        return res.data.url;
      }
    },
  },
};

const getDictName = (arr, values) => {
  let temp = arr;
  const rel = [];
  values.forEach((v) => {
    const item = temp.find(o => o.value === v);
    if (item) {
      temp = item.children || [];
      rel.push(item.label);
    }
  });
  return rel;
};

export default model;
