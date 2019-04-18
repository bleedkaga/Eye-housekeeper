import React from 'react';
import './style.less';
import RH from 'client/routeHelper';
import { formatMoney, accMul } from 'client/utils/formatData';
import { zzyPayChannelType } from 'client/utils/enums';
import Payment from 'client/components/Payment';
import PollingRequest from 'client/utils/pollingRequest';
import { message, Modal, Button, Checkbox } from 'antd';
import cn from 'classnames';

const Text_Map = {
  alipay: {
    time: <span>工作日，预计<span style={{color: '#ff4d4f'}}>24小时内</span>(T+1)到账；周末和节假日，在节假日后的第一个工作日处理，当日到账。</span>,
    charge: '担保交易 · 手续费0.3%',
    name: '支付宝支付',
    channelType: 1,
  },
  wx: {
    time: <span>工作日，预计<span style={{color: '#ff4d4f'}}>24小时内</span>(T+1)到账；周末和节假日，在节假日后的第一个工作日处理，当日到账。</span>,
    charge: '担保交易 · 手续费0.3%',
    name: '微信支付',
    channelType: 2,
  },
  pay: {
    time: <span>工作日，预计<span style={{color: '#ff4d4f'}}>24小时内</span>(T+1)到账；周末和节假日，在节假日后的第一个工作日处理，当日到账。</span>,
    charge: '担保交易 · 手续费0.3%',
    name: '网银支付',
    channelType: 3,
  },
  bank: {
    time: <span>12:00前转账，预计<span style={{color: '#ff4d4f'}}>12小时内</span>(T+0)到账；12:00后转账，预计<span
      style={{color: '#ff4d4f'}}
    >24小时内</span>(T+1)到账</span>,
    charge: '担保交易 · 0手续费',
    name: '银行转账汇款',
    channelType: 4,
  },
};

class Step3 extends React.Component {
  constructor(props) {
    super(props);

    this.textMap = {
      alipay: {...Text_Map.alipay},
      wx: {...Text_Map.wx},
      pay: {...Text_Map.pay},
      bank: {...Text_Map.bank},
    };

    this.state = {
      isNotShowModal: !!window.localStorage[`__Payment_Modal_u${props.global.account.accountId}__`],
    };
  }

  componentDidMount() {
    this.refresh();
    const { dispatch } = this.props;
    dispatch({
      type: 'taxPlan/updateState',
      payload: {
        showCount: true,
      },
    });
    this.paymentBlock.selectItem('bank');
  }

  refresh() {
    this.textMap.alipay = {...Text_Map.alipay};
    this.textMap.wx = {...Text_Map.wx};
    this.textMap.bank = {...Text_Map.bank};
    this.textMap.pay = {...Text_Map.pay};
  }

