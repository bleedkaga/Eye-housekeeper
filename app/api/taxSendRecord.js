const {needLogin} = global.globalConfig.backend;

module.exports = {
  // 查询发放记录
  async querySendRecord(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDetailedPayrollRecords/queryInformationReleaseRecord`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 查询详情
  async queryDetail(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDetailedPayrollRecords/queryInDetail`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 撤销方案
  async revocationScheme(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/revocationScheme`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 下载系统方案
  async downSystemScheme(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/downloadTheProgram`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 下载自定义方案
  async downSelfScheme(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsSalaryDetails/customSchemeDownload`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 再次发放
  async sendAgen(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDetailedPayrollRecords/onceAgainIssued`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 结束任务
  async overTask(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDetailedPayrollRecords/endtask`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 放款
  async sendMoney(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDetailedPayrollRecords/companyAdvanceLoan`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 放款给个人
  async sendMoneyToOne(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDetailedPayrollRecords/personalAdvanceLoan`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
