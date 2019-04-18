import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/notice';

const model = {

  namespace: 'noticeInventory',

  state: {
    list: [],
    pageIndex: 1,
    totalCount: 0,
    successful: 0,
    failure: 0,
    pageSize: 10,
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
    * get({payload}, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});

      const {pageSize, pageIndex} = yield select(state => state.noticeInventory);

      const res = yield call(() => AJAX.send(ajaxMap.queryDetailedDeliveryRecord, {
        ...payload,
        pageIndex,
        pageSize,
      }));

      if (res.code === 0) {
        const {data} = res;
        yield put({
          type: 'set',
          payload: {
            successful: data.statistical.successful,
            failure: data.statistical.failure,
            list: data.list || [],
            totalCount: res.totalCount,
          },
        });
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

    * resendAllTheInformation({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMap.resendAllTheInformation, {
        ...payload,
      }));
      callback && callback(res);
    },
  },
};

export default model;
