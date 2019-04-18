
export default{
  //查询关联单位
  getCompanyAssociatedByIdOrTotalPeople: {
    url: '/sendUnit/getCompanyAssociatedByIdOrTotalPeople',
    method: 'post',
  },
  //查询用户积分
  findBalance: {
    url: '/coupons/findBalance',
    method: 'post',
  },
  //发放给关联单位
  insertBatchMoneyCompanyQuota: {
    url: '/sendUnit/insertBatchMoneyCompanyQuota',
    method: 'post',
  },
};
