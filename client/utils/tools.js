/* eslint-disable no-restricted-globals */
import React from 'react';
import {Redirect} from 'dva/router';
import {Form, message} from 'antd';
import Config from 'client/config';
import ThemeConfig from 'client/themes/theme';

const checkWebp = () => {
  try {
    if (document.createElement('canvas').toDataURL) {
      return (document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0);
    }
    return false;
  } catch (err) {
    return false;
  }
};

let isWebP;

const Tools = {};


Tools.getDD = (dd) => {
  let d = '';
  switch (dd) {
    case 0:
      d = '周日';
      break;
    case 1:
      d = '周一';
      break;
    case 2:
      d = '周二';
      break;
    case 3:
      d = '周三';
      break;
    case 4:
      d = '周四';
      break;
    case 5:
      d = '周五';
      break;
    case 6:
      d = '周六';
      break;
    default:
      d = '';
      break;
  }
  return d;
};

/**
 *
 * @param nd 当前时间对象
 * @param time = '2018-08-06'
 */
Tools.getCurrentDayString = (nd, time) => {
  const dTime = 1000 * 60 * 60 * 24;
  const cd = new Date(`${time.toString()
    .replace(/-/g, '/')} 23:59:59`);
  let m = cd.getMonth() + 1;
  let d = cd.getDate();
  if (m < 10) m = `0${m}`;
  if (d < 10) d = `0${d}`;

  const c = cd - nd;
  const dd = Tools.getDD(cd.getDay());

  if (c > 0) {
    if (c < dTime) {
      return {str: '今天', m, d};
    } else {
      const ys = parseInt(c / dTime, 10);
      if (ys === 1) {
        return {str: '明天', m, d};
      } else if (ys === 2) {
        return {str: '后天', m, d};
      } else {
        return {str: dd, m, d};
      }
    }
  } else {
    return {str: dd, m, d};
  }
};

Tools.getPAM = () => {
  const d = new Date();
  const hour = d.getHours();
  if (hour <= 6 && hour >= 0) {
    return '凌晨好';
  } else if (hour > 6 && hour <= 12) {
    return '早上好';
  } else if (hour > 12 && hour <= 14) {
    return '中午好';
  } else if (hour > 14 && hour <= 18) {
    return '下午好';
  } else if (hour > 18 && hour <= 24) {
    return '晚上好';
  }
};

Tools.formatValList = (item, temp, isLeaf = true) => {
  const arr = [];
  if (Array.isArray(temp)) {
    temp.forEach((o) => {
      arr.push({
        label: o.dicname,
        value: o.dicval,
        isLeaf: !isLeaf,
      });
    });
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr;
};

/**
 * 获取显示金额
 * @param {number} number 实际金额
 * @param symbol ￥ 货币符号
 * @param hasDecimal number是否是元 true 元， false 分， 默认（false）
 * @param places 后面有几位小数
 * @param thousand 银行那种逗号, 显示符号
 * @param decimal 小数点符号
 */
Tools.getViewPrice = (number = 0, symbol = '', hasDecimal = false, places = 2, thousand = ',', decimal = '.') => {
  if (!hasDecimal) number = parseInt(number, 10) / 100;

  const negative = number < 0 ? '-' : '';
  const i = `${parseInt(number = Math.abs(+number || 0)
    .toFixed(places), 10)}`;
  const k = i.length;
  const j = k > 3 ? k % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j)
    .replace(/(\d{3})(?=\d)/g, `$1${thousand}`) + (places ? decimal + Math.abs(number - i)
    .toFixed(places)
    .slice(2) : '');
};

/**
 * 获取缩放比例
 * @param baseSize 基础字号大小
 * @returns {number}
 */
Tools.getZoomRate = (baseSize = 100) => {
  const fontSize = window.document.documentElement.style.fontSize;
  const curSize = parseFloat(fontSize);
  return curSize / baseSize;
};

