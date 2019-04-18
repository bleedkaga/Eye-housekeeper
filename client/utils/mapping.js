const helper = {
  isObject: obj => Object.prototype.toString.call(obj) === '[object Object]',
  isArray: obj => Array.isArray(obj),
  isString: str => typeof str === 'string',
  isNumber: n => typeof n === 'number',
  isFunction: fun => Object.prototype.toString.call(fun) === '[object Function]',
  isSearch: str => helper.isString(str) && str[0] === '?',

  strToString: (str, opt, dv) => {
    if (!M.verify(str, opt)) return dv;
    return str;
  },
  stringToArray: (str, opt, dv) => {
    if (!M.verify(str, opt)) return dv;
    return str.split(opt.separate);
  },
  stringToNumber: (str, opt, dv) => {
    if (!M.verify(str, opt)) return dv;
    const n = parseFloat(str);
    if (isNaN(n)) { //eslint-disable-line
      return dv;
    } else {
      return n;
    }
  },

  /* eslint-disable */
  stringToStr: (str, opt) => {
    if (!M.verify(str, opt)) return '';
    return str;
  },
  arrayToString: (arr, opt) => {
    if (!M.verify(arr, opt)) return '';
    return arr.join(opt.separate);
  },
  numberToString: (n, opt) => {
    if (!M.verify(n, opt)) return '';
    return n.toString();
  },
  /* eslint-enable */
};

const M = {
  config: {
    separate: ',', //数组转数字分隔符
    quarantine: ['', undefined, null, 'undefined', 'null'], //等于这个值进行隔离
  },
  /**
   *
   * @param payload 当前的条件参数
   * @param map 条件参数的类型映射表
   * @param defaultValues 当参数等于隔离值的时候显示的默认值
   * @param isSkip 是否跳过defaultValues没有定义的值
   * @returns {*}
   */
  toParams: (payload, map = {}, defaultValues = {}, isSkip = false) => {
    if (helper.isSearch(payload)) {
      //进行
      payload = payload.substring(1);
      if (!payload) return {};

      const temp = payload.split('&');
      const params = {};
      temp.forEach((v) => {
        const a = v.split('=');
        const key = decodeURIComponent(a[0]);
        if (key in defaultValues || !isSkip) {
          const value = decodeURIComponent(a[1]);
          const item = M.parseMapItem(map[key]);
          params[key] = item.parse(value, defaultValues[key]);
        }
      });
      return params;
    } else if (helper.isObject(payload)) {
      return payload;
    } else if (payload === '') {
      return {};
    } else {
      throw new Error('mapping toParams 未知的payload');
    }
  },

  toAjaxQuery: (params, map, isQuarantine = true, prefix = '?') => {
    const array = [];
    const obj = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      const item = M.parseMapItem(map[key]);
      const v = item.reverse(value);
      if (!isQuarantine || (v !== '' && v !== undefined)) {
        array.push(`${key}=${item.reverse(value)}`);
        obj[key] = item.reverse(value);
      }
    });
    return {params: obj, search: `${prefix}${array.join('&')}`};
  },

  parseMapItem: (item = ['string']) => {
    const type = item[0];
    let parse = item[1];// string to obj 解析
    let reverse = item[2]; //obj to string 反解析
    const opt = {...M.config, ...(item[3] || {}), type}; //额外的参数一般用于修改config
    switch (type) {
      case 'array':
        parse = parse || helper.stringToArray;
        reverse = reverse || helper.arrayToString;
        break;
      case 'number':
        parse = parse || helper.stringToNumber;
        reverse = reverse || helper.numberToString;
        break;
      default:
        //string
        parse = parse || helper.strToString;
        reverse = reverse || helper.stringToStr;
        break;
    }

    return {
      type,
      parse: (value, defaultValue) => parse(value, opt, defaultValue),
      reverse: value => reverse(value, opt),
    };
  },

  stringToArrayGNumber: (str, opt, dv) => {
    if (!M.verify(str, opt)) return dv;
    const arr = str.split(opt.separate);
    return arr.map(o => parseFloat(o));
  },

  verify: (v, opt) => {
    const {quarantine = []} = opt;
    return quarantine.indexOf(v) === -1;
  },
};

export default M;
