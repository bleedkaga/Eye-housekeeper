export default {
  //用户查询
  queryUserStatus: {

    url: '/staff/queryUserStatus',
    method: 'post',
  },
  //部门查询
  findDepartmentByCompanyId: {
    url: '/staff/findDepartmentByCompanyId',
    method: 'post',
  },
  //员工信息表下载
  getExportMember: {
    url: '/staff/getExportMember',
    method: 'post',
  },
  //认证审核
  approved: {
    url: '/staff/approved',
    method: 'post',
  },
  //用户离职
  userDeparture: {
    url: '/staff/userDeparture',
    method: 'post',
  },
  //离职人员信息
  checkOutResignationStaff: {
    url: '/staff/checkOutResignationStaff',
    method: 'post',
  },
  //手机号码唯一检测 (新增人员处检测)  --- wmz
  phoneVerification: {
    url: '/staff/phoneVerification',
    method: 'post',
  },
  //新增人员 --- wmz
  addUser: {
    url: '/staff/addUser',
    method: 'post',
  },
  //查询人员 --- wmz
  queryUserInfo: {
    url: '/staff/queryUserInfo',
    method: 'post',
  },
  //修改人员 --- wmz
  updateUserInfo: {
    url: '/staff/updateUserInfo',
    method: 'post',
  },
  //查询临时人员 --- wmz
  uploadDataList: {
    url: '/staff/uploadDataList',
    method: 'post',
  },
  //修改临时人员 --- wmz
  updateTemporaryData: {
    url: '/staff/updateTemporaryData',
    method: 'post',
  },
  //导入临时用户 ---wmz
  startBulkImport: {
    url: '/staff/startBulkImport',
    method: 'post',
  },
  //清空临时用户 ---wmz
  uploadDataEmpty: {
    url: '/staff/uploadDataEmpty',
    method: 'post',
  },
  //人事异动-（用户修改部门）
  personnelDepartmentTransfer: {
    url: '/staff/personnelDepartmentTransfer',
    method: 'post',
  },
  //发放查询选择数据
  getSelectedMember: {
    url: '/staff/getSelectedMember',
    method: 'post',
  },
};
