export default {
  findProvince: {
    url: '/public/findProvince',
    method: 'post',
  },
  findCity: {
    url: '/public/findCity',
    method: 'post',
  },
  findArea: {
    url: '/public/findArea',
    method: 'post',
  },
  findStreet: {
    url: '/public/findStreet',
    method: 'post',
  },
  findFirstValList: {
    url: '/public/findFirstValList',
    method: 'post',
  },
  findSecondValList: {
    url: '/public/findSecondValList',
    method: 'post',
  },
  findFirstValListNoAll: {
    url: '/public/findFirstValListNoAll',
    method: 'post',
  },

  uploadImage: {
    url: '/public/uploadImage',
    method: 'post',
  },

  //使用方案上传模板
  getUploadData: {
    url: '/public/getUploadData',
    method: 'post',
  },
  // 上传自定义方案模板
  updateCustomIssue: {
    url: '/public/updateCustomIssue',
    method: 'post',
  },
  // 上传众包名单, 人员账户信息
  uploadPersonList: {
    url: '/public/uploadPersonList',
    method: 'post',
  },
  //上传excel
  uploadData: {
    url: '/public/uploadData',
    method: 'post',
  },

  //获取当前用户的菜单列表（权限列表）
  menuList: {
    url: '/public/menuList',
    method: 'post',
  },

  // 权限验证
  checkIfThePayrollIsOpen: {
    url: '/gsServicePurchase/checkIfThePayrollIsOpen',
    method: 'post',
  },

  // 购买VIP
  subscribeToAService: {
    url: '/gsServicePurchase/subscribeToAService',
    method: 'post',
  },
  //微信 支付宝在线充值
  onlineRechargePrepay: {
    url: '/gsMoneyBuy/onlineRechargePrepay',
    method: 'post',
  },

  //单位线下充值
  offlineFinance: {
    url: '/gsMoneyBuy/offlineFinance',
    method: 'post',
  },
  //检查支付是否成功
  checkPayIsSuccess: {
    url: '/gsMoneyBuy/PUBLICKcompanyCashaccountDepositQuery',
    method: 'post',
  },

  // 获取会员模版下载地址
  getDownloadTemplate: {
    url: '/public/getDownloadTemplate',
    method: 'post',
  },

  // 签订协议
  updatePayStatus: {
    url: '/public/updatePayStatus',
    method: 'post',
  },

  // 查询签订的担保协议
  queryOpenPayStatus: {
    url: '/public/queryOpenPayStatus',
    method: 'post',
  },
};
