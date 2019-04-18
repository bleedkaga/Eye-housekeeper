export default {
  // 发放记录详情
  queryDetail: {
    url: '/gsDetailedPayrollRecords/queryInDetail',
    method: 'post',
  },
  // 查询发放记录
  querySendRecord: {
    url: '/gsDetailedPayrollRecords/queryInformationReleaseRecord',
    method: 'post',
  },
  // 撤销方案
  revocationScheme: {
    url: '/gsSalaryDetails/revocationScheme',
    method: 'post',
  },
  // 下载方案-自定义
  downSelfScheme: {
    url: '/gsSalaryDetails/customSchemeDownload',
    method: 'post',
  },
  // 下载方案-系统方案
  downSystemScheme: {
    url: '/gsSalaryDetails/downloadTheProgram',
    method: 'post',
  },
  // 再次执行
  sendAgen: {
    url: '/gsDetailedPayrollRecords/onceAgainIssued',
    method: 'post',
  },
  // 结束任务
  overTask: {
    url: '/gsDetailedPayrollRecords/endtask',
    method: 'post',
  },
  // 放款多人
  sendMoney: {
    url: '/gsDetailedPayrollRecords/companyAdvanceLoan',
    method: 'post',
  },
  // 放款单个
  sendMoneyToOne: {
    url: '/gsDetailedPayrollRecords/personalAdvanceLoan',
    method: 'post',
  }
};
