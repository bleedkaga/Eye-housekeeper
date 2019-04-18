import AJAX from 'client/utils/ajax';
// import Tools from 'client/utils/tools';
import API from 'client/services/company';
// import API2 from 'client/services/goodSoGood';
import { CompanyType } from 'client/utils/enums';


const model = {

  namespace: 'company',

  state: {
    //需要的参数对象
    condition: {},
    allCompanyData: {}, //单位信息和工商税务信息
    isLoad: false, //当前是否正在加载
    edit: false, //当前单位信息是否是编辑状态
    editFinance: false, //当前税务信息是否是编辑状态
    companyNameData: [], //工商注册数据源
    isLoadCompanyList: false, //天眼查 加载
    companyTypeList: [], //单位类型
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setCondition(state, {payload}) {
      return {...state, condition: {...state.condition, ...payload}};
    },

  },

  effects: {
    //页面数据
    * getCompanyByIdDetail({payload, callback}, {call, put }) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(API.getCompanyByIdDetail, {...payload}));
      if (res.code === 0) {
        res.data.company.province = `${res.data.company.province}`;
        res.data.company.city = `${res.data.company.city}`;
        res.data.company.area = `${res.data.company.area}`;
        res.data.company.companyType = `${res.data.company.companyType}`;
        yield put({
          type: 'set',
          payload: {
            allCompanyData: res.data || {},
          }});
        //初始化单位名称数据源
        if (res.data.company.companyType === CompanyType.industrialRegistration) {
          const {gsCompanyIndustry = {}} = res.data;
          yield put({
            type: 'set',
            payload: {
              companyNameData: [
                {
                  KeyNo: gsCompanyIndustry.keyNo,
                  Name: res.data.company.companyName,
                  No: gsCompanyIndustry.no,
                },
              ],
            },
          });
        }
      }
      callback && callback(res);
      yield put({type: 'set', payload: {isLoad: false}});
    },

    //天眼查 数据
    * searchCompanyName({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoadCompanyList: true, companyNameData: []}});
      const res = yield call(() => AJAX.send(API.searchCompanyName, {...payload}));
      if (res.code === 0) {
        let list = [];
        try {
          list = JSON.parse(res.data);
        } catch (e) {
          //empty
        }
        yield put({type: 'set', payload: {companyNameData: list}});
      }
      yield put({type: 'set', payload: {isLoadCompanyList: false}});
      callback && callback(res);
    },
    //修改单位信息
    * updateCompany({payload, callback}, {call, put, select }) {
      const { accountId, realName} = yield select(state => state.global.account); //ok
      const { id } = yield select(state => state.company.allCompanyData.company);
      const { gsCompanyIndustry = {}} = yield select(state => state.company.allCompanyData);
      yield put({type: 'set', payload: {isLoad: true}});
      const modifier = `${accountId}_${realName}`; //ok
      const res = yield call(() => AJAX.send(API.updateCompany,
        {
          ...payload,
          id,
          modifier, //ok
          industryId: gsCompanyIndustry.id,
        }));
      callback && callback(res);
      yield put({type: 'set', payload: {isLoad: false}});
    },
    //修改税务信息
    * updateIndustryBaseInfo({payload, callback}, {call, put }) {
      yield put({type: 'set', payload: {isLoad: true}});

      const res = yield call(() => AJAX.send(API.updateIndustryBaseInfo, {...payload }));

      callback && callback(res);
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },

};
export default model;
