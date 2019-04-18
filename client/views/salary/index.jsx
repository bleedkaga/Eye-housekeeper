import React from 'react';
import {connect} from 'dva';
import {Switch} from 'dva/router';
import {renderRoutes} from 'react-router-config';
import {hot} from 'react-hot-loader';
import RH from 'client/routeHelper';
import moment from 'moment';

class CapacitySalary extends React.Component {
  constructor(props) {
    super(props);
    const {global} = this.props;
    this.state = {
      none: global.account.permission !== 2,
    };
  }

  componentDidMount() {
    const {history} = this.props;
    if (this.jurisdiction()) {
      RH(history, 'payOpened', '/org/payOpened');
    }
  }

  // 权限判断
  jurisdiction = () => {
    const { history } = this.props;
    const { pathname, isPayment } = history.location;
    const { none } = this.state;

    // 没有开通 vip
    if (none) {
      if (pathname === '/org/salary/taxPlan') {
        // 需要开通 vip 才能使用任务众包模块, 如果过期了， 但是 是从发放记录到 taxPlan付款 的则可以使用
        if (isPayment) {
          return false;
        }
        return true;
      } else {
        return false
      }
    } else {
      return false;
    }



  };

  render() {

    return (this.jurisdiction() ? null : <Switch>
      {
        renderRoutes(this.props.route.routes)
      }
    </Switch>);
  }
}

export default connect(state => state)(hot(module)(CapacitySalary));
