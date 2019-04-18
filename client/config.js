export default {
  menuKey: '__BM_USER_MENU__',
  companyKey: '__BM_USER_COMPANY__',

  uploadImageKey: 'L8VSMFU9Z76WS2P8DGDTH65P46DGBFI',
  verificationCodeKey: 'L8VSMFU9Z76WS2P8DGDTH65P46DGBFI',

  fullScreenPath: [
    '/login',
    '/forget',
    '/editPwd',
    '/register',
  ],

  routeType: {
    org: {
      name: '单位管理',
      path: '/org',
      url: '/org/dashboard',
      theme: 'gsg-theme1',
      key: 'org',
    },
    union: {
      name: '工会管理',
      path: '/union',
      url: '/union/dashboard',
      theme: 'gsg-theme2',
      key: 'union',
    },
  },

  dict_codes: {
    baseUnionsType: {
      name: '工会类型',
      tier: 1, //层级，默认1层
      key: 'baseUnionsType', //服务端返回键 默认为当前键
    },
    economicType: {
      name: '经济类型',
    },
    otherIdentity: {
      name: '其他身份',
    },
    importType: {
      name: '导入类型',
    },
    nation: {
      name: '民族',
    },
    natureCode: {
      name: '工会性质',
    },
    regionCode: {
      name: '单位所在政区',
    },
    censusRegisterType: {
      name: '户籍类型',
    },
    industryInvolved: {
      name: '单位所属行业',
    },
    technicalGrade: {
      name: '技术等级',
    },
    tradeMemberAttrCode: {
      name: '工会会员标签',
    },
    idType: {
      name: '有效身份类别', //证件类型
    },
    shipChangeType: {
      name: '会籍变化类型',
    },
    unitNatureCode: {
      name: '组织类型',
    },
    workStatus: {
      name: '就业状况',
    },
    educationalLevel: {
      name: '文化程度',
    },
    shipChangeReason: {
      name: '会籍变化原因',
    },
    gender: {
      name: '性别',
    },
    industry: {
      name: '行业分类',
      tier: 2,
    },
    nationality: {
      name: '国籍',
    },
    marryStatus: {
      name: '婚姻状态',
    },
    politicalStatus: {
      name: '政治面貌',
    },
    bloodType: {
      name: '血型',
    },
    infection: {
      name: '传染病',
    },
    skinDisease: {
      name: '皮肤病',
    },
    malformation: {
      name: '畸形',
    },
    deformity: {
      name: '残疾',
    },
    illegal: {
      name: '违法记录',
    },
    personalCredit: {
      name: '个人征信',
    },
    unitType: {
      name: '组织属性',
    },
    status: {
      name: '状态',
    },
    constellation: {
      name: '星座',
    },
    consumerOptions: {
      name: '消费选项（使用范围）',
    },
    releaseReason: {
      name: '发放事由',
      tier: 3,
    },
    partyMembers: {
      name: '中共党员',
    },
    youthLeagueMembers: {
      name: '共青团员',
    },
    unionMembers: {
      name: '工会会员',
    },
    laborModel: {
      name: '劳动模范',
    },
    womenFederation: {
      name: '妇联工作',
    },
    moreIdentities: {
      name: '更多身份',
    },
    invoiceType: {
      name: '开票类型',
    },
    taxpayerType: {
      name: '纳税人类型',
    },
    resignationType: {
      name: '离职原因',
    },
    taskcenter: {
      name: '任务中心',
      tier: 2,
    },
    accountType: {
      name: '账户类型',
    },
    employmentnature: {
      name: '用工性质',
    },
    // accountType:'账务类型',
  },

  defaultProps: [
    '@@dva',
    'dispatch',
    'children',
    'global',
    'history',
    'location',
    'match',
    'routing',
    'staticContext',
  ],
  vipMoney: 2000 * 100, //开通VIP固定2000元
};

