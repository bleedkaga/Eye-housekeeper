import AJAX from 'client/utils/ajax';
import API from 'client/services/taxList'; //该模块的ajax
import AjaxMapTaskCenter from 'client/services/taskCenter'; //该模块的ajax

const model = {
  namespace: 'taxList',
  state: {
    condition: {
      pageIndex: 1,
      pageSize: 10,
      type: '0',
      queryContent: '',
    },
    affix: false,
    queryContent: '',
    type: '0',
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    tabLoading: false,
    downBtnLoading: false,
    bindBankBtnLoad: false,
    uploadPersonLoad: false,
    bindBankModalVisible: false,
    title: '设置银行账户信息',
    userName: '',
    certificateCode: '',
    openAccount: '',
    reservedPhone: '',
    mappingId: '',
  },
  effects: {
    // 查询名单
    * queryPersonList({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          tabLoading: true,
        },
      });
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId; //ok
      const res = yield call(() => AJAX.send(API.queryPersonInfo, {...payload}));
      if (res && res.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: res.data,
            pageIndex: res.pageIndex,
            pageSize: res.pageSize,
            total: res.totalCount,
            type: payload.type || 0,
            queryContent: payload.queryContent || '',
            tabLoading: false,
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            tabLoading: false,
          },
        });
      }
    },
    // 下载人员信息
    * downloadPersonInfo({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          downBtnLoading: true,
        },
      });
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId; //ok
      const res = yield call(() => AJAX.send(API.downloadPersonInfo, {...payload}));
      if (res && res.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            downBtnLoading: false,
          },
        });
        window.location.href = res.data.url;
      }
    },
    // 绑定银行卡号
    * bindBankNo({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          bindBankBtnLoad: true,
        },
      });
      const callback = payload.callback || null;
      delete payload.callback;
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId; //ok
      const res = yield call(() => AJAX.send(API.bindBankNo, {...payload}));
      if (res && res.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            bindBankBtnLoad: false,
            bindBankModalVisible: false,
          },
        });
        callback && callback();
      } else {
        yield put({
          type: 'updateState',
          payload: {
            bindBankBtnLoad: false,
          },
        });
      }
    },

    //获取保存的所有任务列表
    * getClassification({payload, callback}, {call, select}) {
      const {account} = yield select(state => state.global);
      const res = yield call(() => AJAX.send(AjaxMapTaskCenter.getClassification, {...payload, companyId: account.companyId})); //ok
      callback && callback(res);
    },

    //获取用户任务
    * getUserCustomTask({payload, callback}, {call, select}) {
      const {account} = yield select(state => state.global);
      const res = yield call(() => AJAX.send(AjaxMapTaskCenter.getUserCustomTask, {...payload, companyId: account.companyId})); //ok
      callback && callback(res);
    },

    //添加用户任务
    * addUserCustomTask({payload, callback}, {call, select}) {
      const {account} = yield select(state => state.global);
      const res = yield call(() => AJAX.send(AjaxMapTaskCenter.addUserCustomTask, {...payload, companyId: account.companyId})); //ok
      callback && callback(res);
    },
  },
  reducers: {
    updateState(state, {payload}) {
      return {...state, ...payload};
    },
    reset(state) {
      return {...state, ...model.state};
    },
    setCondition(state, {payload}) {
      return {...state, condition: {...state.condition, ...payload}};
    },
    resetCondition(state) {
      return {...state, condition: {...model.state.condition}};
    },
  },
};

export default model;
