import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/goodSoGood';

const model = {

  namespace: 'register',

  state: {
    step1: {
      phone: '',
      vfcode: '',
      agree: true,
    },
    step2: {
      editPassword: '',
      affirmPassword: '',
    },
    step3: {
      companyType: undefined, //单位类型 1表示工商，2表示非工商
      uniformCreditCode: '', //社会统一信用代码  如果是非工商才会传这个字段过来，界面才会显示这个输入框

      socialTypeArr: undefined, //行业
      // socialTypeOne:xx123                  //行业类型
      // socialType:dfasd                     //行业类型1     子集
      realName: '', //联系人
      contactPhone: '', //联系人电话
      email: '', //邮箱

      areaAddress: undefined,
      province: '', //省
      city: '', //市
      area: '', //区
      streetTown: '', //街道/乡镇
      address: '', //详细地址

      serviceManagerPhone: '', //服务经理手机
      serviceManager: '', //服务经理名

      companyName: undefined, //单位名称

      unitNatureCode: undefined,

      //creditCode 新增参数
      // keyNo:c3fb6cff41832cf9af434c74af6bc1d6        //企查查 keyno
      // no:91500108MA5U4JRQ1G                         //企查查 no
      /*
         oldCompanyId :  xxxafda    //单位id，只有旧用户在完善资料的时候才有会这个东西
        createtime :  2018-06-06  //单位创建时间，只有旧用户在完善资料的时候才有会这个东西
        oldCompanyId:003349B4BA074405B5B1280A121AC22E //老数据的公司id 不填为自己注册 如果填了则走导入旧数据导入流程
       */
    },

    oldUser: {}, //老用户

    companyList: [],
    isLoadCompanyList: false, //天眼查 加载

    isLoad: false, //当前是否正在加载
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setStep1(state, {payload}) {
      return {
        ...state,
        step1: {
          ...state.step1,
          ...payload,
        },
      };
    },
    setStep2(state, {payload}) {
      return {
        ...state,
        step2: {
          ...state.step2,
          ...payload,
        },
      };
    },
    setStep3(state, {payload}) {
      return {
        ...state,
        step3: {
          ...state.step3,
          ...payload,
        },
      };
    },

    setOldUser(state, {payload}) {
      //单位类型 1表示工商，2表示非工商
      if (payload.companyType) {
        state.step3.companyType = `${payload.companyType}`;
        if (payload.companyType == 2) {
          if (payload.companyName) {
            state.step3.companyName = payload.companyName;
          }
          if (payload.companyUnionCode) {
            state.step3.uniformCreditCode = payload.companyUnionCode;
          }
        }
      }
      if (payload.email) {
        state.step3.email = payload.email;
      }
      if (payload.oldCompanyId) {
        state.step3.oldCompanyId = payload.oldCompanyId; //老ID
      }
      if (payload.createtime) {
        state.step3.createtime = payload.createtime; //创建时间
      }
      if (payload.configContact) {
        state.step3.contactPhone = `${payload.configContact}`; //联系人电话
      }
      if (payload.username) {
        state.step3.realName = payload.username; //联系人姓名
      }

      //省市区暂不还原
      /*if (payload.regionProvince && payload.regionCity && payload.regionDistinct && payload.regionStreet) {
        state.step3.province = payload.regionProvince;
        state.step3.city = payload.regionCity;
        state.step3.area = payload.regionDistinct;
        state.step3.streetTown = payload.regionStreet;
      }*/

      if (payload.address) {
        state.step3.address = payload.address; //详细地址
      }
      return {
        ...state,
        oldUser: {
          // ...state.oldUser,
          ...payload,
        },
      };
    },
  },

  effects: {
    * getVerificationCode({payload, callback}, {call, select}) {
      const {tokenVfcode} = yield select(state => state.global);
      const res = yield call(() => AJAX.send(ajaxMap.getVerificationCode, {...payload, type: 1, tokenVfcode}));
      callback && callback(res);
    },

    //天眼查 数据 工商注册才会使用
    * searchCompanyName({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoadCompanyList: true, companyList: []}});
      const res = yield call(() => AJAX.send(ajaxMap.searchCompanyName, {...payload}));
      if (res.code === 0) {
        let list = [];
        try {
          list = JSON.parse(res.data);
        } catch (e) {
          //empty
        }
        yield put({type: 'set', payload: {companyList: list}});
      }
      yield put({type: 'set', payload: {isLoadCompanyList: false}});
      callback && callback(res);
    },

    //注册
    * insertRegisterCompany({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.insertRegisterCompany, {...payload}));
      if (res.code === 0) {
        callback && callback(res);
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
