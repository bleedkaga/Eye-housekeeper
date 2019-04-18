const router = require('koa-better-router')().loadMethods();
const path = require('path');

const filter = require('require-all')({
  dirname: path.join(__dirname, './filter'),
});

const controller = require('require-all')({
  dirname: path.join(__dirname, './controller'),
});

const api = require('require-all')({
  dirname: path.join(__dirname, './api'),
});

//封装需要登录检查的接口
const apiWrapper = {
  get: (url, apiController) => {
    router.get(url, filter.verifyApi, apiController, filter.verifyApiAfter);
  },
  post: (url, apiController) => {
    router.post(url, filter.verifyApi, apiController, filter.verifyApiAfter);
  },
};

//通用接口
router.post('/api/public/findProvince', api.public.findProvince);//获取省市区和街道
router.post('/api/public/findCity', api.public.findCity);
router.post('/api/public/findArea', api.public.findArea);
router.post('/api/public/findStreet', api.public.findStreet);
router.post('/api/public/findFirstValList', api.public.findFirstValList); //获取行业类型
router.post('/api/public/findSecondValList', api.public.findSecondValList); //获取行业类型
router.post('/api/public/findFirstValListNoAll', api.public.findFirstValListNoAll); //获取行业类型
apiWrapper.post('/api/public/getDownloadTemplate', api.public.getDownloadTemplate); //获取-上传会员模板
apiWrapper.post('/api/public/updatePayStatus', api.public.updatePayStatus); // 签订协议
apiWrapper.post('/api/public/queryOpenPayStatus', api.public.queryOpenPayStatus); // 获取签订了那些担保协议

router.post('/api/public/menuList', api.public.menuList); //获取当前用户的菜单列表（权限列表）

apiWrapper.post('/api/public/uploadImage', api.upload.uploadImage); //上传图片接口
apiWrapper.post('/api/public/uploadPersonList', api.upload.uploadPersonList); // 上传众包名单, 人员账户信息
apiWrapper.post('/api/public/getUploadData', api.upload.getUploadData); //使用方案上传模板
apiWrapper.post('/api/public/updateCustomIssue', api.upload.updateCustomIssue); //上传自定义方案模板
apiWrapper.post('/api/public/uploadData', api.upload.uploadData); //上传excel

// 智能财税
apiWrapper.post('/api/taxation/invoicesInfoList', api.invoices.invoicesInfoList); //发票申请
apiWrapper.post('/api/taxation/applyInvoice', api.invoices.applyInvoice); //申请开票
apiWrapper.post('/api/taxation/queryRecipientInfo', api.invoices.queryRecipientInfo); //申请开票参数
apiWrapper.post('/api/taxation/updateIndustrySubsidiaryInfo', api.invoices.updateIndustrySubsidiaryInfo); //申请开票参数
apiWrapper.post('/api/taxation/queryInvoiceBaseInfo', api.invoices.queryInvoiceBaseInfo); //申请开票参数
apiWrapper.post('/api/taxation/invoiceDetailPageList', api.invoices.invoiceDetailPageList); //申请开票参数
apiWrapper.post('/api/taxation/submitApplyInvoice', api.invoices.submitApplyInvoice); //申请开票参数
apiWrapper.post('/api/taxation/invoiceDetailRecordList', api.invoices.invoiceDetailRecordList); //申请开票参数
apiWrapper.post('/api/taxation/showInvoiceDetail', api.invoices.showInvoiceDetail); //查看发票详情

