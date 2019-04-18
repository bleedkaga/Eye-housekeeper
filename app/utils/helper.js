const axios = require('axios');
const QS = require('qs');
const FormData = require('form-data');
const Config = require('../config');

const instance = axios.create({
  timeout: 20 * 1000,
});

const DEBUG = process.env.NODE_ENV === 'development';

const curl = function (url, data, method = 'POST', options = {}, catchCallback) {
  if (DEBUG) {
    console.log('==================>  服务器 AJAX');
    console.log('URL：', url);
    console.log('method：', method);
    console.log('data：', JSON.stringify(data));
  }

  const isGet = method === 'GET';

  const params = isGet ? {params: data, ...options} : (data instanceof FormData) ? data : QS.stringify(data);
  const dataQuery = isGet ? 'get' : 'post';

  return instance[dataQuery](url, params, !isGet ? options : undefined)
    .then((res) => {
      if (DEBUG) {
        res.data ? console.log('data：', res.data) : console.log('data：', null);
      }
      return res;
    }).catch((e) => {
      console.log('----------------->', e);
      if (e.response && e.response.data && e.response.data.code) {
        return catchCallback ? catchCallback() : {data: e.response.data};
      } else {
        // 服务器级错误
        return catchCallback ? catchCallback() : {data: {code: -9999, message: '访问服务器失败', data: []}};
      }
    });
};

const injectCurl = function (url, data, method = 'POST', options = {}, catchCallback) {
  const {token = '', companyId = '', phone = '', accountId = ''} = this.session.user;

  // data.token = token;
  data.token_cid = companyId;
  data.token_phone = phone;
  return curl(`${url}?token=${token}&userId=${accountId}&channelId=${Config.channelId}`, data, method, options, catchCallback);
};

module.exports = {
  curl,
  injectCurl,
};
