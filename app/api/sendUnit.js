const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  // 查询关联单位
  async getCompanyAssociatedByIdOrTotalPeople(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsCompanyAssociated/getCompanyAssociatedByIdOrTotalPeople`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //发放给关联单位
  async insertBatchMoneyCompanyQuota(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'accountId', 'accountId');
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);


    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendQuotaRecord/insertBatchMoneyCompanyQuota`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
