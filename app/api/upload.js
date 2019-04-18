const UploadScaffold = require('../utils/uploadScaffold');
const Tools = require('../utils/tool');

const {toolHost, needLogin} = global.globalConfig.backend;//eslint-disable-line

module.exports = {
  //上传图片
  async uploadImage(ctx, next) {
    const res = await UploadScaffold.uploadImage(ctx, `${toolHost}/OSSController/uploadImg`, 'fileImg');
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //使用方案上传模板
  async getUploadData(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await UploadScaffold.uploadFile(ctx, `${needLogin}/gsTaxPayment/getUploadData`, true);
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //上传自定义方案模板
  async updateCustomIssue(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await UploadScaffold.uploadFile(ctx, `${needLogin}/gsSalaryDetails/updateCustomIssue`, true);
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 上传众包人员名单, 账户信息
  async uploadPersonList(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await UploadScaffold.uploadFile(ctx, `${needLogin}/gsPersonalBankAccount/batchSetBankCard`, true);
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //上传excel
  async uploadData(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'workerId', 'accountId');

    const res = await UploadScaffold.uploadFile(ctx, `${needLogin}/gsBatchImportTemporaryTables/uploadData`, true);
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
};
