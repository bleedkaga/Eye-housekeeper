import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/sendstaff';
import ajaxMapPublic from 'client/services/public';
import ajaxMapDepart from 'client/services/depart';
import ajaxMapCoupons from 'client/services/coupons';
import ajaxMapStaff from 'client/services/staff';
import ajaxMapNotice from 'client/services/notice';
import Tools from 'client/utils/tools';

const model = {

  namespace: 'sendNotice',

  state: {
    step1: {
      informWay: undefined, // 类型
      messageTitle: '',
      informCountent: '',
      informImg: '',
      link: '',
      fileList: [],
    },

    // reasonTips: '', //特殊提示

    step2: {
      selectedRows: [], //当前选择的item
      selectedRowKeys: [], //当前选择的itemKey
    },

    step3: {
      isMaster: 1,
      listQuota: [],
      moneyType: 4,
      outTradeNo: '',
    },

    balance: {
      showBalance: 0, //余额（分）
      incomeBalanceQuota: 0, //配额
      quotaList: [], //部门配额
      useBalance: 2, //余额使用权限
      useBalanceQuota: 2, //配额使用权限
    },

    releaseReason: [], //发放事由

    consumerOptions: [], //使用范围

    isLoadDict: false, //获取字典

    isLoad: false, //当前是否正在加载

    isLoadUser: false, //正在加载人员列表

    isLoadSend: false, //正在发放福利

    //以下是和电子档案一致的搜索参数
    condition: {
      pageIndex: 1,
      pageSize: 10,
      condition: '', //姓名电话证件号
      departmentCode: '', //选择部门--高级查询
      userName: '', //姓名
      communistPartyChina: '', //中共党员
      mobilePhone: '', //电话
      position: '', //职务
      certificateCode: '', //证件号
      unionMember: '', //工会职务
      workNumber: '', //工号
      operationlike: '', //更多身份
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

    totalCount: 0, //人员列表总数
    userList: [], //人员列表
    marryStatus: [], //婚姻状态
    gender: [], //性别
    partyMembers: [], //中共党员
    laborModel: [], //劳动模范
    educationalLevel: [], //文化程度
    moreIdentities: [], //更多身份
    unionMembers: [], //工会职务
    womenFederation: [], //妇联工作
    youthLeagueMembers: [], //共青团员
    departmentCode: undefined,
    department: [],
    resignationType: [], //离职原因
    userLeaveList: [], //离职人员数据
    loadMore: false, //是否加载高级查询
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state, step1: {...model.state.step1, fileList: []}};
    },

    setCondition(state, {payload}) {
      return {...state, condition: {...state.condition, ...payload}};
    },

    resetCondition(state) {
      return {...state, condition: {...model.state.condition}};
    },

    setStep1(state, {payload}) {
      return {...state, step1: {...state.step1, ...payload}};
    },

    setStep2(state, {payload}) {
      return {...state, step2: {...state.step2, ...payload}};
    },

    setStep3(state, {payload}) {
      return {...state, step3: {...state.step3, ...payload}};
    },

    setBalance(state, {payload}) {
      return {...state, balance: {...state.balance, ...payload}};
    },
  },

  effects: {
    //查询余额
    * findBalance({payload, callback}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapCoupons.findBalance, {...payload}));
      if (res.code === 0) {
        yield put({
          type: 'setBalance',
          payload: {
            showBalance: res.data.showBalance, //余额
            incomeBalanceQuota: res.data.incomeBalanceQuota, //配额 (感觉无用)
            quotaList: res.data.quotaList || [], //部门配额
            useBalance: res.data.useBalance, //余额使用权限
            useBalanceQuota: res.data.useBalanceQuota, //配额使用权限
          },
        });
      }
      callback && callback(res);
    },

    //获取部门
    * queryDepartment({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapDepart.queryDepartment, {...payload}));
      if (res.code === 0 && res.data && res.data.dept) {
        yield put({
          type: 'set',
          payload: {department: getTreeData(res.data.dept || [])},
        });
      }
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
    //获取电子档案人员
    * queryUserStatus({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoadUser: true}});
      const params = {
        ...payload,
      };

      const res = yield call(() => AJAX.send(ajaxMapStaff.queryUserStatus, {...params}));
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
          },
        });
      }

      yield put({type: 'set', payload: {isLoadUser: false}});
    },
    //选择全部
    * getSelectedMember({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoadUser: true}});
      const params = {
        ...payload,
      };
      const res = yield call(() => AJAX.send(ajaxMapStaff.getSelectedMember, {...params}));
      callback && callback(res);
      yield put({type: 'set', payload: {isLoadUser: false}});
    },

    //发送通知
    * sendNotification({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoadSend: true}});
      const res = yield call(() => AJAX.send(ajaxMapNotice.sendNotification, {...payload}));
      callback && callback(res);
      yield put({type: 'set', payload: {isLoadSend: false}});
    },

    //修改通知
    * updateSendContent({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMapNotice.updateSendContent, {...payload}));
      callback && callback(res);
      yield put({type: 'set', payload: {isLoad: false}});
    },

    //检查是否设置支付密码
    * checkIsPassword({payload, callback}, {call, select}) {
      const account = yield select(state => state.global.account);
      const res = yield call(() => AJAX.send(ajaxMap.checkIsPassword, {
        moneyId: account.companyId, //ok
        accountId: account.accountId, //ok
        ...payload,
      }));
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

export default model;
