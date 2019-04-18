import AJAX from 'client/utils/ajax';
import API from 'client/services/staff';
import API2 from 'client/services/unionStaff';

import ajaxMapPublic from 'client/services/public';
import Tools from 'client/utils/tools';
import APIDepart from 'client/services/depart';
// import { message } from 'antd';
import Mapping from 'client/utils/mapping';
import RH from 'client/routeHelper';

const model = {
  namespace: 'unionStaff',

  state: {
    //需要的参数对象查询
    condition: {
      pageIndex: 1,
      pageSize: 10,
      condition: '', //姓名电话证件号
      departmentCode: '', //选择部门--高级查询
      departmentCodeBase: undefined,
      userName: '', //姓名
      communistPartyChina: '', //中共党员
      mobilePhone: '', //电话
      position: '', //职务
      certificateCode: '', //证件号
      unionMember: '', //工会职务
      workNumber: '', //工号
      operationlike: undefined, //更多身份
      leagueMembers: '', //共青团员
      type: '', //状态
      modelLabor: '', //劳动模范
      gender: '', //性别
      levelEducation: '', //文化程度
      womanFederation: '', //妇联工作
      marriage: '', //婚姻状况
      remarks: '', //备注
      startDate: '', //入职开始时间
      endDate: '', //入职结束时间
      startMonth: '', //生日开始的月份
      startDay: '', //开始的日期
      endMonth: '', //结束的月份
      endDay: '', //结束的日期
    },
    __condition: {
      pageIndex: ['number'],
      pageSize: ['number'],
      condition: ['string'],
      userName: ['string'],
      communistPartyChina: ['string'],
      departmentCode: ['string'],
      mobilePhone: ['string'],
      position: ['string'],
      certificateCode: ['string'],
      unionMember: ['string'],
      workNumber: ['string'],
      operationlike: ['string'],
      leagueMembers: ['string'],
      type: ['string'],
      modelLabor: ['string'],
      gender: ['string'],
      levelEducation: ['string'],
      womanFederation: ['string'],
      marriage: ['string'],
      remarks: ['string'],
      startDate: ['string'],
      endDate: ['string'],
      startMonth: ['string'],
      startDay: ['string'],
      endMonth: ['string'],
      endDay: ['string'],
    },

    userList: [],
    isLoad: false, //当前是否正在加载
    totalCount: 0, //分页总数
    departmentTreeData: [], //工作部门树
    marryStatus: [], //婚姻状态
    gender: [], //性别
    partyMembers: [], //中共党员
    laborModel: [], //劳动模范
    educationalLevel: [], //文化程度
    moreIdentities: [], //更多身份
    unionMembers: [], //工会职务
    womenFederation: [], //妇联工作
    youthLeagueMembers: [], //共青团员
    unionData: [], //工会列表数据
    department: [],

    loadMore: false, //是否加载高级查询
  },

  effects: {
    //sage 获取会员
    * queryUserStatus({payload}, {call, put, select}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const { companyId } = yield select(
        state => state.global.account
      );
      //在这里进行参数的获取
      const { unionStaff} = yield select(state => state);
      //进行浏览器参数刷新
      const result = Mapping.toAjaxQuery(unionStaff.condition, unionStaff.__condition, true); //获取浏览器参数
      RH(null, 'unionStaff', '/union/unionStaff', {search: result.search, replace: true}); //只改变search不会触发组件刷新
      const params = {
        companyId,
        ...result.params,
        identityId: 1,

      };

      const res = yield call(() => AJAX.send(API.queryUserStatus, {...params}));
      if (res.code === 0) {
        // 修改key 值为id 表单的key值
        const userList = res.data.map((item) => {
          item.key = item.id;
          return item;
        });

        yield put({
          type: 'set',
          payload: {
            userList: userList || [],
            totalCount: res.totalCount || 0,
            cacheQueryParams: payload,
            unionData: [],
          },
        });
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },
    //初始化各种下拉数据--接口(findFirstValList)
    * findFirstValList({payload}, {put, call}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.findFirstValList, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {
            marryStatus: Tools.formatValList(null, res.data.marryStatus || []),
            gender: Tools.formatValList(null, res.data.gender || []),
            partyMembers: Tools.formatValList(null, res.data.partyMembers || []),
            laborModel: Tools.formatValList(null, res.data.laborModel || []),
            educationalLevel: Tools.formatValList(null, res.data.educationalLevel || []),
            moreIdentities: Tools.formatValList(null, res.data.moreIdentities || []),
            unionMembers: Tools.formatValList(null, res.data.unionMembers || []),
            womenFederation: Tools.formatValList(null, res.data.womenFederation || []),
            youthLeagueMembers: Tools.formatValList(null, res.data.youthLeagueMembers || []),

          },
        });
      }
    },
    //离会
    * leaveOperation({payload, callback}, { call}) {
      const res = yield call(() => AJAX.send(API2.leaveOperation, {...payload}));
      callback && callback(res);
    },

    //查询部门列表 -----调用接口（queryDepartment）
    * queryDepartment({ payload }, { call, put }) {
      const res = yield call(() => AJAX.send(APIDepart.queryDepartment, {...payload}));
      if (res.data && res.data.dept) {
        yield put({
          type: 'set',
          payload: {department: getTreeData(res.data.dept || [])},
        });
      }
    },
    //导出用户
    * getExportMember({ payload }, { call }) {
      const res = yield call(() => AJAX.send(API.getExportMember, {...payload}));
      if (res.code === 0 && res.data && res.data.url) {
        window.location.href = res.data.url;
      }
    },
    //搜索单位
    * findCompanyNameList({payload, callback}, {put, call}) {
      yield put({ type: 'set', payload: { unionData: [], isLoad: true } });
      const res = yield call(() => AJAX.send(API2.findCompanyNameList, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {isLoad: false, unionData: res.data },
        });
      }
      callback && callback(res);
    },

    //转会
    * transferOperation({payload, callback}, { call}) {
      const res = yield call(() => AJAX.send(API2.transferOperation, {...payload}));

      callback && callback(res);
    },


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

    setDepartment(state, {payload}) {
      if ('departmentCode' in payload && !payload.departmentCode) {
        payload.departmentCode = undefined;
        state.tab2.departmentCode = undefined;
      }
      if ('natureWork' in payload && !payload.natureWork) {
        payload.natureWork = undefined;
        state.tab2.natureWork = undefined;
      }
      return {...state, tab2: {...state.tab2, ...payload}};
    },
  },
};

const getTreeData = data => data.map((item) => {
  if (Array.isArray(item.children) && item.children.length) {
    return {
      title: item.departmentName,
      value: item.id,
      key: item.id,
      children: getTreeData(item.children),
    };
  }
  return {
    title: item.departmentName,
    value: item.id,
    key: item.id,
  };
});
export default model;
