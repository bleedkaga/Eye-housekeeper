import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Modal, Icon, Input, message} from 'antd';
import BIconfont from 'client/components/BIconfont';
import Tools from 'client/utils/tools';
import RH, {goBack} from 'client/routeHelper';
import FormPwdModal from 'client/components/FormPwdModal';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {sendNotice: {step3, balance}, global} = this.props;

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
      visiblePwd: false, //添加支付密码
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
    //TODO 现在没有收费项直接到发送
    this.onEnd();

    /*const {dispatch} = this.props;
    dispatch({
      type: 'sendNotice/checkIsPassword',
      payload: {
        __autoLoading: true,
      },
      callback: (res) => {
        if (res.code === 0) {
          this.setState({chooseVisible: true});
        } else if (res.message === '请先设置支付密码') {
          this.setState({visiblePwd: true});
        }
      },
    });*/
  }

  getInformWay() {
    const {sendNotice: {step1: {informWay = []}}} = this.props;

    return informWay.map((v) => {
      if (v === 1) {
        return '系统通知';
      } else if (v === 2) {
        return '短信通知';
      } else if (v === 3) {
        return '语音短信通知';
      } else {
        return '未知';
      }
    });
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
    const {dispatch, sendNotice, global, history} = this.props;
    //付款暂留
    const {balanceParams, dept, moneyType} = this.state; //eslint-disable-line
    const {step1, step2, step3} = sendNotice; //eslint-disable-line

    const arr = [];
    step2.selectedRows.forEach((item) => {
      arr.push(item.mappingId);
    });

    const opt = {
      __autoLoading: true,
      companyId: global.account.companyId, //ok 发放方单位id
      informWay: step1.informWay ? step1.informWay.join(',') : '',
      messageTitle: step1.messageTitle,
      informCountent: step1.informCountent,
      informPersonNumber: step2.selectedRows.length,
      informPersonId: arr.join(','),
      informAmount: 0, //通知金额
      cost: 0, //花费
      operationName: global.account.realName, //ok 操作人名
      operationId: global.account.accountId, //ok 操作人id
      // additionalWay: '', //额外通知方式2_3
    };

    if (step1.informImg) opt.informImg = step1.informImg;
    if (step1.link) opt.link = step1.link;

    dispatch({
      type: 'sendNotice/sendNotification',
      payload: opt,
      callback: (res) => {
        if (res.code !== 0) return;
        this.setState({pwdVisible: false, chooseVisible: false, pwd: ''});
        message.success('发送成功');
        goBack();
      },
    });
  }

  render() {
    const {sendNotice, prev, pwd, dispatch, global} = this.props;
    const {chooseVisible, pwdVisible, balanceParams, dept} = this.state;

    const {step1, step2, balance} = sendNotice;

    const total = Tools.getViewPrice(0, '', true); //发放额，貌似现在默认0

    const totalNumber = parseFloat(total);

    return (<div className={'step3'}>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>发送方式：</div>
        <div className={cn('col', 'col-top', 'info')}>{this.getInformWay().join('、')}</div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>信息标题：</div>
        <div className={cn('col', 'col-top', 'info')}>{step1.messageTitle}</div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>信息内容：</div>
        <div className={cn('col', 'col-top', 'info')}>{step1.informCountent || '无'}</div>
      </div>
      {
        step1.informImg ? <div className={cn('row')}>
          <div className={cn('col-top', 'label')}>信息图片：</div>
          <div className={cn('col', 'col-top', 'info')}>
            <i className={cn('bg_contain', 'msg-img')} style={{backgroundImage: `url(${step1.informImg})`}}/>
          </div>
        </div> : null
      }
      {
        step1.link ? <div className={cn('row')}>
          <div className={cn('col-top', 'label')}>链接地址：</div>
          <div className={cn('col', 'col-top', 'info')}>{step1.link}</div>
        </div> : null
      }
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>发放人数：</div>
        <div className={cn('col', 'col-top', 'info')}><span>{step2.selectedRows.length}人</span></div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-top', 'label')}>发放总额：</div>
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
            <span className={cn('sendNotice-tips')}>
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
            <span className={cn('sendNotice-tips')}>
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
        className={cn('gsg-modal', 'sendNotice-s3-modal')}
        title={<div className={cn('title-box')}>
          请选择
          {
            balanceParams.t6 ? <span className={cn('sendNotice-tips')}><Icon
              type="exclamation-circle"
            />你选择了多个部门的员工，只能使用余额发放。</span> : null
          }
        </div>}
        visible={chooseVisible}
        footer={null}
        onCancel={() => this.setState({chooseVisible: false})}
      >
        <div className={cn('sendNotice-choose-list')}>
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
                  Tools.getViewPrice(balance.showBalance) < totalNumber ? <span className={cn('sendNotice-tips')}>
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
                  <span className={cn('sendNotice-tips')}>
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
        okButtonProps={{loading: sendNotice.isLoadSend}}
      >
        <div style={{padding: 40}}>
          <div className={cn('row', 'sendNotice-pay-pwd')}>
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

      <FormPwdModal
        pwd={pwd}
        global={global}
        dispatch={dispatch}
        title={'设置支付密码'}
        wrappedComponentRef={e => (this._pwdForm = e)}
        visible={this.state.visiblePwd}
        onOk={() => {
          this.setState({visiblePwd: false});
          this.onNext();
        }}
        onCancel={() => {
          this.setState({visiblePwd: false});
        }}
      />
    </div>);
  }
}

export default connect(state => state)(hot(module)(Class));
