const PM = {};
const cache = {};

let current = null;

const skipKeys = [
  'props', 'context', 'refs', 'updater', 'state', '__reactstandin__proxyGeneration',
  '_reactInternalFiber', 'REACT_HOT_LOADER_RENDERED_GENERATION', '__reactstandin__isMounted',
];

/**
 *  在构造函数最后调用
 * @param o 当前组件对象 this
 * @param pathname 手动指定 path（对象的标识）
 * @param callback 当前对象的操作额外的操作回调
 */
PM.init = (o, pathname, callback) => {
  if (!pathname) {
    pathname = PM.getPathname(o);
  }
  if (!cache[pathname]) cache[pathname] = {};
  let cc = cache[pathname];
  cc.pathname = pathname;

  o.__save = function () {
    const {top, left} = PM.getScrollTop();
    cc.scrollTop = top;
    cc.scrollLeft = left;

    cc.attribute = {};
    Object.keys(o).forEach((k) => {
      if (skipKeys.indexOf(k) === -1) {
        cc.attribute[k] = o[k];
      }
    });
    cc.state = o.state;
    PM.setScrollTop(0);
    callback && callback('save', cc);
  }.bind(o); //eslint-disable-line

  o.__restore = function (opt = {}, cb) {
    if (!cc) return console.error('缓存不存在');
    const {state: s = false, attr = false, scroll = true, render = false} = opt; //默认只回复滚动条
    const {scrollTop = 0, state = {}, attribute = {}} = cc;

    if (s) this.state = {...this.state, ...state};

    if (attr) {
      Object.keys(attribute).forEach((k) => {
        this[k] = attribute[k];
      });
    }

    setTimeout(() => {
      if (render) {
        this.setState({}, () => {
          scroll && PM.setScrollTop(scrollTop);
        });
      } else {
        scroll && PM.setScrollTop(scrollTop);
      }
    }, 16);


    cb && cb(cc);
  }.bind(o); //eslint-disable-line

  o.__scroll = function (isLeft) {
    if (!cc) return console.error('缓存不存在');
    const {scrollTop = 0, scrollLeft = 0} = cc;
    PM.setScrollTop(scrollTop, isLeft ? scrollLeft : undefined);
  }.bind(o); //eslint-disable-line

  o.__delete = function () {
    delete cache[cc.pathname];
    cc = undefined;
  }.bind(o); //eslint-disable-line
};

PM.getPathname = (o) => {
  if (typeof o === 'string') {
    return o;
  } else if (o.props.location) {
    return o.props.location.pathname;
  } else if (o.props.history && o.props.history.location) {
    return o.props.history.location.pathname;
  } else {
    throw new Error('PM 获取 pathname 失败');
  }
};

PM.getScrollTop = () => {
  let left = 0;
  let top = 0;
  if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
    top = document.documentElement.scrollTop;
    left = document.documentElement.scrollLeft;
  } else if (document.body) {
    top = document.body.scrollTop;
    left = document.body.scrollLeft;
  }
  return {top, left};
};

PM.setScrollTop = (top, left) => {
  if (document.documentElement) {
    document.documentElement.scrollTop = top;
    left !== undefined && (document.documentElement.scrollLeft = left);
  } else if (document.body) {
    document.body.scrollTop = top;
    left !== undefined && (document.body.scrollLeft = left);
  }
};


export default PM;
