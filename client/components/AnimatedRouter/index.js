/* eslint-disable react/no-find-dom-node */
import React from 'react';
import {findDOMNode} from 'react-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {Switch} from 'dva/router';
import {matchRoutes} from 'react-router-config';

import './animate.less';

if (!window.sessionStorage) {
  window.sessionStorage = {
    getItem() {
      return '';
    },
    setItem() {

    },
  };
}

let lastLocation = {isPush: true};
const REACT_HISTORIES_KEY = 'REACT_HISTORIES_KEY';
window.sessionStorage.setItem(REACT_HISTORIES_KEY, '[]'); //清空
let histories = [];
try {
  histories = JSON.parse(window.sessionStorage.getItem(REACT_HISTORIES_KEY) || '[]');
} catch (e) {
  // console.log(e);
}


/**
 * @desc 路由动画组件
 *
 *  需要动画样式文件配合，所以如果使用默认的动画效果，则需要一并将项目中的animated.css导入项目
 */

class AnimatedRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    prefix: 'animated-router',
    ignore: undefined,
    home: '',
    routes: [],
  };

  static histories = histories;


  componentDidMount() {
    this.rootNode = findDOMNode(this);

    // this.props.history.listen(() => {
    //
    // });
  }

  isHistoryPush(location, update) {
    const key = location.key || location.pathname + location.search;
    // const key = location.pathname;
    const isHome = this.isHomePath();
    let action = true;
    if (update && key !== lastLocation.key) {
      if (isHome) {
        //如果是首页强制放在第一位，动画使用退场动画
        action = false;
        histories = [{key, h: isHome, pathname: location.pathname}];
      } else {
        const index = this.findLastByKey(key);
        if (index > -1) {
          histories.splice(index + 1);
          action = false;
        } else {
          histories.push({key, h: isHome, pathname: location.pathname});
        }
      }

      window.sessionStorage.setItem(REACT_HISTORIES_KEY, JSON.stringify(histories));

      if (location.__action !== undefined) {
        action = location.__action;
      }

      lastLocation = {
        isPush: action,
        key,
      };
    }
    return lastLocation.isPush;
  }

  isHomePath() {
    const {location} = this.props;
    const rel = matchRoutes(AnimatedRouterConfig.routes, location.pathname);
    if (rel && rel.length) {
      const r = rel[rel.length - 1];
      if (r.match.path === AnimatedRouterConfig.home) {
        return 1;
      } else {
        try {
          if (r.route.component.name === 'component' && r.route.component().props.to === AnimatedRouterConfig.home) {
            return 1;
          }
        } catch (e) {
          return 0;
        }
      }
    }
    return 0;
  }

  // isFirstRouter() {
  //   if (histories.length === 0) {
  //     return true;
  //   } else if (histories.length === 1 && histories.h && this.isHomePath()) {
  //     //当前是首页路径
  //     return true;
  //   }
  //   return false;
  // }

  findLastByKey(key) {
    for (let i = histories.length - 1; i >= 0; i--) {
      if (histories[i].key === key) {
        return i;
      }
    }
    return -1;
  }

  inTransition = false;

  setInTransition(isAdd) {
    if (this.rootNode) {
      const inName = `${this.props.prefix}-in-transition`;
      this.rootNode.className = this.rootNode.className
        .split(/\s+/)
        .filter(name => name !== inName)
        .concat(isAdd ? inName : [])
        .join(' ');
    }
  }

  onEnter = (node) => {
    this.inTransition || this.setInTransition((this.inTransition = true));
    this.lastTransitionNode = node;
  };

  onEntered = (node) => {
    if (this.lastTransitionNode === node) {
      this.inTransition && this.setInTransition((this.inTransition = false));
    }

    if (node) {
      // 删除所有 transition classNames
      node.className = node.className
        .split(/\s+/)
        .filter(name => !/-(?:forward|backward)-(?:enter|exit)(?:-active)?$/.test(name))
        .join(' ');
    }
  };

  render() {
    let {children} = this.props;
    const {className, enter, location, timeout, prefix, appear, exit, component, history} = this.props;

    if (children && typeof(children.type) === 'function' && children.type.name === 'Switch') { //eslint-disable-line
      children = children.props.children;
    }

    if (this.isHomePath()) {
      if (location.pathname !== AnimatedRouterConfig.home) {
        // window.history.pushState(null, null, AnimatedRouterConfig.home);
        setTimeout(() => {
          history.push(AnimatedRouterConfig.home, location.state);
        }, 16);
      }
      location.pathname = AnimatedRouterConfig.home;
    }

    const groupProps = {
      appear,
      enter,
      exit,
      component,
    };
    const cssProps = {
      onExit: this.onEnter,
      onExited: this.onEntered,
      onEnter: this.onEnter,
      onEntered: this.onEntered,
    };
    const cls = [`${prefix}-container`, 'react-animated-router', className];

    return (
      <TransitionGroup
        className={cls.filter(Boolean).join(' ')}
        childFactory={(child) => {
          const isPush = this.isHistoryPush(location, child.props.in);
          const classNames =
            `${prefix}-${isPush ? 'forward' : 'backward'}`;
          return React.cloneElement(child, {
            classNames,
          });
        }}
        {...groupProps}
      >
        <CSSTransition
          key={this.props.transitionKey || (this.props.transitionKeyFun && this.props.transitionKeyFun(location)) || location.pathname}
          addEndListener={(node, done) => {
            let fun1 = (e) => {
              // 确保动画来自于目标节点
              if (e.target === node) {
                done();
                node.removeEventListener('transitionend', fun1, false); //eslint-disable-line
                fun1 = null;
              }
            };
            let fun2 = (e) => {
              // 确保动画来自于目标节点
              if (e.target === node) {
                done();
                node.removeEventListener('webkitTransitionend', fun2, false); //eslint-disable-line
                fun2 = null;
              }
            };
            node.addEventListener('transitionend', fun1, false);
            node.addEventListener('webkitTransitionend', fun2, false);
          }}
          unmountOnExit
          timeout={timeout}
          {...cssProps}
        >
          <Switch location={location} history={history}>{children}</Switch>
        </CSSTransition>
      </TransitionGroup>
    );
  }

}


export const AnimatedRouterConfig = {
  routes: [],
  home: '',
};

export default AnimatedRouter;
