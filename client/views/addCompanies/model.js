import AJAX from 'client/utils/ajax';
import ispublic from 'client/services/public';
import isAddcompany from 'client/services/addCompany';
// import Tools from 'client/utils/tools';

const model = {

  namespace: 'addCompany',

  state: {
    companyNameLoading: false, //加载标志位
    resData: {},
    industry: [], //第一次行业信息
    unitNatureCode: [], //单位类型
    unitType: [], //工商属性
    secondIndustry: [], //第二次行业信息
    companyName: [], //搜索公司名的结果
    param: {
      socialTypeOne: '',
      socialType: '',
      companyType: '2',
      province: '',
      city: '',
      area: '',
      streetTown: '',
      keyNo: '',
      no: '',
      creditCode: '',
    },
  },

  reducers: {

    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },
    changeParam(state, {payload}) {
      return {
        ...state,
        param: {
          ...state.param,
          ...payload,
        },
      };
    },

  },

  effects: {
    * loadRequest({payload}, {call, put}) { //页面进入加载
      // console.log(payload, 'payload===========>');
      const res = yield call(() => AJAX.send(ispublic.findFirstValList, {...payload}));
      // const aaa = yield select(state => state.addCompany.secondIndustry);
      // console.log(aaa, 'aaa===========>');
      if (res.code === 0) {
        // console.log(res, 'rrrrrrrrrrrrrrr');
        const resData = res.data;
        const newindustry = resData.industry;
        const industry = newindustry.map(item => ({value: item.dicval, label: item.dicname, isLeaf: false}));
        // console.log(industry, '新的数组11111');
        yield put({
          type: 'set',
          payload: {
            industry: industry || [],
            unitNatureCode: resData.unitNatureCode || [],
            unitType: resData.unitType || [],
          }});
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
    * secondPll({payload, selectedOptions}, {call, put}) { //二级拉取
      const [obj] = selectedOptions;
      const res = yield call(() => AJAX.send(ispublic.findSecondValList, {...payload}));
      if (res.code === 0) {
        // console.log(res, 'iiiiiiiiiiiiiii');
        const resData = res.data;
        const secondIndustry = resData.map(item => ({value: item.dicval, label: item.dicname, isLeaf: true}));
        obj.children = secondIndustry;

        yield put({
          type: 'set',
          payload: {
            secondIndustry: secondIndustry || [],
            // industry: obj,
          }});
      }
    },
    * searchCompanyName({payload}, {call, put}) { //搜索公司名称
      yield put({type: 'set', payload: {companyNameLoading: true, companyName: []}});
      const res = yield call(() => AJAX.send(isAddcompany.searchCompanyName, {...payload}));
      if (res.code === 0) {
        let resdata = [];
        try {
          resdata = JSON.parse(res.data);
        } catch (e) {
          //empty
        }
        yield put({
          type: 'set',
          payload: {companyName: resdata || []},
        });
      }
      yield put({type: 'set', payload: {companyNameLoading: false}});
    },
    * sbumit({payload, callback}, {call, select}) { //新增单位提交
      const param = yield select(state => state.addCompany.param);
      const newParam = Object.assign(payload, param);
      const res = yield call(() => AJAX.send(isAddcompany.submitAdd, {...newParam}));
      if (res.code === 0) {
        callback && callback(res);
      }
    },
  },
};

export default model;
