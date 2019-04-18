const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

const Tools = require('../utils/tool');

module.exports = {
  // 用户查询
  async queryUserStatus(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    const res = await ctx.injectCurl(`${needLogin}/gsUser/queryUserStatus`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 部门查询
  async findDepartmentByCompanyId(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/findDepartmentByCompanyId`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 导出用户
  async getExportMember(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    const res = await ctx.injectCurl(`${needLogin}/gsUser/getExportMember`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 认证审核
  async approved(ctx, next) {
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');
    const res = await ctx.injectCurl(`${needLogin}/gsUser/approved`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 用户离职
  async userDeparture(ctx, next) {
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');
    const res = await ctx.injectCurl(`${needLogin}/gsUser/userDeparture`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 离职人员信息
  async checkOutResignationStaff(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsUserLeave/checkOutResignationStaff`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  // 手机号码唯一检测 (新增人员处检测) ---wmz
  async phoneVerification(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsUser/phoneVerification`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //新增人员 ---wmz
  async addUser(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsUser/addUser`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //查询人员详细信息 ---wmz
  async queryUserInfo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');

    const res = await ctx.injectCurl(`${needLogin}/gsUser/queryUserInfo`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //修改人员详细信息 ---wmz
  async updateUserInfo(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');

    const res = await ctx.injectCurl(`${needLogin}/gsUser/updateUserInfo`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //查询临时用户 ---wmz
  async uploadDataList(ctx, next) {
    Tools.proofread(ctx, 'companyId', 'companyId');
    Tools.proofread(ctx, 'workerId', 'accountId');

    const res = await ctx.injectCurl(`${needLogin}/gsBatchImportTemporaryTables/uploadData/list`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //修改临时用户 ---wmz
  async updateTemporaryData(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsBatchImportTemporaryTables/updateTemporaryData`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //导入临时用户 ---wmz
  async startBulkImport(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    Tools.proofread(ctx, 'operationId', 'accountId');
    Tools.proofread(ctx, 'operationName', 'realName');

    const res = await ctx.injectCurl(`${needLogin}/gsBatchImportTemporaryTables/startBulkImport`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //清空临时用户 ---wmz
  async uploadDataEmpty(ctx, next) {
    Tools.proofread(ctx, 'workerId', 'accountId');

    const res = await ctx.injectCurl(`${needLogin}/gsBatchImportTemporaryTables/uploadData/empty`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  //人事异动-（用户修改部门）
  async personnelDepartmentTransfer(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    const res = await ctx.injectCurl(`${needLogin}/gsUser/personnelDepartmentTransfer`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

  //发放查询选择数据（福利发放，选择全部）
  async getSelectedMember(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsUser/getSelectedMember`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

};
