import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/dashboard';
import ajaxMapWelfareRecords from 'client/services/welfareRecords';
import RH from 'client/routeHelper';

const model = {

  namespace: 'dashboard',

  state: {
    companyGroupId: '', //单位id或者工会id
    companyNameRedundancy: '', //公司名称
    companyNature: 2, //单位性质1工会，2单位
    compnayPerson: 0, //公司人数
    incoming: 0, //入职公司人数
    resigned: 0, //离职人数

    decreaseRatio: 0, //人力成本下降比例
    currentLaborCost: 0, //现人力成本
    originalLaborCost: 0, //原人力成本

    perCapitaDecline: 0, //人均成本下降比例
    currentPerCapitaCost: 0, //现人均成本
    originalPerCapitaCost: 0, //原人均成本

    welfareApprovalCount: 0, //福利审批条数

    isLoad: false, //当前是否正在加载
  },

  reducers: {

    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

  },

  effects: {
    * get({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.gsIndex, {...payload}));
      if (res.code === 0) {
        const obj = res.data.object || res.data || {};
        yield put({type: 'set', payload: {...obj}});

        if ('indexName' in res.data) {
          yield put({type: 'global/setAccount', payload: {realName: res.data.indexName}});
        }
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

    * change({payload = {}}, {put, select}) {
      let {themeKey} = payload;
      const {account = {}, themeKey: tk} = yield select(state => state.global);
      if (!themeKey) themeKey = tk;
      if (themeKey === 'union') {
        //工会
        if (!account.groupId) {
          // return console.log('没有工会，跳转到工会专用页面');
          return RH(null, 'unionInfo', '/union/registerUnion');
        }
        yield put({type: 'get', payload: {companyId: account.groupId, __autoLoading: true}});
      } else {
        yield put({type: 'get', payload: {companyId: account.companyId, __autoLoading: true}});
      }
    },

    * findAuditSendMoneyTask(_, {call, put, select}) {
      const {global} = yield select(state => state);

      const companyGroupId = window.__themeKey === 'org' ? {companyId: global.account.companyId} : {groupId: global.account.groupId};

      const res = yield call(() => AJAX.send(ajaxMapWelfareRecords.findAuditSendMoneyTask, {
        pageIndex: 1,
        pageSize: 1,
        ...companyGroupId,
      }, false));

      if (res.code === 0) {
        yield put({type: 'set', payload: {welfareApprovalCount: res.totalCount || 0}});
      } else {
        yield put({type: 'set', payload: {welfareApprovalCount: 0}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
