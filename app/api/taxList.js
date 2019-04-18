const {needLogin} = global.globalConfig.backend;

const Tools = require('../utils/tool');

module.exports = {
  // 查询人员名单
  async queryPersonInfo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsPersonalBankAccount/getPersonnelManagement`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 下载人员名单
  async downloadPersonInfo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsPersonalBankAccount/downloadCompanyInfo`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 绑定银行卡号
  async bindBankNo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsPersonalBankAccount/setBankCard`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //给当前用户添加任务
  async addUserCustomTask(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsUserCustomTask/addUserCustomTask`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
