import React from 'react';
import './style.less';
import { connect } from 'dva';
import cn from 'classnames';
import { goBack } from 'client/routeHelper';
import AJAX from 'client/utils/ajax';
import API from 'client/services/public';
import BIconfont from 'client/components/BIconfont';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import ModalView from './modal-view';
import { message, Button, Checkbox, Icon } from 'antd';

class GuaranteeAgreement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bank_agreemented: false,
      ali_agreemented: false,
      wx_agreemented: false,
      pay_agreemented: false,
      //
      bank_agreed: true,
      ali_agreed: true,
      wx_agreed: true,
      pay_agreed: true,
      visible: false,
      confirmBtnLoading: false,
      agreementType: 'ali',
      // 已经同意协议查看协议内容
      agreemented: false,
      //
      currentClick: 1,
    };
  }

  componentDidMount() {
    const { global } = this.props;
    const queryData = {
      companyId: global.account.companyId,
    };
    AJAX.send(API.queryOpenPayStatus, queryData).then((res) => {
      if (res && res.code === 0) {
        const { data } = res;
        this.setState({
          bank_agreemented: data.bankPay === 0,
          ali_agreemented: data.aliPay === 0,
          wx_agreemented: data.wechatPay === 0,
          pay_agreemented: data.cyberbankPay === 0,
        });
      } else {
        message.error(res.message);
      }
    });
  }

  updateState(payload) {
    this.setState(payload);
  }

  contract(payType) {
    const { global } = this.props;
    const queryData = {
      companyId: global.account.companyId,
    };
    this.setState({
      confirmBtnLoading: true,
      currentClick: payType,
    });
    AJAX.send(API.updatePayStatus, {payType, ...queryData}).then((res) => {
      if (res && res.code === 0) {
        setTimeout(() => {
          AJAX.send(API.queryOpenPayStatus, queryData).then((_res) => {
            if (_res && _res.code === 0) {
              const { data } = _res;
              this.setState({
                confirmBtnLoading: false,
                visible: false,
                bank_agreemented: data.bankPay === 0,
                ali_agreemented: data.aliPay === 0,
                wx_agreemented: data.wechatPay === 0,
                pay_agreemented: data.cyberbankPay === 0,
              });
            } else {
              message.error(_res.message);
              this.setState({
                confirmBtnLoading: false,
              });
            }
          });
        }, 1500);
      } else {
        message.error(res.message);
        this.setState({
          confirmBtnLoading: false,
        });
      }
    });
  }

  render() {
    const {
      bank_agreemented,
      ali_agreemented,
      wx_agreemented,
      pay_agreemented,
      bank_agreed,
      ali_agreed,
      wx_agreed,
      pay_agreed,
      confirmBtnLoading,
      currentClick,
    } = this.state;

    const { global } = this.props;

    const modalViewProps = {
      updateState: this.updateState.bind(this),
      global,
      ...this.state,
    };

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '资金安全担保代扣协议'},
        ]}
      />

      <GPage>
        <div className={'guaranteeAgreement'}>
          <ModalView {...modalViewProps}/>
          <div className="title">
            资金安全担保代扣协议签订
            <div className="close_icon" onClick={() => goBack(this.props.history)}><Icon type="close" /></div>
          </div>
          <div className={'wrap'}>
            <div className={'first_line'}>
              <div
                className={cn({
                  bank_agreement: true,
                })}
              >
                <div
                  className={
                    cn({
                      title_icon: true,
                    })
                  }
                />
                <p>银行担保代扣协议</p>
                <p className={'green_center_text'}>银行担保 · 资金有保障 · 0手续费</p>
                {!bank_agreemented ? <Button
                  type="primary"
                  className={cn({
                    btn_ageed: bank_agreed,
                    sub_btn: true,
                  })}
                  disabled={!bank_agreed}
                  onClick={() => this.contract(4)}
                  loading={confirmBtnLoading && currentClick === 4}
                >
                  立即签约
                </Button>
                  : <div className={'guarantee_wrap'}>
                    <span><BIconfont style={{ fontSize: '22px', color: '#32B16C' }} type="baozhang"/></span>
                    <span>已担保</span>
                  </div>}
                <div className={'agreement_wrap'}>
                  {
                  !bank_agreemented
                  && <span>
                    <Checkbox
                      checked={bank_agreed}
                      onChange={e => this.setState({bank_agreed: e.target.checked})}
                    />&nbsp;&nbsp;同意</span>
                }
                  <a
                    onClick={() =>
                      this.updateState({
                        agreementType: 'bank',
                        visible: true,
                        agreemented: bank_agreemented,
                      })}
                  >
                    《银行担保代扣协议》
                  </a>
                </div>
              </div>
              <div
                className={cn({
                  ali_agreement: true,
                })}
              >
                <div
                  className={
                    cn({
                      title_icon: true,
                    })
                  }
                />
                <p>支付宝支付担保代扣协议</p>
                <p className={'green_center_text'}>支付宝担保 · 资金有保障 · 手续费0.3%</p>
                {!ali_agreemented ? <Button
                  type="primary"
                  className={cn({
                    btn_ageed: ali_agreed,
                    sub_btn: true,
                  })}
                  disabled={!ali_agreed}
                  onClick={() => this.contract(1)}
                  loading={confirmBtnLoading && currentClick === 1}
                >
                  立即签约
                </Button>
                  : <div className={'guarantee_wrap'}>
                    <span><BIconfont style={{ fontSize: '22px', color: '#32B16C' }} type="baozhang"/></span>
                    <span>已担保</span>
                  </div>}
                <div className={'agreement_wrap'}>
                  {
                  !ali_agreemented
                  && <span>
                    <Checkbox
                      checked={ali_agreed}
                      onChange={e => this.setState({ali_agreed: e.target.checked})}
                    />&nbsp;&nbsp;同意</span>
                }
                  <a
                    onClick={() =>
                      this.updateState({
                        agreementType: 'ali',
                        visible: true,
                        agreemented: ali_agreemented,
                      })
                    }
                  >
                    《支付宝担保代扣协议》
                  </a>
                </div>
              </div>
            </div>
            <div className={'seconds_line'}>
              <div
                className={cn({
                  wx_agreement: true,
                })}
              >
                <div
                  className={
                    cn({
                      title_icon: true,
                    })
                  }
                />
                <p>微信支付担保代扣协议</p>
                <p className={'green_center_text'}>微信担保 · 资金有保障 · 手续费0.3%</p>
                {!wx_agreemented ? <Button
                  type="primary"
                  className={cn({
                    btn_ageed: wx_agreed,
                    sub_btn: true,
                  })}
                  disabled={!wx_agreed}
                  onClick={() => this.contract(2)}
                  loading={confirmBtnLoading && currentClick === 2}
                >
                  立即签约
                </Button>
                  : <div className={'guarantee_wrap'}>
                    <span><BIconfont style={{ fontSize: '22px', color: '#32B16C' }} type="baozhang"/></span>
                    <span>已担保</span>
                  </div>}
                <div className={'agreement_wrap'}>
                  {
                  !wx_agreemented
                  && <span>
                    <Checkbox
                      checked={wx_agreed}
                      onChange={e => this.setState({wx_agreed: e.target.checked})}
                    />&nbsp;&nbsp;同意</span>
                }
                  <a
                    onClick={() =>
                      this.updateState({
                        agreementType: 'wx',
                        visible: true,
                        agreemented: wx_agreemented,
                      })
                    }
                  >
                    《微信支付担保代扣协议》
                  </a>
                </div>
              </div>
              <div
                className={cn({
                  pay_agreement: true,
                })}
              >
                <div
                  className={
                    cn({
                      title_icon: true,
                    })
                  }
                />
                <p>网银支付担保代扣协议</p>
                <p className={'green_center_text'}>网银担保 · 资金有保障 · 手续费0.3%</p>
                {!pay_agreemented ? <Button
                  type="primary"
                  className={cn({
                    btn_ageed: pay_agreed,
                    sub_btn: true,
                  })}
                  disabled={!pay_agreed}
                  onClick={() => this.contract(3)}
                  loading={confirmBtnLoading && currentClick === 3}
                >
                  立即签约
                </Button>
                  : <div className={'guarantee_wrap'}>
                    <span><BIconfont style={{ fontSize: '22px', color: '#32B16C' }} type="baozhang"/></span>
                    <span>已担保</span>
                  </div>}
                <div className={'agreement_wrap'}>
                  {
                  !pay_agreemented
                  && <span>
                    <Checkbox
                      checked={pay_agreed}
                      onChange={e => this.setState({pay_agreed: e.target.checked})}
                    />&nbsp;&nbsp;同意</span>
                }
                  <a
                    onClick={() =>
                      this.updateState({
                        agreementType: 'pay',
                        visible: true,
                        agreemented: pay_agreemented,
                      })
                    }
                  >
                    《网银支付担保代扣协议》
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(({global}) => ({global}))(GuaranteeAgreement);
