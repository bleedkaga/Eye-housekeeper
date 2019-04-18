import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/notice';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';

const model = {

  namespace: 'notice',

  state: {
    //条件
    condition: {
      pageIndex: 1,
      pageSize: 10,
      startDate: '',
      endDate: '',
      type: '',
    },

    //映射参数字典
    __condition: {
      pageIndex: ['number'],
      pageSize: ['number'],
      type: ['number'],
    },

    list: [],
    totalCount: 0, //总数
    isLoad: false, //当前是否正在加载
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
    * get({payload}, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});

      //在这里进行参数的获取
      const {global, notice} = yield select(state => state);
      //进行浏览器参数刷新
      const result = Mapping.toAjaxQuery(notice.condition, notice.__condition); //获取浏览器参数
      RH(null, 'notice', `/${window.__themeKey}/notice`, {
        search: result.search,
        replace: true,
      }); //只改变search不会触发组件刷新


      const res = yield call(() => AJAX.send(ajaxMap.querySendRecord, {
        ...result.params,
        companyId: global.account.companyId, //ok
      }));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {
            list: res.data || [],
            totalCount: res.totalCount || 0,
          },
        });
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
