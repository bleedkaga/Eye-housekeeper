import AJAX from 'client/utils/ajax';
import ajaxMapPublic from 'client/services/public';
import ajaxMap from 'client/services/staff';

const MAX_NUM = 10; //一次性最多导入多少个

const model = {
  namespace: 'importStaff',

  state: {
    downloadUrl: '',
    downloadName: '',
    list: [],
    totalList: [],
    isLoad: false, //当前是否正在加载
    isTableLoad: false, //当前是否正在加载
    isImportLoad: false, //当前是否正在导入
    total: 0,
    currentTotal: 0,
    pageSize: 10,
    pageIndex: 1,
    success: 0, //成功条数
    failure: 0, //失败条数
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    getList(state, {payload}) {
      const {pageSize, totalList} = state;
      const size = payload.pageSize || pageSize;
      const {pageIndex} = payload;
      const list = totalList.slice(
        (pageIndex - 1) * size,
        pageIndex * size,
      );
      return {...state, list, pageIndex, pageSize: size};
    },
  },

  effects: {
    * getDownloadTemplate({payload}, {call, put}) {
      // yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMapPublic.getDownloadTemplate, {...payload}));
      if (res.code === 0) {
        const {url} = res.data;
        const temp = url.split('/');
        const name = temp[temp.length - 1];
        yield put({type: 'set', payload: {downloadUrl: url, downloadName: name}});
      }
    },

    * tryList({payload}, {call, put, select}) {
      const isEnd = payload.isEnd;
      delete payload.isEnd;
      yield put({type: 'set', payload: {isTableLoad: true, pageIndex: payload.pageIndex}});
      const {accountId} = yield select(state => state.global.account); //ok
      const res = yield call(() => AJAX.send(ajaxMap.uploadDataList, {
        type: payload.type,
        startNo: 1,
        endNo: 1,
        companyId: payload.companyId, //ok
        workerId: accountId, //ok
      }, !isEnd));

      if (res.code === 0) {
        const total = res.totalCount || 0;
        const res2 = yield call(() => AJAX.send(ajaxMap.uploadDataList, {
          type: payload.type,
          startNo: 1,
          endNo: total,
          companyId: payload.companyId, //ok
          workerId: accountId, //ok
        }, !isEnd));

        const list = res2.data.list || [];

        list.sort(a => (a.state === 1 ? -1 : 1));
        const {statistics = {}} = res2.data;
        const {failure, success} = statistics;
        if (isEnd) {
          const endTotal = failure || list.length; //如果发现failure为0，list有值的情况，强制设置currentTotal为length
          yield put({
            type: 'set',
            payload: {totalList: list, total, currentTotal: endTotal, success, failure: endTotal},
          });
        } else {
          yield put({type: 'set', payload: {totalList: list, total, currentTotal: total, success, failure}});
        }

        // yield put({type: 'set', payload: {totalList: list, total, currentTotal: total}});

        yield put({type: 'getList', payload: {pageIndex: payload.pageIndex}});
      }
      yield put({type: 'set', payload: {isTableLoad: false}});
    },

    * list({payload}, {call, put, select}) {
      const isEnd = payload.isEnd;
      delete payload.isEnd;

      yield put({type: 'set', payload: {isTableLoad: true, pageIndex: payload.pageIndex}});
      const { accountId } = yield select(state => state.global.account); //ok
      const {total} = yield select(state => state.importStaff);

      const res = yield call(() => AJAX.send(ajaxMap.uploadDataList, {
        type: payload.type,
        startNo: 1,
        endNo: total,
        companyId: payload.companyId, //ok
        workerId: accountId, //ok
      }));

      if (res.code === 0) {
        const list = res.data.list || [];
        list.sort(a => (a.state === 1 ? -1 : 1));
        const {statistics = {}} = res.data;
        const {failure, success} = statistics;

        if (isEnd) {
          const endTotal = failure || list.length; //如果发现failure为0，list有值的情况，强制设置currentTotal为length
          yield put({
            type: 'set',
            payload: {totalList: list, total, currentTotal: endTotal, success, failure: endTotal},
          });
        } else {
          yield put({type: 'set', payload: {totalList: list, total, currentTotal: total, success, failure}});
        }

        yield put({type: 'getList', payload: {pageIndex: payload.pageIndex}});
      }
      yield put({type: 'set', payload: {isTableLoad: false}});
    },

    //更新用户信息
    * updateTemporaryData({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMap.updateTemporaryData, {...payload}));
      callback && callback(res);
    },

    //导入
    * startBulkImport({payload, callback}, {call, put, select}) {
      yield put({type: 'getList', payload: {pageIndex: 1, pageSize: MAX_NUM}});

      const {list, totalList, currentTotal} = yield select(state => state.importStaff);

      const ids = list.map(item => item.id);

      const res = yield call(() => AJAX.send(ajaxMap.startBulkImport, {
        id: ids.join(','),
        ...payload,
      }, false));

      //成功
      if (res.code === 0) {
        //totalList 消除数据
        totalList.splice(0, MAX_NUM);
        let t = currentTotal - MAX_NUM;
        if (t < 0) t = 0;
        const {statistics = {}} = res.data;

        yield put({
          type: 'set',
          payload: {totalList, currentTotal: t, success: statistics.success, failure: statistics.failure},
        });
      }

      callback && callback(res, totalList);
    },

    //清空
    * uploadDataEmpty({payload, callback}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMap.uploadDataEmpty, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {totalList: [], list: [], total: 0, currentTotal: 0, pageIndex: 1, pageSize: 10},
        });
      }
      callback && callback(res);
    },
  },
};

export default model;
