const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

module.exports = {

  // 离职人员信息
  async checkOutResignationStaff(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsUserLeave/checkOutResignationStaff`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

};
