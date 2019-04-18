
import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Steps} from 'antd';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';

import './style.less';

const Step = Steps.Step;

const steps = [
  {
    title: '验证手机',
  },
  {
    title: '设置管理员密码',
  },
  {
    title: '完善信息',
  },
  {
    title: '初始化单位资料',
  },
];

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {location: {search}} = props;

    this.state = {
      current: parseInt(Tools.getQueryString('step', search), 10) || 0,
    };
    if (this.state.current > 0) {
      this.state.current--;
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props.dispatch({type: 'register/reset'});
  }

  // componentWillReceiveProps(){
  // }

  setStep(step) {
    this.setState({current: step});
  }

  render() {
    const {current} = this.state;

    return (<div className={'register'}>
      <Steps className={cn('register-steps')} current={current}>
        {steps.map(item => <Step key={item.title} title={item.title}/>)}
      </Steps>
      <div className={cn('register-steps-actions')}>
        {current === 0 && <Step1 next={() => this.setStep(1)}/>}
        {current === 1 && <Step2 next={() => this.setStep(2)}/>}
        {current === 2 && <Step3 next={() => this.setStep(3)}/>}
        {current === 3 && <Step4/>}
      </div>
    </div>);
  }
}


export default connect(state => state)(hot(module)(Class));