// UUID生成器
Tools.createUUID = (place, connector = '_') => {
  place = place || 3;
  /** @return {string} */
  const U = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); //eslint-disable-line
  };
  let uuid = '';
  for (let i = 0; i < place; i++) uuid += U() + connector;
  return uuid + new Date().getTime()
    .toString(32);
};

Tools.smalltoBIG = (n) => {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  const head = n < 0 ? '欠' : '';
  n = Math.abs(n);

  let s = '';

  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * (10 ** i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '')
      .replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
};

//时间戳格式化
Tools.formatDate = (time, tag = '-', base = 1000) => {
  time *= base;
  const D = new Date(time);
  const y = D.getFullYear();
  let m = D.getMonth() + 1;
  let d = D.getDate();
  if (m < 10) m = `0${m}`;
  if (d < 10) d = `0${d}`;
  return [y, m, d].join(tag);
};

//时间戳格式化
Tools.formatDatetime = (time, tag = ['-', ' ', ':'], base = 1000) => {
  time *= base;
  const D = new Date(time);
  const y = D.getFullYear();
  let m = D.getMonth() + 1;
  let d = D.getDate();

  let hh = D.getHours();
  let mm = D.getMinutes();
  let ss = D.getSeconds();

  if (m < 10) m = `0${m}`;
  if (d < 10) d = `0${d}`;

  if (hh < 10) hh = `0${hh}`;
  if (mm < 10) mm = `0${mm}`;
  if (ss < 10) ss = `0${ss}`;

  return `${[y, m, d].join(tag[0])}${tag[1]}${[hh, mm, ss].join(tag[2])}`;
};

Tools.getRealPrice = (number, priceSetting, rate, isUnit = true) => {
  if (priceSetting.id && priceSetting.status == 1) {
    let price = `${number * (rate || priceSetting.rate)}`;

    if (price.split('.').length === 2) {
      price = (+price).toFixed(2);
      if (price.split('.')[1] === '00') price = price.split('.')[0];
    }

    return `${(+price).toFixed(2)}${isUnit ? priceSetting.rateName : ''}`;
  }
  return Tools.getViewPrice(number, isUnit ? '￥' : '');
};

Tools.whiteList = [
  'index', 'category', 'search', 'details', 'comments',
];

Tools.paramsToQuery = (params, prefix = '?') => {
  const query = [];
  for (const k in params) {
    query.push(`${k}=${params[k]}`);
  }
  return `${prefix}${query.join('&')}`;
};

Tools.getDefaultSearchParams = ({keywords, pageNo = 1, sort = 0, flag, pageSize = 20, ref = 'search', categoryId}) => {
  const opt = {pageNo, pageSize, sort, ref};
  if (ref === 'search') {
    opt.keywords = keywords;
  } else {
    opt.categoryId = categoryId;
  }

  if (parseInt(sort, 10) === 4) {
    opt.flag = flag || 2;
  }
  return opt;
};

Tools.queryToParams = (query) => {
  if (query[0] === '?') query = query.substring(1);
  if (!query) return {};
  const a1 = query.split('&');
  const params = {};
  a1.forEach((v) => {
    const a2 = v.split('=');
    params[decodeURIComponent(a2[0])] = decodeURIComponent(a2[1]);
  });
  return params;
};

Tools.getQueryString = (name, url) => {
  url = url || window.location.search;
  const temp = url.split('?');
  const search = temp[temp.length - 1];
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = search.match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};

Tools.setUrlParam = (name, value, url) => {
  url = url || window.location.href;
  const tempArr = url.split('#');
  let currUrl = tempArr[0];
  const urlHash = tempArr[1];

  if (currUrl != null && currUrl !== 'undefined' && currUrl !== '') {
    value = encodeURIComponent(value);
    const reg = new RegExp(`(^|)${name}=([^&]*)(|$)`);
    const tmp = `${name}=${value}`;
    if (url.match(reg) != null) {
      currUrl = currUrl.replace(eval(reg), tmp); //eslint-disable-line
    } else if (url.match('[\?]')) { //eslint-disable-line
      currUrl = `${currUrl}&${tmp}`;
    } else {
      currUrl = `${currUrl}?${tmp}`;
    }
  }
  if (urlHash) currUrl += `#${urlHash}`;
  return currUrl;
};

