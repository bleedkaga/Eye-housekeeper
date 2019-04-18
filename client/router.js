import React from 'react';
import {Redirect, Switch} from 'dva/router'; //eslint-disable-line
import {renderRoutes, matchRoutes} from 'react-router-config';
import AnimatedRouter, {AnimatedRouterConfig} from 'client/components/AnimatedRouter'; //eslint-disable-line
import BIconfont from 'client/components/BIconfont';
import Config from 'client/config';

import RH, {
  R,
  Dashboard, Login, Forget, EditPwd, Register,
  Staff, AddStaff, LeaveStaff, Company,
  Diagnotor, PayOpened, PersonnelChangeRecord, Administrator, AddAdmin, ImportStaff, GovHandle,
  Depart, LinkOrg,
  Demo,//eslint-disable-line
  DemoFather, ListTable, //这三个是例子不管
  ApplyInvoice, ApplyRecord, InvoicesInfo, EAddress, BillingRecord, ApplyInvoicePaper,
  Pwd, UploadWelfare,
  // 担保协议
  GuaranteeAgreement,
  // 智能薪筹模块
  Salary, TaskCenter, TaxList, TaxPlan, TaxSendRecord, TaxSendDetailRecord,

  Coupons, UnionStaff, SendStaff, UnionInfo, SendDepartment, SendUnit,
  AssetStream, AssetAccount, AssetStreamPersonalDetail,
  FundAccount,FundSales,
  UnionAssetAccount, UnionAssetStream, UnionAssetStreamPersonalDetail, Choose, AddCompanies, TransferStatistics,
  QuotaBalance, WelfareRecords, WelfareApproval,
  welfareRecordDetail,

  //通知管理
  Notice, SendNotice, EditNotice, NoticeInventory,
} from './routeHelper';

const {routeType: {org, union}} = Config;
let _redirect_timer_;

const extraJudge = (props, route) => {
  if (props.global.account.permission === 1) {
    RH(props.history, 'payOpened', '/org/payOpened', {state: {redirectKey: route.value || '', redirect: route.path}});
    return false;
  }
  return true;
};

