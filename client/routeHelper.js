import React from 'react'; //eslint-disable-line
import Chunk from 'client/components/Chunk';
import ChunkStorage from 'client/components/Chunk/ChunkStorage';
import Config from 'client/config';
import Weight from 'client/utils/weight';
import {message} from 'antd';


const routerStack = [];
const push = (history, path, options = {}) => {
  if (!history && !window.__history) return console.log('history is null');
  history = history || window.__history;
  const delay = options.delay === undefined ? 16 : 0;
  const replace = options.replace === undefined ? 'push' : 'replace';
  delete options.delay;
  delete options.replace;
  // 这里是为了组件装载好了之后给程序更多的反映时间
  if (delay) {
    setTimeout(() => {
      history[replace]({pathname: path, ...options});
    }, delay);
  } else {
    history[replace]({pathname: path, ...options});
  }
  routerStack.push(path);
};

const RH = (history, key, path, options = {}) => {
  if (!options.__skipWeiget) {
    const id = Weight.match(path);
    if (!Weight.isWeight(id)) {
      return message.warn('没有权限');
    }
  }
  delete options.__weiget;

  const loadable = ChunkStorage.get(key);
  if (loadable) {
    if (loadable.component) {
      push(history, path, options);
    } else {
      //开始加载
      showLoad();
      ChunkStorage.load(key).then(() => {
        hideLoading();
        push(history, path, options);
      }).catch(() => {
        hideLoading();
        message.error('页面加载失败，请重试！');
      });
    }
  } else {
    push(history, path, options);
  }
};

export default RH;

// 延迟300ms显示loading
let _timer = null;
let _loading_un = null;
const showLoad = () => {
  clearTimeout(_timer);
  _timer = setTimeout(() => {
    _loading_un = message.loading('加载中...', 15);
  }, 300);
};

const hideLoading = () => {
  clearTimeout(_timer);
  _loading_un && _loading_un();
};

const wrapper = (key, load, models) => {
  ChunkStorage.add(key, {load, models});
  return key;
};

export const R = key => props => (
  <Chunk
    name={key}
    // error={o => (<NodeData type={'internet'} on={() => (o.reload())}/>)}
    otherProps={props}
  />
);

export const goBack = (history) => {
  if (!history && !window.__history) return console.log('history is null');
  history = history || window.__history;
  if (routerStack.length) {
    history.goBack();
  } else {
    const rt = Config.routeType[window.__themeKey || 'org'];
    RH(history, rt.key, rt.url);
  }
};

export const ApplyInvoice = wrapper('applyInvoice',
  () => import(/* webpackChunkName: "applyInvoice" */ './views/applyInvoice'),
  () => [import(/* webpackChunkName: "applyInvoiceModel" */ './views/applyInvoice/model'),
         import(/* webpackChunkName: "eAddressModel" */ './views/eAddress/model')],
);

export const ApplyRecord = wrapper('applyRecord',
  () => import(/* webpackChunkName: "applyRecord" */ './views/applyRecord'),
  () => [import(/* webpackChunkName: "applyRecordModel" */ './views/applyRecord/model')],
);

export const InvoicesInfo = wrapper('invoicesInfo',
  () => import(/* webpackChunkName: "invoicesInfo" */ './views/invoicesInfo'),
  () => [import(/* webpackChunkName: "invoicesInfoModel" */ './views/invoicesInfo/model')],
);
export const BillingRecord = wrapper('billingRecord',
  () => import(/* webpackChunkName: "billingRecord" */ './views/billingRecord'),
  () => [import(/* webpackChunkName: "billingRecordModel" */ './views/billingRecord/model')]
);
export const ApplyInvoicePaper = wrapper('applyInvoicePaper',
  () => import(/* webpackChunkName: "applyInvoicePaper" */ './views/applyInvoicePaper'),
  () => [import(/* webpackChunkName: "applyInvoicePaperModel" */ './views/applyInvoicePaper/model')]
);

