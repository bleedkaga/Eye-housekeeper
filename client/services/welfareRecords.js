export default {

  //tab1 列表获取
  sendMoneyTaskList: {
    url: '/gsMoneySendTask/sendMoneyTaskList',
    method: 'post',
  },

  findMoneyQuotaList: {
    url: '/gsMoneySendQuotaRecord/findMoneyQuotaList',
    method: 'post',
  },

  //tab1详情
  enquiriesAreIssuedForDetails: {
    url: '/gsMoneySendTaskDetail/enquiriesAreIssuedForDetails',
    method: 'post',
  },

  sendRecordDetailExport: {
    url: '/gsMoneySendTaskDetail/sendRecordDetailExport',
    method: 'post',
  },

  //tab2, tab3 详情
  findMoneyQuotaDetailedList: {
    url: '/gsMoneyQuotaDetailedList/findMoneyQuotaDetailedList',
    method: 'post',
  },
  //tab2, tab3 导出
  exportReleaseList: {
    url: '/gsMoneyQuotaDetailedList/exportReleaseList',
    method: 'post',
  },

  data: [
    {
      url: '/gsMoneySendTask/sendMoneyTaskList',
      method: 'post',
    },
    {
      url: '/gsMoneySendQuotaRecord/findMoneyQuotaList',
      method: 'post',
    },
    {
      url: '/gsMoneySendQuotaRecord/findMoneyQuotaList',
      method: 'post',
    },
  ],
  checkList: [
    {
      url: '/gsMoneySendTaskDetail/enquiriesAreIssuedForDetails',
      method: 'post',
    },
    {
      url: '/gsMoneyQuotaDetailedList/findMoneyQuotaDetailedList',
      method: 'post',
    },
    {
      url: '/gsMoneyQuotaDetailedList/findMoneyQuotaDetailedList',
      method: 'post',
    },
  ],
  exports: [
    {
      url: '/gsMoneySendTaskDetail/sendRecordDetailExport',
      method: 'post',
    },
    {
      url: '/gsMoneyQuotaDetailedList/exportReleaseList',
      method: 'post',
    },
    {
      url: '/gsMoneyQuotaDetailedList/exportReleaseList',
      method: 'post',
    },
  ],

  auditSendMoneyTask: {
    url: '/gsMoneySendTask/auditSendMoneyTask',
    method: 'post',
  },

  findAuditSendMoneyTask: {
    url: '/gsMoneySendTask/findAuditSendMoneyTask',
    method: 'post',
  },
};

