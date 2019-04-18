import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/unionAssetAccount';
// import Tools from 'client/utils/tools';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';

const model = {

  namespace: 'unionAssetAccount',

  state: {
    listOfCash: {}, //接口获取到的现金账户数据
    isLoad: false, //当前是否正在加载
    remainShow: {}, //顶部余额
    paramCash: {
      startDate: '',
      endDate: '',
      channelType: '', //打款渠道
      pageIndex: 1,
      pageSize: 10,
      financialType: '', //财务类型
      status: '', //状态
    },
    __paramCash: {
      startDate: ['string'],
      endDate: ['string'],
      channelType: ['string'],
      pageIndex: ['number'],
      pageSize: ['number'],
      financialType: ['string'],
      status: ['string'],
    },
  },

  reducers: {

    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },
    setParamCash(state, {payload}) { //现金账户的
      const params = Mapping.toParams(payload, state.__paramCash, model.state.paramCash);
      return {...state, paramCash: {...state.paramCash, ...params}};
    },
    resetParamCash(state) {
      return {...state, paramCash: {...model.state.paramCash}};
    },
  },

  effects: {
    * originPullCash({payload}, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});

      // console.log(payload); //这个payload 额外参数传入
      //在这里进行参数的获取
      const {global, unionAssetAccount} = yield select(state => state);

      //进行浏览器参数刷新
      const result = Mapping.toAjaxQuery(unionAssetAccount.paramCash, unionAssetAccount.__paramCash, true); //获取浏览器参数
      RH(null, 'unionAssetAccount', '/union/cloud/unionAssetAccount', {search: result.search, replace: true}); //只改变search不会触发组件刷新

      const res1 = yield call(() => AJAX.send(ajaxMap.originPullCash, {
        ...result.params,
        moneyId: global.account.groupId, //ok
      }));

      if (res1.code === 0) {
        yield put({
          type: 'set',
          payload: {
            listOfCash: res1 || {},
            // totalCount: res.totalCount || 0,
          },
        });
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

    // * originPullCash({payload}, {call, put}) {
    //   yield put({type: 'set', payload: {isLoad: true}});
    //   const res1 = yield call(() => AJAX.send(ajaxMap.originPullCash, {...payload}));
    //   if (res1.code === 0) {
    //     // console.log(res1, 'resresresres11111');
    //     yield put({type: 'set', payload: {listOfCash: res1 || {}}});
    //   }
    //   yield put({type: 'set', payload: {isLoad: false}});
    // },
    * cashExport({payload, callback}, {call, put}) {
      // console.log(payload, '导出payload');
      yield put({type: 'set', payload: {isLoad: true}});
      const res3 = yield call(() => AJAX.send(ajaxMap.cashExport, {...payload}));
      if (res3.code === 0) {
        // console.log(res3, '导出11111');
        if (callback) { callback(res3); }
      // yield put({type: 'set', payload: {listOfCash: res1 || []}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    * remianShow({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      // console.log(payload, 'payloadpayload');
      const res4 = yield call(() => AJAX.send(ajaxMap.remianShow, {...payload}));
      if (res4.code === 0) {
        // console.log(res4, '导出11111');
        // if (callback) { callback(res3); }
        yield put({type: 'set', payload: {remainShow: res4.data || {}}});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