router.post('/api/goodSoGood/getListOfManagementCompany', api.goodSoGood.getListOfManagementCompany);//获取用户的单位列表
//登录注册
router.post('/api/goodSoGood/login', api.goodSoGood.login);// 登录
router.post('/api/goodSoGood/loginChoose', api.goodSoGood.loginChoose);// 选择单位登录
router.post('/api/goodSoGood/updatePassWord', api.goodSoGood.updatePassWord);//忘记密码
router.post('/api/goodSoGood/getVfCodePhoneToken', api.goodSoGood.getVfCodePhoneToken);//验证码token
router.post('/api/goodSoGood/getVerificationCode', api.goodSoGood.getVerificationCode);//获取验证码
router.post('/api/goodSoGood/verificationCodeCheck', api.goodSoGood.verificationCodeCheck);//校验手机号码与验证码是否正确
router.post('/api/goodSoGood/searchCompanyName', api.goodSoGood.searchCompanyName);//注册时的工商信息
router.post('/api/goodSoGood/insertRegisterCompany', api.goodSoGood.insertRegisterCompany);//注册时注册
router.post('/api/goodSoGood/checkIfTheUserExists', api.goodSoGood.checkIfTheUserExists);//检测是否注册


//管理员管理
apiWrapper.post('/api/administrator/accountList', api.administrator.accountList);//获取管理员列表
apiWrapper.post('/api/administrator/insertAccount', api.administrator.insertAccount);//添加管理员
apiWrapper.post('/api/administrator/getAccountId', api.administrator.getAccountId);//获取管理员
apiWrapper.post('/api/administrator/updateAccount', api.administrator.updateAccount);//修改管理员
apiWrapper.post('/api/administrator/deleteAccountById', api.administrator.deleteAccountById);//移除管理员
apiWrapper.post('/api/administrator/handOverManager', api.administrator.handOverManager);//移交超级管理员
apiWrapper.post('/api/administrator/updatePassWord', api.administrator.updatePassWord);//修改登陆密码或者支付密码


//首页接口
apiWrapper.post('/api/dashboard/gsIndex', api.dashboard.gsIndex);//首页数据获取（statisticalUnitStaffChanges）
apiWrapper.post('/api/dashboard/queryPersonnelChange', api.dashboard.queryPersonnelChange);//人员变更查询


// 智能薪筹模块
// 首页众包成本测算费率
apiWrapper.post('/api/crowdsourcingCalc/queryCrowdRate', api.costCalculate.queryCrowdRate);
// 首页众包成本测算
apiWrapper.post('/api/crowdsourcingCalc/costCalculate', api.costCalculate.costCalculate);
// 权限效验接口
apiWrapper.post('/api/gsServicePurchase/checkIfThePayrollIsOpen', api.goodSoGood.checkIfThePayrollIsOpen);
// 购买VIP
apiWrapper.post('/api/gsServicePurchase/subscribeToAService', api.goodSoGood.subscribeToAService);
// 微信 支付宝在线充值
apiWrapper.post('/api/gsMoneyBuy/onlineRechargePrepay', api.goodSoGood.onlineRechargePrepay);
// 单位线下充值
apiWrapper.post('/api/gsMoneyBuy/offlineFinance', api.goodSoGood.offlineFinance);
// 检查支付是否成功
apiWrapper.post('/api/gsMoneyBuy/PUBLICKcompanyCashaccountDepositQuery', api.goodSoGood.PUBLICKcompanyCashaccountDepositQuery);
// 税筹试算
apiWrapper.post('/api/gsTaxPayment/getLaborCostTrial', api.taxPlan.taxTrial);
// 单个用户计算薪筹
apiWrapper.post('/api/gsTaxPayment/singleBenefitCalculation', api.taxPlan.taxTrialOne);

