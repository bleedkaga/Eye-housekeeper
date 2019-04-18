const Tools = require('../utils/tool');

const {needLogin} = global.globalConfig.backend;//eslint-disable-line

module.exports = {
  //查询部门
  async queryDepartment(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});
    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/queryDepartment`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  // 查询管理员
  async queryAdministrator(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/queryAdministrator`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  // 查询上下级
  async queryLowerAndUpperDepartments(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/queryLowerAndUpperDepartments`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //获取设置管理员名单 --- wmz
  //获取设置管理员名单 --- wmz
  async queryManager(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/queryManager`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  // 更改部门名称
  async updateDepartment(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/updateDepartment`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  // 删除部门
  async delDepartment(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/delDepartment`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //取消管理员
  async deleteDepartmentAdministrator(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    const res = await ctx.injectCurl(`${needLogin}/gsAccount/deleteDepartmentAdministrator`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  // 取消最外层的管理员
  async deleteAccountById(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});
    const res = await ctx.injectCurl(`${needLogin}/gsAccount/deleteAccountById`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //新增部门
  async addDepartment(ctx, next) {
    Tools.proofread(ctx, 'companyGroupId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/addDepartment`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //调整部门排序
  async editDepartmentSort(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/editDepartmentSort`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //批量转移员工
  async departmentDatch(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/departmentDatch`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
  //更改上级部门
  async editDepartmentParent(ctx, next) {
    Tools.proofread(ctx, 'companyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsDepartment/editDepartmentParent`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },
};
