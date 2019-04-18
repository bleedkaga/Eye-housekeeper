const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  //各部门配额余量
  async quotaAllowanceDepartment(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMoneyDeptQuota/quotaAllowanceDepartment`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //单位转账额度查询
  async queryAssociatedUnitIssueBalance(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyCompanyQuota/queryAssociatedUnitIssueBalance`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //获取单位转账额度详细查询
  async getReleaseDetailedData(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyCompanyQuota/getReleaseDetailedData`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
