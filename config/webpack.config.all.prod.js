const prod = require('./webpack.config.prod');
const ssr = require('./webpack.config.ssr');

module.exports = [ssr, prod];
