const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line
const Tools = require('../utils/tool');

module.exports = {

  // 部门查询
  async getDeptMenu(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/getDeptMenu`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //查询积分
  async findBalance(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyTradingTotal/findBalance`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //配发金额给部门
  async insertBatchMoneyDeptQuota(ctx, next) {
    Tools.proofread(ctx, 'accountId', 'accountId');
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);


    const res = await ctx.injectCurl(`${needLogin}/gsMoneyDeptQuota/insertBatchMoneyDeptQuota`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
