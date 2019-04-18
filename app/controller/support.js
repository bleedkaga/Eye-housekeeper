//const Config = require('../config');

module.exports = {
  //unsupported
  async unsupported(ctx) {
    ctx.session.user = {};
    // ctx.redirect(Config.appUnsupported);
    await ctx.render('unsupported');
  },
};
