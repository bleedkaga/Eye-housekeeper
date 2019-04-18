const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line
const Tools = require('../utils/tool');

module.exports = {

  // 查询可用点劵积分
  async findBalance(ctx, next) {
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'accountId', 'accountId');

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyTradingTotal/findBalance`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

};
