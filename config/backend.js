module.exports = {
  dev: {
    /* 测试 */

    // unlogin: 'http://b.snet/company_external',
    // needLogin: 'http://company.snet/company_b',
    unlogin: 'http://unionpaygate.snet/v1.0/company_external',
    needLogin: 'http://unionpaygate.snet/v1.0/company_b',
    toolHost: 'http://192.168.2.238:8084/gs_dicitem',
    aliPayUrl: 'http://192.168.2.238:8044/pay/callback/redirect', // dev

    // unlogin: 'http://172.16.30.149:8069/company_externa',
    // needLogin: 'http://172.16.30.149:8037/company_b',
    // needLogin: 'http://172.16.30.149:8022/company_b',
  },

  beforeProd: {
    /* 预发布 */
    unlogin: 'http://yfbunionpaygate.snet/v1.0/company_external',
    needLogin: 'http://yfbunionpaygate.snet/v1.0/company_b',
    toolHost: 'https://tool.goodsogood.com/gs_dicitem',
    aliPayUrl: 'http://192.168.2.235:8044/pay/callback/redirect', // dev
  },

  prod: {
    /* 正式 */
    unlogin: 'https://ylgs.goodsogood.com/v1.0/company_external',
    needLogin: 'https://ylgs.goodsogood.com/v1.0/company_b',
    toolHost: 'http://tool.goodsogood.online/gs_dicitem/',
    aliPayUrl: 'https://appbaseplatform.goodsogood.com/pay/callback/redirect',
  },
};
