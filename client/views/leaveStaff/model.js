import AJAX from 'client/utils/ajax';
import API from 'client/services/leaveStaff';
// import ajaxMapPublic from 'client/services/public';
// import Tools from 'client/utils/tools';
import APIDepart from 'client/services/depart';
// import { message } from 'antd';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';

const model = {

  namespace: 'leaveStaff',

  state: {
    //需要的参数对象查询
    condition: {
      pageIndex: 1,
      pageSize: 10,
      condition: '', //姓名电话证件号
      depamtId: '', //选择部门
    },
    __condition: {
      pageIndex: ['number'],
      pageSize: ['number'],
      condition: ['string'],
      depamtId: ['string'],
    },
    userLeaveList: [], //离职人员数据
    department: [], //工作部门树---基础查询所选部门
  },

  effects: {


    //查询部门列表 -----调用接口（queryDepartment）
    * queryDepartment({ payload }, { call, put }) {
      const res = yield call(() => AJAX.send(APIDepart.queryDepartment, {...payload}));
      if (res.data && res.data.dept) {
        yield put({
          type: 'set',
          payload: {department: getTreeData(res.data.dept || [])},
        });
      }
    },

    //离职人员信息
    * checkOutResignationStaff({payload}, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});
      //在这里进行参数的获取
      const { leaveStaff} = yield select(state => state);
      //进行浏览器参数刷新
      const result = Mapping.toAjaxQuery(leaveStaff.condition, leaveStaff.__condition, true); //获取浏览器参数
      RH(null, 'leaveStaff', '/org/hr/leaveStaff', {search: result.search, replace: true}); //只改变search不会触发组件刷新
      const params = {
        ...result.params,
        ...payload,
      };
      const res = yield call(() => AJAX.send(API.checkOutResignationStaff, {...params }));
      if (res.code === 0) {
        // 修改key 值为id 表单的key值
        const userLeaveList = res.data.map((item) => {
          item.key = item.id;
          return item;
        });

        yield put({
          type: 'set',
          payload: {
            userLeaveList: userLeaveList || [],
            totalCount: res.totalCount || 0,
          },
        });
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
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
    setDepartment(state, {payload}) {
      if ('departmentCode' in payload && !payload.departmentCode) {
        payload.departmentCode = undefined;
        state.tab2.departmentCode = undefined;
      }
      if ('natureWork' in payload && !payload.natureWork) {
        payload.natureWork = undefined;
        state.tab2.natureWork = undefined;
      }
      return {...state, tab2: {...state.tab2, ...payload}};
    },

  },

};

const getTreeData = data => data.map((item) => {
  if (Array.isArray(item.children) && item.children.length) {
    return {
      title: item.departmentName,
      value: item.id,
      key: item.id,
      children: getTreeData(item.children),
    };
  }
  return {
    title: item.departmentName,
    value: item.id,
    key: item.id,
  };
});
export default model;
