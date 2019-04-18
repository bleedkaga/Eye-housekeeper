export default {
  // 进页面拉取数据
  originPullCash: {
    url: '/gsMoneyBuy/UNIONcheckCompanyWelfareAccountRechargeRecord',
    method: 'post',
  },
  cashExport: {//导出EXCEL
    url: '/gsMoneyBuy/UNIONrechargeRecordExport',
    method: 'post',
  },

  remianShow: {//顶部余额
    url: '/gsMoneyTradingTotal/UNIONfindBalance',
    method: 'post',
  },
};
