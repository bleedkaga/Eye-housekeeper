import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/sendstaff';
import ajaxMapPublic from 'client/services/public';
import ajaxMapDepart from 'client/services/depart';
import ajaxMapCoupons from 'client/services/coupons';
import ajaxMapStaff from 'client/services/staff';
import Tools from 'client/utils/tools';

const model = {

  namespace: 'sendStaff',

  state: {
    step1: {
      reason: undefined,
      consumptionOptions: undefined,
      amount: '',
      note: '',
    },

    reasonTips: '', //特殊提示

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
      return {...state, ...model.state};
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
    //一级字典
    * findFirstValListMy({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoadDict: true}});
      const res = yield call(() => AJAX.send(ajaxMapPublic.findFirstValList, {...payload}));
      if (res.code === 0) {
        const {data = {}} = res;

        if (data.consumerOptions) {
          data.consumerOptions.unshift({dicval: '全部', dicname: '全部'});
        }
        yield put({
          type: 'set',
          payload: {
            releaseReason: formatValList(null, data.releaseReason || []),
            consumerOptions: data.consumerOptions,
          },
        });
      }
      callback && callback(res);
      yield put({type: 'set', payload: {isLoadDict: false}});
    },
    //二级行业类型
    * findSecondValList({payload, callback}, {call, put, select}) {
      const end = payload.end;
      delete payload.end;
      const item = payload.selectedOptions.pop();
      item.loading = true;
      delete payload.selectedOptions;
      const {releaseReason} = yield select(state => state.sendStaff);
      const res = yield call(() => AJAX.send(ajaxMapPublic.findSecondValList, {...payload, parentId: item.value}));
      if (res.code === 0) {
        formatValList(item, res.data, !end);
        yield put({type: 'set', payload: {releaseReason}});
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
    //选择发放选择类型
    * sendType({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const params = {
        ...payload,
      };
      const res = yield call(() => AJAX.send(ajaxMap.sendType, {...params}));
      if (res.code === 0) {
        const {data} = res;
        yield put({
          type: 'setStep3',
          payload: {
            isMaster: data.isMaster,
            listQuota: data.listQuota || [],
            moneyType: data.moneyType,
            outTradeNo: data.outTradeNo,
            deptId: parseInt(data.deptId, 10),
          },
        });
      }
      callback && callback(res);
      yield put({type: 'set', payload: {isLoad: false}});
    },
    //通过三级事由code和value查询特殊说明
    * findSpecialNoteByThirdReason({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMap.findSpecialNoteByThirdReason, {...payload}));
      if (res.code === 0) {
        yield put({type: 'set', payload: {reasonTips: res.data}});
      }
    },
    //发放福利
    * sendUserMoney({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoadSend: true}});
      const res = yield call(() => AJAX.send(ajaxMap.sendUserMoney, {...payload}));
      callback && callback(res);
      yield put({type: 'set', payload: {isLoadSend: false}});
    },

    //查询福利
    * againSendMoneyTask({payload}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMap.againSendMoneyTask, {...payload}));
      if (res.code === 0) {
        const {data = {}} = res;
        /*
      amount: 120
consumptionOptions: "电脑,办公,家电,厨具"
note: ""
personCount: 3
sendMoneyId: "20180928155400797489723482"
totalAmount: 360
transferReasonOne: "a1"
transferReasonThree: "a111"
transferReasonTwo: "a11"
userJsonStr: Array(3)
0: {mobilePhone: "18223001463", id: "AFIN4WXRYCKG2RTRFT4HOJ7PPHVGMN65BAXNXFM5AT4FQEQU24AH6KSUSJPPCLSZRZRTKNCJ26HPXBY5X6WQUFI", n: "方小丹", departName: ""}
1: {mobilePhone: "13640512512", id: "LLSEOC73YM3P5PE76LAHR4FSPGTPMEHIBEU5RF43OD4CYZLG2UFH6KSV4BOYGX2TRYIUOQSO26BYXAAYXDPQUFI", n: "陈文睿", departName: ""}
2: {mobilePhone: "18883165906", id: "7YPGY2MKHVXWYH32JOTGE5XGZQVGYRWVPZO27GU6BP5C2ELE2IHH6JJB4RPIMKBB7YMUEOCN2SFYJ5Y2Z7NQUFI", n: "邓宏伟", departName: ""}
length: 3
      */
        yield put({
          type: 'setStep1',
          payload: {
            reason: [data.transferReasonOne, data.transferReasonTwo, data.transferReasonThree],
            consumptionOptions: data.consumptionOptions ? data.consumptionOptions.split(',') : undefined,
            amount: Tools.getViewPrice(data.amount, ''),
            note: data.note || '',
          },
        });

        const userJsonStr = data.userJsonStr || [];
        const selectedRows = [];
        const selectedRowKeys = [];
        userJsonStr.forEach((item) => {
          selectedRowKeys.push(item.id);
          selectedRows.push({
            mobilePhone: item.mobilePhone,
            mappingId: item.id,
            userName: item.n,
            department: item.departName,
          });
        });

        yield put({
          type: 'setStep2',
          payload: {
            selectedRows,
            selectedRowKeys,
          },
        });
      }
    },
  },
};

const formatValList = (item, temp, isLeaf = true) => {
  const arr = [];
  if (Array.isArray(temp)) {
    temp.forEach((o) => {
      arr.push({
        label: o.dicname,
        value: o.dicval,
        isLeaf: !isLeaf,
      });
    });
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr;
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
