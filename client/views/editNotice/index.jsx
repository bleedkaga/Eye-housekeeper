import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import GTitle from 'client/components/GTitle';

import Step1 from './step1';

import '../sendNotice/style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);
    const {location: {state = {}}} = props;

    const item = state.item || {};
    this.props.dispatch({
      type: 'sendNotice/setStep1',
      payload: {
        informWay: [item.informWay], // 类型
        messageTitle: item.messageTitle,
        informCountent: item.informCountent,
        informImg: item.informImg,
        link: item.link,
        fileList: [],
      },
    });

    this.state = {
      item,
    };
  }

  componentDidMount() {
    const {dispatch, global} = this.props;
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'sendNotice/reset'});
  }

  // componentWillReceiveProps(){
  // }

  render() {
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '通知管理', path: `/${window.__themeKey}/notice`},
          {name: '修改通知'},
        ]}
      />
      <GPage className={cn('sendNotice')}>
        <GTitle>编辑内容</GTitle>
        <div className={cn('sendStaffWrapper')}>
          <div className={cn('stepsWrapper')}>
            <Step1 item={this.state.item}/>
          </div>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
