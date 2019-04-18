module.exports = options =>
  async function authorize(ctx, next) {
    if (!ctx.session.user) ctx.session.user = {};

    //这样写兼容（如果有）koa-better-body 和 koa-body multipart 模式
    const {query = {}, body = {}, fields = {}} = ctx.request;
    ctx.request.body = {...body, ...fields};
    ctx.request.parameter = {...query, ...ctx.request.body};

    await next();
  };
