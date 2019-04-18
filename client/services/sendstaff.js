
export default {
  //查询可用点劵积分
  findBalance: {
    url: '/coupons/findBalance',
    method: 'post',
  },
  //查询用户数据
  queryUserStatus: {
    url: '/sendstaff/queryUserStatus',
    method: 'post',
  },
  //发放选择类型
  sendType: {
    url: '/sendstaff/sendType',
    method: 'post',
  },
  //通过三级事由code和value查询特殊说明
  findSpecialNoteByThirdReason: {
    url: '/sendstaff/findSpecialNoteByThirdReason',
    method: 'post',
  },
  checkIsPassword: {
    url: '/sendstaff/checkIsPassword',
    method: 'post',
  },
  sendUserMoney: {
    url: '/sendstaff/sendUserMoney',
    method: 'post',
  },
  insertUploadSource: {
    url: '/sendstaff/insertUploadSource',
    method: 'post',
  },
  listSourceUploadMes: {
    url: '/sendstaff/listSourceUploadMes',
    method: 'post',
  },
  againSendMoneyTask: {
    url: '/sendstaff/againSendMoneyTask',
    method: 'post',
  },
};
