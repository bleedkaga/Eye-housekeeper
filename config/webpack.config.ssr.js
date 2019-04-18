const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
// const CompressionWebpackPlugin = require('compression-webpack-plugin');

//const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.config.base');

const config = require('./global.prod');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ssrConfig = {
  mode: 'production',

  devtool: 'source-map',

  target: 'node',

  //入口文件
  entry: {
    index: path.join(__dirname, '../client/index.jsx'),
  },

  output: {
    filename: '[name].ssr.js',
    path: path.join(config.contextPath, config.path),
    publicPath: `${config.publicPath}/`,
    chunkFilename: 'ssr/[name].js',
    libraryTarget: 'commonjs2', //设置导出类型，web端默认是var，node需要module.exports = xxx的形式
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true, //启用多核心高速构建
        sourceMap: false,
        extractComments: false, //是否提取注释 .LICENSE 文件中
        uglifyOptions: {
          output: {
            comments: false, //去掉所有注释
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
        cssProcessorPluginOptions: {
          preset: ['default', {discardComments: {removeAll: true}}],
        },
        canPrint: true, //是否将插件信息打印到控制台
      }),
    ],
    runtimeChunk: false,
  },

  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: { //node端的babel编译配置可以简化很多
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                },
              ],
              '@babel/preset-react',
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              'transform-es2015-modules-commonjs', //如果不转换成require，import 'xxx.styl'会报错
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: {
          loader: 'null-loader',
        },
      },
      {
        test: /\.(gif|png|jpg|jpeg)$/,
        use: [
          {
            loader: 'null-loader',
          },
        ],
      },
      {
        test: /\.(svg|woff2?|ttf|eot)(\?.*)?$/i,
        // exclude: /node_modules/,
        use: {
          loader: 'null-loader',
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${config.env}"`,
      __CLIENT__: false,
      __DEV__: config.env === 'development',
      __SERVER__: true,
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //   comments: false, //去掉注释
    //   compress: {
    //     warnings: false, //忽略警告,要不然会有一大堆的黄色字体出现……
    //   },
    // }),

    // new CompressionWebpackPlugin({ //gzip 压缩
    //   asset: '[path].gz[query]',
    //   algorithm: 'gzip',
    //   test: new RegExp(
    //     '\\.(js|css)$' //压缩 js 与 css
    //   ),
    //   threshold: 10240,
    //   minRatio: 0.8,
    // }),

  ],

  // externals: [nodeExternals()], //不把node_modules中的文件打包
  externals: Object.keys(require('../package.json').dependencies),
};
baseConfig.plugins = [];

const webpackConfig = merge(baseConfig, ssrConfig);

module.exports = webpackConfig;