export const routes = [
  //这两个首页位置别修改
  {
    component: R(Dashboard),
    path: org.url,
    value: org.key,
    title: '管理中心',
    icon: <BIconfont type="bangongpingtai" className={'layout-menu-icon'}/>,
    exact: true,
    skip: true,
  },
  {
    component: R(Dashboard),
    path: union.url,
    value: union.key,
    title: '管理中心',
    icon: 'desktop',
    exact: true,
    skip: true,
  },

  //---------------------单位管理路由--------------------------
  {
    component: R(Diagnotor),
    path: '/org/diagnotor',
    value: 'diagnotor',
    exact: true,
  },
  {
    component: R(PayOpened),
    path: '/org/payOpened',
    value: 'payOpened',
    exact: true,
  },
  {
    component: R(GuaranteeAgreement),
    path: '/org/guaranteeAgreement',
    value: 'guaranteeAgreement',
    exact: true,
  },

  //智能人事
  {
    id: 2,
    component: R(DemoFather),
    path: '/org/hr/*',
    value: 'hr',
    title: '智能人事',
    icon: <BIconfont type="zhinengrenshi" className={'layout-menu-icon'}/>,
    routes: [
      {
        id: 43,
        component: R(Staff),
        path: '/org/hr/staff',
        value: 'staff',
        title: '电子档案',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 43,
        component: R(AddStaff),
        path: '/org/hr/addStaff',
        father: '/org/hr/staff',
        exact: true,
      },
      //查看/编辑信息
      {
        id: 43,
        component: R(AddStaff),
        path: '/org/hr/editStaff/:id',
        father: '/org/hr/staff',
        exact: true,
      },
      {
        id: 43,
        component: R(LeaveStaff),
        path: '/org/hr/leaveStaff',
        value: 'LeaveStaff',
        father: '/org/hr/staff',
        exact: true,
      },
      {
        id: 43,
        component: R(ImportStaff),
        path: '/org/hr/importStaff',
        value: 'importStaff',
        father: '/org/hr/staff',
        exact: true,
      },

      {
        id: 44,
        component: R(Depart),
        path: '/org/hr/depart',
        value: 'depart',
        title: '组织结构',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 44,
        component: R(LinkOrg),
        path: '/org/hr/linkOrg',
        value: 'linkOrg',
        father: '/org/hr/depart',
        exact: true,
      },
      {
        id: 45,
        component: R(Company),
        path: '/org/hr/company',
        value: 'company',
        title: '单位信息',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 46,
        component: R(Coupons),
        path: '/org/hr/coupons',
        value: 'coupons',
        title: '弹性福利',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 46,
        component: R(SendStaff),
        path: '/org/hr/coupons/sendstaff/:id?',
        value: 'coupons',
        father: '/org/hr/coupons',
        exact: true,
      },
      {
        id: 46,
        component: R(SendDepartment),
        path: '/org/hr/coupons/sendDepartment',
        value: 'coupons',
        father: '/org/hr/coupons',
        exact: true,
      },
      {
        id: 46,
        component: R(SendUnit),
        path: '/org/hr/coupons/sendUnit',
        value: 'coupons',
        father: '/org/hr/coupons',
        exact: true,
      },
      {
        id: 46,
        component: R(QuotaBalance),
        path: '/org/hr/coupons/quotaBalance',
        value: 'coupons',
        father: '/org/hr/coupons',
        exact: true,
      },
      {
        id: 46,
        component: R(TransferStatistics),
        path: '/org/hr/coupons/transferStatistics',
        value: 'coupons',
        father: '/org/hr/coupons',
        exact: true,
      },
      {
        id: 47,
        component: R(WelfareRecords),
        path: '/org/hr/welfareRecords',
        value: 'welfareRecords',
        title: '福利记录',
        exact: true,
      },
      //福利记录上传资料
      {
        id: 47,
        component: R(UploadWelfare),
        path: '/org/hr/uploadWelfare/:id',
        value: 'uploadWelfare',
        exact: true,
        father: '/org/hr/welfareRecords',
      },

      //福利记录发放清单
      {
        id: 47,
        component: R(welfareRecordDetail),
        path: '/org/hr/welfareRecordDetail/:type/:id',
        value: 'welfareRecordDetail',
        father: '/org/hr/welfareRecords',
        exact: true,
      },
    ],
  },
  //智能薪筹
  {
    id: 3,
    component: R(Salary),
    path: '/org/salary/*',
    value: 'capacitySalary',
    title: '任务管理',
    icon: <BIconfont type="zhongbaofuwu" className={'layout-menu-icon'}/>,
    routes: [
      {
        id: 48,
        component: R(TaskCenter),
        path: '/org/salary/taskCenter',
        value: 'taskCenter',
        title: '任务中心',
        icon: 'desktop',
        exact: true,
        // extraJudge, 没开通 vip 也可配置任务中心，众包名单
      },
      {
        id: 49,
        component: R(TaxList),
        path: '/org/salary/taxList',
        value: 'taxList',
        title: '众包名单',
        icon: 'desktop',
        exact: true,
        // extraJudge, 没开通 vip 也可配置任务中心，众包名单
      },
      {
        id: 50,
        component: R(TaxPlan),
        path: '/org/salary/taxPlan',
        value: 'taxPlan',
        title: '任务众包',
        icon: 'desktop',
        exact: true,
        extraJudge,
      },
      {
        id: 51,
        component: R(TaxSendRecord),
        path: '/org/salary/taxSendRecord',
        value: 'taxSendRecord',
        title: '发放记录',
        icon: 'desktop',
        exact: true,
        // extraJudge,
      },
      {
        id: 51,
        component: R(TaxSendDetailRecord),
        value: 'taxSendDetailRecord',
        path: '/org/salary/taxSendDetailRecord',
        father: '/org/salary/taxSendRecord',
        exact: true,
      },
    ],
  },
  //云账户
  {
    id: 4,
    component: R(DemoFather),
    path: '/org/cloud/*',
    value: 'cloud',
    title: '账户管理',
    icon: <BIconfont type="zijinguanli" className={'layout-menu-icon'}/>,
    routes: [
      {
        id: 52,
        component: R(AssetAccount),
        path: '/org/cloud/assetAccount',
        value: 'assetAccount',
        title: '资金账户',
        icon: 'desktop',
        exact: true,
      },
      // {
      //   id: 54,
      //   component: R(FundAccount),
      //   path: '/org/cloud/fundAccount',
      //   value: 'fundAccount',
      //   title: '资金账户',
      //   icon: 'desktop',
      //   exact: true,
      // },
      {
        id: 53,
        component: R(AssetStream),
        path: '/org/cloud/assetStream',
        value: 'assetStream',
        title: '资金流水',
        icon: 'desktop',
        exact: true,
      },
      // {
      //   id: 53,
      //   component: R(FundSales),
      //   path: '/org/cloud/fundSales',
      //   value: 'fundSales',
      //   title: '资金流水',
      //   icon: 'desktop',
      //   exact: true,
      // },
      {
        id: 53,
        component: R(AssetStreamPersonalDetail),
        path: '/org/cloud/assetStreamPersonalDetail',
        value: 'assetStreamPersonalDetail',
        father: '/org/cloud/assetStream',
        // title: '资金流水',
        // icon: 'desktop',
        exact: true,
      },
    ],
  },
  //智能财税
  {
    id: 5,
    component: R(DemoFather),
    path: '/org/taxation/*',
    value: 'taxation',
    title: '智能财税',
    icon: <BIconfont type="kaipiaoguanli" className={'layout-menu-icon'}/>,
    routes: [
      {
        id: 54,
        component: R(ApplyInvoice),
        path: '/org/taxation/applyInvoices',
        value: 'applyInvoices',
        title: '发票申请',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 54,
        component: R(BillingRecord),
        path: '/org/taxation/applyInvoices/billingRecord',
        value: 'billingRecord',
        father: '/org/taxation/applyInvoices',
      },
      {
        id: 54,
        component: R(ApplyInvoicePaper),
        path: '/org/taxation/applyInvoices/applyInvoicePaper',
        value: 'applyInvoicePaper',
        father: '/org/taxation/applyInvoices',
      },
      {
        id: 55,
        component: R(ApplyRecord),
        path: '/org/taxation/record',
        value: 'record',
        title: '申请记录',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 56,
        component: R(InvoicesInfo),
        path: '/org/taxation/invoicesInfo',
        value: 'invoicesInfo',
        title: '开票信息',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 57,
        component: R(EAddress),
        path: '/org/taxation/eAddress',
        value: 'eAddress',
        title: '邮寄地址',
        icon: 'desktop',
        exact: true,
      },
    ],
  },

  {
    id: 6,
    component: R(Notice),
    path: '/org/notice',
    value: 'notice',
    title: '通知管理', //通知管理入口暂不开放
    icon: <BIconfont type="tongzhiguanli" className={'layout-menu-icon'}/>,
  },

  {
    id: 6,
    component: R(SendNotice),
    path: '/org/sendNotice',
    father: '/org/notice',
  },

  {
    id: 6,
    component: R(EditNotice),
    path: '/org/editNotice',
    father: '/org/notice',
  },

  {
    id: 6,
    component: R(NoticeInventory),
    path: '/org/noticeInventory/:id',
    father: '/org/notice',
  },


  //---------------------工会管理路由--------------------------
  //没有工会下的组织信息
  {
    component: R(UnionInfo),
    path: '/union/registerUnion',
    value: 'unionInfo',
    // title: '组织信息',
    // icon: <BIconfont type="organization" className={'layout-menu-icon'}/>,
    exact: true,
  },
  //会员管理
  {
    id: 102,
    component: R(UnionStaff),
    path: '/union/unionStaff',
    value: 'unionStaff',
    title: '会员管理',
    icon: <BIconfont type="peoples" className={'layout-menu-icon'}/>,
    exact: true,
  },
  //会员资料编辑
  {
    id: 102,
    component: R(AddStaff),
    path: '/union/editStaff/:id',
    father: '/union/unionStaff',
    exact: true,
  },
  //组织信息
  {
    id: 103,
    component: R(UnionInfo),
    path: '/union/unionInfo',
    value: 'unionInfo',
    title: '组织信息',
    icon: <BIconfont type="organization" className={'layout-menu-icon'}/>,
    exact: true,
  },
  //(工会)弹性福利
  {
    id: 104,
    component: R(DemoFather),
    path: '/union/spring/*',
    value: 'spring',
    title: '弹性福利',
    icon: <BIconfont type="unit-welfare" className={'layout-menu-icon'}/>,
    routes: [
      {
        id: 108,
        component: R(Coupons),
        path: '/union/spring/coupons',
        value: 'coupons',
        title: '福利发放',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 108,
        component: R(SendStaff),
        path: '/union/spring/coupons/sendstaff/:id?',
        value: 'coupons',
        father: '/union/spring/coupons',
        exact: true,
      },
      {
        id: 108,
        component: R(SendDepartment),
        path: '/union/spring/coupons/sendDepartment',
        value: 'coupons',
        father: '/union/spring/coupons',
        exact: true,
      },
      {
        id: 108,
        component: R(SendUnit),
        path: '/union/spring/coupons/sendUnit',
        value: 'coupons',
        father: '/union/spring/coupons',
        exact: true,
      },
      {
        id: 108,
        component: R(QuotaBalance),
        path: '/union/spring/coupons/quotaBalance',
        value: 'coupons',
        father: '/union/spring/coupons',
        exact: true,
      },
      {
        id: 108,
        component: R(TransferStatistics),
        path: '/union/spring/coupons/transferStatistics',
        value: 'coupons',
        father: '/union/spring/coupons',
        exact: true,
      },
      //福利记录
      {
        id: 109,
        component: R(WelfareRecords),
        path: '/union/spring/welfareRecords',
        value: 'welfareRecords',
        title: '福利发放记录',
        icon: 'desktop',
        exact: true,
      },
      //福利记录发放清单
      {
        id: 109,
        component: R(welfareRecordDetail),
        path: '/union/spring/welfareRecordDetail/:type/:id',
        value: 'welfareRecordDetail',
        father: '/union/spring/welfareRecords',
        exact: true,
      },
      //福利记录上传资料
      {
        id: 109,
        component: R(UploadWelfare),
        path: '/union/spring/uploadWelfare/:id',
        value: 'uploadWelfare',
        father: '/union/spring/welfareRecords',
        exact: true,
      },
    ],
  },
  //(工会)云账户
  {
    id: 105,
    component: R(DemoFather),
    path: '/union/cloud/*',
    value: 'cloud',
    title: '账户管理',
    icon: <BIconfont type="gonghuizijinguanli" className={'layout-menu-icon'}/>,
    routes: [
      {
        id: 110,
        component: R(UnionAssetAccount),
        path: '/union/cloud/unionAssetAccount',
        value: 'unionAssetAccount',
        title: '资金账户',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 111,
        component: R(UnionAssetStream),
        path: '/union/cloud/unionAssetStream',
        value: 'unionAssetStream',
        title: '资金流水',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 111,
        component: R(UnionAssetStreamPersonalDetail),
        path: '/union/cloud/unionAssetStreamPersonalDetail',
        value: 'unionAssetStreamPersonalDetail',
        // title: '资金流水',
        // icon: 'desktop',
        father: '/union/cloud/unionAssetStream',
        exact: true,
      },
    ],
  },
  //(工会)智能财税
  {
    id: 106,
    component: R(DemoFather),
    path: '/union/taxation/*',
    value: 'taxation',
    title: '智能财税',
    icon: <BIconfont type="record" className={'layout-menu-icon'}/>,
    routes: [
      {
        id: 112,
        component: R(ApplyInvoice),
        path: '/union/taxation/applyInvoices',
        value: 'invoices',
        title: '发票申请',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 112,
        component: R(BillingRecord),
        path: '/union/taxation/applyInvoices/billingRecord',
        value: 'billingRecord',
        father: '/union/taxation/applyInvoices',
      },
      {
        id: 112,
        component: R(ApplyInvoicePaper),
        path: '/union/taxation/applyInvoices/applyInvoicePaper',
        value: 'applyInvoicePaper',
        father: '/union/taxation/applyInvoices',
      },
      {
        id: 113,
        component: R(ApplyRecord),
        path: '/union/taxation/record',
        value: 'record',
        title: '申请记录',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 114,
        component: R(InvoicesInfo),
        path: '/union/taxation/invoicesInfo',
        value: 'invoicesInfo',
        title: '开票信息',
        icon: 'desktop',
        exact: true,
      },
      {
        id: 115,
        component: R(EAddress),
        path: '/union/taxation/eAddress',
        value: 'eAddress',
        title: '邮寄地址',
        icon: 'desktop',
        exact: true,
      },
    ],
  },

  {
    id: 84,
    component: R(GovHandle),
    path: '/union/GovHandle',
    value: 'GovHandle',
    exact: true,
  },

  // ------------------- 单位，工会通用页面 -------------------
  //人员变更记录
  //人员变成查询
  {
    component: R(PersonnelChangeRecord),
    path: '/org/personnelChangeRecord',
    value: 'personnelChangeRecord',
    exact: true,
  },
  {
    component: R(PersonnelChangeRecord),
    path: '/union/personnelChangeRecord',
    value: 'personnelChangeRecord',
    exact: true,
  },
  //管理员设置
  {
    id: 7,
    component: R(Administrator),
    path: '/org/administrator',
    value: 'administrator',
    exact: true,
  },
  {
    id: 7,
    component: R(Administrator),
    path: '/union/administrator',
    value: 'administrator',
    exact: true,
  },
  //新增管理员
  {
    id: 82,
    component: R(AddAdmin),
    path: '/org/addAdmin',
    value: 'addAdmin',
    exact: true,
  },
  {
    id: 82,
    component: R(AddAdmin),
    path: '/union/addAdmin',
    value: 'addAdmin',
    exact: true,
  },
  //编辑管理员
  {
    id: 82,
    component: R(AddAdmin),
    path: '/org/editAdmin/:id',
    value: 'editAdmin',
    exact: true,
  },
  {
    id: 82,
    component: R(AddAdmin),
    path: '/union/editAdmin/:id',
    value: 'editAdmin',
    exact: true,
  },
  //密码设置
  {
    id: 83,
    component: R(Pwd),
    path: '/org/pwd',
    value: 'pwd',
    exact: true,
  },
  {
    id: 83,
    component: R(Pwd),
    path: '/union/pwd',
    value: 'pwd',
    exact: true,
  },
  //新增单位
  {
    id: 84,
    component: R(AddCompanies),
    path: '/org/addCompanies',
    value: 'addCompanies',
    exact: true,
  },
  {
    id: 84,
    component: R(Choose),
    path: '/org/choose',
    father: '/org/addCompanies',
    value: 'choose',
    exact: true,
  },
  {
    id: 84,
    component: R(Choose),
    path: '/union/choose',
    father: '/union/addCompanies',
    value: 'choose',
    exact: true,
  },
  {
    id: 84,
    component: R(AddCompanies),
    path: '/union/addCompanies',
    value: 'addCompanies',
    exact: true,
  },

  //首页 福利发放审批
  {
    id: 77,
    component: R(WelfareApproval),
    path: '/org/welfareApproval',
    value: 'welfareApproval',
    exact: true,
  },
  {
    id: 78,
    component: R(WelfareApproval),
    path: '/union/welfareApproval',
    value: 'welfareApproval',
    exact: true,
  },


  // ------------------- 通用页面 -------------------
  //列表例子
  {
    component: R(ListTable),
    path: '/org/listTable',
    exact: true,
  },

  {
    component: R(Demo),
    path: '/org/demo',
    exact: true,
  },

  {
    component: R(Login),
    path: '/login',
    exact: true,
  },
  {
    component: R(Forget),
    path: '/forget',
    exact: true,
  },
  {
    component: R(EditPwd),
    path: '/editPwd',
    exact: true,
  },
  {
    component: R(Register),
    path: '/register',
    exact: true,
  },

  {
    component: ({history}) => {
      if (history) {
        clearTimeout(_redirect_timer_);
        _redirect_timer_ = setTimeout(() => history.push(org.url), 16);
      }
      return null;
      // return <Redirect {...props} to={org.url}/>;
    },
    globbing: true,
    path: '/*',
    exact: true,
  },
];

