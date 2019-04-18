import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Tabs} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';

import Tab1 from './tab1';
import Tab2 from './tab2';

import './style.less';


//TODO 这个页面的功能充分的提现了前端的苦逼和后端的懒惰
class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: '1',
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  render() {
    const {active} = this.state;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '任务中心'},
        ]}
      />
      <GPage className={'taskCenter'}>
        <Tabs
          defaultActiveKey={active}
          className={cn('taskCenter-tabs')}
          onChange={(activeKey) => {
            if (activeKey === '1') {
              this._tab2.onTabChange && this._tab2.onTabChange(activeKey);
            } else {
              this._tab1.onTabChange && this._tab1.onTabChange(activeKey);
            }
          }}
        >
          <Tabs.TabPane tab={'系统推荐任务'} key={'1'} forceRender><Tab1
            ref={e => (this._tab1 = e)}
            {...this.props}
          /></Tabs.TabPane>
          <Tabs.TabPane tab={'自定义任务'} key={'2'} forceRender><Tab2
            ref={e => (this._tab2 = e)}
            {...this.props}
          /></Tabs.TabPane>
        </Tabs>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