export const EAddress = wrapper('eAddress',
  () => import(/* webpackChunkName: "eAddress" */ './views/eAddress'),
  () => [import(/* webpackChunkName: "eAddressModel" */ './views/eAddress/model')],
);

export const Demo = wrapper('demo',
  () => import(/* webpackChunkName: "demo" */ './views/demo'),
  () => [import(/* webpackChunkName: "demoModel" */ './views/demo/model')],
);

export const ListTable = wrapper('listTable',
  () => import(/* webpackChunkName: "listTable" */ './views/listTable'),
  () => [import(/* webpackChunkName: "listTable" */ './views/listTable/model')],
);

export const DemoFather = wrapper('demoFather',
  () => import(/* webpackChunkName: "demoFather" */ './views/demoFather'),
  () => [],
);

export const Dashboard = wrapper('org',
  () => import(/* webpackChunkName: "dashboard" */ './views/dashboard'),
  () => [import(/* webpackChunkName: "dashboardModel" */ './views/dashboard/model')],
);

export const Login = wrapper('login',
  () => import(/* webpackChunkName: "login" */ './views/login'),
  () => [
    import(/* webpackChunkName: "registerModel" */ './views/register/model'), //老用户需要用到register
  ], //登录由于有全局操作修改到全局model
);

export const Forget = wrapper('forget',
  () => import(/* webpackChunkName: "forget" */ './views/forget'),
  () => [import(/* webpackChunkName: "forgetModel" */ './views/forget/model')],
);

export const EditPwd = wrapper('editPwd',
  () => import(/* webpackChunkName: "editPwd" */ './views/editPwd'),
  () => [
    import(/* webpackChunkName: "editPwdModel" */ './views/editPwd/model'),
    import(/* webpackChunkName: "registerModel" */ './views/register/model'),
  ],
);
// 协议
export const GuaranteeAgreement = wrapper('guaranteeAgreement',
  () => import(/* webpackChunkName: "guaranteeAgreement" */ './views/guaranteeAgreement'),
  // () => [import(/* webpackChunkName: "guaranteeAgreement" */ './views/guaranteeAgreement')]
);