export const getIndexRoute = () => (window.__themeKey === 'union' ? routes[1] : routes[0]);

const formatting = (arr, parent = null, index = 0) => {
  const item = arr[index];
  if (item) {
    if (item.father) {
      const rel = matchRoutes(routes, item.father);
      if (rel) {
        const allP = rel.pop();
        item.parent = allP.route;
      } else {
        item.parent = parent;
      }
    } else {
      item.parent = parent;
    }

    if (item.globbing) {
      try {
        const globbingPath = item.component().props.to;
        const o = matchRoutes(arr, globbingPath).pop();
        item.parent = o.route;
      } catch (e) {
        item.parent = getIndexRoute();
      }
    }

    if (Array.isArray(item.routes)) {
      formatting(item.routes, item, 0);
    }
    formatting(arr, parent, ++index);
  }
};
formatting(routes);

AnimatedRouterConfig.routes = routes;
AnimatedRouterConfig.home = routes[0].path;

/*export default (
  <AnimatedRouter
    timeout={{enter: 180, exit: 117}}
    appear={false}

    transitionKeyFun={(location) => { //eslint-disable-line
      // const path = location.pathname.split('/').slice(0, 2).join('/');
      // return path === '/order' || path === '/support' ? path : location.pathname;
      return location.pathname;
    }}
  >
    {renderRoutes(routes)}
  </AnimatedRouter>
);*/

export default (
  <Switch>
    {renderRoutes(routes)}
  </Switch>
);

