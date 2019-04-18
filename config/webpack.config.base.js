const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const manifest = require('../.dll/manifest');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const HappyPack = require('happypack');
//多线程运行
const happyThreadPool = HappyPack.ThreadPool({size: 4});

let config;
if (process.env.NODE_ENV === 'production') {
  config = require('./global.prod');
} else {
  config = require('./global.dev');
}

module.exports = {
  devtool: 'hidden-source-map',

  output: {
    path: path.join(config.contextPath, config.path),
    publicPath: `${config.publicPath}/`,
    filename: 'js/[name].js',
    chunkFilename: 'chunk/[name].js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css', '.json', '.tsx', '.ts'],
    alias: {
      client: path.join(__dirname, '../client'),

      components: path.join(__dirname, '../client/components'),
      utils: path.join(__dirname, '../client/utils'),
      config: path.join(__dirname, '../client/utils/config'),
      enums: path.join(__dirname, '../client/utils/enums'),
      services: path.join(__dirname, '../client/services'),
      models: path.join(__dirname, '../client/models'),
      routes: path.join(__dirname, '../client/routes'),
      themes: path.join(__dirname, '../client/styles/themes'),
      index: path.join(__dirname, '../client/utils/index'),
      assets: path.join(__dirname, '../client/assets'),
    },
  },

  // externals: {
  // react: 'React',
  // 'react-dom': 'ReactDOM',
  // dva: 'dva',
  // },

  optimization: {
    splitChunks: {
      chunks: 'all', // all, async, initial 三选一, 插件作用的chunks范围// initial只对入口文件处理
      name: 'chunk',
      // automaticNameDelimiter: '~', //如果不指定name，自动生成name的分隔符（‘runtime~[name]’）

      // cacheGroups: {
      // styles: {
      //   name: 'styles',
      //   test: /\.css$/,
      //   chunks: 'all',
      //   enforce: true,
      // },
      // vendor: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
      //   test: /[\\/]node_modules[\\/]/,
      //   name: 'vendors',
      //   chunks: 'all',
      //   priority: 10,
      // },
      // common: {
      //   minSize: 1, // bytes 1KB = 1 * 1024 bytes
      //   minChunks: 2,
      //   name: 'commons',
      //   chunks: 'async',
      //   priority: 10,
      //   reuseExistingChunk: true,
      // },
      // },
    },

    runtimeChunk: {
      name: 'manifest',
    },
  },

  plugins: [
    //指定首页
    new HtmlWebpackPlugin({
      filename: config.templateName,
      // chunks: ['manifest', 'index'],
      //favicon: path.resolve(__dirname, '../src/assets/favicon.ico'),
      template: path.resolve(__dirname, '../layout/index.html'),
      hash: config.env === 'development',
      title: config.title,
      staticPath: config.staticPath,
      minify: {
        collapseWhitespace: config.env === 'production', //去除html的换行
        minifyJS: config.env === 'production', // 压缩html中的js
      },
    }),

    new HappyPack({
      //多线程运行 默认是电脑核数-1
      id: 'babel', //对于loaders id
      loaders: ['cache-loader', 'babel-loader?cacheDirectory'], //是用babel-loader解析
      threadPool: happyThreadPool,
      verboseWhenProfiling: true, //显示信息
    }),

    new webpack.DllReferencePlugin({
      manifest,
    }),

    new AddAssetHtmlPlugin([{
      filepath: path.join(__dirname, '../.dll/dll.js'),
      // outputPath: '',
      // publicPath: '',
      includeSourcemap: false,
      hash: true,
    }]),
  ],

  node: {
    fs: 'empty',
    path: 'empty',
    console: false,
    process: true,
    global: true,
    Buffer: true,
    setImmediate: true,
    __filename: 'mock',
    __dirname: 'mock',
  },

  cache: true, // boolean
  watch: false, // boolean
};
