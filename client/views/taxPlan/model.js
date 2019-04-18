import AJAX from 'client/utils/ajax';
import API from 'client/services/capacityTax';
import publicAPI from 'client/services/public';

const model = {
  namespace: 'taxPlan',

  state: {
    step: 0, // 步骤
    currentScheme: '1', // 当前使用的方案
    tabsChangeVisible: false, // tabs 切换的 提醒modal
    outTradeNo: '', // 流水号
    taxCompanyName: '', // 公司名
    rate: 0, // 综合服务费
    alipay: false,
    wx: false,
    pay: false,
    bank: false, // 是否签订了担保协议
    // 税筹试算
    taxTrialVisible: false,
    // header-view
    balance: 0, // 现金账户余额
    // step1
    taskName: '', // 任务名称
    paymentMethod: 1, // 发放模式
    whetherLend: 0, // 领取任务是否付款
    distributionMethod: 0, // 放款方式
    cityAverageSalary: '6106',
    program: 60,
    fileList: [],
    schemeTwoFile: [], // 自定义方案使用
    downTmpLoading: false, // 下载 模板 loading
    createSchemeBtnDisable: true, // 是否上传了模板, true 为没有, false 为传了
    createSchemeBtnLoading: false, // 生成方案, 安扭 loading...
    // step2
    addPersonModal: false, // 新增成员 modal 是否打开
    addPersonBtnLoad: false, // 添加员工按钮 loading
    confirmSchemeBtnLoad: false, // 确认方案按钮 loading...
    personPhone: '', // 员工手机
    personName: '', // 员工姓名
    certificateCode: '', // 员工身份证号
    personId: '', // 员工 id
    personInfoTableScroll: false, // step2, 表格头是否有下 border
    personinfoFull: true, // 人员信息是否完整
    tableViewLoading: false, // table 加载 loading...
    queryContent: '', // 模糊查询参数
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    personCount: 0, // 方案人数
    totalCount: 0, // 总条数
    totalMoney: 0, // 总收费
    totalAmount: 0, // 订单收费
    didNotPass: 0, // 失败条数
    wrongAmount: 0, // 失败金额
    qualifiedCount: 0, // 成功条数
    qualifyingAmount: 0, // 成功金额
    serviceCharge: 0, // 服务费
    sendTaskShowAnimate: false, // 发布任务显示动画
    // step3
    paymentBtnLoading: false, // 支付按钮 loading
    showCount: false,
    tradeNum: null, // 查询是否支付成功的流水号
    showPaymentTips: false,
    // step4
    showAnimate: true, // 显示动画
    showResult: false, // 显示结果
    successNum: 0, // 成功条数
    failNum: 0, // 失败条数
  },

  effects: {
    * initData({payload}, {call, put, select}) {
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId; //ok
      // 不显示税率，不用发请求
      // const res = yield call(() => AJAX.send(API.gsRate, {...payload}));
      const dredge = yield call(() => AJAX.send(publicAPI.queryOpenPayStatus, {companyId: app.companyId})); //ok
      if (dredge && dredge.code === 0) {
        const { data } = dredge;
        yield put({
          type: 'updateState',
          payload: {
            alipay: data.aliPay === 0,
            wx: data.wechatPay === 0,
            pay: data.cyberbankPay === 0,
            bank: data.bankPay === 0,
            fileList: [],
          },
        });
      }
      // if (res && res.code === 0) {
      //   const { data } = res;
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       taxCompanyName: data.companyName,
      //       rate: data.rate,
      //     },
      //   });
      // }
    },

    // 下载模板
    * downSchemeTemplate({payload}, {call, select, put}) {
      yield put({
        type: 'updateState',
        payload: {
          downTmpLoading: true,
        }
      });
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const res = yield call(() => AJAX.send(API.downSchemeTemplate, {...payload}));
      if (res && res.code === 0) {
        window.location.href = res.data.url;
        yield put({
          type: 'updateState',
          payload: {
            downTmpLoading: false,
          }
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            downTmpLoading: false,
          }
        });
      }
    },

    // 方案生成 -> 系统方案
    * createScheme({payload}, {call, put, select}) {
      const callback = payload.next || null;
      delete payload.next;
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const res = yield call(() => AJAX.send(API.createScheme, {...payload}));
      if (res && res.code === 0) {
        const { data } = res;
        yield put({
          type: 'updateState',
          payload: {
            outTradeNo: data.outTradeNo,
            createSchemeBtnLoading: false,
            dataSource: data.list,
            pageSize: res.pageSize,
            pageIndex: res.pageIndex,
            personCount: data.personCount,
            totalCount: res.totalCount,
            totalMoney: data.total,
            totalAmount: data.totalAmount,
            serviceCharge: data.serviceCharge,
            didNotPass: data.didNotPass,
            wrongAmount: data.wrongAmount,
            qualifiedCount: data.qualifiedCount,
            qualifyingAmount: data.qualifyingAmount,
            personinfoFull: data.didNotPass <= 0,
          },
        });
        callback && callback();
      } else {
        yield put({
          type: 'updateState',
          payload: {
            createSchemeBtnLoading: false,
          },
        });
      }
    },

    // 查询方案 -> 作用也是生成方案(自定义)， 只是接口和一些逻辑不一样
    * queryScheme({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          tableViewLoading: true,
        },
      });
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;

      const step = yield select(state => state.taxPlan.step);
      if (!payload.outTradeNo) {
        const outTradeNo = yield select(state => state.taxPlan.outTradeNo);
        payload.outTradeNo = outTradeNo;
      }

      const callback = payload.next || null;
      delete payload.next;
      const res = yield call(() => AJAX.send(API.queryScheme, {...payload}));
      if (res && res.code === 0) {
        const { data } = res;
        yield put({
          type: 'updateState',
          payload: {
            outTradeNo: data.outTradeNo,
            createSchemeBtnLoading: false,
            tableViewLoading: false,
            dataSource: data.list,
            pageSize: res.pageSize,
            pageIndex: res.pageIndex,
            totalCount: res.totalCount,
            personCount: data.personCount,
            totalMoney: data.total,
            totalAmount: data.totalAmount,
            serviceCharge: data.serviceCharge,
            didNotPass: data.didNotPass,
            wrongAmount: data.wrongAmount,
            qualifiedCount: data.qualifiedCount,
            qualifyingAmount: data.qualifyingAmount,
            personinfoFull: data.didNotPass <= 0 && payload.pageIndex === 1,
            step: step === 2 ? 1 : step,
          },
        });
        callback && callback();
      } else {
        yield put({
          type: 'updateState',
          payload: {
            createSchemeBtnLoading: false,
            tableViewLoading: false,
          },
        });
      }
    },

    // 搜索方案
    * searchSchemePerson({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          tableViewLoading: true,
        },
      });
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const outTradeNo = yield select(state => state.taxPlan.outTradeNo);
      payload.outTradeNo = outTradeNo;

      const res = yield call(() => AJAX.send(API.queryScheme, {...payload}));
      if (res && res.code === 0) {
        const { data } = res;
        yield put({
          type: 'updateState',
          payload: {
            tableViewLoading: false,
            dataSource: data.list,
            pageSize: res.pageSize,
            pageIndex: res.pageIndex,
            totalCount: res.totalCount,
            queryContent: payload.queryContent.trim(),
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            tableViewLoading: false,
          },
        });
      }
    },

    // 下载方案
    * downScheme({payload}, {call, select}) {
      const outTradeNo = yield select(state => state.taxPlan.outTradeNo);
      payload.outTradeNo = outTradeNo;
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const res = yield call(() => AJAX.send(API.downScheme, {...payload}));
      if (res && res.code === 0) {
        window.location.href = res.data.scheme;
      }
    },

    // 新增员工
    * addPerson({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          addPersonBtnLoad: true,
        },
      });
      const callback = payload.callback || null;
      delete payload.callback;
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId; //ok
      payload.operationId = app.accountId; //ok
      payload.operationName = app.realName; //ok
      const res = yield call(() => AJAX.send(API.addPerson, {...payload}));
      if (res && res.code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            addPersonModal: false,
            addPersonBtnLoad: false,
          },
        });
        yield put({
          type: 'queryScheme',
          payload: {
            pageSize: 10,
            pageIndex: 1,
          },
        });
        callback && callback('人员添加成功');
      } else {
        yield put({
          type: 'updateState',
          payload: {
            addPersonBtnLoad: false,
          },
        });
      }
    },

    // 确定方案
    * confirmScheme({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          confirmSchemeBtnLoad: true,
        },
      });
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      const res = yield call(() => AJAX.send(API.confirmScheme, {...payload}));
      if (res && res.code === 0) {
        const { data } = res;
        yield put({
          type: 'updateState',
          payload: {
            step: 2,
            confirmSchemeBtnLoad: false,
            personCount: data.personCount,
            serviceCharge: data.serviceCharge,
            totalAmount: data.totalAmount,
            totalMoney: data.total,
          },
        });
      }
    },

    // 发布任务
    * programRelease({payload}, {call, put, select}) {
        const app = yield select(state => state.global.account);
        payload.companyId = app.companyId;
        const callback = payload.cb || null;
        delete payload.cb;
        const res = yield call(() => AJAX.send(API.programRelease, {...payload}));
        if (res && res.code === 0) {
          setTimeout(() => {
            callback && callback();
          }, 2000)
        }
        yield put({
          type: 'updateState',
          payload: {
            sendTaskShowAnimate: true
          }
        })
    },

    // 线上转账
    * onlinePayment({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          paymentBtnLoading: true,
        },
      });
      const callback = payload.next || null;
      delete payload.next;
      const app = yield select(state => state.global.account);
      payload.moneyId = app.companyId;//ok
      payload.moneyName = app.companyName;//ok
      payload.operationer = `${app.accountId}_${app.realName}`;//ok
      const res = yield call(() => AJAX.send(API.onlinePayment, {...payload}));
      if (res && res.code === 0) {
        const { data } = res;
        yield put({
          type: 'updateState',
          payload: {
            paymentBtnLoading: false,
            tradeNum: data.tradeNum,
          },
        });
        callback && callback(data.url);
      } else {
        yield put({
          type: 'updateState',
          payload: {
            paymentBtnLoading: false,
            tradeNum: null,
          },
        });
      }
    },

    // 线下转账
    * offlinePayment({payload}, {call, select}) {
      const callback = payload.next || null;
      delete payload.next;
      const app = yield select(state => state.global.account);
      payload.moneyId = app.companyId; //ok
      payload.operationer = `${app.accountId}_${app.realName}`; //ok
      const res = yield call(() => AJAX.send(API.offlinePayment, {...payload}));
      if (res && res.code === 0) {
        callback && callback();
      }
    },

    // 支付成功?
    * paymentIsSuccess({payload}, {call, select}) {
      const app = yield select(state => state.global.account);
      payload.moneyId = app.companyId;
      return yield call(() => AJAX.send(API.paymentIsSuccess, {...payload}));
    },

    // 获取成功失败数
    * pollingResult({payload}, {call, select}) {
      const app = yield select(state => state.global.account);
      payload.companyId = app.companyId;
      return yield call(() => AJAX.send(API.pollingResult, {...payload}));
    },
    // 设置任务配置
    * setTaskConfig({payload}, {call, select}) {
      const { whetherLend, paymentMethod } = yield select(state => state.taxPlan);
      console.log(payload);

    }
  },

  reducers: {
    updateState(state, {payload}) {
      return { ...state, ...payload };
    },

    reset(state) {
      return { ...state, ...model.state };
    },
  },
};

export default model;
