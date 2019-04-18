import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Steps} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Tools from 'client/utils/tools';
import GTitle from 'client/components/GTitle';

import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);
    const {location: {search}} = props;
    this.state = {
      current: parseInt(Tools.getQueryString('step', search), 10) || 0,
    };
  }

  componentDidMount() {
    const {dispatch, global} = this.props;

    let moneyId = '';
    let pageType = '';
    if (window.__themeKey === 'org') {
      moneyId = global.account.companyId; //ok
      pageType = '1';
    } else {
      moneyId = global.account.groupId; //ok
      pageType = '2';
    }

    dispatch({
      type: 'sendNotice/findBalance',
      payload: {
        moneyId,
        pageType,
        accountId: global.account.accountId, //ok
      },
    });
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'sendNotice/reset'});
  }
  // componentWillReceiveProps(){
  // }

  setStep(step) {
    this.setState({current: step});
  }

  render() {
    const {current} = this.state;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '通知管理', path: `/${window.__themeKey}/notice`},
          {name: '发送通知'},
        ]}
      />
      <GPage className={cn('sendNotice')}>
        <GTitle>发送消息</GTitle>
        <div className={cn('sendStaffWrapper')}>
          <div className={cn('stepsWrapper')}>
            <Steps
              className={cn('sendStaff-steps')}
              current={current}
            >
              <Steps.Step title="设置消息内容"/>
              <Steps.Step title="确认发送人员名单"/>
              <Steps.Step title="确认发送"/>
            </Steps>
            <div className={cn('sendStaff-steps-actions')}>
              {current === 0 && <Step1 next={() => this.setStep(1)}/>}
              {current === 1 && <Step2 next={() => this.setStep(2)} prev={() => this.setStep(0)}/>}
              {current === 2 && <Step3 prev={() => this.setStep(1)}/>}
            </div>
          </div>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
