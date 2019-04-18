const FormData = require('form-data');
const fs = require('fs');
const MD5 = require('../../client/utils/md5');

const {md5_key} = global.globalConfig;

const US = {
  //上传图片
  uploadImage(ctx, url, fileName = 'fileImg') {
    const formData = new FormData();
    Object.keys(ctx.request.parameter).forEach((k) => {
      formData.append(k, ctx.request.parameter[k]);
    });
    Object.keys(ctx.request.files).forEach((k) => {
      const file = ctx.request.files[k];
      formData.append(fileName, fs.createReadStream(file.path));
    });
    /*
      fileImg               // MultipartFile 类型
      timeStamp             //时间毫秒值   用于验证请求合法
      nonceStr              //随机字符串    用于验证请求合法    一个随机数，只能用一次，访止重复提交
      sign                  //签名参数    使用MD5 加密      js 加密 demo:http://www.cnblogs.com/smallfa/p/5995965.html   加密规则
    */
    const nonceStr = new Date().getTime().toString(32);
    const timeStamp = new Date().getTime();
    const sign = MD5(`timeStamp=${timeStamp}&nonceStr=${nonceStr}&key=${md5_key}`);

    formData.append('timeStamp', timeStamp);
    formData.append('nonceStr', nonceStr);
    formData.append('sign', sign);

    return new Promise((resolve) => {
      formData.submit(url, (err, res) => {
        if (err) {
          resolve({data: {code: 10087, message: err.message, data: []}});
        } else {
          res.on('data', (data) => {
            try {
              data = JSON.parse(data.toString());
              if (data.code === 1) data.code = 0;
              resolve({data});
            } catch (e) {
              resolve({data: {code: 10087, message: err.message, data: []}});
            }
          });
        }
      });
    });
  },

  //上传文件
  uploadFile(ctx, url, base64 = false) {
    if (base64) return US.uploadFileBase64(ctx, url);

    const formData = new FormData();
    Object.keys(ctx.request.parameter).forEach((k) => {
      formData.append(k, ctx.request.parameter[k]);
    });
    Object.keys(ctx.request.files).forEach((k) => {
      const file = ctx.request.files[k];
      formData.append(k, fs.createReadStream(file.path));
    });

    const {token = '', companyId = '', phone = ''} = ctx.session.user;
    formData.append('token', token);
    formData.append('token_cid', companyId);
    formData.append('token_phone', phone);

    return new Promise((resolve) => {
      formData.submit(url, (err, res) => {
        if (err) {
          resolve({data: {code: 10087, message: err.message, data: []}});
        } else {
          res.on('data', (data) => {
            try {
              data = JSON.parse(data.toString());
              if (data.code === 1) data.code = 0;
              resolve({data});
            } catch (e) {
              resolve({data: {code: 10087, message: err.message, data: []}});
            }
          });
        }
      });
    });
  },

  uploadFileBase64(ctx, url) {
    try {
      const params = {...ctx.request.parameter};
      Object.keys(ctx.request.files).forEach((k) => {
        const file = ctx.request.files[k];
        params[k] = fs.readFileSync(file.path, 'base64');
      });
      return ctx.injectCurl(url, {...params}, 'POST');
    } catch (err) {
      return {data: {code: 10087, message: err.message, data: []}};
    }
  },
};

module.exports = US;
