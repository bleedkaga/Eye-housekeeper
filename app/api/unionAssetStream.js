const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  // 进页面拉取现金账户数据
  async UNIONconditionalQuery(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMeccaAccountCapitalFlow/conditionalQuery`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 工会个人详情的数据
  async userPersonalFlowQuery(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsPersonalFundFlowDetails/userPersonalFlowQuery`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 导出
  async UNIONcashAccountFlowExport(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMeccaAccountCapitalFlow/cashAccountFlowExport`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },


};
