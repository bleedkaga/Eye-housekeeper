const {needLogin} = global.globalConfig.backend;//eslint-disable-line
const Tools = require('../utils/tool');

module.exports = {
  //首页信息
  async gsIndex(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsIndex/statisticalUnitStaffChanges`, {
      ...ctx.request.parameter,
    }, 'POST');

    //单位信息更新时 超管名称需要更新
    if (res.data && res.data.code === 0 && 'indexName' in res.data.data) {
      ctx.session.user.indexName = res.data.data.indexName;//联系人名称更新
    }

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //人员变更查询
  async queryPersonnelChange(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsIndex/queryPersonnelChange`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },


};
