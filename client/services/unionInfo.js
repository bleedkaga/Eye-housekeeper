export default {
  // 工会组织信息
  getGroupByIdDetail: {
    url: '/unionInfo/getGroupByIdDetail',
    method: 'post',
  },
  //新增
  insertGroup: {
    url: '/unionInfo/insertGroup',
    method: 'post',
  },
  //修改
  updateGroup: {
    url: '/unionInfo/updateGroup',
    method: 'post',
  },
  //工商
  searchCompanyName: {
    url: '/unionInfo/searchCompanyName',
    method: 'post',
  },
  //非工商
  findCompanyNameList: {
    url: '/unionInfo/findCompanyNameList',
    method: 'post',
  },
  //工会或者单位保存关联单位
  insertCompanyAssociated: {
    url: '/unionInfo/insertCompanyAssociated',
    method: 'post',
  },
  //查询下属单位列表
  getCompanyAssociatedList: {
    url: '/unionInfo/getCompanyAssociatedList',
    method: 'post',
  },
  //工会或者单位编辑关联单位
  updateCompanyAssociated: {
    url: '/unionInfo/updateCompanyAssociated',
    method: 'post',
  },
  //工会删除关联单位
  deleteCompanyAssociated: {
    url: '/unionInfo/deleteCompanyAssociated',
    method: 'post',
  },
};
