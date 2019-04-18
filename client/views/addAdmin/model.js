import AJAX from 'client/utils/ajax';
import ajaxMapDepart from 'client/services/depart';
import ajaxMapAdmin from 'client/services/administrator';

const model = {

  namespace: 'addAdmin',

  state: {
    //选择人员
    manager: {
      pageSize: 10,
      list: [],
      total: 0,
    },
    //选择部门
    department: {
      list: [],
    },

    //选择了的人员
    people: {
      phone: '',
      realName: '',
    },

    //选择了的部门
    deptData: [], //部门数据

    //选择的权限菜单
    menuIds: [], //菜单ids

    scopeControl: 2, //全单位 or 部门
    list: [],
    isLoad: false, //当前是否正在加载
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setManager(state, {payload}) {
      return {...state, manager: {...state.manager, ...payload}};
    },

    setDepartment(state, {payload}) {
      return {...state, department: {...state.department, ...payload}};
    },

    setPeople(state, {payload}) {
      return {...state, people: {...state.people, ...payload}};
    },
  },

  effects: {
    * queryManager({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapDepart.queryManager, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'setManager',
          payload: {list: res.data || [], total: res.totalCount || 0},
        });
      }
    },

    * queryDepartment({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapDepart.queryDepartment, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'setDepartment',
          payload: {list: res.data.dept || []},
        });
      }
    },

    * insertAccount({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMapAdmin.insertAccount, {...payload}));
      if (res.code === 0) {
        callback && callback(res);
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },

    * getAccountId({payload, callback}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapAdmin.getAccountId, {...payload}));
      if (res.code === 0) {
        const {data} = res;
        yield put({
          type: 'setPeople',
          payload: {
            phone: data.phone,
            realName: data.realName,
          },
        });
        yield put({
          type: 'set',
          payload: {
            deptData: data.deptData || [],
            menuIds: data.menuIds ? data.menuIds.split(',').map(v => parseInt(v, 10)) : [],
            scopeControl: data.scopeControl,
          },
        });
      }
      callback && callback(res);
    },

    * updateAccount({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMapAdmin.updateAccount, {...payload}));
      if (res.code === 0) {
        callback && callback(res);
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
