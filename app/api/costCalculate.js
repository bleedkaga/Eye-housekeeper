const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

module.exports = {

  // 首页众包成本测算费率
  async queryCrowdRate(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/crowdsourcingCalc/queryCrowdRate`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
  // 首页众包成本测算
  async costCalculate(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/crowdsourcingCalc/costCalculate`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },
};
