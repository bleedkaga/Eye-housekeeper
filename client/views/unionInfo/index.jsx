import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Tabs, message} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import RH from 'client/routeHelper';

import './style.less';
import Tab1 from './tab1';
import Tab2 from './tab2';

const TabPane = Tabs.TabPane;

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {global, location: {state = {}}} = this.props;
    const groupId = global.account.groupId;

    this.state = {
      activeKey: state.activeKey || '1',
      groupId,
    };
  }

  componentDidMount() {
    const {dispatch, global, location, history} = this.props;
    const {groupId} = this.state;

    if (groupId && location.pathname === '/union/registerUnion') {
      //存在工会ID不需要注册工会了
      return RH(history, 'unionInfo', '/union/unionInfo');
    }

    const queue = [];
    const un = message.loading('加载中...', 15);
    //获取工会信息
    if (groupId) {
      queue.push(dispatch({
        type: 'unionInfo/getGroupByIdDetail',
        payload: {groupId},
      }));
    }

    //查询单位信息
    queue.push(dispatch({type: 'unionInfo/getCompanyByIdDetail', payload: {companyId: global.account.companyId}}));

    //获取省
    queue.push(dispatch({type: 'dict/findPCAS', payload: {selectedOptions: []}}));

    Promise.all(queue).then(() => {
      un();
      this.onNext();
    });
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'unionInfo/reset'});
  }

  // componentWillReceiveProps(){
  // }

  onNext() {
    const {unionInfo: {group, company}, dispatch} = this.props;
    //市
    dispatch({
      type: 'dict/findPCAS',
      payload: {
        selectedOptions: [group.province, group.city, group.area],
      },
    });
    //单位市
    dispatch({
      type: 'dict/findPCAS',
      payload: {
        selectedOptions: [company.province, company.city, company.area],
      },
    });
  }


  render() {
    const {groupId} = this.state;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: groupId ? '组织信息' : '填写工会资料'},
        ]}
      />
      <GPage className={cn('unionInfo')}>
        <Tabs defaultActiveKey={this.state.activeKey} className={cn('tab-box')}>
          <TabPane tab="基本资料" key="1">
            <Tab1 {...this.props} />
          </TabPane>
          {
            groupId ? <TabPane tab="下属单位/工会" key="2">
              <Tab2 {...this.props} />
            </TabPane> : null
          }
        </Tabs>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
