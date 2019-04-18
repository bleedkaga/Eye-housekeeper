const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const getSSRBundle = require('../utils/getSSRBundle');

const React = require('react'); //eslint-disable-line

const ReactDOMServer = require('react-dom/server');

const {renderToString} = ReactDOMServer;

let contentHtml = '';

/**
 * 读取HTML模版，返回cheerio实例
 */
async function loadHTMLTemplate(ctx) {
  try {
    let content = '';
    if (ctx.globalConfig.env === 'development') {
      content = ctx.webpackCompiler.outputFileSystem.readFileSync(path.join(ctx.webpackCompiler.outputPath, ctx.globalConfig.templateName)).toString();
    } else if (contentHtml) {
      content = contentHtml;
    } else {
      contentHtml = fs.readFileSync(path.join(process.cwd(), ctx.globalConfig.path, ctx.globalConfig.templateName));
      content = contentHtml;
    }
    return cheerio.load(content);
  } catch (e) {
    // console.error(e);
    return false;
  }
}

async function getBaseHtml(ctx, bundleName, initialData, isSSR = true) {
  const $ = await loadHTMLTemplate(ctx);

  let bundle;
  if (bundleName) bundle = getSSRBundle(ctx, bundleName);

  if (!$) {
    ctx.body = null;
    return;
  }

  if (bundle && isSSR) {
    const props = {};

    if (ctx && ctx.url) {
      props.location = ctx.url;
      props.context = {
        location: {
          pathname: ctx.pathname,
        },
      };
    }

    // const instance = React.createElement(bundle.default, {store: initialData, location: props});

    const instance = bundle.default(props, initialData);

    const str = renderToString(instance.html);

    $('#container').html(str);

    //前后端数据要同步
    const syncScript = `<script id="server-data">window.__INITIAL_STATE__=${JSON.stringify(instance.state)}</script>`;

    $('head').append(syncScript);
  }

  $('head').append(`<script id="user-data">window.__USER__=${JSON.stringify(ctx.session.user)}</script>`);

  ctx.body = $.html();
}

module.exports = getBaseHtml;
