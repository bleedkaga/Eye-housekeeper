import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Tabs} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';

import Pwd1 from './pwd1';
import Pwd2 from './pwd2';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {state = {}} = props.location;

    this.state = {
      current: state.current || '1',
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'pwd/reset'});
  }

  // componentWillReceiveProps(){
  // }

  render() {
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '密码设置'},
        ]}
      />
      <GPage className={cn('pwd')}>
        <Tabs defaultActiveKey={this.state.current} className={cn('pwd-tabs')}>
          <Tabs.TabPane tab={'登录密码'} key="1"><Pwd1 {...this.props}/></Tabs.TabPane>
          <Tabs.TabPane tab={'支付密码'} key="2"><Pwd2 {...this.props}/></Tabs.TabPane>
        </Tabs>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
