const {needLogin, unlogin} = global.globalConfig.backend;//eslint-disable-line

module.exports = {

  // 政策文件
  async findDocumentByKeyword(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsDocDownload/findDocumentByKeyword`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },


};
