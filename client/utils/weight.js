import {matchRoutes} from 'react-router-config';
import {routes} from 'client/router';

const weightMap = {
  2: {name: '智能人事'},
  43: {name: '电子档案'},
  44: {name: '组织结构'},
  45: {name: '单位信息'},
  46: {name: '弹性福利'},
  47: {name: '福利记录'},

  3: {name: '智能薪筹'},
  48: {name: '任务中心'},
  49: {name: '众包名单'},
  50: {name: '税筹规划'},
  51: {name: '发放记录'},

  4: {name: '账户管理'},
  52: {name: '资金账户'},
  53: {name: '资金流水'},

  5: {name: '智能财税'},
  54: {name: '发票申请'},
  55: {name: '申请记录'},
  56: {name: '开票信息'},
  57: {name: '邮寄地址'},

  6: {name: '通知管理'},


  7: {name: '系统管理'},
  82: {name: '管理员设置'},
  83: {name: '密码设置'},
  84: {name: '新增单位'},


  102: {name: '会员管理'},

  103: {name: '组织信息'},

  104: {name: '弹性福利'},
  108: {name: '福利发放'},
  109: {name: '福利发放记录'},

  105: {name: '账户管理'},
  110: {name: '资金账户'},
  111: {name: '资金流水'},

  106: {name: '智能财税'},
  112: {name: '发票申请'},
  113: {name: '申请记录'},
  114: {name: '开票信息'},
  115: {name: '邮寄地址'},
};

let isReset = false;

const Weight = {
  _wMap: {...weightMap},

  match: (path) => {
    // path
    const t = matchRoutes(routes, path);
    if (t) {
      const item = t[t.length - 1];
      const {route} = item;
      if (route) {
        return Weight._getRoute(route);
      }
    }
    return null;
  },

  isWeight: (id) => {
    if (!isReset) return true;
    if (Weight._wMap[id]) {
      return !!Weight._wMap[id].weight;
    }
    //未知的权限默认返回 true
    return true;
  },

  resetWeightMap: (menuArr) => {
    Weight._wMap = {...weightMap};
    Weight._setMenuWeight(menuArr);
    isReset = true;
  },

  _setMenuWeight: (arr) => {
    arr.forEach((item) => {
      // console.log(item);
      if (Weight._wMap[item.id]) {
        Weight._wMap[item.id].weight = true;
      }
      if (item.child && item.child.length) {
        Weight._setMenuWeight(item.child);
      } else if (item.childMenu && item.childMenu.length) {
        Weight._setMenuWeight(item.childMenu);
      }
    });
  },

  _getRoute: (route) => {
    if (!route.globbing) {
      return route.id;
    } else if (route.parent) {
      Weight._getRoute(route.parent);
    } else {
      return null;
    }
  },
};

export default Weight;
