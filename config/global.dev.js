const config = require('./global');
const backend = require('./backend');

module.exports = {
  ...config,

  port: 3456,
  backend: {
    /* 预发布 */
    // ...backend.beforeProd,

    /* 测试 */
    ...backend.dev,

    /*正式*/
    // ...backend.prod,
  },

};
