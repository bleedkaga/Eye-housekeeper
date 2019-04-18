const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  // 管理员列表
  async accountList(ctx, next) {
    Tools.proofread(ctx, 'companyId', 'companyId');

    const res = await ctx.injectCurl(`${needLogin}/gsAccount/accountList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //移除部门管理员
  async deleteAccountById(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsAccount/deleteAccountById`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //移交超级管理员
  async handOverManager(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'accountId', 'accountId');
    Tools.proofread(ctx, 'operationerId', 'accountId');
    Tools.proofread(ctx, 'companyId', 'companyId');

    const res = await ctx.injectCurl(`${needLogin}/gsAccount/handOverManager`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //添加部门管理员
  async insertAccount(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'companyId', 'companyId');
    Tools.proofread(ctx, 'companyName', 'companyName');

    const res = await ctx.injectCurl(`${needLogin}/gsAccount/insertAccount`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //修改部门管理员
  async updateAccount(ctx, next) {
    Tools.proofread(ctx, 'modifier', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'companyId', 'companyId');

    const res = await ctx.injectCurl(`${needLogin}/gsAccount/updateAccount`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //获取管理员权限
  async getAccountId(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsAccount/getAccountId`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //修改登陆密码或者支付密码
  async updatePassWord(ctx, next) {
    Tools.proofread(ctx, 'phone', 'phone');
    Tools.proofread(ctx, 'accountId', 'accountId');

    const res = await ctx.injectCurl(`${needLogin}/gsPassWord/updatePassWord`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

};
