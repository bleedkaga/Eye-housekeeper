import React from 'react';
import cn from 'classnames';
import {Modal, Icon, Input, Row, Col, message, Button, Spin} from 'antd';
import BIconfont from 'client/components/BIconfont';
import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/capacityTax';
import Tools from 'client/utils/tools';


import './style.less';

const moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

export const Text_Map = {
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
    time: <span>14:00前转账，预计<span style={{color: '#ff4d4f'}}>12小时内</span>(T+0)到账；14:00后转账，预计<span style={{color: '#ff4d4f'}}>24小时内</span>(T+1)到账</span>,
    charge: '担保交易 · 0手续费',
    name: '银行转账汇款',
    channelType: 4,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: props.show,
      step: 0, //步骤 0默认模式 1输入金额 2输入银行汇款账号 3二维码界面 4您的汇款信息已提交！
      money: props.money,
      water: '', //流水号
      type: '', //选择的类型
      params: null, //额外参数
    };
  }

  static defaultProps = {
    textMap: {
      alipay: {...Text_Map.alipay},
      wx: {...Text_Map.wx},
      pay: {...Text_Map.pay},
      bank: {...Text_Map.bank},
    },
    callback: () => {
    },
    dialog: true, //弹窗模式
    show: false,
    dredge: {alipay: false, wx: false, pay: false, bank: false}, //担保交易 开通与否(不传默认为否)
    block: 1, //block板块类型
    query: {}, //block = 2查询用额外的查询参数
    way: ['alipay', 'wx', 'pay', 'bank'], //支付类型， 方式排序
    money: '', //固定金额， 不需要输入
    openBank: '浙商银行重庆渝中支行',
    bankName: '重庆固守大数据有限公司',
    bankNumber: '6530000210120100012231',
    bankPhone: '40000-10-711',
    maxMoney: 9999999.99, //最大支付金额
    bankTips: '您的付款信息已提交，请等待工作人员确认，确认成功后方案自动执行，您可前往发放记录查询',
  };

  componentDidMount() {
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  showPayment() {
    const {money = ''} = this.props;
    this.setState({
      show: true,
      step: 0,
      type: '',
      water: '',
      money,
      params: null,
    });
  }

  timer = null;

  hidePayment() {
    this.setState({step: -1});
    this.timer = setTimeout(() => {
      this.setState({
        show: false,
        step: 0,
        water: '',
        params: null,
      });
    }, 133);
  }

  onDialogClick = (t) => {
    const {money} = this.props;
    if (t === 'bank') {
      //汇款
      this.setState({step: 2, type: t});
    } else if (money) {
      //有了金额
      this.setState({type: t}, () => {
        this.onPayBefore();
      });
    } else {
      //输入金额
      this.setState({step: 1, type: t});
    }
  };

  renderDialogContent() {
    const {way = [], textMap} = this.props;
    const content = way.map((type, index) => {
      switch (type) {
        case 'alipay':
          return (<button
            onClick={() => this.onDialogClick(type)}
            className={cn('payment-dialog-item', 'f-cb', type)}
            key={`pd-${index}`}
          >
            <i/><span>{textMap[type].name}</span><Icon type="right"/><em>实时到账，具体时间以入账时间为准</em>
          </button>);
        case 'wx':
          return (<button
            onClick={() => this.onDialogClick(type)}
            className={cn('payment-dialog-item', 'f-cb', type)}
            key={`pd-${index}`}
          >
            <i/><span>{textMap[type].name}</span><Icon type="right"/><em>实时到账，具体时间以入账时间为准</em>
          </button>);
        case 'pay':
          return (<button
            onClick={() => this.onDialogClick(type)}
            className={cn('payment-dialog-item', 'f-cb', type)}
            key={`pd-${index}`}
          >
            <i/><span>{textMap[type].name}</span><Icon type="right"/><em>实时到账，具体时间以入账时间为准</em>
          </button>);
        case 'bank':
          return (<button
            onClick={() => this.onDialogClick(type)}
            className={cn('payment-dialog-item', 'f-cb', type)}
            key={`pd-${index}`}
          >
            <i/><span>{textMap[type].name}</span><Icon type="right"/><em>预计2小时内到账，具体时间以入账时间为准</em>
          </button>);
        default:
          return null;
      }
    });
    return (<div className={cn('payment-dialog-box')}>{content}</div>);
  }

  renderDialog() {
    const {step} = this.state;
    return (<Modal
      key={'pd-step0'}
      className={cn('gsg-modal', 'gsg-payment', 'payment-modal')}
      title={'选择支付渠道'}
      width={600}
      visible={step === 0}
      footer={null}
      onCancel={() => {
        this.hidePayment();
      }}
    >
      {this.renderDialogContent()}
    </Modal>);
  }

  renderBlock() {
    const {way, textMap} = this.props;
    const {type: t} = this.state;
    return (<div key={'pb-step0'} className={cn('payment-block-main', 'gsg-payment')}>{
      way.map(type => (<button
        key={type}
        className={cn('payment-block-item', type, {active: type === t})}
        onClick={() => {
          this.setState({type});
        }}
      >
        <i/><span>{textMap[type].name}</span><em><Icon type="check" theme="outlined"/></em>
      </button>))
    }</div>);
  }

  //新版block
  renderBlock2() {
    const {way, textMap, dredge} = this.props;
    const {type: t} = this.state;

    return (<div key={'pb-step0'} className={cn('payment-block-main', 'gsg-payment')}>{
      way.map((type) => {
        const tm = textMap[type];
        return (<button
          key={type}
          className={cn('payment-block2-item', type, {active: type === t})}
          onClick={() => {
            this.setState({type}, () => {
              this.getPaymentFees(tm);
            });
          }}
        >
          <div className={cn('box', 'row')}>
            <div className={cn('col', 'col-center')}>
              <div className={cn('item', 'row')}>
                <b className={cn('col-center')}/>
                <i className={cn('pb2-icon', 'col-center', type)}/>
                <span className={cn('col-center')}>{tm.name}</span>
                {
                  dredge[type] ? [
                    <BIconfont type={'baozhang'} className={cn('col-center')} key={`${type}-d0`}/>,
                    <em className={cn('col-center')} key={`${type}-d1`}>{tm.charge}</em>,
                  ] : null
                }
              </div>
              <div className={cn('time')}>{tm.time}</div>
            </div>
            {
              tm.details && t === type ? <div className={cn('detail-money', 'col-center')}>
                <i>应付：</i><span><i>￥</i>{Tools.getViewPrice(tm.details.total, '')}</span>
                <em>（含手续费：￥{Tools.getViewPrice(tm.details.formalities || 0, '')}）</em>
              </div> : null
            }
            {
              tm.loading ? <div className={cn('col-center')}><Spin/></div> : null
            }
          </div>

        </button>);
      })
    }</div>);
  }

  //加载应付款
  getPaymentFees(tm) {
    const {query} = this.props;
    tm.loading = true;
    AJAX.send(ajaxMap.getPaymentFees, {...query, channelType: tm.channelType}).then((res) => {
      if (res.code === 0) {
        tm.details = res.data || {};
      } else {
        tm.details = undefined;
      }
      tm.loading = false;
      this.setState({});
    });
  }

  onPayBefore() {
    const {money: m, textMap = {}} = this.props;
    const {type, money, water} = this.state;
    const {callback} = this.props;

    if (type === 'alipay' || type === 'pay') {
      this.newWindow = window.open();
    }

    callback && callback({
      type,
      money: Math.round((m || money) * 100),
      water,
      item: textMap[type],
    }, this.onPaying);
  }

  onPaying = (params) => {
    const {type} = this.state;
    const {onComplete} = this.props;

    switch (type) {
      case 'alipay':
        this.newWindow.location.href = params;
        this.hidePayment();
        Modal.confirm({
          iconType: '-',
          icon: '-',
          className: 'gsg-modal',
          confirmLoading: true,
          title: '系统提示',
          content: <div className={cn('f-tac')}>是否支付成功</div>,
          okText: '支付成功',
          cancelText: '支付失败',
          onOk: () => {
            if (onComplete) {
              return onComplete(type);
            }
          },
        });
        break;
      case 'wx':
        this.setState({step: 3, params});
        break;
      case 'bank':
        this.setState({step: 4, params});
        break;
      case 'pay':
        this.newWindow.location.href = params;
        this.hidePayment();
        Modal.confirm({
          iconType: '-',
          icon: '-',
          className: 'gsg-modal',
          confirmLoading: true,
          title: '系统提示',
          content: <div className={cn('f-tac')}>是否支付成功</div>,
          okText: '支付成功',
          cancelText: '支付失败',
          onOk: () => {
            if (onComplete) {
              return onComplete(type);
            }
          },
        });
        break;
      default:
        //empty
        break;
    }
  };

  paymentBlockNext() {
    const {type} = this.state;
    this.onDialogClick(type);
  }

  selectItem(type) {
    const tm = this.props.textMap[type];
    this.setState({type}, () => {
      this.getPaymentFees(tm);
    });
  }

  render() {
    const {show, step, money, water, params, type} = this.state;
    const {dialog, onComplete, money: oldMoney, openBank, bankName, bankNumber, bankPhone, block, maxMoney, bankTips} = this.props;

    if (show || !dialog) {
      return [
        dialog ? this.renderDialog() : block === 1 ? this.renderBlock() : this.renderBlock2(),
        <Modal //微信和支付宝的第二步
          key={'p-step1'}
          className={cn('gsg-modal')}
          title={'请输入充值金额'}
          width={500}
          visible={step === 1}
          okText={'去支付'}
          cancelButtonProps={{style: {display: 'none'}}}
          onOk={() => {
            if (!moneyReg.test(money)) {
              return message.error('请输入正确的金额，小数点后最多两位');
            }
            if (money > maxMoney) {
              return message.error(`单次最大支付金额为${maxMoney}元`);
            }
            this.onPayBefore();
          }}
          onCancel={() => {
            this.setState({step: 0, money: oldMoney || '', water: ''});
          }}
        >
          <div className={cn('payment-input-money')}>
            <Row>
              <Col offset={3} span={4}><em>充值金额：</em></Col>
              <Col span={14}>
                <Input
                  placeholder={'请输入'}
                  value={money}
                  suffix={<i>元</i>}
                  onChange={(e) => {
                    this.setState({money: e.target.value});
                  }}
                />
              </Col>
            </Row>
          </div>
        </Modal>,
        <Modal //银行转账的第二步
          key={'p-step2'}
          className={cn('gsg-modal')}
          title={'银行转账汇款'}
          width={777}
          visible={step === 2}
          footer={null}
          onCancel={() => {
            this.setState({step: 0, money: oldMoney || '', water: ''});
          }}
        >
          <div className={cn('payment-input-blank')}>
            <div className={cn('row')}>
              <div className={cn('col', 'col-top', 'pib-left')}>
                <Row>
                  <Col span={10}>
                    <em>汇款金额：</em>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder={'请输入'}
                      suffix={<i>元</i>}
                      value={oldMoney || money}
                      disabled={!!oldMoney}
                      onChange={(e) => {
                        this.setState({money: e.target.value});
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={10}>
                    <em>汇款银行流水帐号：</em>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder={'请输入'}
                      value={water}
                      onChange={(e) => {
                        const { value } = e.target;
                        const rule = /[^a-zA-Z0-9]/g;
                        if (value.length <= 64) {
                          const val = value.replace(rule, '');
                          this.setState({water: val});
                        }
                      }}
                    />
                  </Col>
                </Row>
                <Button
                  onClick={() => {
                    if (!moneyReg.test(money)) return message.error('请输入正确的金额，小数点后最多两位');
                    if (money > maxMoney) {
                      return message.error(`单次最大支付金额为${maxMoney}元`);
                    }
                    if (!water) return message.error('请输入流水号');
                    this.onPayBefore();
                  }}
                  className={cn('pib-left-btn')}
                  type={'primary'}
                >提交</Button>
              </div>
              <div className={cn('col', 'col-top', 'pib-right')}>
                <div className={cn('t1')}>收款账户</div>
                <div className={cn('t2')}><i>开户行：</i>{openBank}</div>
                <div className={cn('t2')}><i>收款姓名：</i>{bankName}</div>
                <div className={cn('t2')}><i>收款账号：</i>{bankNumber}</div>
                <div className={cn('t3')}>由于线下汇款时间较长，为了快速上账，请在完成转账后提交</div>
                <div className={cn('t3')}>汇款金额、汇款银行流水号信息，并拨打服务热线。</div>
                <div className={cn('t3')}>服务热线：{bankPhone}</div>
              </div>
            </div>
          </div>
        </Modal>,
        <Modal
          key={'p-step3'}
          className={cn('gsg-modal')}
          title={'二维码支付'}
          width={500}
          visible={step === 3}
          onCancel={() => {
            this.setState({step: 0});
          }}
          onOk={() => {
            if (onComplete) {
              const rel = onComplete(type);
              if (rel instanceof Promise) {
                const un = message.loading('加载中...', 15);
                return rel.then((v) => {
                  un();
                  this.hidePayment(v);
                  return v;
                }).catch(() => {
                  un();
                });
              } else {
                this.hidePayment();
              }
            } else {
              this.hidePayment();
            }
          }}
          okText={'支付成功'}
          cancelText={'支付失败'}
        >
          <div className={cn('payment-wx-box')}>
            <img className={cn('')} src={`data:image/png;base64,${params}`} alt="微信支付二维码"/>
          </div>
        </Modal>,
        <Modal
          key={'p-step4'}
          className={cn('gsg-modal', 'payment-bank-modal')}
          title={'系统提示'}
          width={500}
          visible={step === 4}
          onCancel={() => {
            onComplete && onComplete(type);
            this.hidePayment();
          }}
          footer={null}
        >
          <div className={cn('payment-bank-box')}>
            <div className={cn('t1')}>{bankTips}</div>
            <Button
              onClick={() => {
                onComplete && onComplete(type);
                this.hidePayment();
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
        </Modal>,
      ];
    } else {
      return null;
    }
  }
}

export default Class;
