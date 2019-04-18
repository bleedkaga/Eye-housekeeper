const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  // 查询可用点劵积分
  async findBalance(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMoneyTradingTotal/findBalance`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //TODO 查询用户数据（这个接口可以使用电子档案的queryUserStatus接口，这里多余）
  async queryUserStatus(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsUser/queryUserStatus`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //获取发放类型
  async sendType(ctx, next) {
    Tools.proofread(ctx, 'accountId', 'accountId');
    Tools.proofread(ctx, 'sendMoneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendTask/sendType`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //通过三级事由code和value查询特殊说明
  async findSpecialNoteByThirdReason(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDictValue/findSpecialNoteByThirdReason`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //检查当前用户是否设置了支付密码
  async checkIsPassword(ctx, next) {
    Tools.proofread(ctx, 'accountId', 'accountId');
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyTradingTotal/checkIsPassword`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //企业给用户发钱
  async sendUserMoney(ctx, next) {
    Tools.proofread(ctx, 'accountId', 'accountId');
    Tools.proofread(ctx, 'sendMoneyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);

    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendTask/sendUserMoney`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //添加上传资料
  async insertUploadSource(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsSourceUpload/insertUploadSource`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //已上传资料列表
  async listSourceUploadMes(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsSourceUpload/listSourceUploadMes`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //查看福利记录
  async againSendMoneyTask(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);

    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendTask/againSendMoneyTask`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
