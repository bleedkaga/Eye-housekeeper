import React from 'react';
import {withRouter} from 'dva/router';
import {Breadcrumb, Affix} from 'antd';
import cn from 'classnames';
import RH from 'client/routeHelper';
import {CSSTransition} from 'react-transition-group';

import './style.less';

const GPage = (props) => {
  const style = {...props.style};

  if (props.footerBottom) {
    style.paddingBottom = `${props.footerBottom}px`;
  }

  return (
    <div
      className={cn('page-layout-main', props.className)}
      style={style}
    >
      {props.children}
    </div>
  );
};

/* eslint-disable */
class H extends React.Component {
  constructor(props) {
    super(props);
    props.route.forEach((item, index) => {
      item.key = item.key || `h-breadcrumb-${index}`;
    });
    this.state = {};
  }

  itemRender = (route, params, routes) => {
    const index = routes.indexOf(route);
    const last = index === routes.length - 1;
    if (last) {
      return <span key={route.key}>{route.name}</span>
    } else {
      if (!route.path) {
        console.error('header', route, '没有path');
      }
      return (
        <a href={'javascript:;'}
           key={route.key}
           onClick={() => {
             RH(null, route.key || '', route.path, route.options || {state: {__back: true}});
           }}>{route.name}</a>
      )
    }
  };

  render() {
    const {route} = this.props;

    return (
      <div style={{height: 46}}>
        <Affix offsetTop={46}>
          <div className={cn('page-layout-nav')}>
            <Breadcrumb separator={'>'} className={cn('route')} routes={route} itemRender={this.itemRender}/>
          </div>
        </Affix>
      </div>
    );
  }
}

/* eslint-enable */

/* eslint-disable */
class GContainer extends React.Component {
  constructor(props) {
    super(props);

    try {
      this.Event1 = new Event('resize');
      this.Event2 = new Event('scroll');
    } catch (e) {
    }
    this.state = {show: false};
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, true);
    this.onResize();
    this.setState({show: true});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, true);
  }

  shouldComponentUpdate() {
    return true;
  }

  _timer = null;
  onResize = () => {
    const WH = document.documentElement.clientHeight;
    this.container.style.height = `${WH - 118}px`;
    //时间更新用于Affix的校正
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      if (this.Event2) {
        window.dispatchEvent(this.Event2);
      } else {
        window.scroll();
      }
    }, 3000);
  };

  onEntered = () => {
    // 时间更新用于Affix的校正
    setTimeout(() => {
      if (this.Event1) {
        window.dispatchEvent(this.Event1);
      } else if (window.resize) {
        window.resize();
      }
    }, 500);
  };

  render() {
    const {show} = this.state;
    return (
      <div ref={(e) => (this.container = e)} className={cn('page-layout-container', this.props.className)}
           style={this.props.style}>
        <CSSTransition
          in={show}
          classNames="fade"
          timeout={200 + 16}
          unmountOnExit
          onEntered={this.onEntered}
        >
          <div className={cn('page-layout-inner')}>
            {this.props.children}
          </div>
        </CSSTransition>
      </div>

    );
  }
}

/*const GContainer = props => (
  <div className={cn('page-layout-container', props.className)} style={props.style}>
    {props.children}
  </div>
);*/
/* eslint-disable */
const GHeader = withRouter(H);

export {
  GHeader, GPage, GContainer,
};
