import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Icon, Carousel, Divider, message} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Payment from 'client/components/Payment';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';


import './style.less';
import {PayChannelType} from '../../utils/enums';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outTradeNo: null,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'coupons/findBalance',
      payload: {__autoLoading: true},
    });
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'coupons/reset'});
  }

  // componentWillReceiveProps(){
  // }

  render() {
    const {global, coupons, history, dispatch} = this.props;
    const quotaList = coupons.quotaList || [];
    const secondPath = window.__themeKey === 'org' ? 'hr' : 'spring';

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '弹性福利'},
        ]}
      />
      <GPage className={cn('coupons')}>
        <div className={cn('row', 'bgf5f5f5')}>
          <div className={cn('card-left', 'col', 'col-50', 'col-center')}>
            <div className={cn('row', 'card')}>
              <div className={cn('col-center')}>
                <i className={cn('head-title', {union: window.__themeKey !== 'org'})}/>
              </div>
              <div className={cn('col-center', 'col', 'f-toe', 'info')}>
                <div className={cn('f-ffa', 'f-toe', 't1')} title={Tools.getViewPrice(coupons.showBalance, '')}>
                  {Tools.getViewPrice(coupons.showBalance, '')}
                </div>
                <div className={cn('t2')}>
                  {window.__themeKey === 'org' ? '单位' : '工会'}
                  福利账户余额
                </div>
              </div>
              <div className={cn('col-center')}>
                <Button
                  className={cn('recharge')}
                  type={'primary'}
                  onClick={() => {
                    this.paymentDialog.showPayment();
                  }}
                >充值</Button>
              </div>
            </div>
          </div>
          <div className={cn('card-right', 'col', 'col-50', 'col-center')}>
            <div className={cn('row', 'card')}>
              <div className={cn('col-center')}>
                <i className={cn('quota')}/>
              </div>
              <div className={cn('col-center', 'col', 'f-toe', 'info')}>
                <div className={cn('carousel-container')}>
                  {
                    (quotaList && quotaList.length > 3) &&
                    <div
                      className={cn('arrow-wrapper', 'arrow-left')}
                      onClick={() => this.info.slick.slickPrev()}
                    >
                      <Icon type="left"/>
                    </div>
                  }
                  {
                    (quotaList && quotaList.length !== 0) ?
                      <Carousel
                        slidesToShow={quotaList.length < 3 ? quotaList.length : 3}
                        slidesToScroll={quotaList.length < 3 ? quotaList.length : 3}
                        ref={ref => (this.info = ref)}
                        dots={false}
                        style={{height: '100%'}}
                      >
                        {
                          quotaList && quotaList.map(item => (
                            <div key={item.id}>
                              <div className={cn('list-wrapper')}>
                                <div
                                  className={cn('quotaBalance', 'f-toe', 'f-ffa')}
                                  title={Tools.getViewPrice(item.quotaBalance, '')}
                                >
                                  {Tools.getViewPrice(item.quotaBalance, '')}
                                </div>
                                <div className={cn('deptName', 'f-toe')} title={item.deptName || '未知部门'}>
                                  {item.deptName || '未知部门'}
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </Carousel> :
                      <div className={cn('no-data')}>暂无数据</div>
                  }
                  {
                    (quotaList && quotaList.length > 3) &&
                    <div
                      className={cn('arrow-right', 'arrow-wrapper')}
                      onClick={() => this.info.slick.slickNext()}
                    >
                      <Icon type="right"/>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={cn('card-3', 'bgf5f5f5')}>
          <div className={cn('card-box')}>
            <div className={cn('item', 'row')}>
              <i className={cn('card3-icon', 'staff', 'col-center')}/>

              <div className={cn('card-info', 'col', 'col-center')}>
                <div className={cn('t1')}>发放给员工</div>
                <div className={cn('t2')}>直接向员工派发积分，发放后无法自行撤销。</div>
              </div>

              <div className={cn('do-box', 'col-center')}>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    dispatch({
                      type: 'coupons/checkIsPassword',
                      payload: {__autoLoading: true},
                      callback: (res) => {
                        if (res.code === 0) {
                          if (window.__themeKey === 'org') {
                            RH(history, 'sendstaff', `/${window.__themeKey}/hr/coupons/sendstaff`);
                          } else {
                            RH(history, 'sendstaff', `/${window.__themeKey}/spring/coupons/sendstaff`);
                          }
                        } else if (res.message === '请先设置支付密码') {
                          RH(history, 'pwd', `/${window.__themeKey}/pwd`, {state: {current: '2'}});
                        }
                      },
                    });
                  }}
                >开始发放</a>
                <Divider type="vertical" className={cn('divider')}/>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    RH(history, 'welfareRecords', `/${window.__themeKey}/${secondPath}/welfareRecords`,
                      {search: '?pageIndex=1&pageSize=10&createTimeStart=&createTimeEnd=&sendType=1&t=0'});
                  }}
                >查看发放记录</a>
              </div>
            </div>
            <div className={cn('item', 'row')}>
              <i className={cn('card3-icon', 'depart', 'col-center')}/>

              <div className={cn('card-info', 'col', 'col-center')}>
                <div className={cn('t1')}>配发给部门</div>
                <div className={cn('t2')}>将积分配发给部门，由部门负责人进行发放。</div>
              </div>

              <div className={cn('do-box', 'col-center')}>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    RH(history, 'sendDepartment', `/${window.__themeKey}/${secondPath}/coupons/sendDepartment`);
                  }
                  }
                >开始发放</a>
                <Divider type="vertical" className={cn('divider')}/>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    RH(history, 'welfareRecords', `/${window.__themeKey}/${secondPath}/welfareRecords`,
                      {search: '?pageIndex=1&pageSize=10&createTimeStart=&createTimeEnd=&t=1'});
                  }}
                >查看发放记录</a>
                <Divider type="vertical" className={cn('divider')}/>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    RH(history, 'Depart', '/org/hr/depart');
                  }}
                >设置部门</a>
                <Divider type="vertical" className={cn('divider')}/>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    RH(history, 'quotaBalance', `/${window.__themeKey}/${secondPath}/coupons/quotaBalance`);
                  }}
                >各部门配额余量</a>
              </div>
            </div>
            <div className={cn('item', 'row')}>
              <i className={cn('card3-icon', 'unit', 'col-center')}/>

              <div className={cn('card-info', 'col', 'col-center')}>
                <div className={cn('t1')}>发放给关联单位</div>
                <div className={cn('t2')}>将积分配发给关联单位，由关联单位负责人进行发放。</div>
              </div>

              <div className={cn('do-box', 'col-center')}>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    RH(history, 'sendUnit', `/${window.__themeKey}/${secondPath}/coupons/sendUnit`);
                  }}
                >开始发放</a>
                <Divider type="vertical" className={cn('divider')}/>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    RH(history, 'welfareRecords', `/${window.__themeKey}/${secondPath}/welfareRecords`,
                      {search: '?pageIndex=1&pageSize=10&createTimeStart=&createTimeEnd=&t=2'});
                  }}
                >查看发放记录</a>
                <Divider type="vertical" className={cn('divider')}/>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    if (window.__themeKey === 'org') {
                      RH(history, 'linkOrg', '/org/hr/linkOrg');
                    } else {
                      RH(history, 'unionInfo', '/union/unionInfo', {state: {activeKey: '2'}});
                    }
                  }}
                >设置关联单位</a>
                <Divider type="vertical" className={cn('divider')}/>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    RH(history, 'transferStatistics', `/${window.__themeKey}/${secondPath}/coupons/transferStatistics`);
                  }}
                >发放额度统计</a>
              </div>
            </div>
          </div>
        </div>
      </GPage>
      <Payment
        ref={e => (this.paymentDialog = e)}
        show={false}
        way={['alipay', 'wx', 'bank']}
        openBank={'招商银行重庆分行南岸支行'}
        bankName={'固守供应链管理有限公司'}
        bankNumber={'123910742610601'}
        bankTips={'您的汇款信息已提交！'}
        callback={(opt, next) => {
          const {type, money, water} = opt;
          const payload = {
            moneyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId, //ok
            operationer: `${global.account.accountId}_${global.account.realName}`, //ok
            __autoLoading: true,
            amount: money,
            remittanceAmount: money,
          };
          let nextBefore = null;
          switch (type) {
            case 'alipay':
              payload.channelType = PayChannelType.ali;
              payload.returnUrl = window.location.href;
              nextBefore = data => `${data.aliPayUrl}?orderId=${data.tradeNo}`;
              break;
            case 'wx':
              payload.channelType = PayChannelType.wx;
              nextBefore = data => data.payBase64;
              break;
            case 'bank':
              payload.bankTradeNo = water;
              nextBefore = data => data;
              break;
            default:
            //empty
              break;
          }
          if (type === 'bank') {
            dispatch({
              type: 'global/offlineFinance',
              payload: {
                ...payload,
              },
              callback: (res) => {
                if (res.code === 0) {
                  next(nextBefore(res));
                }
              },
            });
          } else {
            dispatch({
              type: 'global/onlineRechargePrepay',
              payload: {
                ...payload,
              },
              callback: (res) => {
                if (res.code === 0) {
                  this.setState({
                    outTradeNo: res.data.outTradeNo,
                  });
                  next(nextBefore(res.data));
                }
              },
            });
          }
        }}
        onComplete={(type) => {
          const outTradeNo = this.state.outTradeNo;
          if (type !== 'bank') {
            return dispatch({
              type: 'coupons/paymentIsSuccess',
              payload: {
                outTradeNo,
                types: 2,
              },
            }).then((res) => {
              if (res && res.code === 0) {
                if (res.data.payResult === 1) {
                  message.success(window.__themeKey === 'org' ? '单位福利账户余额充值成功' : '工会福利账户余额充值成功');
                } else {
                  message.error(window.__themeKey === 'org' ? '单位福利账户余额充值失败' : '工会福利账户余额充值失败');
                }
                dispatch({
                  type: 'coupons/findBalance',
                  payload: {__autoLoading: true},
                });
              } else {
                // message.error(window.__themeKey === 'org' ? '单位福利账户余额充值失败' : '工会福利账户余额充值失败');
                dispatch({
                  type: 'coupons/findBalance',
                  payload: {__autoLoading: true},
                });
              }
            });
          }
        }}
      />
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
