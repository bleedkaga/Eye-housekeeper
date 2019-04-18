
export default{
  // 查询部门配额余量
  quotaAllowanceDepartment: {
    url: '/quotaBalance/quotaAllowanceDepartment',
    method: 'post',
  },
  //单位转账额度查询
  queryAssociatedUnitIssueBalance: {
    url: '/transferStatistics/queryAssociatedUnitIssueBalance',
    method: 'post',
  },
  //获取单位转账额度详细查询
  getReleaseDetailedData: {
    url: '/transferStatistics/getReleaseDetailedData',
    method: 'post',
  },
};
