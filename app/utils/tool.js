// const atob = require('atob');
/* eslint-disable no-plusplus,no-buffer-constructor */
const deBase64 = str => Buffer.from(str, 'base64').toString('binary');
const base64ToBuffer = str => new Buffer(str, 'base64');

const setUser = (ctx, account) => {
  ctx.session.user.token = account.token;
  ctx.session.user.isAuth = account.isAuth;//是否授权登陆：1表示否，2表示是
  ctx.session.user.companyId = account.companyId;//公司id
  ctx.session.user.companyName = account.companyName;//单位名称
  ctx.session.user.scopeControl = account.scopeControl; //1表示全单位，2表示部门
  ctx.session.user.phone = account.phone;//登陆人手机号
  ctx.session.user.isMaster = account.isMaster;//状态：1超级管理员  2表示普通管理员
  ctx.session.user.isHistory = account.isHistory;//是否是老数据 1表示老数据，2表示新数据  老数据需要先完善资料才能使用
  ctx.session.user.permission = account.permission;//VIP权限 1：没有权限，2：有权限
  ctx.session.user.realName = account.realName;//联系人
  ctx.session.user.deptIds = account.deptIds || '';//部门ids
  ctx.session.user.groupId = account.groupId || '';//工会ID
  ctx.session.user.accountId = account.accountId || '';//用户ID
};

// UUID生成器
const createUUID = (place, connector = '_') => {
  place = place || 3;
  /** @return {string} */
  const U = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); //eslint-disable-line
  };
  let uuid = '';
  for (let i = 0; i < place; i++) uuid += U() + connector;
  return uuid + new Date().getTime().toString(32);
};


const isFunction = fun => Object.prototype.toString.call(fun) === '[object Function]';
const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

//替换器
const proofread = (ctx, paramsName, proofreadName, parameterName = 'parameter') => {
  const {user} = ctx.session;
  if (ctx.request[parameterName]) {
    if (isObject(proofreadName)) {
      //{maybe: ['companyId', 'groupId']}
      if (paramsName in ctx.request[parameterName]) {
        const name = ctx.request[parameterName][paramsName];
        for (let i = 0; i < proofreadName.maybe.length; i++) {
          const n = proofreadName.maybe[i];
          if (user[n] === name) {
            return true;
          }
        }
        ctx.request[parameterName][paramsName] = ''; //效验不通过清空传入的值
      }
    } else if (isFunction(proofreadName)) {
      ctx.request[parameterName][paramsName] = proofreadName(user);
    } else {
      ctx.request[parameterName][paramsName] = user[proofreadName];
    }
  }
};


const checkToken = token => !/[a-z_]+/.test(token);

module.exports = {
  deBase64,
  base64ToBuffer,
  setUser,
  createUUID,
  proofread,
  checkToken,
};
