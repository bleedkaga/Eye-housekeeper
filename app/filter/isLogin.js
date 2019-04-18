const Config = require('../config');
//验证是否已经登录
module.exports = (ctx, next) => {
  const {token} = ctx.session.user;
  if (!token) return next();

  //已经登录过无需登录
  const redirect = ctx.session.redirect || Config.appIndex;
  ctx.redirect(redirect);
};
