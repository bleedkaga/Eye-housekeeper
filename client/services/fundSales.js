export default {
  // 进页面拉取数据
  rmbAccountinquiry: {
    url: '/gsRmbCapitalFlow/rmbAccountinquiry',
    method: 'post',
  },
  conditionalQuery: {
    url: '/gsMeccaAccountCapitalFlow/conditionalQuery',
    method: 'post',
  },
  originPullDetail: {
    url: '/gsPersonalFundFlowDetails/COMPANYuserPersonalFlowQuery',
    method: 'post',
  },
  cashExport: {
    url: '/gsRmbCapitalFlow/rmbCapitalFlowExport',
    method: 'post',
  },
  companyExport: {
    url: '/gsMeccaAccountCapitalFlow/cashAccountFlowExport',
    method: 'post',
  },
};
