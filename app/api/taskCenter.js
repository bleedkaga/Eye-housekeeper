const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line
const Tools = require('../utils/tool');

module.exports = {
  // 获取用户任务中心数据（旧的已经不用了）
  async getMissionCenter(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMissionCenter/getMissionCenter`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  // 保存用户任务中心数据（旧的已经不用了）
  async addOrUpdateTaskInformation(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMissionCenter/addOrUpdateTaskInformation`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  // 获取用户任务中心数据(系统推荐和自定义)
  async getClassification(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyTask/getClassification`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  // 保存用户任务中心数据
  async addClassification(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    const res = await ctx.injectCurl(`${needLogin}/gsCompanyTask/addClassification`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  //获取自定义一级数据
  async getFirstClassification(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyClassification/getClassification`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  //获取自定义二级数据
  async getSecondCustomTask(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsCompanyCustomTask/getCustomTask`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  //批量添加一级二级数据
  async batchClassification(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyClassification/batchClassification`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  //删除子任务
  async delClassification(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsCompanyCustomTask/delClassification`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  //删除父任务
  async delFatherClassification(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    const res = await ctx.injectCurl(`${needLogin}/gsCompanyClassification/delClassification`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  //删除已选的自定义任务
  async delSelectClassification(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyTask/deleClassification`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  //单个用户任务信息获取
  async getUserCustomTask(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsUserCustomTask/getUserCustomTask`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },

  //单个用户任务添加
  async addUserCustomTask(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsUserCustomTask/addUserCustomTask`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    next();
  },
};

