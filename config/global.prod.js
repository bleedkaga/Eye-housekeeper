const config = require('./global');
const backend = require('./backend');
const sys = require('../sys.config').system;

const hosts = sys === 'dev' ? backend.dev : sys === 'beforeProd' ? backend.beforeProd : backend.prod;

module.exports = {
  ...config,

  port: 8110,
  backend: {
    // 测试
    // ...backend.dev,

    //     // 预发布
    // ...backend.beforeProd,

    //正式
    // ...backend.prod,

    ...hosts,
  },

  path: '/public',
  publicPath: '/public', // webpack publicPath
  static: '/public', //静态资源路径
  staticPath: '/public', //静态资源 Path
};
