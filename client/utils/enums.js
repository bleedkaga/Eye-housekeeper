// 员工状态
const StaffState = {
  normal: 0, // 正常
  unActive: 1, // 未激活
  toBeAudited: 2, // 待审核
  sendMoney: 3, // 发钱用的状态
};
// 员工审核状态
const StaffAuditState = {
  pass: 1, // 通过
  unPass: 2, // 不通过
};
const PayChannelType = {
  ali: 'ALIPAY_1',
  yee: 'yeepay',
  wx: 'WXPAY_1',
};
//组织易 支付渠道号
const zzyPayChannelType = {
  ali: 'ALIPAY_zzy_cash',
  yee: 'yeepay_zzy_cash',
  wx: 'WXPAY_zzy_cash',
};

// 单位类型
const CompanyType = {
  industrialRegistration: '1', // 工商登记
  nonIndustrialRegistration: '2', // 非工商登记组织
};

// 导入状态
const ImportState = {
  toBeImported: 1, // 待导入
  success: 2, // 成功
  fail: 3, // 失败
};

export {
  StaffState,
  PayChannelType,
  zzyPayChannelType,
  StaffAuditState,
  CompanyType,
  ImportState,
};
