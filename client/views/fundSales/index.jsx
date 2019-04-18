import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Tabs} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';

import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';


import './style.less';
import Tab1 from './tab1';
import Tab2 from './tab2';

const {TabPane} = Tabs;

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch, location, location: {state = {}}} = this.props;
    this.secondPath = window.__themeKey === 'org' ? 'cloud' : 'spring';
    //判断是否是后退 设置条件参数值
    if (location.search || state.__back) {
      const t = Tools.getQueryString('t', location.search || '') || '0';
      dispatch({type: 'fundSales/set', payload: {active: t}});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'fundSales/set', payload: {active: '0'}});
    }

    this.state = {};
  }

  componentWillMount() {
  }


  render() {
    const {fundSales: {active}, dispatch} = this.props;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '福利记录'},
        ]}
      />
      <GPage className={cn('fundSales')}>
        <Tabs
          animated={false}
          activeKey={active || '0'}
          onChange={(t) => {
            dispatch({type: 'fundSales/set', payload: {active: t}});
            const search = Tools.setUrlParam('t', t, window.location.search);
            RH(null, 'fundSales', `/${window.__themeKey}/${this.secondPath}/fundSales`, {
              search, replace: true,
            });
          }}
        >
          <TabPane tab="现金账户" key="0">
            <Tab1 {...this.props} />
          </TabPane>
          <TabPane tab="单位福利账户" key="1">
            <Tab2 {...this.props} />
          </TabPane>
        </Tabs>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
