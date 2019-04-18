require('@babel/register');

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
  if (key !== 'localStorage' && key !== 'sessionStorage' && !(key in global)) {
    global[key] = window[key];
  }
}

const globalConfig = require('../config/global.prod');

global.globalConfig = globalConfig;

const Koa = require('koa');
const session = require('koa-session');

const router = require('./router');

const path = require('path');
const koaStatic = require('koa-static-server');

const koaBody = require('koa-body');
const views = require('koa-views');

const authorize = require('./middleware/authorize');
const compress = require('koa-compress');
const {curl, injectCurl} = require('./utils/helper');

const app = new Koa();

const RES_PATH = path.join(globalConfig.contextPath, globalConfig.static); //静态资源路径

app.keys = globalConfig.keys;
app.use(session({...globalConfig.session}, app));

app.context.globalConfig = globalConfig;
app.context.webpackCompiler = {}; //empty
app.context.curl = curl;
app.context.injectCurl = injectCurl;

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
app.use(compress());

app.use(
  views(path.join(__dirname, './views'), {
    extension: 'html',
  })
);

app.use(router.middleware());

app.use((ctx, next) => {
  //如果路由中间件已经有数据了，无需再走静态文件中间件了
  if (ctx.body) {
    return true;
  }
  return next();
});

app.use(koaStatic({rootDir: RES_PATH, rootPath: globalConfig.staticPath}));


app.listen(globalConfig.port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`prod服务已启动完成 http://127.0.0.1:${globalConfig.port}`);
});
