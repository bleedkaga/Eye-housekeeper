import React from 'react';
import cn from 'classnames';
import {CSSTransition} from 'react-transition-group';
import BIconfont from 'client/components/BIconfont';

import './style.less';

export const Loading = (props) => (
  <div className={cn('iac-box', 'f-cb')}>
    <i className={cn('iac-icon')}>
      <BIconfont
        subType={''}
        type="guanjiaowangtubiao17"
        className={'iac-icon-item'}
      />
      <em className={cn('iac-rotate', 'bg_contain')}/>
    </i>
    {props.text || '正在获取工商信息···'}
  </div>
);

class LoadingComplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
    };
  }

  componentDidMount() {
    this._timer = setTimeout(() => {
      this.setState({show: false});
    }, 888);
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  render() {
    return (
      <CSSTransition
        in={this.state.show}
        classNames="fade"
        timeout={233 + 16}
        unmountOnExit
      >
        <div className={cn('iac-box', 'iac-box2', 'f-cb')}>
          <i className={cn('iac-icon')}>
            <BIconfont
              subType={''}
              type="zijinanquan"
              className={'iac-icon-item'}
            />
          </i>
          {this.props.text || '获取成功'}
        </div>
      </CSSTransition>
    );
  }
}

export default LoadingComplete;


export const CompleteTag = () => (
  <div className={cn('iac-box', 'iac-box3', 'f-cb')}>
    <BIconfont
      subType={''}
      type="guanjiaowangtubiao17"
      className={'iac-icon-item'}
    />
  </div>
);
