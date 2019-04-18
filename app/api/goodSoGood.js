import Md5 from '../utils/md5';
import Config from '../config';

const Tools = require('../utils/tool');

const {needLogin, unlogin, aliPayUrl} = global.globalConfig.backend;//eslint-disable-line

module.exports = {
  //登录
  async login(ctx, next) {
    const res = await ctx.curl(`${unlogin}/gsLogin/login`, {
      ...ctx.request.parameter,
      // debug: 'gsg2018',
    }, 'POST');

    const {data} = res;

    if (data.code === 0 && data.data.type === 1) {
      //登录成功
      const {data: {dataLogin: {account = {}}}} = data;
      account.permission = data.data.permission;

      console.log('ctxxxxxxxxx', account);
      Tools.setUser(ctx, account);
    }

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  // 登陆有个单位时，选择某个单位
  async loginChoose(ctx, next) {
    //parameter 的参数id不需要效验
    const res = await ctx.curl(`${unlogin}/gsLogin/loginChoose`, {
      ...ctx.request.parameter,
      // debug: 'gsg2018',
    }, 'POST');

    const {data} = res;

    if (data.code === 0) {
      //登录成功
      const {data: {dataLogin: {account = {}}}} = data;
      account.permission = data.data.permission;
      Tools.setUser(ctx, account);
    }

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //获取发送验证的token
  async getVfCodePhoneToken(ctx, next) {
    const timeStamp = new Date().getTime(); //时间错
    const nonceStr = Tools.createUUID(4, ''); //随机数
    const sign = Md5(`timeStamp=${timeStamp}&nonceStr=${nonceStr}&key=${Config.verificationCodeKey}`);

    const res = await ctx.curl(`${unlogin}/vfCheckToken/getVfCodePhoneToken`, {
      ...ctx.request.parameter,
      timeStamp,
      nonceStr,
      sign,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //获取手机验证码
  async getVerificationCode(ctx, next) {
    const res = await ctx.curl(`${unlogin}/register/getVerificationCode`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //校验手机号码与验证码是否正确
  async verificationCodeCheck(ctx, next) {
    const res = await ctx.curl(`${unlogin}/register/verificationCodeCheck`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //忘记密码
  async updatePassWord(ctx, next) {
    Tools.proofread(ctx, 'accountId', 'accountId');
    const res = await ctx.curl(`${unlogin}/gsLoginAccount/updatePassWord`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //（注册）调用企查查获取工商局单位名称
  async searchCompanyName(ctx, next) {
    const res = await ctx.curl(`${unlogin}/register/searchCompanyName`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //（注册）添加单位数据
  //  如果传了companyId 表示是完善资料(type=3)
  async insertRegisterCompany(ctx, next) {
    const res = await ctx.curl(`${unlogin}/register/insertRegisterCompany`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //检测用户是否注册
  async checkIfTheUserExists(ctx, next) {
    const res = await ctx.curl(`${unlogin}/register/checkIfTheUserExists`, {
      ...ctx.request.parameter,
    }, 'POST');

    ctx.body = res.data;
    ctx.status = 200;
    next();
  },

  //VIP权限校验接口
  async checkIfThePayrollIsOpen(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsServicePurchase/checkIfThePayrollIsOpen`, {
      ...ctx.request.parameter,
    }, 'POST');

    if (res.data.code === 0) {
      ctx.session.user.permission = res.data.data.permission;
    }

    ctx.body = res.data;
    next();
  },

  //购买VIP
  async subscribeToAService(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const {channelType} = ctx.request.parameter;
    const res = await ctx.injectCurl(`${needLogin}/gsServicePurchase/subscribeToAService`, {
      ...ctx.request.parameter,
    }, 'POST');

    if (channelType === 'ALIPAY_zzy_cash' && res.data.code === 0) {
      //是阿里支付
      res.data.data.aliPayUrl = aliPayUrl;
    }

    ctx.body = res.data;
    next();
  },
  //支付宝，微信在线充值
  async onlineRechargePrepay(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const {channelType} = ctx.request.parameter;
    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/onlineRechargePrepay`, {
      ...ctx.request.parameter,
    }, 'POST');

    if (channelType === 'ALIPAY_1' && res.data.code === 0) {
      //是阿里支付
      res.data.data.aliPayUrl = aliPayUrl;
    }

    ctx.body = res.data;
    next();
  },
  //单位线下充值
  async offlineFinance(ctx, next) {
    Tools.proofread(ctx, 'operationer', user => `${user.accountId}_${user.realName}`);
    Tools.proofread(ctx, 'moneyId', {maybe: ['companyId', 'groupId']});

    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/offlineFinance`, {
      ...ctx.request.parameter,
    }, 'POST');

    // if (channelType === 'ALIPAY_1' && res.data.code === 0) {
    //   //是阿里支付
    //   res.data.data.aliPayUrl = aliPayUrl;
    // }

    ctx.body = res.data;
    next();
  },
  //检查支付是否成功
  async PUBLICKcompanyCashaccountDepositQuery(ctx, next) {
    // const {channelType} = ctx.request.parameter;
    const res = await ctx.injectCurl(`${needLogin}/gsMoneyBuy/companyCashaccountDepositQuery`, {
      ...ctx.request.parameter,
    }, 'POST');

    // if (channelType === 'ALIPAY_1' && res.data.code === 0) {
    //   //是阿里支付
    //   res.data.data.aliPayUrl = aliPayUrl;
    // }

    ctx.body = res.data;
    next();
  },

  //获取用户的单位列表
  async getListOfManagementCompany(ctx, next) {
    const res = await ctx.injectCurl(`${needLogin}/gsAccount/getListOfManagementCompany`, {
      ...ctx.request.parameter,
    }, 'POST');
    ctx.body = res.data;
    next();
  },

};