// 任务中心
// 获取用户任务中心数据（旧的已经不用了）
apiWrapper.post('/api/taskCenter/getMissionCenter', api.taskCenter.getMissionCenter);
// 保存用户任务中心数据（旧的已经不用了）
apiWrapper.post('/api/taskCenter/addOrUpdateTaskInformation', api.taskCenter.addOrUpdateTaskInformation);
//获取用户任务中心数据
apiWrapper.post('/api/taskCenter/getClassification', api.taskCenter.getClassification);
// 保存用户任务中心数据
apiWrapper.post('/api/taskCenter/addClassification', api.taskCenter.addClassification);
//获取自定义一级数据
apiWrapper.post('/api/taskCenter/getFirstClassification', api.taskCenter.getFirstClassification);
//获取自定义二级数据
apiWrapper.post('/api/taskCenter/getSecondCustomTask', api.taskCenter.getSecondCustomTask);
//批量添加一级二级数据
apiWrapper.post('/api/taskCenter/batchClassification', api.taskCenter.batchClassification);
//删除子任务
apiWrapper.post('/api/taskCenter/delClassification', api.taskCenter.delClassification);
//删除父任务
apiWrapper.post('/api/taskCenter/delFatherClassification', api.taskCenter.delFatherClassification);
//删除已选的自定义任务
apiWrapper.post('/api/taskCenter/delSelectClassification', api.taskCenter.delSelectClassification);
//单个用户任务信息获取
apiWrapper.post('/api/taskCenter/getUserCustomTask', api.taskCenter.getUserCustomTask);
//单个用户任务添加
apiWrapper.post('/api/taskCenter/addUserCustomTask', api.taskCenter.addUserCustomTask);


// 众包名单
// 查询人员信息
apiWrapper.post('/api/gsPersonalBankAccount/getPersonnelManagement', api.taxList.queryPersonInfo);
// 下载人员名单
apiWrapper.post('/api/gsPersonalBankAccount/downloadCompanyInfo', api.taxList.downloadPersonInfo);
// 绑定银行卡号
apiWrapper.post('/api/gsPersonalBankAccount/setBankCard', api.taxList.bindBankNo);
//给当前用户添加任务
apiWrapper.post('/api/gsUserCustomTask/addUserCustomTask', api.taxList.addUserCustomTask);

// 税筹规划
// 众包 费率
apiWrapper.post('/api/gsSalaryDetails/acquisitionCompanyRate', api.taxPlan.getRate);
// 模板下载
apiWrapper.post('/api/gsTaxPayment/getTemplateUrl', api.taxPlan.downSchemeTemplate);
// 生成方案
apiWrapper.post('/api/gsSalaryDetails/confirmationPlan', api.taxPlan.createScheme);
// 查询方案
apiWrapper.post('/api/gsSalaryDetails/getPackageInformation', api.taxPlan.queryScheme);
// 下载方案
apiWrapper.post('/api/gsSalaryDetails/downloadTheProgram', api.taxPlan.downScheme);
// 新增员工
apiWrapper.post('/api/gsSalaryDetails/improvePersonalInformation', api.taxPlan.addPerson);
// 确认方案
apiWrapper.post('/api/gsSalaryDetails/determineSolution', api.taxPlan.confirmScheme);
// 发布任务
apiWrapper.post('/api/gsSalaryDetails/programRelease', api.taxPlan.programRelease);
// 线上转账
apiWrapper.post('/api/gsMoneyBuy/payThePayment', api.taxPlan.onlinePayment);
// 线下转账
apiWrapper.post('/api/gsMoneyBuy/offlineFundAccount', api.taxPlan.offlinePayment);
// 支付成功?
apiWrapper.post('/api/gsMoneyBuy/companyCashaccountDepositQuery', api.taxPlan.paymentIsSuccess);
// 获取成功失败数
apiWrapper.post('/api/gsDetailedPayrollRecords/resultEnforcement', api.taxPlan.pollingResult);
//获取税筹订单支付信息
apiWrapper.post('/api/gsSalaryDetails/getPaymentFees', api.taxPlan.getPaymentFees);


// 发放记录
// 查询发放记录
apiWrapper.post('/api/gsDetailedPayrollRecords/queryInformationReleaseRecord', api.taxSendRecord.querySendRecord);
// 发放记录详情
apiWrapper.post('/api/gsDetailedPayrollRecords/queryInDetail', api.taxSendRecord.queryDetail);
// 撤销方案
apiWrapper.post('/api/gsSalaryDetails/revocationScheme', api.taxSendRecord.revocationScheme);
// 下载方案-系统
apiWrapper.post('/api/gsSalaryDetails/downloadTheProgram', api.taxSendRecord.downSystemScheme);
// 下载方案-自定义
apiWrapper.post('/api/gsSalaryDetails/customSchemeDownload', api.taxSendRecord.downSelfScheme);
// 再次发放
apiWrapper.post('/api/gsDetailedPayrollRecords/onceAgainIssued', api.taxSendRecord.sendAgen);
// 结束任务
apiWrapper.post('/api/gsDetailedPayrollRecords/endtask', api.taxSendRecord.overTask);
// 放款
apiWrapper.post('/api/gsDetailedPayrollRecords/companyAdvanceLoan', api.taxSendRecord.sendMoney);
// 放款给个人
apiWrapper.post('/api/gsDetailedPayrollRecords/personalAdvanceLoan', api.taxSendRecord.sendMoneyToOne);

