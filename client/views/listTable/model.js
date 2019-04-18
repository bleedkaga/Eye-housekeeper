import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/staff';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';


const model = {

  namespace: 'listTable',

  state: {
    //条件
    condition: {
      pageIndex: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
      keywords: '',
      array: undefined,
    },


    //映射参数字典
    __condition: {
      /**
       * 目前第一个参数为类型（目前有3种 string | number | array）默认为 undefined
       * 第二个为解析函数
       * 第三个为反解析函数
       * 第四个为覆盖config
       */
      pageIndex: ['number'],
      pageSize: ['number'],
      array: ['array', (str, opt, dv) => {
        if (!Mapping.verify(str, opt)) return dv;
        const arr = str.split(opt.separate);
        return arr.map(o => parseFloat(o));
      },

      undefined,

      {
        separate: ',', //数组转数字分隔符
        quarantine: ['', undefined, null, 'undefined', 'null'], //等于这个值进行隔离
      },
      ],
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

    setCondition(state, {payload, other}) {
      console.log(other); //other值这么拿， 看需求进行添加
      //参数初始化
      const params = Mapping.toParams(payload, state.__condition, model.state.condition);
      return {...state, condition: {...state.condition, ...params}};
    },

    //这个主要是 非回退操作 的参数还原操作
    resetCondition(state) {
      return {...state, condition: {...model.state.condition}};
    },
  },

  effects: {
    * getData({payload}, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});

      console.log(payload); //这个payload 额外参数传入

      //在这里进行参数的获取
      const {global, listTable} = yield select(state => state);

      //进行浏览器参数刷新
      const result = Mapping.toAjaxQuery(listTable.condition, listTable.__condition, true); //获取浏览器参数
      RH(null, 'listTable', '/org/listTable', {search: result.search, replace: true}); //只改变search不会触发组件刷新

      const res = yield call(() => AJAX.send(ajaxMap.queryUserStatus, {
        ...result.params,
        companyId: global.account.companyId,
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
