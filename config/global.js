/* eslint-disable no-trailing-spaces */
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  version: '1.6.7',

  cryptoKey: {
    AES: '1406157146ABCDEF',
  },
  keys: [
    'dbRzJE9QCyDwGRbEREhMqllm5LmxCElcvy5HIN7lkncx9q6wA4r3DZwQ0vtJdKI1',
    'MKhhV5z037a9pYIhUl15VjcfBDzmS6Te2gec2CvV3J8axaecw4kcPM3NiRRwOa22',
    'Yh2DfewgSVuyqZUCO9zVJggEOk3Vayahj8G0Iog0wrIzjukKMUasVGXxZCBbZnQ3',
  ],
  session: {
    prefix: 'gsg-',
    /** (string) cookie key (default is koa:sess) */
    key: 'goodsogood business management pc',
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew se*ssion when session is nearly expired,*/
  },
  md5_key: 'L8VSMFU9Z76WS2P8DGDTH65P46DGBFI',
  title: '麦卡组织易',
  env,

  contextPath: process.cwd(),
  path: '/build',
  publicPath: '/build', // webpack publicPath
  static: '/public', //静态资源路径
  staticPath: '/public', //静态资源 Path

  templateName: 'index.html', //基础html模版名称

  apiPrefix: '/api', //API接口路径前缀
};
