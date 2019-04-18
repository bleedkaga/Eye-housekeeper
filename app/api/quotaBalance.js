const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  //各部门配额余量
  async quotaAllowanceDepartment(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyDeptQuota/quotaAllowanceDepartment`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
