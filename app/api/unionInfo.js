const {needLogin, unlogin} = global.globalConfig.backend;

const Tools = require('../utils/tool');

module.exports = {
  // 获取工会信息
  async getGroupByIdDetail(ctx, next) {
    Tools.proofread(ctx, 'groupId', 'groupId');

    const res = await ctx.injectCurl(`${needLogin}/gsGroup/getGroupByIdDetail`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //新增工会
  async insertGroup(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsGroup/insertGroup`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //修改工会信息
  async updateGroup(ctx, next) {
    Tools.proofread(ctx, 'modifier', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'id', 'groupId');

    const res = await ctx.injectCurl(`${needLogin}/gsGroup/updateGroup`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  // 通过名称搜索企查查接口（工商注册的）
  async searchCompanyName(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsCompany/searchCompanyName`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //非工商注册名称查询
  async findCompanyNameList(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${unlogin}/gsCompany/findCompanyNameList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //工会或者单位保存关联单位
  async insertCompanyAssociated(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyAssociated/insertCompanyAssociated`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //查询下属单位列表
  async getCompanyAssociatedList(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyAssociated/getCompanyAssociatedList`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //工会或者单位编辑关联单位
  async updateCompanyAssociated(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'modifier', user => `${user.accountId}_${user.realName}`);

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyAssociated/updateCompanyAssociated`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //删除关联单位
  async deleteCompanyAssociated(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsCompanyAssociated/deleteCompanyAssociated`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

};

