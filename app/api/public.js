const {toolHost, unlogin, needLogin} = global.globalConfig.backend;//eslint-disable-line
const Tools = require('../utils/tool');


module.exports = {
  //获取省
  async findProvince(ctx, next) {
    const res = await ctx.injectCurl(`${toolHost}/areaController/findProvince.action`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //获取市
  async findCity(ctx, next) {
    const res = await ctx.injectCurl(`${toolHost}/areaController/findCity.action`, {
      ...ctx.request.parameter,
      //adcode
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //获取区
  async findArea(ctx, next) {
    const res = await ctx.injectCurl(`${toolHost}/areaController/findArea.action`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //获取街道
  async findStreet(ctx, next) {
    const res = await ctx.injectCurl(`${toolHost}/street/getStreetByGsAdcode`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //获取字典（比如行业）一级数据
  async findFirstValList(ctx, next) {
    const res = await ctx.injectCurl(`${unlogin}/gsDictValue/findFirstValList`, {
      ...ctx.request.parameter,
      // dict_code,
      // parentId
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //获取字典（比如行业）二级数据
  async findSecondValList(ctx, next) {
    const res = await ctx.injectCurl(`${unlogin}/gsDictValue/findSecondValList`, {
      ...ctx.request.parameter,
      // dict_code,
      // parentId
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 查询字典, 全部选项
  async findFirstValListNoAll(ctx, next) {
    const res = await ctx.injectCurl(`${unlogin}/gsDictValue/findFirstValListNoAll`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //菜单列表
  async menuList(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsMenu/menuList`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //获取上传会员模板
  async getDownloadTemplate(ctx, next) {
    const res = await ctx.injectCurl(`${unlogin}/gsConfig/getDownloadTemplate`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 签订担保协议 updatePayStatus
  async updatePayStatus(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsServicePurchase/updatePayStatus`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 查询签订的担保协议 updatePayStatus
  async queryOpenPayStatus(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsServicePurchase/queryOpenPayStatus`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

};
