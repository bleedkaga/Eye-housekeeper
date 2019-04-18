import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/depart.js'; //该模块的ajax

const model = {

  namespace: 'depart',

  state: {
    //需要的参数对象
    condition: {},
    list: [],
    isLoad: false, //当前是否正在加载
    departments: [], // 返回部门所以的数据
    Administrator: [], //管理员根据点击树结构而变化的
    LowerAndUpperDepartments: undefined, //上下级单位
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
    //查询部门，构建树结构需要的数据
    * queryDepartment({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.queryDepartment, {...payload, __autoLoading: true, companyGroupId: global.companyId})); //ok
      if (res.code === 0) {
        const departments = [
          {
            id: '0',
            parentId: '0',
            level: 0,
            departmentName: global.companyName, //ok
            companyGroupId: global.companyId, //ok
            staffNumber: res.data.number,
            adminName: global.realName, //ok
            children: res.data.dept,
          },
        ];
        yield put({type: 'set', payload: {departments: departments || []}});
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    // 查询管理员
    * queryAdministrator({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.queryAdministrator, {...payload, companyId: global.companyId})); //ok
      if (res.code === 0) {
        yield put({type: 'set', payload: {Administrator: res.data || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    //查询上下级部门
    * queryLowerAndUpperDepartments({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.queryLowerAndUpperDepartments, {...payload, companyId: global.companyId})); //ok
      if (res.code === 0) {
        yield put({type: 'set', payload: {LowerAndUpperDepartments: res.data || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    //更改部门的名称
    * updateDepartment({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.updateDepartment, {...payload, companyGroupId: global.companyId})); //ok
      if (res.code === 0) {
        yield put({type: 'queryDepartment'});
      }
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
    // 删除部门
    * delDepartment({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.delDepartment, {...payload, companyId: global.companyId})); //ok
      if (res.code === 0) {
        yield put({type: 'queryDepartment'});
      }
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
    //取消管理员
    * deleteDepartmentAdministrator({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      const operationer = `${global.accountId}_${global.realName}`; //ok
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.deleteDepartmentAdministrator,
        {
          ...payload,
          companyId: global.companyId, //ok
          operationer,
        }));
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
    // 取消最外层的管理员
    * deleteAccountById({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      const operationer = `${global.accountId}_${global.realName}`; //ok
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.deleteAccountById, {
        ...payload,
        companyId: global.companyId, //ok
        operationer, //ok
      }));
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
    //新增部门
    * addDepartment({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.addDepartment, {...payload, companyGroupId: global.companyId})); //ok
      if (res.code === 0) {
        yield put({type: 'queryDepartment'});
      }
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
    // 调整部门排序
    * editDepartmentSort({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.editDepartmentSort, {...payload, companyId: global.companyId})); //ok
      if (res.code === 0) {
        yield put({type: 'queryDepartment'});
      }
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
    //批量转移员工
    * departmentDatch({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.departmentDatch, {...payload, companyId: global.companyId})); //ok
      if (res.code === 0) {
        yield put({type: 'queryDepartment'});
      }
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
    //更改上级部门
    * editDepartmentParent({payload}, {call, put, select}) {
      const global = yield select(state => state.global.account);
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.editDepartmentParent, {...payload, companyId: global.companyId})); //ok
      if (res.code === 0) {
        yield put({type: 'queryDepartment'});
      }
      yield put({type: 'set', payload: {isLoad: false}});
      return res;
    },
  },
};

export default model;