  render() {
    const {
      dispatch,
      history,
      personCount,
      totalAmount,
      serviceCharge,
      totalMoney,
      outTradeNo,
      alipay,
      wx,
      pay,
      bank,
      global,
      showCount,
      tradeNum,
      paymentMethod,
      showPaymentTips,
    } = this.props;

    return (
      <div className="step3-wrap">
        <div className="step3-title">
          <div className="step3-title-left">
            <p><span className="tradeNo-lable">订单号</span>：{outTradeNo}</p>
            <p>交易总额合计: {personCount}笔 /￥{formatMoney(accMul(totalMoney || 0, 0.01), true)}</p>
            {/*<p>综合税费: ￥{formatMoney(accMul(serviceCharge || 0, 0.01), true)}</p>*/}
          </div>
          <div className="step3-title-right">
            订单金额: <span style={{color: '#FD8129'}}>￥</span><span style={{fontSize: '24px', color: '#FD8129'}}>{formatMoney(accMul(totalMoney || 0, 0.01), true)}</span>
          </div>
        </div>
        <div
          className="step3-pay-content"
        >
          <p className="pay-label">选择支付渠道：</p>
          <Payment
            ref={e => (this.paymentBlock = e)}
            way={['bank', 'alipay', 'wx', 'pay']}
            textMap={this.textMap}
            show
            dialog={false}
            block={2}
            money={accMul(totalMoney, 0.01)}
            dredge={{alipay, wx, pay, bank}}
            query={{
              companyId: global.account.companyId,
              outTradeNo,
            }}
            callback={(opt, next) => {
              const {type, money, water, item} = opt; //eslint-disable-line

              switch (type) {
                case 'alipay':
                  dispatch({
                    type: 'taxPlan/onlinePayment',
                    payload: {
                      outTradeNo,
                      channelType: zzyPayChannelType.ali,
                      amount: item.details.total,
                      returnUrl: window.location.href,
                      next,
                    },
                  });
                  break;
                case 'wx':
                  dispatch({
                    type: 'taxPlan/onlinePayment',
                    payload: {
                      outTradeNo,
                      channelType: zzyPayChannelType.wx,
                      amount: item.details.total,
                      next,
                    },
                  });
                  break;
                case 'bank':
                  dispatch({
                    type: 'taxPlan/offlinePayment',
                    payload: {
                      outTradeNo,
                      bankTradeNo: water,
                      amount: item.details.total,
                      next,
                    },
                  });
                  break;
                case 'pay':
                  dispatch({
                    type: 'taxPlan/onlinePayment',
                    payload: {
                      outTradeNo,
                      channelType: zzyPayChannelType.yee,
                      amount: item.details.total,
                      next,
                    },
                  });
                  break;
                default:
                  message.error('请选择支付渠道');
                  break;
              }
            }}
            onComplete={(type, updateState) => {
              if (type === 'bank') {
                RH(history, 'taxSendRecord', `/${window.__themeKey}/salary/taxSendRecord`);
              } else {
                return dispatch({
                  type: 'taxPlan/paymentIsSuccess',
                  payload: {
                    outTradeNo: tradeNum,
                    types: 1,
                  },
                }).then((res) => {
                  if (res && res.code === 0) {
                    return new Promise((resolve, reject) => {
                      if (res.data.payType) {
                        resolve();
                        if (paymentMethod === 1) {
                          dispatch({
                            type: 'taxPlan/updateState',
                            payload: {
                              showPaymentTips: true,
                            }
                          })
                        } else {
                          // 下一步与轮询
                          PollingRequest.pollingResult(dispatch, outTradeNo);
                        }
                      } else {
                        message.error('支付失败');
                        reject();
                      }
                    });
                  }
                });
              }
            }}
          />
        </div>
        <div style={{ height: '30px' }}/>
        <Modal
          title="支付渠道到账时间说明"
          visible={showCount && !this.state.isNotShowModal}
          className={cn('gsg-modal')}
          footer={null}
          width={800}
          maskStyle={{backgroundColor: 'rgba(0, 0, 0, .3)'}}
          onCancel={() => { dispatch({type: 'taxPlan/updateState', payload: {showCount: false}}); }}
        >
          <table
            border="0"
            className={cn('native-table-step3')}
          >
            <tbody>
              <tr>
                <td>支付渠道</td>
                <td>当日到账（T+0）</td>
                <td>次日到账（T+1）</td>
              </tr>
              <tr>
                <td>银行转账汇款</td>
                <td>12:00前转账，预计<span style={{color: '#ff4d4f'}}>12小时内</span>到账</td>
                <td>12:00后转账，预计<span style={{color: '#ff4d4f'}}>24小时内</span>到账</td>
              </tr>
              <tr>
                <td>支付宝支付</td>
                <td rowSpan="3">——</td>
                <td rowSpan="3">预计<span style={{color: '#ff4d4f'}}>24小时内</span>到账</td>
              </tr>
              <tr>
                <td>微信支付</td>
              </tr>
              <tr>
                <td>网银支付</td>
              </tr>
            </tbody>
          </table>
          <p style={{marginTop: '15px', fontSize: '14px' }}>
            <span style={{color: '#ff4d4f'}}>温馨提示：</span>
            若遇周末或节假日，则在周末或节假日后第一个工作日处理，当日到账！
          </p>
          <Button
            type="primary"
            className={cn('i-know-btn')}
            onClick={() => { dispatch({type: 'taxPlan/updateState', payload: {showCount: false}}); }}
          >
            我知道了
          </Button>
          <Checkbox onChange={(e) => {
            if (e.target.checked) {
              this.state.isNotShowModal = true;
              window.localStorage[`__Payment_Modal_u${global.account.accountId}__`] = 1;
            } else {
              this.state.isNotShowModal = false;
              window.localStorage[`__Payment_Modal_u${global.account.accountId}__`] = '';
            }
          }}
          >
          下次不再提示
          </Checkbox>
        </Modal>
        <Modal
          key={'p-step4'}
          className={cn('gsg-modal', 'payment-bank-modal')}
          title={'系统提示'}
          width={500}
          visible={showPaymentTips}
          onCancel={() => {
            dispatch({
              type: 'taxPlan/updateState',
              payload: {
                showPaymentTips: false,
              }
            })
          }}
          footer={null}
        >
          <div className={cn('payment-bank-box')}>
            <div className={cn('t1')}>{'您的付款信息已提交，请等待工作人员确认，确认成功后方案自动执行，您可前往发放记录查询'}</div>
            <Button
              onClick={() => {
                RH(history, 'taxSendRecord', `/${window.__themeKey}/salary/taxSendRecord`);
              }}
              type={'primary'}
            >我知道了</Button>
            <div className={cn('t2')}>
              <span>转账汇款说明：</span>
              <em>
                由于线下汇款时间较长，为了快速上账，请在完成转账后提交汇款金额、汇款银行流水号信息，并拨打服务热线。服务热线：<i>40000-10-711</i>
              </em>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Step3;
/**
 *
 */
