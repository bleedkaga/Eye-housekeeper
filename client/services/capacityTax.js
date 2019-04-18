export default {
  // 薪筹试算
  taxTrial: '/gsTaxPayment/getLaborCostTrial',
  // 单个用户薪筹试算
  taxTrialOne: '/gsTaxPayment/singleBenefitCalculation',
  // 获取费率
  gsRate: {
    url: '/gsSalaryDetails/acquisitionCompanyRate',
    method: 'post',
  },
  // 众包成本测算费率
  queryCrowdRate: {
    url: '/crowdsourcingCalc/queryCrowdRate',
    method: 'post',
  },
  // 众包成本测算
  costCalculate: {
    url: '/crowdsourcingCalc/costCalculate',
    method: 'post',
  },
  // 下载模板
  downSchemeTemplate: {
    url: '/gsTaxPayment/getTemplateUrl',
    method: 'post',
  },
  // 生成方案
  createScheme: {
    url: '/gsSalaryDetails/confirmationPlan',
    method: 'post',
  },
  // 查询方案
  queryScheme: {
    url: '/gsSalaryDetails/getPackageInformation',
    method: 'post',
  },
  // 下载方案
  downScheme: {
    url: '/gsSalaryDetails/downloadTheProgram',
    method: 'post',
  },
  // 添加员工
  addPerson: {
    url: '/gsSalaryDetails/improvePersonalInformation',
    method: 'post',
  },
  // 确认方案
  confirmScheme: {
    url: '/gsSalaryDetails/determineSolution',
    method: 'post',
  },
  // 发布任务
  programRelease: {
    url: '/gsSalaryDetails/programRelease',
    method: 'post'
  },
  // 线上转账
  onlinePayment: {
    url: '/gsMoneyBuy/payThePayment',
    method: 'post',
  },
  // 线下转账
  offlinePayment: {
    url: '/gsMoneyBuy/offlineFundAccount',
    method: 'post',
  },
  // 转账成功?
  paymentIsSuccess: {
    url: '/gsMoneyBuy/companyCashaccountDepositQuery',
    method: 'post',
  },
  // 获取执行成功失败数
  pollingResult: {
    url: '/gsDetailedPayrollRecords/resultEnforcement',
    method: 'post',
  },
  // 获取税筹订单支付信息
  getPaymentFees: {
    url: '/gsSalaryDetails/getPaymentFees',
    method: 'post',
  },
};
