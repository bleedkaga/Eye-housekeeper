const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');


module.exports = {
  // 单位信息与工商税务信息
  async getCompanyByIdDetail(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']}); //TODO 标记

    const res = await ctx.injectCurl(`${needLogin}/gsCompany/getCompanyByIdDetail`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },


  // 修改，通过名称搜索企查查接口
  async searchCompanyName(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsCompany/searchCompanyName`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 修改单位信息
  async updateCompany(ctx, next) {
    Tools.proofread(ctx, 'modifier', user => `${user.accountId}_${user.realName}`);

    const res = await ctx.injectCurl(`${needLogin}/gsCompany/updateCompany`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 修改单位信息--税务信息
  async updateIndustryBaseInfo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']}); //TODO 标记

    const res = await ctx.injectCurl(`${needLogin}/gsCompanyIndustry/updateIndustryBaseInfo`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

};
