import React from 'react';
import {connect} from 'dva';
import {withRouter} from 'dva/router';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {message} from 'antd';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

// import '../login/style.less';
import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);

    const {location: {state = {}}} = this.props;

    this.state = {
      id: state.id,
    };
  }

  handleClick1() {
    this.beforeClick(() => RH(this.props.history, 'hr/depart', `/${window.__themeKey}/hr/depart`, {replace: true}));
  }

  handleClick2() {
    this.beforeClick(() => RH(this.props.history, 'hr/importStaff', `/${window.__themeKey}/hr/importStaff`, {replace: true}));
  }

  handleClick3() {
    this.beforeClick(() => RH(this.props.history, 'salary/taxPlan', `/${window.__themeKey}/salary/taxPlan`, {replace: true}));
  }

  handleClickSkip() {
    this.beforeClick(() => RH(this.props.history, 'org', '/org/dashboard', {replace: true}));
  }

  beforeClick(cb) {
    const {dispatch} = this.props;
    const {id} = this.state;
    if (!id) return message.error('错误的单位ID');
    const un = message.loading('切换中...', 15);
    Tools.resetAllModel(this.props).then(() => {
      dispatch({
        type: 'login/loginChoose',
        payload: {
          id,
          loadingMsg: '切换中...',
        },
        callback: (res) => {
          un();
          if (res.code === 0) {
            cb && cb();
          } else {
            message.error('切换失败', 15);
          }
        },
      });
    }).catch(() => {
      un();
      message.error('切换失败', 15);
    });
  }

  render() {
    return (<div className={'successWrapper'}>
      <div style={{marginTop: '100px'}}><h2 className={cn('t1')}>新增成功 !</h2></div>

      <div className={cn('t2')}>现在您可以配置您的企业。</div>
      {/* <div className={cn('icon')}> */}
      <ul className={cn('icon')}>
        <li><a href="javascript:;" className={cn('m0')} onClick={() => this.handleClick1()}>
          <i className={cn('bg_contain')}/>
          <span>配置单位组织架构</span>
        </a></li>
        <li> <a href="javascript:;" className={cn('m1')} onClick={() => this.handleClick2()}>
          <i className={cn('bg_contain')}/>
          <span>导入人员信息</span>
        </a></li>
        <li><a href="javascript:;" className={cn('m2')} onClick={() => this.handleClick3()}>
          <i className={cn('bg_contain')}/>
          <span>智能薪税筹划</span>
        </a></li>
      </ul>
      <p
        href="javascript:;"
        className={cn('skip', 'has-text')}
        onClick={() => this.handleClickSkip()}
      >跳过</p>
    </div>);
  }
}


export default connect(state => state)(withRouter(hot(module)(Class)));