// 智能人事模块
//电子档案---用户查询
apiWrapper.post('/api/staff/queryUserStatus', api.staff.queryUserStatus);
//电子档案---高级查询部门查询
apiWrapper.post('/api/staff/findDepartmentByCompanyId', api.staff.findDepartmentByCompanyId);
//电子档案---导出用户
apiWrapper.post('/api/staff/getExportMember', api.staff.getExportMember);
//电子档案---认证审核
apiWrapper.post('/api/staff/approved', api.staff.approved);
//电子档案---用户离职
apiWrapper.post('/api/staff/userDeparture', api.staff.userDeparture);
//电子档案---离职人员信息
apiWrapper.post('/api/leaveStaff/checkOutResignationStaff', api.leaveStaff.checkOutResignationStaff);

apiWrapper.post('/api/staff/checkOutResignationStaff', api.staff.checkOutResignationStaff);
//电子档案---手机号码唯一检测 (新增人员处检测)  --- wmz
apiWrapper.post('/api/staff/phoneVerification', api.staff.phoneVerification);
//电子档案---新增人员 --- wmz
apiWrapper.post('/api/staff/addUser', api.staff.addUser);
//电子档案---查询人员 --- wmz
apiWrapper.post('/api/staff/queryUserInfo', api.staff.queryUserInfo);
//电子档案---修改人员 --- wmz
apiWrapper.post('/api/staff/updateUserInfo', api.staff.updateUserInfo);
//查询临时用户---wmz
apiWrapper.post('/api/staff/uploadDataList', api.staff.uploadDataList);
//修改临时用户信息---wmz
apiWrapper.post('/api/staff/updateTemporaryData', api.staff.updateTemporaryData);
//导入临时用户 ---wmz
apiWrapper.post('/api/staff/startBulkImport', api.staff.startBulkImport);
//清空临时用户 ---wmz
apiWrapper.post('/api/staff/uploadDataEmpty', api.staff.uploadDataEmpty);
//人事异动-（用户修改部门）
apiWrapper.post('/api/staff/personnelDepartmentTransfer', api.staff.personnelDepartmentTransfer);
//发放查询选择数据
apiWrapper.post('/api/staff/getSelectedMember', api.staff.getSelectedMember);

// 组织结构模块
// 查询部门
apiWrapper.post('/api/depart/queryDepartment', api.depart.queryDepartment);
// 查询管理员
apiWrapper.post('/api/depart/queryAdministrator', api.depart.queryAdministrator);
//查询上下级
apiWrapper.post('/api/depart/queryLowerAndUpperDepartments', api.depart.queryLowerAndUpperDepartments);
//获取设置管理员名单 --- wmz
apiWrapper.post('/api/gsDepartment/queryManager', api.depart.queryManager);
//修改部门名称
apiWrapper.post('/api/depart/updateDepartment', api.depart.updateDepartment);
//删除部门
apiWrapper.post('/api/depart/delDepartment', api.depart.delDepartment);
//取消管理员
apiWrapper.post('/api/depart/deleteDepartmentAdministrator', api.depart.deleteDepartmentAdministrator);
// 取消最外层的管理员
apiWrapper.post('/api/depart/deleteAccountById', api.depart.deleteAccountById);
//新增部门
apiWrapper.post('/api/depart/addDepartment', api.depart.addDepartment);

