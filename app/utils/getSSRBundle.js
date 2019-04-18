/* eslint-disable no-eval */
const path = require('path');
const prodConfig = require('../../config/global.prod');

const bundelMap = {};

module.exports = (ctx, name) => {
  if (bundelMap[name] !== undefined) {
    return bundelMap[name];
  } else {
    let p = name;

    try {
      p = path.join(prodConfig.contextPath, prodConfig.path, name).replace(/\\/g, '/');
      const bundle = eval(`require("${p}")`);

      bundelMap[name] = bundle;
      return bundle;
    } catch (e) {
      bundelMap[name] = false;
      console.log(e);
      console.warn(`没有 ${p} 无法启用服务端渲染，如需启用请运行 npm run build:ssr`);
    }
  }
};