export const Register = wrapper('register',
  () => import(/* webpackChunkName: "register" */ './views/register'),
  () => [import(/* webpackChunkName: "registerModel" */ './views/register/model')],
);
export const Diagnotor = wrapper('diagnotor',
  () => import(/* webpackChunkName: "diagnotor" */ './views/diagnotor'),
  () => [import(/* webpackChunkName: "diagnotorModel" */ './views/diagnotor/model')],
);
export const PayOpened = wrapper('payOpened',
  () => import(/* webpackChunkName: "payOpened" */ './views/payOpened'),
  () => [import(/* webpackChunkName: "payOpenedModel" */ './views/payOpened/model')],
);
export const PersonnelChangeRecord = wrapper('personnelChangeRecord',
  () => import(/* webpackChunkName: "personnelChangeRecord" */ './views/personnelChangeRecord'),
  () => [import(/* webpackChunkName: "personnelChangeRecordModel" */ './views/personnelChangeRecord/model')],
);
//管理员
export const Administrator = wrapper('administrator',
  () => import(/* webpackChunkName: "administrator" */ './views/administrator'),
  () => [import(/* webpackChunkName: "administratorModel" */ './views/administrator/model')],
);
//添加/修改管理员
export const AddAdmin = wrapper('addAdmin',
  () => import(/* webpackChunkName: "addAdmin" */ './views/addAdmin'),
  () => [import(/* webpackChunkName: "addAdminModel" */ './views/addAdmin/model')],
);
//密码设置
export const Pwd = wrapper('pwd',
  () => import(/* webpackChunkName: "pwd" */ './views/pwd'),
  () => [import(/* webpackChunkName: "pwdModel" */ './views/pwd/model')],
);
// 智能薪筹父级路由
export const Salary = wrapper('salary',
  () => import(/* webpackChunkName: "salary" */ './views/salary'),
);
// 任务中心
export const TaskCenter = wrapper('taskCenter',
  () => import(/* webpackChunkName: 'taskCenter' */ './views/taskCenter'),
  () => [import(/* webpackChunkName: "taskCenterModel" */ './views/taskCenter/model')]
);
// 众包名单
export const TaxList = wrapper('taxList',
  () => import(/* webpackChunkName: "taxList" */ './views/taxList'),
  () => [import(/* webpackChunkName: "taxListModel" */ './views/taxList/model')]
);
// 税筹规划
export const TaxPlan = wrapper('taxPlan',
  () => import(/* webpackChunkName: 'taxPlan' */ './views/taxPlan'),
  () => [
    import(/* webpackChunkName: "taxPlanModel" */ './views/taxPlan/model'),
    import(/* webpackChunkName: "taxSendDetailRecordModel" */ './views/taxSendDetailRecord/model'),
  ]
);
// 税筹, 发放记录
export const TaxSendRecord = wrapper('taxSendRecord',
  () => import(/* webpackChunkName: "taxSendRecord" */ './views/taxSendRecord'),
  () => [import(/* webpackChunkName: "taxSendRecordModel" */ './views/taxSendRecord/model')],
);
// 税筹, 发放记录详情
export const TaxSendDetailRecord = wrapper('taxSendDetailRecord',
  () => import(/* webpackChunkName: 'taxSendDetailRecord' */ './views/taxSendDetailRecord'),
  () => [import(/* webpackChunkName: 'taxSendDetailRecord' */ './views/taxSendDetailRecord/model')],
);
//电子档案
export const Staff = wrapper('staff',
  () => import(/* webpackChunkName: "staff" */ './views/staff'),
  () => [import(/* webpackChunkName: "staffModel" */ './views/staff/model')],
);
//电子档案--新增
export const AddStaff = wrapper('addStaff',
  () => import(/* webpackChunkName: "addStaff" */ './views/addStaff'),
  () => [import(/* webpackChunkName: "addStaffModel" */ './views/addStaff/model')],
);
//电子档案--批量导入
export const ImportStaff = wrapper('importStaff',
  () => import(/* webpackChunkName: "importStaff" */ './views/importStaff'),
  () => [import(/* webpackChunkName: "importStaffModel" */ './views/importStaff/model')],
);
//花名册--离职人员表
export const LeaveStaff = wrapper('leaveStaff',
  () => import(/* webpackChunkName: "leaveStaff" */ './views/leaveStaff'),
  () => [
    import(/* webpackChunkName: "leaveStaff" */ './views/leaveStaff/model'),
    import(/* webpackChunkName: "staffModel" */ './views/staff/model')],
);
//单位信息
export const Company = wrapper('company',
  () => import(/* webpackChunkName: "company" */ './views/company'),
  () => [import(/* webpackChunkName: "companyModel" */ './views/company/model'), import(/* webpackChunkName: "dashboardModel" */ './views/dashboard/model')],
);
//组织树结构
export const Depart = wrapper('depart',
  () => import(/* webpackChunkName: "depart" */ './views/depart'),
  () => [import(/* webpackChunkName: "departModel" */ './views/depart/model')],
);
//弹性福利
export const Coupons = wrapper('coupons',
  () => import(/* webpackChunkName: "coupons" */ './views/coupons'),
  () => [import(/* webpackChunkName: "couponsModel" */ './views/coupons/model')],
);
//弹性福利--发放给员工
export const SendStaff = wrapper('sendStaff',
  () => import(/* webpackChunkName: "sendStaff" */ './views/sendStaff'),
  () => [
    import(/* webpackChunkName: "sendStaffModel" */ './views/sendStaff/model'),
    import(/* webpackChunkName: "pwdModel" */ './views/pwd/model'),
  ],
);
//弹性福利--配发给部门
export const SendDepartment = wrapper('sendDepartment',
  () => import(/* webpackChunkName: "sendDepartment" */ './views/sendDepartment'),
  () => [import(/* webpackChunkName: "sendDepartmentModel" */ './views/sendDepartment/model')],
);
//弹性福利--配发给单位
export const SendUnit = wrapper('sendUnit',
  () => import(/* webpackChunkName: "sendUnit" */ './views/sendUnit'),
  () => [import(/* webpackChunkName: "sendUnitModel" */ './views/sendUnit/model')],
);
//弹性福利--各部门配额余量
export const QuotaBalance = wrapper('quotaBalance',
  () => import(/* webpackChunkName: "quotaBalance" */ './views/quotaBalance'),
  () => [import(/* webpackChunkName: "quotaBalanceModel" */ './views/quotaBalance/model')],
);
//弹性福利--发放关联单位 发放额度统计
export const TransferStatistics = wrapper('transferStatistics',
  () => import(/* webpackChunkName: "transferStatistics" */ './views/transferStatistics'),
  () => [import(/* webpackChunkName: "transferStatisticsModel" */ './views/transferStatistics/model')],
);
//智能人事 -- 福利记录
// export const WelfareRecords = wrapper('welfareRecords',
//   () => import(/* webpackChunkName: "welfareRecords" */ './views/welfareRecords'),
//   () => [import(/* webpackChunkName: "welfareRecordsModel" */ './views/welfareRecords/model')],
// );
//智能人事 -- 福利记录 新
export const WelfareRecords = wrapper('welfareRecords',
  () => import(/* webpackChunkName: "welfareRecords" */ './views/welfareRecords'),
  () => [import(/* webpackChunkName: "welfareRecordsModel" */ './views/welfareRecords/model')],
);
//智能人事 -- 发放清单
export const welfareRecordDetail = wrapper('welfareRecordDetail',
  () => import(/* webpackChunkName: "welfareRecordDetail" */ './views/welfareRecordDetail'),
  () => [import(/* webpackChunkName: "welfareRecordDetailModel" */ './views/welfareRecordDetail/model')],
);

