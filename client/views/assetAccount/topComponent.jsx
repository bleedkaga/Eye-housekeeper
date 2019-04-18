import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import { Button} from 'antd';

import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  render() {
    // console.log(this.props, 'MMMMMMMMMMMMMM');
    return (
      <div className={cn('top-wrapper')}>
        <ul>
          <li className={cn('top-wrapper-common')}>
            <div className={cn('top-wrapper-icon')}>
              <img className={cn('top-wrapper-imge')}/>
            </div>
            <p className={cn('top-wrapper-nameOne')}>现金账户</p>
            <p className={cn('top-wrapper-numberOne')}>0.00</p>
            <p className={cn('top-wrapper-illustrate')}>用于众包服务费支付</p>
          </li>
          <li className={cn('top-wrapper-common')}>
            <div className={cn('top-wrapper-icon')}>
              <img className={cn('top-wrapper-imge')}/>
            </div>
            <p className={cn('top-wrapper-nameOne')}>单位福利账户</p>
            <p className={cn('top-wrapper-numberTwo')}>0.00</p>
            <div className={cn('top-wrapper-button')}>
              <Button type="primary" >充值</Button>
            </div>
            <p className={cn('top-wrapper-illustrate')}>用于麦卡福利社购买商品或服务</p>
          </li>
          <li className={cn('top-wrapper-common', 'top-wrapper-unmargin')}>
            <div className={cn('top-wrapper-icon')}>
              <img className={cn('top-wrapper-imge')}/>
            </div>
            <p className={cn('top-wrapper-nameOne')}>福利积分</p>
            <p className={cn('top-wrapper-numberOne')}>0.00</p>
            <p className={cn('top-wrapper-illustrate')}>暂未开通</p>
          </li>
        </ul>
      </div>
    );
  }
}

export default connect(state => state)(hot(module)(Class));
