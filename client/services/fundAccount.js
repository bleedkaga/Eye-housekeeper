export default {
  // 进页面拉取数据
  cashWelfareRechargeRecordInquiry: {
    url: '/gsPayrollRecords/cashWelfareRechargeRecordInquiry',
    method: 'post',
  },
  checkCompanyWelfareAccountRechargeRecord: {
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
