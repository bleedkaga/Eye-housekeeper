const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line
const Tools = require('../utils/tool');

module.exports = {

  // 员工福利记录
  async sendMoneyTaskList(ctx, next) {
    Tools.proofread(ctx, 'sendMoneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendTask/sendMoneyTaskList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 部门（/关联单位）福利记录
  async findMoneyQuotaList(ctx, next) {
    Tools.proofread(ctx, 'sendMoneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendQuotaRecord/findMoneyQuotaList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 取消部门配额发放
  async cancelMoneyDeptQuotaSend(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendQuotaRecord/cancelMoneyDeptQuotaSend`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 部门发放清单
  async findMoneyQuotaDetailedList(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMoneyQuotaDetailedList/findMoneyQuotaDetailedList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 员工发放详细
  async enquiriesAreIssuedForDetails(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendTaskDetail/enquiriesAreIssuedForDetails`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 部门清单导出地址
  async exportReleaseList(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyQuotaDetailedList/exportReleaseList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 员工发放详细导出地址
  async sendRecordDetailExport(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendTaskDetail/sendRecordDetailExport`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 审核发放记录，拒绝，通过，撤回
  async auditSendMoneyTask(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);

    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendTask/auditSendMoneyTask`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //首页 福利审核提示
  async findAuditSendMoneyTask(ctx, next) {
    if ('companyId' in ctx.request.parameter) {
      Tools.proofread(ctx, 'companyId', 'companyId');
    } else if ('groupId' in ctx.request.parameter) {
      Tools.proofread(ctx, 'groupId', 'groupId');
    }

    const res = await ctx.injectCurl(`${needLogin}/gsMoneySendTask/findAuditSendMoneyTask`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

};
