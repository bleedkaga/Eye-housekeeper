import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/dashboard';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';

const model = {

  namespace: 'personnelChangeRecord',

  state: {
    //条件
    condition: {
      pageIndex: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
    },

    //映射参数字典
    __condition: {
      pageIndex: ['number'],
      pageSize: ['number'],
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
    * get(_, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});
      //在这里进行参数的获取
      const {global, personnelChangeRecord} = yield select(state => state);

      //进行浏览器参数刷新
      const result = Mapping.toAjaxQuery(personnelChangeRecord.condition, personnelChangeRecord.__condition); //获取浏览器参数
      RH(null, 'personnelChangeRecord', `/${window.__themeKey}/personnelChangeRecord`, {
        search: result.search,
        replace: true,
      }); //只改变search不会触发组件刷新

      const companyGroupId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok
      const idType = window.__themeKey === 'org' ? 1 : 2;

      const res = yield call(() => AJAX.send(ajaxMap.queryPersonnelChange, {
        ...result.params,
        companyId: companyGroupId, //ok
        type: idType,
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
