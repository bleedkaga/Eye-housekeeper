export default{
  //获取记录
  querySendRecord: {
    url: '/notice/querySendRecord',
    method: 'post',
  },

  //发送通知
  sendNotification: {
    url: '/notice/sendNotification',
    method: 'post',
  },

  //修改
  updateSendContent: {
    url: '/notice/updateSendContent',
    method: 'post',
  },

  queryDetailedDeliveryRecord: {
    url: '/notice/queryDetailedDeliveryRecord',
    method: 'post',
  },

  singleResend: {
    url: '/notice/singleResend',
    method: 'post',
  },

  resendAllTheInformation: {
    url: '/notice/resendAllTheInformation',
    method: 'post',
  },
};