/* 判断用户是否登录 */
Tools.login = (history, callback) => {
  window.hostSdk.openNativePage({
    name: 'login',
    appid: window.__appId,
  }, (res) => {
    // const {code, data, message, msg} = res;
    const {code, data} = res;

    if (parseInt(code, 10) === 0) {
      window.__openId = data.openId;

      callback ? callback() : history.goBack();
    } else {
      // Toast.show(message || msg || '登录失败');
    }
  });
};

// Tools.thousand = number => number.toString().replace(/\d+/, n => n.replace((/(\d)(?=(\d{3})+$)/g), $1 => `${$1},`));

let validateCustomerTimer = null;

Tools.validateCustomer = Component => (props) => {
  const openId = window.__openId;
  const {history} = props;

  if (openId) {
    return <Component {...props}/>;
  } else {
    clearTimeout(validateCustomerTimer);
    validateCustomerTimer = setTimeout(() => {
      Tools.login(history);
    }, 16);

    return (
      <Redirect
        to={{pathname: '/login'}}
      />
    );
  }
};

/* eslint-disable */
//base64生成器
Tools._keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
//base64编码
Tools.encode = function (input) {
  let output = '';
  let chr1;
  let chr2;
  let chr3;
  let enc1;
  let enc2;
  let enc3;
  let
    enc4;
  let i = 0;
  input = this._utf8_encode(input);
  while (i < input.length) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output +
      this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
      this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
  }
  return output;
};
//base64解码
Tools.decode = function (input) {
  let output = '';
  let chr1;
  let chr2;
  let
    chr3;
  let enc1;
  let enc2;
  let enc3;
  let
    enc4;
  let i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  while (i < input.length) {
    enc1 = this._keyStr.indexOf(input.charAt(i++));
    enc2 = this._keyStr.indexOf(input.charAt(i++));
    enc3 = this._keyStr.indexOf(input.charAt(i++));
    enc4 = this._keyStr.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output += String.fromCharCode(chr1);
    if (enc3 != 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output += String.fromCharCode(chr3);
    }
  }
  output = this._utf8_decode(output);
  return output;
};
//UTF-8编码
Tools._utf8_encode = function (string) {
  string = string.replace(/\r\n/g, '\n');
  let utftext = '';
  for (let n = 0; n < string.length; n++) {
    const c = string.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if ((c > 127) && (c < 2048)) {
      utftext += String.fromCharCode((c >> 6) | 192);
      utftext += String.fromCharCode((c & 63) | 128);
    } else {
      utftext += String.fromCharCode((c >> 12) | 224);
      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
      utftext += String.fromCharCode((c & 63) | 128);
    }
  }
  return utftext;
};
//UTF-8解码
Tools._utf8_decode = function (utftext) {
  let string = '';
  let i = 0;
  let c;
  let c1;
  let c2;
  let
    c3;
  c = c1 = c2 = 0;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c2 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return string;
};
/* eslint-enable */

Tools.getSrc = (src) => {
  if (!src) return 'none';

  if (isWebP === undefined) {
    isWebP = checkWebp();
  }

  if (/\/\/yanxuan\./.test(src)) {
    src += '?imageView&quality=65&thumbnail=330x330';
  } else if (isWebP && /360buyimg/.test(src)) {
    src += '!q50.dpg.webp';
  } else if (isWebP && (/imgpvs\.goodsogood/.test(src) || /img\.goodsogood/.test(src))) {
    src += '?x-oss-process=image/format,webp';
  }

  if (src.indexOf('http:') === 0) {
    return src.substring(5);
  } else {
    return src;
  }
};

