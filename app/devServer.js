require('@babel/register');

if (process.stdout && !process.stdout.isTTY) {
  process.stdout.isTTY = true;
  process.stdout.columns = 80;
  process.stdout.cursorTo = () => {
    process.stdout.write('\r');
  };
  process.stdout.clearLine = () => {
  };
}

const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, '../.dll/dll.js'))) {
  throw new Error('未发现 dll 文件，请运行 npm run build:dll 进行构建');
}

const jsdom = require('jsdom');

const {JSDOM} = jsdom;
// Jsdom document & window
const dom = new JSDOM('<!doctype html><html><body><div></div></body></html>', {
  url: 'http://localhost/',
  // referrer: 'https://example.com/', //来源
  contentType: 'text/html',
  includeNodeLocations: true, //是否允许使用定位
  storageQuota: 5000000, //仓库的大小
});
const win = dom.window;

const doc = win.document;
// Add to global
global.document = doc;
global.window = win;
for (const key in window) {
  if (!(key in global)) {
    global[key] = window[key];
  }
}

const globalConfig = require('../config/global.dev');

global.globalConfig = globalConfig;

const Koa = require('koa');
const session = require('koa-session');
const webpack = require('webpack');
const webpackMiddleware = require('koa-webpack');
const config = require('../config/webpack.config.dev');
const reporter = require('./utils/reporter');


let router = require('./router');

const authorize = require('./middleware/authorize');
const koaStatic = require('koa-static-server');
const koaBody = require('koa-body');
const views = require('koa-views');
const {curl, injectCurl} = require('./utils/helper');

const app = new Koa();

const RES_PATH = path.join(globalConfig.contextPath, globalConfig.static); //静态资源路径

// const hmrName = `/__webpack_hmr_${new Date().getTime()}`;

/*config.entry = lodash.mapValues(config.entry, val => [
  // 'react-hot-loader/patch',
  // activate HMR for React
  // 'webpack-dev-server/client?http://localhost:3456', //原始的dev-server
  `webpack-hot-middleware/client?path=${hmrName}&timeout=2000`,
  // 'webpack-hot-middleware/client?reload=true',
  // bundle the client for webpack-dev-server
  // and connect to the provided endpoint
  // 'webpack/hot/only-dev-server',
  val,
]);*/

// config.plugins = config.plugins.concat([
// new webpack.HotModuleReplacementPlugin(),
// new webpack.NoEmitOnErrorsPlugin(),
// enable HMR globally
// new webpack.NamedModulesPlugin(),
// ]);

app.keys = globalConfig.keys;

app.use(session({...globalConfig.session}, app));

config.entry.index.unshift(`webpack-hot-client/client?whc_${new Date().getTime()}`);
config.entry.index.unshift('react-hot-loader/patch');
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  // enable HMR globally
  new webpack.NamedModulesPlugin(),
]);

const compiler = webpack(config);

app.context.globalConfig = globalConfig;
app.context.webpackCompiler = compiler;
app.context.curl = curl;
app.context.injectCurl = injectCurl;

webpackMiddleware({
  compiler,
  devMiddleware: {
    reporter,
    methods: ['GET', 'POST'],
    headers: {'X-Custom-Header': 'yes'},
    publicPath: config.output.publicPath,
  },

  hotClient: {
    allEntries: false,
    autoConfigure: false,
    logTime: true,
    logLevel: 'error',
    // host: '127.0.0.1',
    // port: 8080,
    // server: app,
    // HTTPS: true,
  },
})
  .then((middleware) => {
    app.use(middleware);

    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        console.error('10088', '解析请求参数失败', err);
        ctx.body = {code: 10088, message: '解析请求参数失败'};
        ctx.code = 444;
      }
    });

    app.use(koaBody({
      jsonLimit: '1mb', //JSON主体字节 1mb //application/json
      formLimit: '56kb', //表单主体字节 56kb //application/x-www-urlencoded
      textLimit: '56kb', //文本主体字节 56kb
      onError: (err, ctx) => {//eslint-disable-line
        console.log(err);
        throw err;
      },
      multipart: true, //
      formidable: {
        //multipart/form-data
        maxFields: 1000, //query 字符数 (0表示无限制)
        maxFieldsSize: 2 * 1024 * 1024, //默认单位内存量 2MB
        maxFileSize: 20 * 1024 * 1024, //限制上传文件的大小 20MB
        keepExtensions: true,
      },
    }));


    app.use(authorize());

    app.use(
      views(path.join(__dirname, './views'), {
        extension: 'html',
      })
    );

    app.use((ctx, next) => router.middleware()(ctx, next));

    app.use((ctx, next) => {
      //如果路由中间件已经有数据了，无需再走静态文件中间件了
      if (ctx.body) {
        return true;
      }
      return next();
    });

    app.use(koaStatic({
      rootDir: RES_PATH,
      rootPath: globalConfig.staticPath,
    }));
  });

app.listen(globalConfig.port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`dev服务已启动请等待编译完成 port:${globalConfig.port}......`);
});

const chokidar = require('chokidar');

const cleanCache = (modulePath, callback) => {
  const module = require.cache[modulePath];
  if (module && module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(module), 1);
    cleanCache(module.parent.id, callback);
    require.cache[modulePath] = null;
    callback && callback(modulePath);
  }
};

const includePath = [
  {id: path.join(process.cwd(), 'app/router.js'), callback: null},
  {id: path.join(process.cwd(), 'app/api'), callback: null},
  {id: path.join(process.cwd(), 'app/controller'), callback: null},
  {id: path.join(process.cwd(), 'app/filter'), callback: null},
  {
    id: path.join(process.cwd(), 'app/utils/helper.js'),
    callback: () => {
      const newModule = require('./utils/helper');
      app.context.curl = newModule.curl;
      app.context.injectCurl = newModule.injectCurl;
    },
  },
  {id: path.join(process.cwd(), 'app/utils/uploadScaffold.js'), callback: null},
  {id: path.join(process.cwd(), 'app/utils/enums.js'), callback: null},
  {id: path.join(process.cwd(), 'app/utils/tool.js'), callback: null},
];

const watcher = chokidar.watch(path.join(process.cwd(), 'app'));

const watcherUpdate = (type, ph) => {
  if (ph.indexOf('___jb_tmp___') !== -1) return false; //忽略idea临时文件
  const result = includePath.find(o => ph.indexOf(o.id) === 0);
  if (result) {
    // console.log('\n', type, '服务端文件更新...：', ph);
    cleanCache(ph, (modulePath) => {
      const rel = includePath.find(o => modulePath.indexOf(o.id) === 0);
      if (rel && rel.callback) {
        rel.callback();
      }
    });
    try {
      router = require('./router');
      console.log('\n', type, '服务端文件更新成功：', ph);
    } catch (ex) {
      console.error('\n', type, '服务端文件更新失败', ph);
    }
  }
};

watcher.on('ready', () => {
  watcher.on('change', (ph) => {
    //文件发生改变
    watcherUpdate('change', ph);
  });
  watcher.on('add', (ph) => {
    //新增文件
    watcherUpdate('add', ph);
  });

  watcher.on('unlink', (ph) => {
    //删除文件
    watcherUpdate('unlink', ph);
  });
});
