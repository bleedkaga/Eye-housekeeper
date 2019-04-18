
export default{
  //部门查询
  getDeptMenu: {
    url: '/sendDepartment/getDeptMenu',
    method: 'post',
  },
  //查询积分
  findBalance: {
    url: '/sendDepartment/findBalance',
    method: 'post',
  },
  //发放配额给部门
  insertBatchMoneyDeptQuota: {
    url: '/sendDepartment/insertBatchMoneyDeptQuota',
    method: 'post',
  },
};
