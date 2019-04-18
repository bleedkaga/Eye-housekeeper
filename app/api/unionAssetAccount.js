const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
//   // 进页面拉取现金账户数据
//   async cashWelfareRechargeRecordInquiry(ctx, next) {
//     // const { user } = ctx.session;
//     // console.log(ctx.session, 'YYYYYYYYYYYY');
//     const res = await ctx.injectCurl(`${needLogin}/gsPayrollRecords/cashWelfareRechargeRecordInquiry`, {
//       ...ctx.request.parameter,
//     }, 'POST');
//     ctx.body = res.data;
//     next();
//   },

  // 进页面拉取数据
  async UNIONcheckCompanyWelfareAccountRechargeRecord(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/checkCompanyWelfareAccountRechargeRecord`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 导出
  async UNIONrechargeRecordExport(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/rechargeRecordExport`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //顶部余额
  async UNIONfindBalance(ctx, next) {
    Tools.proofread(ctx, 'accountId', 'accountId');
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyTradingTotal/findBalance`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },


};