//单位信息
apiWrapper.post('/api/company/getCompanyByIdDetail', api.company.getCompanyByIdDetail);
//单位信息--修改税务
apiWrapper.post('/api/company/updateIndustryBaseInfo', api.company.updateIndustryBaseInfo);
//查询公司名字
apiWrapper.post('/api/company/searchCompanyName', api.company.searchCompanyName);
//修改单位信息
apiWrapper.post('/api/company/updateCompany', api.company.updateCompany);


//调整部门排序
//调整部门排序查询临时用户
apiWrapper.post('/api/depart/editDepartmentSort', api.depart.editDepartmentSort);
//批量转移员工
apiWrapper.post('/api/depart/departmentDatch', api.depart.departmentDatch);
//更改上级部门
apiWrapper.post('/api/depart/editDepartmentParent', api.depart.editDepartmentParent);


//弹性福利
//查询可用点劵积分
apiWrapper.post('/api/coupons/findBalance', api.coupons.findBalance);
//发放单位--查询用户数据
apiWrapper.post('/api/sendstaff/queryUserStatus', api.sendstaff.queryUserStatus);
//弹性福利配发部门
apiWrapper.post('/api/sendDepartment/getDeptMenu', api.sendDepartment.getDeptMenu);
apiWrapper.post('/api/sendDepartment/insertBatchMoneyDeptQuota', api.sendDepartment.insertBatchMoneyDeptQuota);
//弹性福利配发部门查询积分配额
apiWrapper.post('/api/sendDepartment/findBalance', api.sendDepartment.findBalance);
//弹性福利 配发给关联单位
apiWrapper.post('/api/sendUnit/getCompanyAssociatedByIdOrTotalPeople', api.sendUnit.getCompanyAssociatedByIdOrTotalPeople);
apiWrapper.post('/api/sendUnit/insertBatchMoneyCompanyQuota', api.sendUnit.insertBatchMoneyCompanyQuota);
//弹性福利 各部门配发余额
apiWrapper.post('/api/quotaBalance/quotaAllowanceDepartment', api.quotaBalance.quotaAllowanceDepartment);
//弹性福利 各单位福利转账统计
apiWrapper.post('/api/transferStatistics/queryAssociatedUnitIssueBalance', api.transferStatistics.queryAssociatedUnitIssueBalance);
apiWrapper.post('/api/transferStatistics/getReleaseDetailedData', api.transferStatistics.getReleaseDetailedData);

//首页审核记录提示
apiWrapper.post('/api/gsMoneySendTask/findAuditSendMoneyTask', api.welfareRecords.findAuditSendMoneyTask);
// 福利记录 -- 发放给 员工
apiWrapper.post('/api/gsMoneySendTask/sendMoneyTaskList', api.welfareRecords.sendMoneyTaskList);
// 福利记录 -- 发放给 部门（/关联单位）
apiWrapper.post('/api/gsMoneySendQuotaRecord/findMoneyQuotaList', api.welfareRecords.findMoneyQuotaList);
// 福利记录 -- 取消部门配额发放
apiWrapper.post('/api/gsMoneySendQuotaRecord/cancelMoneyDeptQuotaSend', api.welfareRecords.cancelMoneyDeptQuotaSend);
// 福利记录 -- 发放清单
apiWrapper.post('/api/gsMoneyQuotaDetailedList/findMoneyQuotaDetailedList', api.welfareRecords.findMoneyQuotaDetailedList);
// 福利记录 -- 员工发放详细
apiWrapper.post('/api/gsMoneySendTaskDetail/enquiriesAreIssuedForDetails', api.welfareRecords.enquiriesAreIssuedForDetails);
// 福利记录 -- 员工发放详情导出地址
apiWrapper.post('/api/gsMoneySendTaskDetail/sendRecordDetailExport', api.welfareRecords.sendRecordDetailExport);
// 福利记录 -- 部门清单导出地址
apiWrapper.post('/api/gsMoneyQuotaDetailedList/exportReleaseList', api.welfareRecords.exportReleaseList);
// 审核发放记录，拒绝，通过，撤回
apiWrapper.post('/api/gsMoneySendTask/auditSendMoneyTask', api.welfareRecords.auditSendMoneyTask);
//(工会)政策文件
apiWrapper.post('/api/govHandle/findDocumentByKeyword', api.govHandle.findDocumentByKeyword);
//（工会）组织信息
apiWrapper.post('/api/unionInfo/getGroupByIdDetail', api.unionInfo.getGroupByIdDetail);
//（工会）新增工会
apiWrapper.post('/api/unionInfo/insertGroup', api.unionInfo.insertGroup);
//（工会）修改工会
apiWrapper.post('/api/unionInfo/updateGroup', api.unionInfo.updateGroup);

