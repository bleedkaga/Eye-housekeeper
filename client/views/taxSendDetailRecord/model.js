import AJAX from 'client/utils/ajax';
import API from 'client/services/taxSendRecord';

const model = {
  namespace: 'taxSendDetailRecord',
  state: {
    condition: {
      outTradeNo: '',
      pageIndex: 1,
      pageSize: 10,
    },
    affix: false,
    dataSource: [],
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    status: '',
    outTradeNo: '',
    scheme: '1',
    queryDetailBtnLoad: false,
    //
    didNotPass: 0,
    personCount: 0,
    qualifiedCount: 0,
    qualifyingAmount: 0,
    serviceCharge: 0,
    totalMoney: 0,
    totalAmount: 0,
    wrongAmount: 0,
    //
    recordsId: '',
    sendAgenBtnLoad: false,
  },
  effects: {
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
        const { data } = res;
        callback && callback();
        yield put({
          type: 'updateState',
          payload: {
            total: res.totalCount,
            pageIndex: res.pageIndex,
            pageSize: res.pageSize,
            queryDetailBtnLoad: false,
            dataSource: data.list,
            //
            didNotPass: data.didNotPass,
            personCount: data.personCount,
            qualifiedCount: data.qualifiedCount,
            qualifyingAmount: data.qualifyingAmount,
            serviceCharge: data.serviceCharge,
            totalMoney: data.total,
            totalAmount: data.totalAmount,
            wrongAmount: data.wrongAmount,
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            queryDetailBtnLoad: false,
          },
        });
      }
    },
    // 再次执行
    * sendAgen({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          sendAgenBtnLoad: true,
        },
      });
      const callback = payload.callback || null;
      delete payload.callback;
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const res = yield call(() => AJAX.send(API.queryDetail, {...payload}));
      if (res && res.code === 0) {
        const { data } = res;
        let recordsId = '';
        if (payload.status === '-2' && payload.pageSize >= 100) {
          if (data.list && data.list.length > 0) {
            data.list.map((item, index) => { // eslint-disable-line
              if (data.list.length - 1 === index) {
                recordsId += item.id;
              } else {
                recordsId += `${item.id},`;
              }
            });
          }
        }
        const _res = yield call(() => AJAX.send(API.sendAgen, {recordsId, ...payload}));
        if (_res && _res.code === 0) {
          yield put({
            type: 'updateState',
            payload: {
              sendAgenBtnLoad: false,
            },
          });
          callback && callback();
        } else {
          yield put({
            type: 'updateState',
            payload: {
              sendAgenBtnLoad: false,
            },
          });
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            sendAgenBtnLoad: false,
          },
        });
      }
    },
    // 放款给个人
    * sendMoneyToOne({payload}, {call, put, select}) {
      const app = yield select(state => state.global.account);
      const currentModel = yield select(state => state.taxSendDetailRecord);
      payload.sendMoneyId = app.companyId;
      const callback = payload.callback || null;
      delete payload.callback;
      const res = yield call(() => AJAX.send(API.sendMoneyToOne, {...payload}));
      if (res && res.code === 0) {
        callback && callback();
        yield put({
          type: 'queryDetail',
          payload: {
            outTradeNo: currentModel.outTradeNo,
            pageIndex: currentModel.pageIndex,
            pageSize: currentModel.pageSize,
            scheme: currentModel.scheme,
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
