import React from 'react';
import cn from 'classnames';
import {connect} from 'dva';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import {formatMoney, accMul} from 'client/utils/formatData';
import RH from 'client/routeHelper';
import TaxTrial from 'client/components/TaxTrial';
import HeaderView from './header-view';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import TableViewFailed from 'client/components/TaxSendFailRecord';
import './style.less';
import {Tabs, Steps, Affix, Button, Modal} from 'antd';


const TabPane = Tabs.TabPane;
const Step = Steps.Step;

class TaxPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    const {dispatch, location} = props;
    const {
      isPayment,
      step,
      outTradeNo,
      currentScheme,
      personCount,
      serviceCharge,
      totalAmount,
      totalMoney,
    } = location;
    if (isPayment) {
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          step,
          outTradeNo,
          currentScheme,
          personCount,
          serviceCharge,
          totalAmount,
          totalMoney,
        },
      });
    }
  }

  // 初始化数据
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'taxPlan/initData',
      payload: {},
    });
  }

  // 卸载组件后数据初始化
  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'taxPlan/reset',
      payload: {},
    });
  }

  // tabs 切换
  tabsChange = (key) => {
    const {dispatch, taxPlan} = this.props;
    if (taxPlan.step > 0 || !taxPlan.createSchemeBtnDisable) {
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          tabsChangeVisible: true,
        },
      });
    } else {
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          currentScheme: key,
        },
      });
    }
  };

  // 确定 tabs 切换
  confirmTabsChange = () => {
    const {dispatch, taxPlan} = this.props;
    dispatch({
      type: 'taxPlan/updateState',
      payload: {
        step: 0,
        fileList: [],
        schemeTwoFile: [],
        tabsChangeVisible: false,
        createSchemeBtnDisable: true,
        currentScheme: taxPlan.currentScheme === '1' ? '2' : '1',
      },
    });
  };

  // step2 上一步
  prev = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'taxPlan/updateState',
      payload: {
        step: 0,
        fileList: [],
        schemeTwoFile: [],
      },
    });
  };

  // step2 下一步
  next = () => {
    const {dispatch, taxPlan, history} = this.props;
    const { outTradeNo, paymentMethod } = taxPlan;

    if (paymentMethod) {
      dispatch({
        type: 'taxPlan/programRelease',
        payload: {
          outTradeNo: outTradeNo,
          cb: () => {
            RH(history, 'taxSendRecord', `/${window.__themeKey}/salary/taxSendRecord`);
          }
        }
      })
    } else {
      dispatch({
        type: 'taxPlan/confirmScheme',
        payload: {
          outTradeNo: outTradeNo,
        },
      });
    }
  };

  // step3 返回上一步
  step3_prev = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'taxPlan/queryScheme',
      payload: {
        pageIndex: 1,
        pageSize: 10,
      },
    });
  };

  render() {
    const {taxPlan, global, taxSendDetailRecord, dispatch, history} = this.props;
    const {
      step,
      currentScheme,
      taxTrialVisible,
      personinfoFull,
      personCount,
      totalAmount,
      qualifyingAmount,
      qualifiedCount,
      tabsChangeVisible,
      showResult,
      confirmSchemeBtnLoad,
      outTradeNo,
      paymentBtnLoading,
      paymentMethod,
    } = taxPlan;
    // header
    const headerViewProps = {
      ...taxPlan,
      dispatch,
    };
    // step1
    const step1Props = {
      ...taxPlan,
      ...global,
      dispatch,
    };
    // step2
    const step2Props = {
      ...taxPlan,
      dispatch,
      history,
    };
    // step3
    const step3Props = {
      ...taxPlan,
      dispatch,
      history,
      global,
    };
    // step4
    const step4Props = {
      ...taxPlan,
      taxSendDetailRecord,
      dispatch,
      history,
    };

    // step4 fail_result
    const step4_result = {
      ...taxSendDetailRecord,
      dispatch,
      history,
      onSearch: (_data) => {
        dispatch({
          type: 'taxSendDetailRecord/queryDetail',
          payload: {
            ..._data,
            outTradeNo,
          },
        });
      },
    };
    // step
    const stepsContents = [
      {
        title: '众包任务配置',
        content: <Step1 {...step1Props}/>,
      },
      {
        title: '确认发放信息及费用',
        content: <Step2 {...step2Props}/>,
      },
      {
        title: paymentMethod === 0 ? '支付费用' : '发布任务',
        fun: true,
        // content: type => <Step3 {...step3Props} ref={step3_ref => (this[`${type}_step3_child`] = step3_ref)}/>,
        content: <Step3 {...step3Props} ref={step3_ref => (this.step3_child = step3_ref)}/>,
      },
      {
        title: paymentMethod === 1 ? '支付费用' : '发布任务',
        content: !showResult ? <Step4 {...step4Props}/> : <div
          style={{padding: '0 20px'}}
        ><TableViewFailed {...step4_result}/></div>,
      },
    ];

    return (
      <GContainer className={cn('home-view')}>
        <GHeader
          route={[
            {name: '首页', path: `/${window.__themeKey}/dashboard`},
            {name: '任务管理'},
          ]}
        />
        <TaxTrial
          visible={taxTrialVisible}
          onCancel={() => dispatch({type: 'taxPlan/updateState', payload: {taxTrialVisible: false}})}
          dispatch={dispatch}
          history={this.props.history}
        />
        <GPage className={cn('taxPlan')} style={{backgroundColor: '#F5F5F5', height: 'calc(100% - 100px)'}}>
          {step === 0 && <HeaderView {...headerViewProps}/>}
          <div className="wrap" style={{minHeight: `${step > 0 ? '100%' : 'calc(100% - 141px)'}`}}>
            <Tabs
              onChange={this.tabsChange}
              activeKey={currentScheme}
              tabBarExtraContent={<div
                className="tabBarExtraContent"
              >{`安全稳定，秒级到账`}{/*（${taxPlan.taxCompanyName}：综合税费${taxPlan.rate}%)*/}</div>}
            >
              <TabPane key="0" tab={<div className="tabPhaneDisable"><span className="dot"/>众包费用发放</div>} disabled/>
              <TabPane tab="使用方案发放" key="1">
                <div className={cn('stepWrap')}>
                  <div className={cn('stepWrap-bg')}>
                    <Steps className="stepsStyle" current={step}>
                      {stepsContents.map((item, index) => <Step key={`s1-${index}`} title={item.title}/>)}
                    </Steps>
                  </div>
                </div>

                {/* {stepsContents[step].fun ? stepsContents[step].content('t1') : stepsContents[step].content} */}
                {currentScheme === '1' && stepsContents[step].content}
              </TabPane>
              <TabPane tab="自定义方案发放" key="2">
                <div className={cn('stepWrap')}>
                  <div className={cn('stepWrap-bg')}>
                    <Steps className="stepsStyle" current={step}>
                      {stepsContents.map((item, index) => <Step key={`s2-${index}`} title={item.title}/>)}
                    </Steps>
                  </div>
                </div>
                {/* {stepsContents[step].fun ? stepsContents[step].content('t2') : stepsContents[step].content} */}
                {currentScheme === '2' && stepsContents[step].content}
              </TabPane>
            </Tabs>
          </div>
          {/* step2 底部 */}
          {step === 1 && <div style={{height: '78px'}}>
            <Affix offsetBottom={0}>
              <div className="step2-affix-footer">
                <div>
                  发放请求共
                  <span className="step2-font-weight">{personCount}条</span>，
                  总金额
                  <span
                    className="step2-font-weight"
                  >{formatMoney(accMul(totalAmount, 0.01), true)}元</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  实际可发放共
                  <span className="step2-font-weight">{qualifiedCount}条</span>，
                  总金额
                  <span className="step2-font-weight">{formatMoney(accMul(qualifyingAmount, 0.01), true)}元</span>
                </div>
                <div>
                  <Button className="step2-prev" onClick={this.prev}>上一步</Button>
                  <Button
                    type="primary"
                    className="spte2-confirm-btn"
                    disabled={!personinfoFull}
                    onClick={this.next}
                    loading={confirmSchemeBtnLoad}
                  >
                    {!personinfoFull > 0 ? '人员信息不全' : paymentMethod === 1 ? '发布任务' : '确定信息及金额'}
                  </Button>
                </div>
              </div>
            </Affix>
          </div>}
          {/* step3 底部 */}
          {step === 2 && <div style={{height: '84px'}}>
            <Affix offsetBottom={0}>
              <div className="step3-btn-wrap">
                <div className="step3-btn-content-wrap">
                  <Button className="step3-btn" onClick={this.step3_prev} disabled={paymentMethod === 1}>返回上一步</Button>
                  <Button
                    type="primary"
                    className="step3-btn"
                    loading={paymentBtnLoading}
                    // onClick={() => this[`t${currentScheme}_step3_child`].paymentBlock.paymentBlockNext()}
                    onClick={() => this.step3_child.paymentBlock.paymentBlockNext()}
                  >
                    立即支付
                  </Button>
                </div>
              </div>
            </Affix>
          </div>}
        </GPage>
        <Modal
          className={cn('gsg-modal')}
          visible={tabsChangeVisible}
          title="温馨提示"
          width={520}
          onCancel={() =>
            dispatch({
              type: 'taxPlan/updateState',
              payload: {tabsChangeVisible: false},
            })
          }
          onOk={() => this.confirmTabsChange()}
        >
          <div className={'tabsTxt f-tac'} style={{fontSize: 16, color: '#333', padding: '30px 0'}}>您确定要放弃本次众包费用发放吗？</div>
        </Modal>
      </GContainer>
    );
  }
}

export default connect(({taxPlan, global, taxSendDetailRecord}) => ({taxPlan, global, taxSendDetailRecord}))(TaxPlan);
