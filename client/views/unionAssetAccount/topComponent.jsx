import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import { Button, message} from 'antd';
import './style.less';
import Payment from 'client/components/Payment';
import RH from 'client/routeHelper';
import Tools from 'client/utils/tools';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {dispatch, global} = this.props;
    // console.log(this.props, 'TTTTTTTTTTTTTTT');
    dispatch({
      type: 'unionAssetAccount/remianShow',
      payload: {
        moneyId: global.account.groupId, //ok
        accountId: global.account.accountId, //ok
      },
    });
  }

  // componentWillUnmount() {
  // }

  // componentWillReceiveProps(){
  // }
  // handleButton() {
  //   console.log('4747');

  // }

  // paymentCallback({type}, next) {
  paymentCallback(obj, next) {
    // console.log(obj, '支付obj');
    const {dispatch, global} = this.props;
    const opt = {
      moneyId: global.account.groupId, //ok
      amount: obj.money,
      remittanceAmount: obj.money,
      operationer: `${global.account.accountId}_${global.account.realName}`, //ok
      __autoLoading: true,
    };
    let nextBefore = null;
    if (obj.type === 'alipay') {
      opt.channelType = 'ALIPAY_1';
      opt.returnUrl = window.location.href;
      nextBefore = data => `${data.aliPayUrl}?orderId=${data.tradeNo}`;
      dispatch({
        type: 'global/onlineRechargePrepay',
        payload: opt,
        callback: (res) => {
          if (res.code === 0) {
            // console.log(res, 'resresres----');
            next(nextBefore(res.data));
          }
        },
      });
    } else if (obj.type === 'wx') {
      opt.channelType = 'WXPAY_1';
      nextBefore = data => data.payBase64;
      dispatch({
        type: 'global/onlineRechargePrepay',
        payload: opt,
        callback: (res) => {
          if (res.code === 0) {
            // console.log(res, 'resresres----');
            next(nextBefore(res.data));
          }
        },
      });
    } else if (obj.type === 'bank') {
      opt.bankTradeNo = obj.water;
      nextBefore = data => data;
      dispatch({
        type: 'global/offlineFinance',
        payload: opt,
        callback: (res) => {
          if (res.code === 0) {
            // console.log(res, 'resresres----');
            next(nextBefore(res));
          }
        },
      });
    } else {
      return false;
    }
  }

  paymentComplete() {
    const {history} = this.props;
    message.success('操作完成');
    setTimeout(() => {
      RH(history, 'cloud/unionAssetAccount', `/${window.__themeKey}/cloud/unionAssetAccount`, { search: '?startDate=&endDate=&channelType=&pageIndex=1&pageSize=10&financialType=&status=', replace: true});
    }, 1500);
    // const {key, redirect} = this.state;
    // const {dispatch, history} = this.props;
    // console.log(this.props, 'paymentComplete.props');
    // dispatch({
    //   type: 'global/checkPayIsSuccess',
    //   payload: {__autoLoading: '查询中...'},
    //   callback: (res) => {
    //     console.log(res, 'paymentComplete的回调==');
    //     if (res.code === 0) {
    //       if (res.data.permission === 2) {
    //         message.error('支付成功！');
    //         RH(history, key, redirect);
    //       } else {
    //         message.error('支付失败！');
    //       }
    //     } else {
    //       message.error('查询失败！');
    //     }
    //   },
    // });
  }

  render() {
    const {unionAssetAccount: {remainShow}} = this.props;
    return (
      <div className={cn('top-wrapper')}>
        <ul>
          {/* <li className={cn('top-wrapper-common')}>
            <div className={cn('top-wrapper-icon')}>
              <img className={cn('top-wrapper-imge')}/>
            </div>
            <p className={cn('top-wrapper-nameOne')}>现金账户</p>
            <p className={cn('top-wrapper-numberOne')}>0.00</p>
            <p className={cn('top-wrapper-illustrate')}>用于众包服务费支付</p>
          </li> */}
          <li className={cn('top-wrapper-common')}>
            <div className={cn('top-wrapper-icon')}>
              <i className={cn('top-wrapper-imge01')} />
            </div>
            <p className={cn('top-wrapper-nameOne')}>工会福利账户</p>
            <p className={cn('top-wrapper-numberTwo')}>{Tools.getViewPrice(remainShow.showBalance, '', false, 2, ',', '.')}</p>
            {/* <p className={cn('top-wrapper-button')}> */}
            <Button type="primary" onClick={() => this.paymentDialog.showPayment()} className={cn('top-wrapper-button')}> 赋 值 </Button>
            {/* </p> */}
            <p className={cn('top-wrapper-illustrate')}>用于工会会员合规福利发放</p>
          </li>
          <li className={cn('top-wrapper-common', 'top-wrapper-unmargin')}>
            <div className={cn('top-wrapper-icon')}>
              <i className={cn('top-wrapper-imge02')}/>
            </div>
            <p className={cn('top-wrapper-nameOne')}>福利积分</p>
            <p className={cn('top-wrapper-numberOne')}>0.00</p>
            <p className={cn('top-wrapper-illustrate')}>暂未开通</p>
          </li>
        </ul>
        <Payment
          ref={e => (this.paymentDialog = e)}
          show={false}
          way={['alipay', 'wx', 'bank']}
          bankName={'固守供应链管理有限公司'}
          bankNumber={'6530000210120100011352'}
          bankTips={'您的汇款信息已提交！'}
          callback={
            (opt, next) => this.paymentCallback(opt, next)
          }
          onComplete={
            type => this.paymentComplete(type)
            // (type) => {
            //   console.log(type, '完成');
            // }
        }
        />
      </div>
    );
  }
}

export default connect(state => state)(hot(module)(Class));
