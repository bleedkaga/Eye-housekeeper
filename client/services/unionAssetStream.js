export default {
  // 进页面拉取数据
  originPullCash: {
    url: '/gsMeccaAccountCapitalFlow/UNIONconditionalQuery',
    method: 'post',
  },
  originPullDetail: {
    url: '/gsPersonalFundFlowDetails/userPersonalFlowQuery',
    method: 'post',
  },
  cashExport: {//导出
    url: '/gsMeccaAccountCapitalFlow/UNIONcashAccountFlowExport',
    method: 'post',
  },
};

