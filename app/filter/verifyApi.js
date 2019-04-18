//验证
const Tools = require('../utils/tool');

module.exports = (ctx, next) => {
  const {token} = ctx.session.user;
  if (token && Tools.checkToken(token)) return next();

  ctx.session.user = {};
  //这里判断登录需要和后台一致
  ctx.body = {
    code: -10000,
    message: '请登录',
    timestamp: new Date().getTime(),
  };
  ctx.code = 200;
};
