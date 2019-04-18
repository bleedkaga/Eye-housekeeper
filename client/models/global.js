import Config from 'client/config';
// import Md5 from 'client/utils/md5';
// import Tools from 'client/utils/tools';
import Weight from 'client/utils/weight';
import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/goodSoGood';
import ajaxMapPublic from 'client/services/public';

const model = {
  namespace: 'global',

  state: {
    themeKey: 'org',
    account: {},
    menuArray: [],
    menuUpdate: false,
    companies: [], //公司列表
    tokenVfcode: '',

    industry: [], //行业类型
    unitNatureCode: [], //单位类型
    unitType: [], //工商属性

    areaAddressData: [],

    isLoad: false,
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },
    setLogin(state, {payload}) {
      return {...state, ...payload};
    },
    setMenuArray(state, {payload}) {
      const {menuArray = []} = payload;
      window.localStorage[Config.menuKey] = JSON.stringify(menuArray);
      Weight.resetWeightMap(menuArray);
      return {...state, ...payload, menuUpdate: true};
    },
    setCompanies(state, {payload}) {
      const {companies = []} = payload;
      window.localStorage[Config.companyKey] = JSON.stringify(companies);
      return {...state, ...payload};
    },
    setCompany(state, {payload}) {
      const {companyName, companyId} = payload;

      return {
        ...state,
        account: {
          ...state.account,
          companyName,
          companyId,
        },
      };
    },
    setAccount(state, {payload}) {
      return {
        ...state,
        account: {
          ...state.account,
          ...payload,
        },
      };
    },
  },

  effects: {
    * getVfCodePhoneToken(_, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMap.getVfCodePhoneToken, {}, false));
      if (res.code === 0) {
        yield put({type: 'set', payload: {tokenVfcode: res.data || ''}});
      } else {
        yield put({type: 'set', payload: {tokenVfcode: ''}});
      }
    },

    * verificationCodeCheck({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.verificationCodeCheck, {...payload}));
      if (res.code === 0) {
        callback && callback(res);
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },

    * menuList({payload, callback}, {call, put}) {
      const menuArray = payload.menuArray;
      delete payload.menuArray;
      const res = yield call(() => AJAX.send(ajaxMapPublic.menuList, {...payload}));

      if (res.code === 0) {
        yield put({type: 'setMenuArray', payload: {menuArray: res.data || []}});
      } else if (menuArray) {
        yield put({type: 'setMenuArray', payload: {menuArray: menuArray || []}});
      }

      callback && callback(res);
    },

    * findFirstValListNoAll({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.findFirstValListNoAll, {...payload}));


      if (res.code === 0) {
        const {unitType = [], unitNatureCode = [], industry = []} = res.data;

        yield put({
          type: 'set',
          payload: {
            unitType: formatDicList(unitType),
            unitNatureCode: formatDicList(unitNatureCode),
            industry: formatDicList(industry, true),
          },
        });
      }
    },

    * findFirstValList({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.findFirstValList, {...payload}));
      if (res.code === 0) {
        const {data = {}} = res;
        yield put({type: 'set', payload: {industry: formatValList(null, data.industry || [])}});
      }
    },

    * findSecondValList({payload}, {call, put, select}) {
      const item = payload.selectedOptions.pop();
      item.loading = true;
      delete payload.selectedOptions;
      const {industry} = yield select(state => state.global);
      yield put({type: 'set', payload: {industry}});
      const res = yield call(() => AJAX.send(ajaxMapPublic.findSecondValList, {...payload, parentId: item.value}));
      if (res.code === 0) {
        formatValList(item, res.data, false);
        yield put({type: 'set', payload: {industry}});
      }
    },

    * findProvince({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.findProvince, {...payload}));
      if (res.code === 0) {
        yield put({type: 'set', payload: {areaAddressData: formatPCAS(null, res.data)}});
      }
    },
    * findCity({payload, callback}, {call, put, select}) {
      const item = payload.selectedOptions.pop();
      item.loading = true;
      delete payload.selectedOptions;
      const {areaAddressData} = yield select(state => state.global);
      yield put({type: 'set', payload: {areaAddressData}});
      const res = yield call(() => AJAX.send(ajaxMapPublic.findCity, {adcode: item.value}));
      if (res.code === 0) {
        formatPCAS(item, res.data);
        yield put({type: 'set', payload: {areaAddressData}});
        callback && callback();
      }
    },
    * findArea({payload, callback}, {call, put, select}) {
      const item = payload.selectedOptions.pop();
      const end = payload.end || false;
      item.loading = true;
      delete payload.selectedOptions;
      delete payload.end;

      const {areaAddressData} = yield select(state => state.global);
      yield put({type: 'set', payload: {areaAddressData}});
      const res = yield call(() => AJAX.send(ajaxMapPublic.findArea, {adcode: item.value}));
      if (res.code === 0) {
        formatPCAS(item, res.data, !end);
        yield put({type: 'set', payload: {areaAddressData}});
        callback && callback();
      }
    },
    * findStreet({payload, callback}, {call, put, select}) {
      const item = payload.selectedOptions.pop();
      item.loading = true;
      delete payload.selectedOptions;
      const {areaAddressData} = yield select(state => state.global);
      yield put({type: 'set', payload: {areaAddressData}});
      const res = yield call(() => AJAX.send(ajaxMapPublic.findStreet, {adCode: item.value}));
      if (res.code === 0) {
        formatPCAS(item, res.data, false);
        yield put({type: 'set', payload: {areaAddressData}});
        callback && callback();
      }
    },

    //用户是否注册
    * checkIfTheUserExists({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMap.checkIfTheUserExists, {...payload}));
      callback && callback(res);
    },

    //权限验证
    * checkIfThePayrollIsOpen({payload, callback}, {call, put, select}) {
      const {account} = yield select(state => state.global);
      const res = yield call(() => AJAX.send(ajaxMapPublic.checkIfThePayrollIsOpen, {
        companyId: account.companyId,
        ...payload,
      }));
      if (res.code === 0) {
        if (res.data.permission === 2) {
          yield put({
            type: 'setAccount',
            payload: {
              permission: res.data.permission,
              startTime: res.data.startTime,
              endTime: res.data.endTime,
            },
          });
        } else {
          yield put({type: 'setAccount', payload: {permission: res.data.permission}});
        }
      }
      callback && callback(res);
    },

    //购买VIP
    * subscribeToAService({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.subscribeToAService, {...payload}));
      callback && callback(res);
    },
    //微信 支付宝在线充值
    * onlineRechargePrepay({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.onlineRechargePrepay, {...payload}));
      callback && callback(res);
    },
    //检查支付是否成功
    * checkPayIsSuccess({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.checkPayIsSuccess, {...payload}));
      callback && callback(res);
    },
    //单位线下充值
    * offlineFinance({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.offlineFinance, {...payload}));
      callback && callback(res);
    },

    //获取公司列表
    * getListOfManagementCompany({payload, callback}, {call, put, select}) {
      const {account: {phone}} = yield select(state => state.global);
      const res = yield call(() => AJAX.send(ajaxMap.getListOfManagementCompany, {...payload, phone}));
      if (res.code === 0) {
        yield put({type: 'setCompanies', payload: {companies: res.dataLogin || []}});
      }
      callback && callback(res);
    },
  },
};

const formatDicList = (arr = [], isLeaf) => arr.map((item) => {
  const opt = {label: item.label || item.dicname, value: item.value || item.dicval};
  isLeaf !== undefined && (opt.isLeaf = !isLeaf);
  return opt;
});

const formatValList = (item, temp, isLeaf = true) => {
  const arr = [];
  if (Array.isArray(temp)) {
    temp.forEach((o) => {
      arr.push({
        label: o.dicname,
        value: o.dicval,
        isLeaf: !isLeaf,
      });
    });
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr;
};

const formatPCAS = (item, str, isLeaf = true) => {
  let arr = [];
  if (typeof str === 'string') {
    const temp = str.split(';');
    temp.forEach((o) => {
      const d = o.split(',');
      arr.push({
        label: d[0],
        value: d[1],
        isLeaf: !isLeaf,
      });
    });
  } else if (Array.isArray(str) && str[0] && str[0].areaName) {
    str.forEach((d) => {
      arr.push({
        label: d.areaName,
        value: d.adcode,
        isLeaf: !isLeaf,
      });
    });
  } else {
    arr = str;
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr || [];
};

export default model;
