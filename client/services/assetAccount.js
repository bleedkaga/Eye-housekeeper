export default {
  // 进页面拉取数据
  originPullCash: {
    url: '/gsPayrollRecords/cashWelfareRechargeRecordInquiry',
    method: 'post',
  },
  originPullCompany: {
    url: '/gsMoneyBuy/checkCompanyWelfareAccountRechargeRecord',
    method: 'post',
  },
  cashExport: {//导出EXCEL
    url: '/gsPayrollRecords/cashBenefitRechargeRecordExport',
    method: 'post',
  },
  companyExport: {
    url: '/gsMoneyBuy/rechargeRecordExport',
    method: 'post',
  },
};
