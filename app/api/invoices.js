const Tools = require('../utils/tool');

const {needLogin} = global.globalConfig.backend;//eslint-disable-line

module.exports = {
  // 发票申请
  async invoicesInfoList(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsInvoiceInfo/invoicesInfoList`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  // 开票申请
  async applyInvoice(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsInvoiceInfo/applyInvoice`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 邮寄地址
  async queryRecipientInfo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyIndustry/queryRecipientInfo`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 保存邮寄地址
  async updateIndustrySubsidiaryInfo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyIndustry/updateIndustrySubsidiaryInfo`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 获取开票信息
  async queryInvoiceBaseInfo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyIndustry/queryInvoiceBaseInfo`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 获取申请记录
  async invoiceDetailPageList(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsInvoiceBatch/invoiceDetailPageList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 提交开票申请
  async submitApplyInvoice(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsInvoiceBatch/submitApplyInvoice`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  async invoiceDetailRecordList(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsInvoiceBatch/invoiceDetailRecordList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 发票详情
  async showInvoiceDetail(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsInvoiceBatch/showInvoiceDetail`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
};
