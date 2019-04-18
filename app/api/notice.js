const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  // 查询通知记录
  async querySendRecord(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsInform/querySendRecord`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //发送通知
  async sendNotification(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');

    const res = await ctx.injectCurl(`${needLogin}/gsInform/sendNotification`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //修改通知
  async updateSendContent(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operation', user => `${user.accountId}_${user.realName}`);

    const res = await ctx.injectCurl(`${needLogin}/gsInform/updateSendContent`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //详细发送记录
  async queryDetailedDeliveryRecord(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsInformDetails/queryDetailedDeliveryRecord`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //单条记录通知重新发送
  async singleResend(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsInformDetails/singleResend`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //所有重新发送
  async resendAllTheInformation(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsInformDetails/resendAllTheInformation`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
