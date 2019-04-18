import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import {StaticRouter, BrowserRouter} from 'dva/router';
import {message} from 'antd';

import createHistory from 'history/createBrowserHistory';
import ChunkHelper from 'client/components/Chunk/ChunkStorage';

import Config from './config';
import routers from './router';
import models from './models/index';
import Layout from './views/layout';

import './themes/public.less';
import './themes/pc.less';
import './themes/theme1.less';
import './themes/theme2.less';

message.config({
  top: '45%',
  duration: 2.5,
  maxCount: 1,
});

if (__CLIENT__) {
  // 1. Initialize
  const state = window.__INITIAL_STATE__ || {};

  const history = createHistory();

  const app = dva({
    initialState: state,
    history,
  });

  // 2. Plugins
  // app.use({});

  // 3. Model
  models.forEach((model) => {
    app.model(model);
  });

  // 4. Router
  app.router(props => ( //eslint-disable-line
    <BrowserRouter>
      <Layout>
        {routers}
      </Layout>
    </BrowserRouter>
  ));

  ChunkHelper.app = app;

  // 5. Start
  const App = app.start();

  let renderMethod = null;
  if (module.hot) {
    module.hot.accept();
    renderMethod = ReactDOM.render;
  } else {
    renderMethod = ReactDOM.hydrate;
  }

  renderMethod(<App/>, document.getElementById('container'));

  const account = window.__USER__ || {};
  let menuArray = [];
  let companies = [];
  try {
    menuArray = JSON.parse(window.localStorage[Config.menuKey] || '[]');
    companies = JSON.parse(window.localStorage[Config.companyKey] || '[]');
  } catch (e) {
    //empty
  }

  app._store.dispatch({type: 'global/setLogin', payload: {account}});
  app._store.dispatch({type: 'global/setMenuArray', payload: {menuArray}});
  app._store.dispatch({type: 'global/setCompanies', payload: {companies}});

  if (account && account.token) {
    //存在登录 更新权限
    app._store.dispatch({type: 'global/menuList', payload: {}});
    //更新公司列表
    app._store.dispatch({type: 'global/getListOfManagementCompany', payload: {phone: account.phone}});
  }
}


export default (props, initialData) => { //eslint-disable-line
  const app2 = dva({
    initialState: {},
    history: createHistory(),
  });

  models.forEach((model) => {
    app2.model(model);
  });

  app2.router(() => (
    <StaticRouter
      location={props.location}
    >
      <Layout>
        {routers}
      </Layout>
    </StaticRouter>
  ));

  ChunkHelper.app = app2;

  const app2Html = app2.start()();

  // const {category, home} = initialData;

  // app2._store.dispatch({type: 'category/setList', payload: category});
  // app2._store.dispatch({type: 'home/setList', payload: home});
  // home.list.length && app2._store.dispatch({type: 'home/set', payload: {isReplay: false}});

  return {html: app2Html, state: app2._store.getState()};
};

