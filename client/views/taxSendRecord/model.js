import AJAX from 'client/utils/ajax';
import API from 'client/services/taxSendRecord';

const model = {
  namespace: 'taxSendRecord',
  state: {
    condition: {
      pageIndex: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
      orderId: '',
      status: 'null',
      isAdvancedQuery: true,
    },
    // 税筹规划 step4 在次执行
    queryDetailBtnLoad: false, // 查询详情按钮 loading...
    // header-view
    isAdvancedQuery: true,
    startTime: '',
    endTime: '',
    orderId: '',
    status: 'null',
    // table-view
    affix: false, // 表头是否固定了
    tableViewLoading: false,
    dataSource: [],
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    confirmed: 0, // 付快待确认
    fail: 0, // 失败
    success: 0, //成功
    allTotal: 0, // 全部方案
    pendingPayment: 0, // 等待付款
    pendingloan: 0, // 进行中
    // modal-view
    outTradeNo: '',
    title: '系统提示',
    visible: false,
    modalType: 1, // 1 为撤销, 2 为提醒确认
    channelBtnLoading: false, // 确定撤销按钮 loading...
  },
  effects: {
    // 查询发放记录
    * querySendRecord({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          tableViewLoading: true,
        },
      });
      delete payload.isAdvancedQuery;
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const queryData = {};
      for (const key of Object.keys(payload)) {
        if (payload[key] !== null && payload[key].toString().length > 0 && payload[key] !== 'null') {
          queryData[key] = payload[key];
        }
      }

      const res = yield call(() => AJAX.send(API.querySendRecord, {...queryData}));
      if (res && res.code === 0) {
        const { list, statistics } = res.data;
        yield put({
          type: 'updateState',
          payload: {
            dataSource: list,
            pageIndex: res.pageIndex,
            pageSize: res.pageSize,
            total: res.totalCount,
            confirmed: statistics.confirmed,
            fail: statistics.fail,
            success: statistics.success,
            allTotal: statistics.total,
            pendingloan: statistics.pendingloan, // 进行中
            pendingPayment: statistics.pendingPayment,
            startTime: payload.startTime || '',
            endTime: payload.endTime || '',
            orderId: payload.orderId || '',
            status: payload.status || null,
            tableViewLoading: false,
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            tableViewLoading: false,
          },
        });
      }
    },
    // 查询发放记录详情
    * queryDetail({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          queryDetailBtnLoad: true,
        },
      });
      const callback = payload.callback || null;
      delete payload.callback;
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const res = yield call(() => AJAX.send(API.queryDetail, {...payload}));
      if (res && res.code === 0) {
        callback && callback();
        yield put({
          type: 'updateState',
          payload: {
            queryDetailBtnLoad: false,
            data: res.data,
          },
        });
      }
    },
    // 下载方案
    * downScheme({payload}, {call, select}) {
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const { type } = payload;
      delete payload.type;
      // type: 1, 系统方案, type: 2, 自定义方案. 下载
      const res = yield call(() => AJAX.send(type === 1 ? API.downSystemScheme : API.downSelfScheme, {...payload}));
      if (res && res.code === 0) {
        window.location.href = res.data.scheme;
      }
    },
    // 撤销方案
    * revocationScheme({payload}, {call, put, select}) {
      const callback = payload.callback || null;
      delete payload.callback;
      yield put({
        type: 'updateState',
        payload: {
          channelBtnLoading: true,
        },
      });
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const res = yield call(() => AJAX.send(API.revocationScheme, {...payload}));
      if (res && res.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            visible: false,
            channelBtnLoading: false,
          },
        });
        callback && callback();
      } else {
        yield put({
          type: 'updateState',
          payload: {
            channelBtnLoading: false,
          },
        });
      }
    },
    // 结束任务
    * overTask({payload}, {put, call, select}) {
      const app = yield select(state => state.global.account);
      payload.sendMoneyId = app.companyId;

      const currentModel = yield select(state => state.taxSendRecord);

      const res = yield call(() => AJAX.send(API.overTask, {...payload}));
      if (res && res.code === 0) {
        yield put({
          type: 'querySendRecord',
          payload: {
            outTradeNo: currentModel.outTradeNo,
            pageIndex: currentModel.pageIndex,
            pageSize: currentModel.pageSize,
          }
        })
      }
    },
    // 放款
    * sendMoney({payload}, {call, select, put}) {
      const app = yield select(state => state.global.account);
      const currentModel = yield select(state => state.taxSendRecord);
      payload.sendMoneyId = app.companyId;
      const res = yield call(() => AJAX.send(API.sendMoney, {...payload}));
      if (res && res.code === 0) {
        yield put({
          type: 'querySendRecord',
          payload: {
            outTradeNo: currentModel.outTradeNo,
            pageIndex: currentModel.pageIndex,
            pageSize: currentModel.pageSize,
          }
        })
      }
    }
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
