const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line
const Tools = require('../utils/tool');

module.exports = {
  // 离会操作
  async leaveOperation(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');

    const res = await ctx.injectCurl(`${needLogin}/gsUser/leaveOperation`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  // 搜索单位
  async findCompanyNameList(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${unlogin}/gsCompany/findCompanyNameList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  // 转会操作
  async transferOperation(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');

    const res = await ctx.injectCurl(`${needLogin}/gsUser/transferOperation`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },


};
