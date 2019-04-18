import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Icon, Row, Col, Button, message} from 'antd';
import {GContainer, GPage} from 'client/components/GLayout';
import TaxTrial from 'client/components/TaxTrial';
import CostCalculate from 'client/components/CostCalculate';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import Weight from 'client/utils/weight';
import moment from 'moment';
import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);
    const key = Tools.getTypeByPath(props.location.pathname).key;
    this.state = {
      org: key === 'org',
      key,
      taxTrialVisible: false,
    };
  }

  componentDidMount() {
    const {key} = this.state;
    const {dispatch} = this.props;
    dispatch({type: 'global/checkIfThePayrollIsOpen'}); // 切换公司， vip 时间会显示今天的日期， 因为这个方法不会调用。 在 layout 里切换公司再调用一次
    dispatch({
      type: 'dashboard/change',
      payload: {
        themeKey: key,
      },
    });

    setTimeout(() => {
      dispatch({type: 'dashboard/findAuditSendMoneyTask'});
    }, 16);
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(nextProps) {
  // }

  render() {
    const {org, taxTrialVisible} = this.state;
    const {history, dispatch, dashboard, global} = this.props;

    const temp = false; //以前的老板需要的参数， 现在默认为false 防止修改

    return (<GContainer className={cn('home-view')}>
      <GPage className={cn('dashboard')} style={{backgroundColor: '#f5f5f5'}} top={-26}>
        <div className={cn('dashboard-title', 'row')}>
          <div className={cn('col-center')}>{Tools.getPAM()}，{global.account.realName}！</div>
          {
            dashboard.welfareApprovalCount ? <div className={cn('col', 'col-center', 'notice')}>
              <Icon type={'notification'}/>您有{dashboard.welfareApprovalCount}条福利发放审批！&nbsp;
              <a
                href="javascript:"
                className={cn('has-text')}
                onClick={() => {
                  RH(history, 'welfareApproval', `/${window.__themeKey}/welfareApproval`);
                }}
              >查看</a>
            </div> : null
          }
        </div>
        <div className={cn('dashboard-top', 'f-cb')}>
          <Row gutter={16}>
            <Col span={temp ? 12 : 8} className={cn('t0')}>
              <div className={cn('item')}>
                <div className={cn('t-title')}><i className={cn('tag')}/>{org ? '在职员工' : '工会会员'}</div>
                <div className={cn('row')}>
                  <div className={cn('number', 'f-ffa', 'f-toe', 'col', 'col-center')}>{dashboard.compnayPerson}</div>
                  <div className={cn('change', 'col', 'col-center', 'f-toe')}>
                    <span>
                      本月
                      <em>{org ? '入职' : '入会'}{`${dashboard.incoming}人`}</em>
                      <b>{org ? '离职' : '离会'}{`${dashboard.resigned}人`}</b>
                    </span>
                    {
                      dashboard.compnayPerson ?
                        <a
                          href="javascript:"
                          onClick={() => {
                            RH(history, 'personnelChangeRecord', `/${window.__themeKey}/personnelChangeRecord`);
                          }}
                          className={cn('has-text', 'f-toe')}
                        >查看{org ? '人员' : '会员'}变更记录</a> : null
                    }
                  </div>
                </div>
              </div>
            </Col>
            {
              !org ? <Col span={16} className={cn('t4')}>
                <div className={cn('item')}/>
              </Col> : temp ? <Col span={12} className={cn('t4')}>
                <div className={cn('item')}>
                  <span>使用人工智能薪税筹划，企业<i>立省10%以上人</i>力成本。</span>
                  <Button type={'primary'}>开启薪筹规划</Button>
                </div>
              </Col> : [<Col span={8} className={cn('t1')} key={'dashboard-col-0'}>
                <div className={cn('item')}>
                  <div className={cn('t-title')}><i className={cn('tag')}/>人力成本总额</div>
                  <div className={cn('row')}>
                    <div className={cn('col', 'col-center', 'info0', 'f-toe')}>
                      {
                        dashboard.decreaseRatio * -100 > 0 ?
                          [
                            <i key={'dr0'}><Icon type="arrow-down"/>降</i>,
                            <span
                              key={'dr1'}
                              className={cn('f-ffa')}
                            >{(dashboard.decreaseRatio * -100).toFixed(0)}%</span>,
                          ] :
                          <span className={cn('f-ffa')}>0%</span>
                      }
                    </div>
                    <div className={cn('col', 'col-center', 'f-toe', 'info1')}>
                      <span>现成本总额:{Tools.getViewPrice(dashboard.currentLaborCost)}元</span>
                      <em>原成本总额:{Tools.getViewPrice(dashboard.originalLaborCost)}元</em>
                    </div>
                  </div>
                </div>
              </Col>,
                <Col span={8} className={cn('t1', 't2')} key={'dashboard-col-1'}>
                  <div className={cn('item')}>
                    <div className={cn('t-title')}><i className={cn('tag')}/>人均人力成本</div>
                    <div className={cn('row')}>
                      <div className={cn('col', 'col-center', 'info0', 'f-toe')}>
                        {
                          dashboard.perCapitaDecline * -100 > 0 ?
                            [
                              <i key={'dr0'}><Icon type="arrow-down"/>降</i>,
                              <span
                                key={'dr1'}
                                className={cn('f-ffa')}
                              >{(dashboard.perCapitaDecline * -100).toFixed(0)}%</span>,
                            ] :
                            <span className={cn('f-ffa')}>0%</span>
                        }
                      </div>
                      <div className={cn('col', 'col-center', 'f-toe', 'info1')}>
                        <span>现人均成本:{Tools.getViewPrice(dashboard.currentPerCapitaCost)}元</span>
                        <em>原人均成本:{Tools.getViewPrice(dashboard.originalPerCapitaCost)}元</em>
                      </div>
                    </div>
                  </div>
                </Col>]
            }
          </Row>
        </div>
        <div className={cn('center')}>
          <div className={cn('center-title')}><i/>{org ? '单位管理' : '工会管理'}</div>
          {
            org ?
              <div className={cn('center-menu', 'row')}>
                <div className={cn('col', 'col-center')}>
                  <a href="javascript:" onClick={() => RH(history, 'addStaff', '/org/hr/addStaff')}>
                    <i className={'i0'}/><em>添加成员</em>
                  </a>
                </div>
                <div className={cn('col', 'col-center')}>
                  <a href="javascript:" onClick={() => RH(history, 'depart', '/org/hr/depart')}>
                    <i className={'i1'}/><em>部门管理</em>
                  </a>
                </div>
                <div className={cn('col', 'col-center')}>
                  <a href="javascript:" onClick={() => this.setState({taxTrialVisible: true})}>
                    <i className={'i2'}/><em>薪税试算</em>
                  </a>
                </div>
                <div className={cn('col', 'col-center')}>
                  <a href="javascript:" onClick={() => RH(history, 'taxPlan', '/org/salary/taxPlan')}>
                    <i className={'i3'}/><em>众包费用发放</em>
                  </a>
                </div>
                <div className={cn('col', 'col-center')} onClick={() => RH(history, 'coupons', '/org/hr/coupons')}>
                  <a href="javascript:"><i className={'i4'}/><em>弹性福利</em></a>
                </div>
                <div className={cn('col', 'col-center')}>
                  <a href="javascript:" onClick={() => this.costCalculateRef.showModal(true)}>
                    {/* RH(history, 'assetAccount', '/org/cloud/assetAccount') */}
                    <i className={'i5'}/><em>成本测算</em>
                  </a>
                </div>
                <div className={cn('col', 'col-center')}>
                  <a
                    href="javascript:"
                    onClick={() => RH(null, 'addCompanies', `/${window.__themeKey}/addCompanies`)}
                  >
                    <i className={'i6'}/><em>新增单位</em>
                  </a>
                </div>
              </div> :
              <div className={cn('center-menu', 'row')}>
                <div className={cn('col', 'col-center')}>
                  <a href="javascript:" onClick={() => RH(history, 'unionStaff', '/union/unionStaff')}>
                    <i className={'u0'}/><em>会员管理</em>
                  </a>
                </div>
                <div className={cn('col', 'col-center')}>
                  <a href="javascript:" onClick={() => RH(history, 'coupons', '/union/spring/coupons')}>
                    <i className={'u1'}/><em>工会福利</em>
                  </a>
                </div>
                <div className={cn('col', 'col-center')}>
                  <a href="javascript:" onClick={() => RH(history, 'unionAssetAccount', '/union/cloud/unionAssetAccount')}>
                    <i className={'u2'}/><em>账户管理</em>
                  </a>
                </div>
                <div className={cn('col', 'col-center')}>
                  <a
                    href="javascript:"
                    onClick={() => {
                      // 105: {name: '云账户'},
                      // 110: {name: '资金账户'},
                      // 111: {name: '资金流水'},
                      if (Weight.isWeight(105) && Weight.isWeight(110) && Weight.isWeight(111)) {
                        RH(history, 'govHandle', '/union/govHandle');
                      } else {
                        message.warn('没有权限');
                      }
                    }}
                  ><i className={'u3'}/><em>政策文件</em></a>
                </div>
                <div className={cn('col', 'col-center')}/>
                <div className={cn('col', 'col-center')}/>
                <div className={cn('col', 'col-center')}/>
              </div>
          }
        </div>
        {
          org ?
            <Row gutter={16} className={cn('block-box')}>
              <Col span={8}>
                <div className={cn('block', 'block1')}>
                  <i className={cn('bg_contain')}/>
                  <div className={cn('text')}>
                    <div className={cn('t1')}>企业人力成本优化诊断器</div>
                    <div className={cn('t3')}>在企业成本管理中，人力成本是不可忽视的关键一环，也是判断一个企业是否健康的重要指标，您知道自己企业的人力成本状态是否健康吗？马上测一下！</div>
                    <Button
                      onClick={() => {
                        RH(history, 'diagnotor', '/org/diagnotor');
                        dispatch({type: 'diagnotor/reset'});
                      }}
                      type={'primary'}
                    >开始测试</Button>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={cn('block', 'block2')}>
                  <i className={cn('bg_contain')}/>
                  <div className={cn('text')}>
                    <div className={cn('t1')}>关于智能薪筹的内容</div>
                    <div className={cn('t3')}>运用政策探针通过智能优化财税、薪筹结构 帮助企业节省至少10%的薪筹成本。</div>
                    {
                      global.account.permission === 2 ? <div className={cn('vip-tips')}>
                        <span>VIP有效期：</span>
                        <em>{moment(global.account.startTime).format('YYYY年MM月DD日')}—{moment(global.account.endTime).format('YYYY年MM月DD日')}</em>
                      </div> : <Button
                        type={'primary'}
                        onClick={() => {
                          RH(history, 'payOpened', '/org/payOpened');
                        }}
                      >开通vip</Button>
                    }
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={cn('block', 'block3')}>
                  <i className={cn('bg_contain')}/>
                  <div className={cn('text')}>
                    <div className={cn('t1')}>资金安全担保代扣协议</div>
                    <div className={cn('t3')}>委托第三方机构对资金进行监管，交易流水公开透明，资金流向清晰可查。微信、支付宝、网银担保收取0.3%的手续费，银行担保0手续费。</div>
                    <Button
                      type={'primary'}
                      onClick={() => {
                        RH(history, 'payOpened', '/org/guaranteeAgreement');
                      }}
                    >立即签约</Button>
                  </div>
                </div>
              </Col>
            </Row> :
            <Row className={cn('block-box')}>
              <Col span={24}>
                <div className={cn('block')} style={{minHeight: '300px'}}/>
              </Col>
            </Row>
        }
      </GPage>
      <TaxTrial
        visible={taxTrialVisible}
        onCancel={() => this.setState({taxTrialVisible: false})}
        dispatch={dispatch}
        history={this.props.history}
      />
      <CostCalculate
        wrappedComponentRef={ref => (this.costCalculateRef = ref)}
        history={this.props.history}
      />
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
