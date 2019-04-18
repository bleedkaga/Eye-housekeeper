import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/welfareRecords';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';
import {message} from "antd/lib/index";

// noinspection JSAnnotator
const model = {
  namespace: 'welfareApproval',

  state: {
    condition: {
      pageIndex: 1,
      pageSize: 10,
    },

    __condition: {
      pageIndex: ['number'],
      pageSize: ['number'],
    },

    list: [],
    totalCount: 0, //总数
    isLoad: false,
    isWALoading: false,
    pList: [],
    isPLoad: false,
    totalPCount: 0,
    pCurrent: 1,
    pPageSize: 10,
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setCondition(state, {payload}) {
      const params = Mapping.toParams(payload, state.__condition, model.state.condition);
      return {...state, condition: {...state.condition, ...params}};
    },

    resetCondition(state) {
      return {...state, condition: {...model.state.condition}};
    },
  },

  effects: {
    // 获取列表数据
    * getData(_, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const {global, welfareApproval} = yield select(state => state);

      const result = Mapping.toAjaxQuery(welfareApproval.condition, welfareApproval.__condition);

      RH(null, 'welfareApproval', `/${window.__themeKey}/welfareApproval`, {search: result.search, replace: true});
      const companyGroupId = window.__themeKey === 'org' ? {companyId: global.account.companyId} : {groupId: global.account.groupId}; //ok
      const res = yield call(() => AJAX.send(ajaxMap.findAuditSendMoneyTask, {
        ...result.params,
        ...companyGroupId,//ok
      }));
      if (res.code === 0) {
        yield put({type: 'set', payload: {list: res.data || [], totalCount: res.totalCount || 0}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

    //获取人员数据
    * getPData({payload}, {call, put, select}) {
      yield put({type: 'set', payload: {isPLoad: true}});
      const {welfareApproval} = yield select(state => state);
      const res = yield call(() => AJAX.send(ajaxMap.checkList[0], {
        ...payload,
        pageIndex: welfareApproval.pCurrent,
        pageSize: welfareApproval.pPageSize,
      }));
      if (res.code === 0) {
        yield put({type: 'set', payload: {pList: res.data || [], totalPCount: res.totalCount || 0}});
      }

      yield put({type: 'set', payload: {isPLoad: false}});
    },

    // 审核发放记录，拒绝，通过，撤回
    * auditSendMoneyTask({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isWALoading: true}});
      const res = yield call(() => AJAX.send(ajaxMap.auditSendMoneyTask, {
        ...payload,
      }));
      if (res.code === 0) {
        callback && callback(res);
      }
      yield put({type: 'set', payload: {isWALoading: false}});
    },
  },
};

export default model;
