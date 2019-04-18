const {needLogin, aliPayUrl} = global.globalConfig.backend;
const { zzyPayChannelType } = require('../utils/enums');
const Tools = require('../utils/tool');

module.exports = {
  // 税筹试算
  async taxTrial(ctx, next) {
    const { user } = ctx.session;
    const res = await ctx.injectCurl(`${needLogin}/gsTaxPayment/getLaborCostTrial`, {
      companyId: user.companyId,
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 单个用户薪筹试算
  async taxTrialOne(ctx, next) {
    const { user } = ctx.session;
    const res = await ctx.injectCurl(`${needLogin}/gsTaxPayment/singleBenefitCalculation`, {
      companyId: user.companyId,
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 获取众包费率
  async getRate(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/acquisitionCompanyRate`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 下载税筹模板
  async downSchemeTemplate(ctx, next) {
    const { user } = ctx.session;
    const res = await ctx.injectCurl(`${needLogin}/gsTaxPayment/getTemplateUrl`, {
      companyId: user.companyId, //TODO  标记
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 生成方案
  async createScheme(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/confirmationPlan`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 查询方案
  async queryScheme(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/getPackageInformation`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 下载方案
  async downScheme(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/downloadTheProgram`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 新增员工
  async addPerson(ctx, next) {
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');
    Tools.proofread(ctx, 'companyId', 'companyId');

    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/improvePersonalInformation`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 确认方案
  async confirmScheme(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/determineSolution`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 发布任务
  async programRelease(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/programRelease`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 线上转账
  async onlinePayment(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'moneyId', 'companyId');
    Tools.proofread(ctx, 'moneyName', 'companyName');

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/payThePayment`, {
      ...ctx.request.parameter,
    }, 'POST');
    const { channelType } = ctx.request.parameter;
    if (res.data && res.data.code === 0) {
      const { data } = res.data;
      if (channelType === zzyPayChannelType.ali) {
        ctx.body = {
          code: 0,
          data: {
            url: `${aliPayUrl}?orderId=${data.tradeNo}`,
            tradeNum: data.outTradeNo,
          },
          message: 'success',
        };
      } else
      if (channelType === zzyPayChannelType.yee) {
        ctx.body = {
          code: 0,
          data: {
            url: data.payUrl,
            tradeNum: data.outTradeNo,
          },
          message: 'success',
        };
      } else {
        ctx.body = {
          code: 0,
          data: {
            url: data.payBase64,
            tradeNum: data.outTradeNo,
          },
          message: 'success',
        };
      }
    } else {
      ctx.body = res.data;
    }
    next();
  },
  // 线下转账
  async offlinePayment(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'moneyId', 'companyId');

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/offlineFundAccount`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 支付成功?
  async paymentIsSuccess(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/companyCashaccountDepositQuery`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 获取成功失败数
  async pollingResult(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDetailedPayrollRecords/resultEnforcement`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //获取税筹订单支付信息
  async getPaymentFees(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/getPaymentFees`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