apiWrapper.post('/api/unionInfo/searchCompanyName', api.unionInfo.searchCompanyName);//工商注册名称查询
apiWrapper.post('/api/unionInfo/findCompanyNameList', api.unionInfo.findCompanyNameList);//非工商注册名称查询

apiWrapper.post('/api/unionInfo/insertCompanyAssociated', api.unionInfo.insertCompanyAssociated);//工会或者单位保存关联单位
apiWrapper.post('/api/unionInfo/getCompanyAssociatedList', api.unionInfo.getCompanyAssociatedList);//查询下属单位列表
apiWrapper.post('/api/unionInfo/updateCompanyAssociated', api.unionInfo.updateCompanyAssociated);//工会或者单位编辑关联单位
apiWrapper.post('/api/unionInfo/deleteCompanyAssociated', api.unionInfo.deleteCompanyAssociated);//工会删除关联单位

//工会---会员离会
apiWrapper.post('/api/unionStaff/leaveOperation', api.unionStaff.leaveOperation);
//工会---转会搜索单位
apiWrapper.post('/api/unionStaff/findCompanyNameList', api.unionStaff.findCompanyNameList);
//工会---转会操作
apiWrapper.post('/api/unionStaff/transferOperation', api.unionStaff.transferOperation);

//福利发放选择类型
apiWrapper.post('/api/sendstaff/sendType', api.sendstaff.sendType);
apiWrapper.post('/api/sendstaff/findSpecialNoteByThirdReason', api.sendstaff.findSpecialNoteByThirdReason);
apiWrapper.post('/api/sendstaff/checkIsPassword', api.sendstaff.checkIsPassword);
apiWrapper.post('/api/sendstaff/sendUserMoney', api.sendstaff.sendUserMoney);
apiWrapper.post('/api/sendstaff/againSendMoneyTask', api.sendstaff.againSendMoneyTask);
//上传资料
apiWrapper.post('/api/sendstaff/insertUploadSource', api.sendstaff.insertUploadSource);
apiWrapper.post('/api/sendstaff/listSourceUploadMes', api.sendstaff.listSourceUploadMes);
//设置---新增单位
router.post('/api/gsDictValue/findFirstValList', api.addcomPany.findFirstValList);
//设置---新增单位--查询公司名
apiWrapper.post('/api/addCompany/searchCompanyName', api.addcomPany.searchCompanyName);
//设置---新增单位--提交
apiWrapper.post('/api/addCompany/insertRegisterCompany', api.addcomPany.insertRegisterCompany);
//云账户--资金账户--初始拉数据-现金账户
apiWrapper.post('/api/gsPayrollRecords/cashWelfareRechargeRecordInquiry', api.assetAccount.cashWelfareRechargeRecordInquiry);
//云账户--资金账户--初始拉数据-单位福利账户
apiWrapper.post('/api/gsMoneyBuy/checkCompanyWelfareAccountRechargeRecord', api.assetAccount.checkCompanyWelfareAccountRechargeRecord);
//云账户--资金账户--现金导出
apiWrapper.post('/api/gsPayrollRecords/cashBenefitRechargeRecordExport', api.assetAccount.cashBenefitRechargeRecordExport);
//云账户--资金账户--单位导出
apiWrapper.post('/api/gsMoneyBuy/rechargeRecordExport', api.assetAccount.rechargeRecordExport);

