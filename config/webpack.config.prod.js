const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const config = require('./global.prod');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//浏览器端的配置
const browserConfig = {
  mode: 'production', // "production" | "development" | "none"  指定当前编译版本

  output: {
    path: path.join(config.contextPath, config.path),
    publicPath: `${config.publicPath}/`,
    filename: `js/[name].${config.version}.js`,
    chunkFilename: `chunk/[name].${config.version}.js`,
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
        assetNameRegExp: /\.(css)$/g,
        cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
        cssProcessorPluginOptions: {
          preset: ['default', {discardComments: {removeAll: true}}],
        },
        canPrint: true, //是否将插件信息打印到控制台
      }),
    ],
  },

  //入口文件
  entry: {
    index: [path.join(__dirname, '../client/index.jsx')],
  },

  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        // loader: 'babel-loader',
        loader: 'happypack/loader?id=babel',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({browsers: ['>1%', 'last 10 versions', 'Firefox ESR', 'not ie < 9']}),
                require('cssnano')(),
              ],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({browsers: ['>1%', 'last 10 versions', 'Firefox ESR', 'not ie < 9']}),
                require('cssnano')(),
              ],
            },
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                'primary-color': '#3C4FA0', // 全局主色
                'link-color': '#4DC2FF', // 链接色
                'success-color': '#32B16C', // 成功色
                'warning-color': '#FEAE22', // 警告色
                'error-color': '#FF4D4F', // 错误色

                'font-size-base': '14px', // 主字号
                'heading-color': '#333', // 标题色
                'text-color': '#333', // 主文本色
                'text-color-secondary ': '#999', // 次文本色
                'disabled-color ': '#ccc', // 失效色
                'border-radius-base': '4px', // 组件/浮层圆角
                'border-color-base': '#E5E5E5', // 边框色
                'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)', // 浮层阴影

                'screen-xs': 1,
                'screen-sm': 1,
                'screen-md': 1,
                'screen-lg': 1,
                'screen-xl': 1,
                'screen-xxl': 1,
              },
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpg|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'img/[name]-[hash:5].[ext]',
              limit: 8000, // 大概8k以下的图片打包成base64
            },
          },
        ],
      },
      {
        test: /\.(svg|woff2?|ttf|eot)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'img/[sha512:hash:base64:7].[ext]',
          },
        },
      },
    ],
  },

  plugins: [
    // 页面可用的变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${config.env}"`,
      __CLIENT__: true,
      __DEV__: config.env === 'development',
      __SERVER__: false,
    }),

    //指定打包的css
    // new ExtractTextPlugin(`style/[name].${config.version}.css`),

    //指定通用Chunk
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   filename: `js/manifest.${config.version}.js`,
    // }),

    new MiniCssExtractPlugin({
      filename: `style/[name].${config.version}.css`,
      chunkFilename: `chunk/[name].${config.version}.css`,
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //   comments: false, //去掉注释
    //   compress: {
    //     warnings: false, //忽略警告,要不然会有一大堆的黄色字体出现……
    //   },
    // }),
  ],
};

const webpackConfig = merge(baseConfig, browserConfig);

module.exports = webpackConfig;