Tools.getTypeByPath = (pathname = '') => {
  if (pathname[0] === '/') pathname = pathname.substring(1);
  const pathArray = pathname.split('/');
  if (Config.routeType[pathArray[0]]) {
    return Config.routeType[pathArray[0]];
  } else {
    return Config.routeType.org;
  }
};

//把父组件的属性映射到表单项上（如：把 Redux store 中的值读出）
Tools.getMapPropsToFields = (o, fieldContainer) => {
  o = o || {};
  const result = {};
  Object.keys(o)
    .forEach((k) => {
      const field = fieldContainer[k];
      result[k] = Form.createFormField({
        ...field,
        value: o[k],
      });
    });
  return result;
};

//当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
//isThan 是否比对 对象o的键值， 当发生改变的field键值o对象不存在时则不做更新
Tools.setOnFieldsChange = (dispatch, dispatchType, o, fieldContainer, fields, isThan = true) => {
  Object.keys(fields)
    .forEach((k) => {
      const field = fields[k];
      fieldContainer[k] = field;
      if (isThan || field.name in o) {
        dispatch({type: dispatchType, payload: {[field.name]: field.value}});
      }
    });
};

Tools.updateFullScreenPathTheme = (setKey) => {
  if (window.__themeKey !== setKey) {
    window.less.modifyVars(ThemeConfig[setKey]);
  }
};

Tools.logout = (msg = '登出中...') => {
  localStorage.removeItem(Config.companyKey);
  localStorage.removeItem(Config.menuKey);
  message.success(msg);
  setTimeout(() => {
    window.location.href = '/login/logout';
  }, 1000);
};

Tools.getHidePhone = (phone = '') => `${phone.substring(0, 3)}****${phone.substring(7)}`;

Tools.delaySaga = (ms = 16) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

Tools.resetAllModel = (props, skip = []) => {
  const {dispatch} = props;
  const propsKeys = Object.keys(props);
  const temp = Config.defaultProps.concat(skip);
  // const newKeys = Array.from(new Set(temp)));
  const newKeys = [];
  propsKeys.forEach((k) => {
    if (temp.indexOf(k) === -1) {
      newKeys.push(
        dispatch({type: `${k}/reset`}),
      );
    }
  });
  return Promise.all(newKeys);
};
/**比较两个obj中的key和value是否相等
 * @param a 比较对象1
 * @param b 比较对象2
 * @returns boolean
 */
Tools.compareObj = (a, b) => {
  // console.log('---------params', [a, b]);
  if (!a || !b) {
    return a === b;
  }
  const [arr1, arr2] = [Object.keys(a), Object.keys(b)];
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
    if (typeof a[arr1[i]] === 'object' || typeof b[arr1[i]] === 'object') {
      if (!Tools.compareObj(a[arr1[i]], b[arr1[i]])) {
        return false;
      }
    } else if (a[arr1[i]] !== b[arr1[i]]) {
      return false;
    }
  }
  return true;
};

/**截取字符串前几位和后几位，中间用*代替
 * @param str 原始字符串
 * @param startNumber 保留前几位字数(3)
 * @param endNumber 保留后几位字数(4)
 * @param repeat 中间替换字符(*)
 * @param repeatNum 重复次数(4)
 */
Tools.hiddenStr = (str, startNumber = 3, endNumber = 4, repeat = '*', repeatNum = 4) => {
  str += '';
  return str.slice(0, startNumber || 3) + repeat.padEnd(repeatNum || 4, repeat) + str.slice(0 - (endNumber || 4));
};

/**
 * 去掉字符串中的空格，第二个参数为全部去掉，默认为去掉前后
 */
Tools.trimSpace = (str, flag) => {
  if (!str) return '';
  str = str.toString();
  if (!flag) {
    return str.trim();
  } else {
    return str.replace(/\s/g, '');
  }
};


Tools.formatCompanyName = (d) => {
  d = Tools.trimSpace(d, true);
  return d.replace(/'/g, '');
};
export default Tools;
