import {message} from 'antd';
import AJAX from 'client/utils/ajax';
import ajaxMapPublic from 'client/services/public';
import ajaxMap from 'client/services/staff';
import ajaxMapDepart from 'client/services/depart';
import Tools from 'client/utils/tools';

const model = {

  namespace: 'addStaff',

  state: {
    tab1: {
      mobilePhone: '', //电话
      userName: '', //用户名
      certificateTypeCode: undefined, //证件类型
      certificateCode: '', //证件号
      identityId: 1, //是否是工会会员 1是工会会员 2不是
    },

    tab2: {
      workNumber: '', //工号
      job: '', //岗位
      rank: '', //职级
      entryDate: '', //入职日期
      departmentCode: undefined, //所属部门code
      department: '', //所属部门名称
      position: '', //职务
      email: '', //邮箱
      natureWork: undefined, //用工性质
    },

    tab3: {
      gender: '', //性别
      marriage: '', //婚姻状况
      householdType: '', //户籍类型

      yearBirth: '', //出生年
      month: '', //月份
      date: '', //日期
      hour: '', //时间
      minute: '', //分钟

      nationality: undefined, //国籍
      levelEducation: undefined, //文化程度
      politicalLandscape: undefined, //政治面貌

      height: '', //身高
      weight: '', //体重
      bloodType: undefined, //血型
    },

    tab4: {
      communistPartyChina: undefined, //中共党员
      modelLabor: undefined, //劳动模范
      unionMember: undefined, //工会职务
      leagueMembers: undefined, //共青团员
      womanFederation: undefined, //妇联工作
      identity: '', //更多身份
    },

    department: [],

    isVerify: false, //当前是否在效验

    isLoad: false, //当前是否在加载
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setTab1(state, {payload}) {
      if ('certificateTypeCode' in payload && !payload.certificateTypeCode) {
        payload.certificateTypeCode = undefined;
        state.tab1.certificateTypeCode = undefined;
      }
      return {...state, tab1: {...state.tab1, ...payload}};
    },
    setTab2(state, {payload}) {
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
    setTab3(state, {payload}) {
      if ('nationality' in payload && !payload.nationality) {
        payload.nationality = undefined;
        state.tab3.nationality = undefined;
      }
      if ('levelEducation' in payload && !payload.levelEducation) {
        payload.levelEducation = undefined;
        state.tab3.levelEducation = undefined;
      }
      if ('politicalLandscape' in payload && !payload.politicalLandscape) {
        payload.politicalLandscape = undefined;
        state.tab3.politicalLandscape = undefined;
      }
      if ('bloodType' in payload && !payload.bloodType) {
        payload.bloodType = undefined;
        state.tab3.bloodType = undefined;
      }
      return {...state, tab3: {...state.tab3, ...payload}};
    },
    setTab4(state, {payload}) {
      if ('communistPartyChina' in payload && !payload.communistPartyChina) {
        payload.communistPartyChina = undefined;
        state.tab4.communistPartyChina = undefined;
      }
      if ('modelLabor' in payload && !payload.modelLabor) {
        payload.modelLabor = undefined;
        state.tab4.modelLabor = undefined;
      }
      if ('unionMember' in payload && !payload.unionMember) {
        payload.unionMember = undefined;
        state.tab4.unionMember = undefined;
      }
      if ('leagueMembers' in payload && !payload.leagueMembers) {
        payload.leagueMembers = undefined;
        state.tab4.leagueMembers = undefined;
      }
      if ('womanFederation' in payload && !payload.womanFederation) {
        payload.womanFederation = undefined;
        state.tab4.womanFederation = undefined;
      }

      return {...state, tab4: {...state.tab4, ...payload}};
    },
  },

  effects: {
    //字典
    * findFirstValListNoAll({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.findFirstValListNoAll, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {
            ...res.data,
          },
        });
      }
    },
    //手机号码检测
    * phoneVerification({payload}, {call, put}) {
      yield put({type: 'set', payload: {isVerify: true}});
      const res = yield call(() => AJAX.send(ajaxMap.phoneVerification, {...payload}));
      if (res.code === 0) {
        if (res.message === 'success') {
          message.success('该手机号可用');
          if (res.data && res.data.info && res.data.info.userName) {
            const o = res.data.info;
            yield put({
              type: 'setTab1',
              payload: {
                mobilePhone: o.mobilePhone, //电话
                userName: o.userName, //用户名
                certificateTypeCode: o.certificateTypeCode, //证件类型
                certificateCode: o.certificateCode, //证件号
              },
            });
          }
        } else {
          message.error(res.message);
        }
      }
      yield call(Tools.delaySaga, 332);
      yield put({type: 'set', payload: {isVerify: false}});
    },
    //查询部门列表
    * queryDepartment({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapDepart.queryDepartment, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {department: getTreeData(res.data.dept || [])},
        });
      }
    },
    //新增人员
    * addUser({payload, callback}, {call}) {
      if (!payload.certificateTypeCode) payload.certificateTypeCode = '';

      if (!payload.departmentCode) payload.departmentCode = '';
      if (!payload.natureWork) payload.natureWork = '';

      if (!payload.nationality) payload.nationality = '';
      if (!payload.levelEducation) payload.levelEducation = '';
      if (!payload.politicalLandscape) payload.politicalLandscape = '';
      if (!payload.bloodType) payload.bloodType = '';

      if (!payload.communistPartyChina) payload.communistPartyChina = '';
      if (!payload.modelLabor) payload.modelLabor = '';
      if (!payload.unionMember) payload.unionMember = '';
      if (!payload.leagueMembers) payload.leagueMembers = '';
      if (!payload.womanFederation) payload.womanFederation = '';

      const res = yield call(() => AJAX.send(ajaxMap.addUser, {...payload}));

      callback && callback(res);
    },
    //查询人员
    * queryUserInfo({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMap.queryUserInfo, {...payload}));

      if (res.code === 0) {
        const {data} = res;
        //同步
        const tab1 = syncData(Object.keys(model.state.tab1), data);
        const tab2 = syncData(Object.keys(model.state.tab2), data);
        const tab3 = syncData(Object.keys(model.state.tab3), data);
        const tab4 = syncData(Object.keys(model.state.tab4), data);

        yield put({type: 'setTab1', payload: tab1});
        yield put({type: 'setTab2', payload: tab2});
        yield put({type: 'setTab3', payload: tab3});
        yield put({type: 'setTab4', payload: tab4});
      }
    },
    //修改人员
    * updateUserInfo({payload, callback}, {call}) {
      if (!payload.certificateTypeCode) payload.certificateTypeCode = '';

      if (!payload.departmentCode) payload.departmentCode = '';
      if (!payload.natureWork) payload.natureWork = '';

      if (!payload.nationality) payload.nationality = '';
      if (!payload.levelEducation) payload.levelEducation = '';
      if (!payload.politicalLandscape) payload.politicalLandscape = '';
      if (!payload.bloodType) payload.bloodType = '';

      if (!payload.communistPartyChina) payload.communistPartyChina = '';
      if (!payload.modelLabor) payload.modelLabor = '';
      if (!payload.unionMember) payload.unionMember = '';
      if (!payload.leagueMembers) payload.leagueMembers = '';
      if (!payload.womanFederation) payload.womanFederation = '';

      const res = yield call(() => AJAX.send(ajaxMap.updateUserInfo, {...payload}));
      callback && callback(res);
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

const syncData = (tabDataKey, data) => {
  const o = {};
  tabDataKey.forEach((k) => {
    if (data[k]) {
      o[k] = data[k];
    }
  });
  return o;
};

export default model;