//工会会员管理
export const UnionStaff = wrapper('unionStaff',
  () => import(/* webpackChunkName: "unionStaff" */ './views/unionStaff'),
  () => [import(/* webpackChunkName: "unionStaff" */ './views/unionStaff/model')],
);

//工会会员管理
export const UnionInfo = wrapper('unionInfo',
  () => import(/* webpackChunkName: "unionInfo" */ './views/unionInfo'),
  () => [import(/* webpackChunkName: "unionInfoModel" */ './views/unionInfo/model'), import(/* webpackChunkName: "dashboardModel" */ './views/dashboard/model')],
);

//组织结构 设置关联单位
export const LinkOrg = wrapper('linkOrg',
  () => import(/* webpackChunkName: "linkOrg" */ './views/linkOrg'),
  () => [import(/* webpackChunkName: "unionInfoModel" */ './views/unionInfo/model')],
);
//云账户-单位
export const AssetAccount = wrapper('assetAccount',
  () => import(/* webpackChunkName: "assetAccount" */ './views/assetAccount'),
  () => [import(/* webpackChunkName: "assetAccountModel" */ './views/assetAccount/model')],
);

// 资金账户
export const FundAccount = wrapper('fundAccount',
  () => import(/* webpackChunkName: "fundAccount" */ './views/fundAccount'),
  () => [import(/* webpackChunkName: "fundAccountModel" */ './views/fundAccount/model')],
);

// 资金流水
export const FundSales = wrapper('fundSales',
  () => import(/* webpackChunkName: "fundSales" */ './views/fundSales'),
  () => [import(/* webpackChunkName: "fundSalesModel" */ './views/fundSales/model')],
);

export const AssetStream = wrapper('assetStream',
  () => import(/* webpackChunkName: "assetStream" */ './views/assetStream'),
  () => [import(/* webpackChunkName: "assetStreamModel" */ './views/assetStream/model')],
);

