const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

module.exports = {
  // 进页面拉取字典
  async searchCompanyName(ctx, next) {
    // const { user } = ctx.session;
    // console.log(ctx.session, 'YYYYYYYYYYYY');
    const res = await ctx.injectCurl(`${needLogin}/addCompany/searchCompanyName`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  async insertRegisterCompany(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/addCompany/insertRegisterCompany`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },


};
