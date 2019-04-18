const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');


module.exports = {
  // 进页面拉取现金账户数据
  async rmbAccountinquiry(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsRmbCapitalFlow/rmbAccountinquiry`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 进页面拉取单位账户数据
  async conditionalQuery(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMeccaAccountCapitalFlow/conditionalQuery`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 个人详情
  async COMPANYuserPersonalFlowQuery(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsPersonalFundFlowDetails/userPersonalFlowQuery`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 现金导出
  async rmbCapitalFlowExport(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsRmbCapitalFlow/rmbCapitalFlowExport`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 单位导出
  async cashAccountFlowExport(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMeccaAccountCapitalFlow/cashAccountFlowExport`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },


};