export const AssetStreamPersonalDetail = wrapper('assetStreamPersonalDetail',
  () => import(/* webpackChunkName: "assetStreamPersonalDetail" */ './views/assetStream/assetStreamPersonalDetail'),
  () => [import(/* webpackChunkName: "assetStreamModel" */ './views/assetStream/model')],
);
//云账户-工会
export const UnionAssetAccount = wrapper('unionAssetAccount',
  () => import(/* webpackChunkName: "unionAssetAccount" */ './views/unionAssetAccount'),
  () => [import(/* webpackChunkName: "unionAssetAccountModel" */ './views/unionAssetAccount/model')],
);

export const UnionAssetStream = wrapper('unionAssetStream',
  () => import(/* webpackChunkName: "unionAssetStream" */ './views/unionAssetStream'),
  () => [import(/* webpackChunkName: "unionAssetStreamModel" */ './views/unionAssetStream/model')],
);

export const UnionAssetStreamPersonalDetail = wrapper('unionAssetStreamPersonalDetail',
  () => import(/* webpackChunkName: "unionAssetStreamPersonalDetail" */ './views/unionAssetStream/unionAssetStreamPersonalDetail'),
  () => [import(/* webpackChunkName: "unionAssetStreamModel" */ './views/unionAssetStream/model')],
);
//新增单位
export const AddCompanies = wrapper('addCompanies',
  () => import(/* webpackChunkName: "addCompanies" */ './views/addCompanies'),
  () => [import(/* webpackChunkName: "addCompaniesModel" */ './views/addCompanies/model')],
);

export const Choose = wrapper('choose',
  () => import(/* webpackChunkName: "choose" */ './views/addCompanies/choose'),
  () => [import(/* webpackChunkName: "addCompaniesModel" */ './views/addCompanies/model')],
);
//福利记录-上传资料
export const UploadWelfare = wrapper('uploadWelfare',
  () => import(/* webpackChunkName: "uploadWelfare" */ './views/uploadWelfare'),
  () => [import(/* webpackChunkName: "uploadWelfareModel" */ './views/uploadWelfare/model')],
);
//福利记录-上传资料
export const GovHandle = wrapper('govHandle',
  () => import(/* webpackChunkName: "govHandle" */ './views/govHandle'),
  () => [import(/* webpackChunkName: "govHandle" */ './views/govHandle/model')],
);
//首页-福利发放审批
export const WelfareApproval = wrapper('welfareApproval',
  () => import(/* webpackChunkName: "welfareApproval" */ './views/welfareApproval'),
  () => [import(/* webpackChunkName: "welfareApproval" */ './views/welfareApproval/model')],
);

//通知管理
export const Notice = wrapper('notice',
  () => import(/* webpackChunkName: "notice" */ './views/notice'),
  () => [import(/* webpackChunkName: "noticeModel" */ './views/notice/model')],
);

//发送通知
export const SendNotice = wrapper('sendNotice',
  () => import(/* webpackChunkName: "sendNotice" */ './views/sendNotice'),
  () => [
    import(/* webpackChunkName: "sendNoticeModel" */ './views/sendNotice/model'),
    import(/* webpackChunkName: "pwdModel" */ './views/pwd/model'),
  ],
);

//修改通知
export const EditNotice = wrapper('editNotice',
  () => import(/* webpackChunkName: "editNotice" */ './views/editNotice'),
  () => [
    import(/* webpackChunkName: "sendNoticeModel" */ './views/sendNotice/model'),
    import(/* webpackChunkName: "pwdModel" */ './views/pwd/model'),
  ],
);

//发送通知清单
export const NoticeInventory = wrapper('noticeInventory',
  () => import(/* webpackChunkName: "noticeInventory" */ './views/noticeInventory'),
  () => [
    import(/* webpackChunkName: "noticeInventoryModel" */ './views/noticeInventory/model'),
  ],

);
