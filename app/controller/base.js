const getBaseHtml = require('../utils/ssr');
// const Tools = require('../utils/tool');

// const {unlogin} = global.globalConfig.backend;//eslint-disable-line

module.exports = {
  async index(ctx, next, isSSR) {
    //登录状态
    /*if (ctx.session.user && ctx.session.user.token) {
      //调用loginChoose刷新权限
      const res = await ctx.curl(`${unlogin}/gsLogin/loginChoose`, {
        id: ctx.session.user.accountId,
      }, 'POST');
      const {data} = res;
      if (data.code === 0) {
        //登录成功
        const {data: {dataLogin: {account = {}}}} = data;
        account.permission = data.data.permission;
        Tools.setUser(ctx, account);
      }
    }
*/

    await getBaseHtml(ctx, '', {}, isSSR);
  },
};

