import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Modal, Icon, Input, message} from 'antd';
import BIconfont from 'client/components/BIconfont';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {sendStaff: {step3, balance}, global} = this.props;

    const dept = balance.quotaList.find(item => item.id === step3.deptId);

    const balanceParams = {
      ub: false, //当前余额权限
      ubq: false, //当前部门配额权限
      t6: false, //选择多个部门值显示余额的标识
    };

    if (
      global.account.isMaster === 1 || //超级管理员
      step3.moneyType === 1 || //只能使用余额
      step3.moneyType === 2 || //使用单位配额
      step3.moneyType === 3 ||//使用单位配额（多来源）
      step3.moneyType === 4 //余额，单位配额都可用
    ) {
      //以上只能使用余额发放（单位配额取消）
      balanceParams.ub = true;
      balanceParams.ubq = false;
    } else if (step3.moneyType === 5 && balance.useBalanceQuota === 1) {
      //部门管理员，只能只用部门配额
      balanceParams.ub = false;
      balanceParams.ubq = true;
    } else if (step3.moneyType === 6 && balance.useBalance === 1) {
      //部门管理员，选择多个部门只能使用余额
      balanceParams.ub = true;
      balanceParams.ubq = false;
      balanceParams.t6 = true;
    } else if (step3.moneyType === 7) {
      //部门管理员 余额，部门配额都可选
      if (balance.useBalance === 1) balanceParams.ub = true;
      if (balance.useBalanceQuota === 1) balanceParams.ubq = true;
    }

    this.state = {
      chooseVisible: false,
      pwdVisible: false,
      pwd: '',
      balanceParams,
      dept: dept || {quotaBalance: 0, deptName: ''}, //部门配额显示部门
      moneyType: 1,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  onNext() {
    this.setState({chooseVisible: true});
  }

  getConsumptionOptions() {
    const {sendStaff: {step1: {consumptionOptions = []}}} = this.props;
    const a = [];
    consumptionOptions.forEach((item) => {
      if (item !== '全部') {
        a.push(`【${item}】`);
      }
    });
    return a;
  }

  getReason() {
    const {sendStaff: {step1: {reason = []}, releaseReason}} = this.props;
    let temp = releaseReason;
    const arr = [];
    const items = [];
    reason.forEach((value) => {
      const rel = temp.find(item => item.value === value);
      if (rel) {
        arr.push(rel.label);
        items.push(rel);
        temp = rel.children || [];
      }
    });

    return {arr, items};
  }

  //增加余额
  toType1() {
    RH(this.props.history, 'coupons', '/org/hr/coupons');
  }

  //增加配额
  toType2() {
    RH(this.props.history, 'coupons', '/org/hr/coupons');
  }

  onPwd(moneyType) {
    this.setState({pwdVisible: true, moneyType});
  }

  onEnd() {
    const {dispatch, sendStaff, global, history} = this.props;
    const {balanceParams, dept, moneyType} = this.state;

    const {step1, step2, step3} = sendStaff;

    const reason = this.getReason();

    const arr = [];
    step2.selectedRows.forEach((item) => {
      arr.push({id: item.mappingId, n: item.userName});
    });

    const total = Math.round(step1.amount * step2.selectedRows.length * 100); //发放额

    const opt = {
      __autoLoading: true,
      sendMoneyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId, //ok 发放方单位id
      transferReasonName: reason.arr.join('-'),
      transferReasonOne: reason.items[0] ? reason.items[0].value : '', //一级事由id
      transferReasonTwo: reason.items[1] ? reason.items[1].value : '', //二级事由id
      transferReasonThree: reason.items[2] ? reason.items[2].value : '', //三级事由id
      moneyType, //1表示余额，2表示配额
      userJsonStr: JSON.stringify(arr), //发放json
      amount: Math.round(step1.amount * 100), //发放金额
      totalAmount: total, //发放总金额
      personCount: step2.selectedRows.length, //发放人数
      note: step1.note, //备注
      consumptionOptions: step1.consumptionOptions.join(','), //消费选项
      operationer: `${global.account.accountId}_${global.account.realName}`, //ok 操作人id_name
      outTradeNo: step3.outTradeNo, //流水号
      accountId: global.account.accountId, // 账号id
      payPwd: this.state.pwd, //支付密码
    };

    if (balanceParams.ubq && moneyType === 2) {
      opt.quotaId = dept.id; //配额关联的充值方id
      opt.quotaName = dept.deptName; //配额关联的充值方名称
    }

    dispatch({
      type: 'sendStaff/sendUserMoney',
      payload: opt,
      callback: (res) => {
        if (res.code === 0) {
          this.setState({pwdVisible: false, chooseVisible: false, pwd: ''});
          message.success('提交成功');
          RH(
            history,
            'welfareRecords',
            `/${window.__themeKey}/${window.__themeKey === 'org' ? 'hr' : 'spring'}/welfareRecords`,
            {search: '?pageIndex=1&pageSize=10&createTimeStart=&createTimeEnd=&sendType=1&t=0'},
          );
        }
      },
    });
  }

  render() {
    const {sendStaff, prev} = this.props;
    const {chooseVisible, pwdVisible, balanceParams, dept} = this.state;

    const {step1, step2, balance} = sendStaff;

    const total = Tools.getViewPrice(step1.amount * step2.selectedRows.length, '', true); //发放额

    const totalNumber = parseFloat(total);

    return (<div className={'step3'}>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>发放事由：</div>
        <div className={cn('col', 'col-top', 'info')}>{this.getReason().arr.join('-')}</div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>使用范围：</div>
        <div className={cn('col', 'col-top', 'info')}>{this.getConsumptionOptions()}</div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>备注信息：</div>
        <div className={cn('col', 'col-top', 'info')}>{step1.note || '无'}</div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>发放标准：</div>
        <div className={cn('col', 'col-top', 'info')}><span>{Tools.getViewPrice(step1.amount, '', true)}元/人</span></div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>发放人数：</div>
        <div className={cn('col', 'col-top', 'info')}><span>{step2.selectedRows.length}人</span></div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>发放配额：</div>
        <div className={cn('col', 'col-top', 'info')}>
          <span>{total}元</span>
          {
            !balanceParams.ub && !balanceParams.ubq ? <em>（没有发放权限）</em> : null
          }
          {
            balanceParams.ub && balanceParams.ubq ?
              <em>（当前可用余额{Tools.getViewPrice(balance.showBalance)}元，当前可用配额{Tools.getViewPrice(dept.quotaBalance)}元）</em> : null
          }
          {
            balanceParams.ub && !balanceParams.ubq ?
              <em>（当前可用余额{Tools.getViewPrice(balance.showBalance)}元）</em> : null
          }
          {
            !balanceParams.ub && balanceParams.ubq ?
              <em>（当前可用配额{Tools.getViewPrice(dept.quotaBalance)}元）</em> : null
          }
        </div>
      </div>
      {
        balanceParams.ub && Tools.getViewPrice(balance.showBalance) < totalNumber ? <div className={cn('row')}>
          <div className={cn('col-top', 'label')}/>
          <div className={cn('col', 'col-center')}>
            <span className={cn('sendStaff-tips')}>
              <Icon type="exclamation-circle"/>
            余额不足，请先<a href="javascript:" onClick={() => this.toType1()}>充值&gt;&gt;</a>
            </span>
          </div>
        </div> : null
      }
      {
        balanceParams.ubq && Tools.getViewPrice(dept.quotaBalance) < totalNumber ? <div className={cn('row')}>
          <div className={cn('col-top', 'label')}/>
          <div className={cn('col', 'col-center')}>
            <span className={cn('sendStaff-tips')}>
              <Icon type="exclamation-circle"/>
            配额不足，请<a href="javascript:" onClick={() => this.toType2()}>增加配额&gt;&gt;</a>
            </span>
          </div>
        </div> : null
      }

      <div className={cn('btns')}>
        <Button type={'gray'} onClick={() => prev()}>返回上一步</Button>
        <Button
          disabled={!balanceParams.ub && !balanceParams.ubq}
          type={'primary'}
          onClick={() => this.onNext()}
        >确认发放</Button>
      </div>

      <Modal
        className={cn('gsg-modal', 'sendStaff-s3-modal')}
        title={<div className={cn('title-box')}>
          请选择
          {
            balanceParams.t6 ? <span className={cn('sendStaff-tips')}><Icon
              type="exclamation-circle"
            />你选择了多个部门的员工，只能使用余额发放。</span> : null
          }
        </div>}
        visible={chooseVisible}
        footer={null}
        onCancel={() => this.setState({chooseVisible: false})}
      >
        <div className={cn('sendStaff-choose-list')}>
          {
            balanceParams.ub ?
              <div
                className={cn('item', 'row')}
                onClick={() => {
                  if (Tools.getViewPrice(balance.showBalance) < totalNumber) return message.error('余额不足');
                  this.onPwd(1);
                }}
              >
                {
                  Tools.getViewPrice(balance.showBalance) < totalNumber ? <span className={cn('sendStaff-tips')}>
                    <Icon type="exclamation-circle"/>
                  余额不足，请先<a href="javascript:" onClick={() => this.toType1()}>充值&gt;&gt;</a>
                  </span> : null
                }
                <i className={cn('bg_cover', 'i0', 'col-center')}/>
                <div className={cn('col-center', 'col', 'info', 'f-toe')}>
                  <span>使用余额发放</span>
                  <em className={cn('f-toe')}>账户余额（元）：{Tools.getViewPrice(balance.showBalance)}</em>
                </div>
                <b className={'col-center'}><Icon type="right"/></b>
              </div> : null
          }

          {
            balanceParams.ubq ? <div
              className={cn('item', 'row')}
              onClick={() => {
                if (Tools.getViewPrice(dept.quotaBalance) < totalNumber) return message.error('配额不足');
                this.onPwd(2);
              }}
            >
              {
                Tools.getViewPrice(dept.quotaBalance) < totalNumber ?
                  <span className={cn('sendStaff-tips')}>
                    <Icon type="exclamation-circle"/>
                    配额不足，请<a href="javascript:" onClick={() => this.toType2()}>增加配额&gt;&gt;</a>
                  </span> : null
              }
              <i className={cn('bg_cover', 'i1', 'col-center')}/>
              <div className={cn('col-center', 'col', 'info', 'f-toe')}>
                <span>使用配额发放</span>
                <em className={cn('f-toe')}>账户配额（元）：{Tools.getViewPrice(dept.quotaBalance)}</em>
              </div>
              <b className={'col-center'}><Icon type="right"/></b>
            </div> : null
          }

        </div>
      </Modal>

      <Modal
        className={cn('gsg-modal')}
        title={'支付密码'}
        visible={pwdVisible}
        onCancel={() => this.setState({pwdVisible: false})}
        onOk={() => {
          if (!this.state.pwd) return message.error('请输入支付密码');
          this.onEnd();
        }}
        okButtonProps={{loading: sendStaff.isLoadSend}}
      >
        <div style={{padding: 40}}>
          <div className={cn('row', 'sendStaff-pay-pwd')}>
            <span className={cn('col-center')}>支付密码：</span>
            <Input
              type={'password'}
              className={cn('col', 'col-center')}
              placeholder={'请输入'}
              value={this.state.pwd}
              suffix={<BIconfont type={'anquanmima'}/>}
              onChange={(e) => {
                this.setState({pwd: e.target.value});
              }}
              onPressEnter={() => {
                if (!this.state.pwd) return message.error('请输入支付密码');
                this.onEnd();
              }}
            />
          </div>
        </div>
      </Modal>
    </div>);
  }
}

export default connect(state => state)(hot(module)(Class));
