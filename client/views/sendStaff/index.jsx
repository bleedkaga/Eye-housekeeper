import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Row, Col, Steps} from 'antd';
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
    const {location: {search}, match: {params = {}}} = props;
    this.state = {
      id: params.id,
      current: parseInt(Tools.getQueryString('step', search), 10) || 0,
    };
  }

  componentDidMount() {
    const {dispatch, global} = this.props;
    const {id} = this.state;

    let moneyId = '';
    let pageType = '';
    if (window.__themeKey === 'org') {
      moneyId = global.account.companyId;
      pageType = '1';
    } else {
      moneyId = global.account.groupId;
      pageType = '2';
    }

    dispatch({
      type: 'sendStaff/findBalance',
      payload: {
        moneyId, //ok
        pageType,
        accountId: global.account.accountId, //ok
      },
    });

    if (id) {
      dispatch({
        type: 'sendStaff/againSendMoneyTask',
        payload: {
          id,
          operationer: `${global.account.accountId}_${global.account.realName}`, //ok
        },
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'sendStaff/reset'});
  }
  // componentWillReceiveProps(){
  // }

  setStep(step) {
    this.setState({current: step});
  }

  render() {
    const {current, id} = this.state;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '弹性福利', path: `/${window.__themeKey}/hr/coupons`},
          {name: '开始发放'},
        ]}
      />
      <GPage className={cn('sendStaff')}>
        <GTitle>发放福利给员工</GTitle>
        <div className={cn('sendStaffWrapper')}>
          <div className={cn('stepsWrapper')}>
            <Steps
              className={cn('sendStaff-steps')}
              current={current}
            >
              <Steps.Step title="选择发放事由"/>
              <Steps.Step title="确认发送人员名单"/>
              <Steps.Step title="确认发放"/>
            </Steps>
            <div className={cn('sendStaff-steps-actions')}>
              {current === 0 && <Step1 next={() => this.setStep(1)} id={id}/>}
              {current === 1 && <Step2 next={() => this.setStep(2)} prev={() => this.setStep(0)} id={id}/>}
              {current === 2 && <Step3 prev={() => this.setStep(1)} id={id}/>}
            </div>
          </div>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