//云账户--资金流水--初始拉数据-现金账户
apiWrapper.post('/api/gsRmbCapitalFlow/rmbAccountinquiry', api.assetStream.rmbAccountinquiry);
//云账户--资金流水--初始拉数据-单位福利账户
apiWrapper.post('/api/gsMeccaAccountCapitalFlow/conditionalQuery', api.assetStream.conditionalQuery);
//云账户--资金流水--现金导出
apiWrapper.post('/api/gsRmbCapitalFlow/rmbCapitalFlowExport', api.assetStream.rmbCapitalFlowExport);
//云账户--资金流水--单位导出
apiWrapper.post('/api/gsMeccaAccountCapitalFlow/cashAccountFlowExport', api.assetStream.cashAccountFlowExport);
//云账户--资金流水--初始拉数据-单位福利账户
apiWrapper.post('/api/gsPersonalFundFlowDetails/COMPANYuserPersonalFlowQuery', api.assetStream.COMPANYuserPersonalFlowQuery);
//云账户--工会-资金账户--初始拉数据
apiWrapper.post('/api/gsMoneyBuy/UNIONcheckCompanyWelfareAccountRechargeRecord', api.unionAssetAccount.UNIONcheckCompanyWelfareAccountRechargeRecord);
//云账户--工会-资金账户--导出
apiWrapper.post('/api/gsMoneyBuy/UNIONrechargeRecordExport', api.unionAssetAccount.UNIONrechargeRecordExport);
//云账户--工会-资金账户--顶部余额
apiWrapper.post('/api/gsMoneyTradingTotal/UNIONfindBalance', api.unionAssetAccount.UNIONfindBalance);

//云账户--工会-资金流水--初始拉数据
apiWrapper.post('/api/gsMeccaAccountCapitalFlow/UNIONconditionalQuery', api.unionAssetStream.UNIONconditionalQuery);
//云账户--工会-资金流水--导出
apiWrapper.post('/api/gsMeccaAccountCapitalFlow/UNIONcashAccountFlowExport', api.unionAssetStream.UNIONcashAccountFlowExport);

//云账户--工会-资金流水--个人详细查询
apiWrapper.post('/api/gsPersonalFundFlowDetails/userPersonalFlowQuery', api.unionAssetStream.userPersonalFlowQuery);

//通知管理
apiWrapper.post('/api/notice/querySendRecord', api.notice.querySendRecord);
apiWrapper.post('/api/notice/sendNotification', api.notice.sendNotification);
apiWrapper.post('/api/notice/updateSendContent', api.notice.updateSendContent);
apiWrapper.post('/api/notice/queryDetailedDeliveryRecord', api.notice.queryDetailedDeliveryRecord);
apiWrapper.post('/api/notice/singleResend', api.notice.singleResend);
apiWrapper.post('/api/notice/resendAllTheInformation', api.notice.resendAllTheInformation);


//--------------------------- 页面跳转 ---------------------------

// router.get('/', controller.home.index);

// 跳转支付页面
// router.get('/payment.html', controller.home.payment);

//在线支付页面
// router.get('/executePayment.html', controller.genAndExecute.executePayment.onlinePayment);

router.get('/login', filter.isLogin, controller.base.index);
router.get('/register', filter.isLogin, controller.base.index);
router.get('/forget', controller.base.index);
router.get('/editPwd', controller.base.index);
router.get('/login/logout', controller.login.logout);
router.get('/unsupported', controller.support.unsupported);

// if (process.env.NODE_ENV !== 'development') {
/* 首页服务端渲染 */
// router.get('/home/hot', controller.home.index);
// }
// 兜底
router.get('/*', (ctx, next) => {
  const GC = ctx.globalConfig;
  const ignorePath = [GC.apiPrefix, GC.staticPath, '/favicon.ico'];
  if (ignorePath.some(p => ctx.url.indexOf(p) !== -1)) {
    return true;
  }
  return next();
}, filter.verify, controller.base.index);


module.exports = router;
