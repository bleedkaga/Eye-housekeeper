import React from 'react';
import {connect} from 'dva';
import {withRouter} from 'dva/router';
import cn from 'classnames';
import {hot} from 'react-hot-loader';

import Tools from 'client/utils/tools';
import Config from 'client/config';
import RH from 'client/routeHelper';

import '../login/style.less';
import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);
    Tools.updateFullScreenPathTheme(Config.routeType.org.key);

    this.state = {};
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  render() {
    const {history} = this.props;

    return (<div className={'step4'}>
      <div className={cn('t1')}>注册成功</div>
      <div className={cn('t2')}>现在您可以配置您的企业。</div>
      <div className={cn('s4-menu')}>
        <a href="javascript:" className={cn('m0')} onClick={() => RH(history, 'depart', '/org/hr/depart')}>
          <i className={cn('bg_contain')}/>
          <span>配置单位组织架构</span>
        </a>
        <a href="javascript:" className={cn('m1')} onClick={() => RH(history, 'importStaff', '/org/hr/importStaff')}>
          <i className={cn('bg_contain')}/>
          <span>导入人员信息</span>
        </a>
        <a href="javascript:" className={cn('m2')} onClick={() => RH(history, 'taxPlan', '/org/salary/taxPlan')}>
          <i className={cn('bg_contain')}/>
          <span>智能薪税筹划</span>
        </a>
      </div>
      <a
        href="javascript:"
        className={cn('skip', 'has-text')}
        onClick={() => {
          RH(history, 'org', '/org/dashboard');
        }}
      >跳过</a>
    </div>);
  }
}


export default connect(state => state)(withRouter(hot(module)(Class)));
