const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  // 进页面拉取现金账户数据
  async cashWelfareRechargeRecordInquiry(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsPayrollRecords/cashWelfareRechargeRecordInquiry`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 进页面拉取单位账户数据Se
  async checkCompanyWelfareAccountRechargeRecord(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/checkCompanyWelfareAccountRechargeRecord`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 现金导出
  async cashBenefitRechargeRecordExport(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsPayrollRecords/cashBenefitRechargeRecordExport`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 单位导出
  async rechargeRecordExport(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/rechargeRecordExport`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },


};
