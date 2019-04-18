//验证
module.exports = (ctx, next) => { //eslint-disable-line
  const codes = [101, 102, 103, 104, 105, 106, 107, 108, 700, -10000];

  if (ctx.body && ctx.body.code && codes.indexOf(ctx.body.code) !== -1) {
    ctx.body.code = -10000;
    ctx.session.user = {};
  }
};

