export default {
  // 查询部门
  queryDepartment: {
    url: '/depart/queryDepartment',
    method: 'post',
  },
  // 查询管理员
  queryAdministrator: {
    url: '/depart/queryAdministrator',
    method: 'post',
  },
  // 查询上下级关系
  queryLowerAndUpperDepartments: {
    url: '/depart/queryLowerAndUpperDepartments',
    method: 'post',
  },
  // 获取设置管理员名单 --- wmz
  queryManager: {
    url: '/gsDepartment/queryManager',
    method: 'post',
  },
  // 更改部门名称
  updateDepartment: {
    url: '/depart/updateDepartment',
    method: 'post',
  },
  // 删除部门
  delDepartment: {
    url: '/depart/delDepartment',
    method: 'post',
  },
  //取消管理员
  deleteDepartmentAdministrator: {
    url: '/depart/deleteDepartmentAdministrator',
    method: 'post',
  },
  //取消最外层的管理员
  deleteAccountById: {
    url: '/depart/deleteAccountById',
    method: 'post',
  },
  //增加部门
  addDepartment: {
    url: '/depart/addDepartment',
    method: 'post',
  },
  //调整部门排序
  editDepartmentSort: {
    url: '/depart/editDepartmentSort',
    method: 'post',
  },
  //批量转移员工
  departmentDatch: {
    url: '/depart/departmentDatch',
    method: 'post',
  },
  //更改上级部门
  editDepartmentParent: {
    url: '/depart/editDepartmentParent',
    method: 'post',
  },
};
