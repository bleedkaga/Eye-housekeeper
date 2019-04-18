export default {
  applyInvoice: {
    url: '/taxation/applyInvoice',
    method: 'post',
  },
  invoicesInfoList: {
    url: '/taxation/invoicesInfoList',
    method: 'post',
  },
  // invoicesInfoList : {
  //     url: '/taxation/applyInvoice',
  //     method: 'post'
  // }
  queryRecipientInfo: {
    url: '/taxation/queryRecipientInfo',
    method: 'post',
  },
  updateIndustrySubsidiaryInfo: {
    url: '/taxation/updateIndustrySubsidiaryInfo',
    method: 'post',
  },
  queryInvoiceBaseInfo: {
    url: '/taxation/queryInvoiceBaseInfo',
    method: 'post',
  },
  invoiceDetailPageList: {
    url: '/taxation/invoiceDetailPageList',
    method: 'post',
  },

  // 提交开票申请
  submitApplyInvoice: {
    url: '/taxation/submitApplyInvoice',
    method: 'post',
  },

  // 开票记录
  invoiceDetailRecordList: {
    url: '/taxation/invoiceDetailRecordList',
    method: 'post',
  },

  // 查看记录，发票详情
  showInvoiceDetail: {
    url: '/taxation/showInvoiceDetail',
    method: 'post',
  },
};
