import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';

import './style.less';

import Detail1 from './detail1';
import Detail2 from './detail2';
import Detail3 from './detail3';

class Class extends React.Component {
  constructor(props) {
    super(props);
    const {match: {params = {}}} = props;

    this.secondPath = window.__themeKey === 'org' ? 'hr' : 'spring';


    this.state = {
      type: params.type,
    };
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'welfareRecordDetail/reset'});
  }

  render() {
    const {type} = this.state;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '福利记录', path: `/${window.__themeKey}/${this.secondPath}/welfareRecords`},
          {name: '查看明细'},
        ]}
      />
      <GPage className={cn('welfareRecordDetail')}>
        {type === '0' ? <Detail1 {...this.props}/> : null}
        {type === '1' ? <Detail2 {...this.props}/> : null}
        {type === '2' ? <Detail3 {...this.props}/> : null}
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
