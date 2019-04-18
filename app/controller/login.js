const Config = require('../config');

module.exports = {
  //login
  async logout(ctx) {
    ctx.session.user = {};
    ctx.redirect(Config.appLogin);
  },
};
