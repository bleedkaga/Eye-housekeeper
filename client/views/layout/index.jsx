import React from 'react';
import cn from 'classnames';
// import {connect} from 'dva';
import {withRouter} from 'dva/router';
import {LocaleProvider} from 'antd';
import Config from 'client/config';

import Layout from './layout';

//I18N
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import './layout.less';

const Class = (props) => {
  const {location, children, history} = props;

  window.__history = history;
  const {pathname} = location;

  return (<LocaleProvider locale={zh_CN}>
    {
      Config.fullScreenPath.indexOf(pathname) !== -1 ?
        <div className={cn('full-screen-view')}>{React.cloneElement(children, {...props})}</div> : <Layout {...props}>
          {children}
        </Layout>
    }
  </LocaleProvider>);
};


export default withRouter(Class);
