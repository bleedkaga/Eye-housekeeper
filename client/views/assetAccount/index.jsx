import React from 'react';
import { connect } from 'dva';
import cn from 'classnames';
import { hot } from 'react-hot-loader';
import { GContainer, GHeader, GPage } from 'client/components/GLayout';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import {
  Form, Button, DatePicker, Table,
  Pagination, Select, Icon, Tabs, Affix,
} from 'antd';
import Moment from 'moment';

import './style.less';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      { title: '充值时间', dataIndex: 'createtime', width: 230, align: 'center', fixed: 'left' },
      {
        title: '入账时间',
        dataIndex: 'finishTime',
        width: 230,
        align: 'center',
        fixed: 'left',
        render: (finishTime) => {
          if (finishTime) {
            return finishTime;
          } else {
            return ' _ _ ';
          }
        },
      },
      { title: '流水号', dataIndex: 'outTradeNo', align: 'center', width: 320 },
      { title: '充值金额（元）',
        dataIndex: 'amount',
        align: 'center',
        width: 150,
        render: amount => (
          Tools.getViewPrice(amount, '', false, 2, ',', '.')
        ),
      },
      { title: '实际到账金额（元）',
        dataIndex: 'actualAmount',
        align: 'center',
        width: 160,
        render: actualAmount => (
          Tools.getViewPrice(actualAmount, '', false, 2, ',', '.')
        ),
      },
      { title: '打款渠道', dataIndex: 'channelName', align: 'center', width: 200 },
      { title: '账务类型', dataIndex: 'financialTypeRedundancy', align: 'center', width: 200 },
      {
        title: '状态',
        dataIndex: 'statusDesc',
        align: 'center',
        width: 170,
        fixed: 'right',
        render: (statusDesc) => {
          switch (statusDesc) {
            case '审核中':
              return <div style={{ color: '#FFBE4D' }}>审核中</div>;
            case '审核通过':
              return <div style={{ color: '#32B16C' }}>审核通过</div>;
            case '审核不通过':
              return <div style={{ color: '#FF595B' }}>审核不通过</div>;
            case '待付款':
              return <div style={{color: '#1890FF'}}>待付款</div>;
          }
        },
      },
    ];
    this.columnsCompany = [
      { title: '充值时间', dataIndex: 'createtime', width: 230, align: 'center', fixed: 'left' },
      {
        title: '入账时间',
        dataIndex: 'finishTime',
        width: 230,
        align: 'center',
        fixed: 'left',
        render: (finishTime) => {
          if (finishTime) {
            return finishTime;
          } else {
            return ' _ _ ';
          }
        },
      },
      { title: '流水号', dataIndex: 'outTradeNo', align: 'center', width: 320 },
      { title: '充值金额（元）',
        dataIndex: 'amount',
        align: 'center',
        width: 150,
        render: amount => (
          Tools.getViewPrice(amount, '', false, 2, ',', '.')
        ),
      },
      { title: '实际到账金额（元）',
        dataIndex: 'remittanceAmount',
        align: 'center',
        width: 160,
        render: remittanceAmount => (
          Tools.getViewPrice(remittanceAmount, '', false, 2, ',', '.')
        ),
      },
      { title: '打款渠道', dataIndex: 'channelName', align: 'center', width: 200 },
      { title: '账务类型', dataIndex: 'financialTypeRedundancy', align: 'center', width: 200 },
      {
        title: '状态',
        dataIndex: 'statusDesc',
        align: 'center',
        width: 170,
        fixed: 'right',
        render: (statusDesc) => {
          switch (statusDesc) {
            case '审核中':
              return <div style={{ color: '#FFBE4D' }}>审核中</div>;
            case '审核通过':
              return <div style={{ color: '#32B16C' }}>审核通过</div>;
            case '审核不通过':
              return <div style={{ color: '#FF595B' }}>审核不通过</div>;
            case '待付款':
              return <div style={{color: '#1890FF'}}>待付款</div>;
          }
        },
      },
    ];

    this.unlisten = props.history.listen((e) => {
      if (e.pathname === `/${window.__themeKey}/cloud/assetAccount`) {
        const params = Tools.queryToParams(e.search);
        if (params.type === '1') {
          const o = this.getCurrentParams();
          this.getData({ ...o, ...params }); //查询现金
        } else if (params.type === '2') {
          const o = this.getCurrentParamsCompany();
          this.getDataCompany({ ...o, ...params }); //查询单位
        }
      }
    });
    this.state = {
      cashFlage: false,
      companyFlag: false,
    };
  }

  componentDidMount() {
    const { dispatch, location, location: { state = {} } } = this.props;
    // console.log(this.props, 'this.props;this.props;');
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      if (searchParams.type === '1') {
        dispatch({type: 'assetAccount/setParamCash', payload: searchParams});
        dispatch({ type: 'assetAccount/set', payload: { type: searchParams.type} });
        setTimeout(() => {
          this.onSearch();
        }, 16);
      } else {
        dispatch({ type: 'assetAccount/setParamCompany', payload: searchParams });
        dispatch({ type: 'assetAccount/set', payload: { type: searchParams.type } });
        setTimeout(() => {
          this.onSearchCompany();
        }, 16);
      }
    } else {
      dispatch({type: 'assetAccount/set', payload: {type: '1'}});
      //空的
      dispatch({ type: 'assetAccount/resetParamCash' });
      dispatch({ type: 'assetAccount/resetParamCompany' });
      setTimeout(() => {
        this.onSearch();
      }, 16);
    }
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
  }

  paramsInit(params) {
    Object.keys(params).forEach((k) => {
      if (['pageIndex', 'pageSize'].indexOf(k) !== -1) {
        params[k] = parseInt(params[k], 10);
      if (isNaN(params[k])) { //eslint-disable-line
          delete params[k];
        }
      }
    });
  }

  onSearch() {
    const { history } = this.props;
    const o = this.getCurrentParams();
    const q = Tools.paramsToQuery(o);
    RH(history, 'cloud/assetAccount', `/${window.__themeKey}/cloud/assetAccount`, { search: q, replace: true });
  }

  onSearchCompany() {
    const { history } = this.props;
    const o = this.getCurrentParamsCompany();
    const q = Tools.paramsToQuery(o);
    RH(history, 'cloud/assetAccount', `/${window.__themeKey}/cloud/assetAccount`, { search: q, replace: true });
  }

  //获取redux中的的参数
  getCurrentParams() {
    const { assetAccount } = this.props;
    const o = { ...assetAccount.paramCash, type: assetAccount.type };
    //这里可以做一些特殊操作
    return o;
  }

  getCurrentParamsCompany() {
    const { assetAccount } = this.props;
    const o = { ...assetAccount.paramCompany, type: assetAccount.type };
    return o;
  }

  getData(params) {
    const { dispatch, global } = this.props;
    const { companyId } = global.account;
    dispatch({ type: 'assetAccount/originPullCash', payload: { ...params, moneyId: companyId } });
  }

  getDataCompany(params) {
    const { dispatch, global } = this.props;
    const { companyId } = global.account;
    dispatch({ type: 'assetAccount/originPullCompany', payload: { ...params, moneyId: companyId } });
  }

  highSearch() {
    const { cashFlage } = this.state;
    this.setState({
      cashFlage: !cashFlage,
    });
  }

  highSearchCompany() {
    const { companyFlag } = this.state;
    this.setState({
      companyFlag: !companyFlag,
    });
  }

  commonSearchOne() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assetAccount/setParamCash',
      payload: { pageIndex: 1 },
    });
    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  commonSearchTwo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assetAccount/setParamCompany',
      payload: {pageIndex: 1 },
    });
    setTimeout(() => {
      this.onSearchCompany();
    }, 16);
  }

  tabsCallback(k) {
    // console.log(k, 'KKKKK////');
    const { dispatch } = this.props;
    dispatch({
      type: 'assetAccount/set',
      payload: {
        type: k,
      },
    });
    if (k === '1') {
      setTimeout(() => {
        this.onSearch();
      }, 16);
    } else if (k === '2') {
      setTimeout(() => {
        this.onSearchCompany();
      }, 16);
    }
  }

  handleExport() {
    const {assetAccount, dispatch, global} = this.props;
    const { companyId } = global.account;
    if (assetAccount.type === '1') {
      const param = Object.assign(assetAccount.paramCash, {moneyId: companyId});
      dispatch({
        type: 'assetAccount/cashExport',
        payload: param,
        callback: (res) => {
          window.location.href = res.data.url;
          // console.log(res, '回调的cash');
        },
      });
      // console.log(11111, 'type====<<<<');
    } else if (assetAccount.type === '2') {
      const param = Object.assign(assetAccount.paramCompany, {moneyId: companyId});
      dispatch({
        type: 'assetAccount/companyExport',
        payload: param,
        callback: (res) => {
          window.location.href = res.data.url;
          // console.log(res, '回调的');
        },
      });
      // console.log(22222, 'type====<<<<');
    }
  }

  render() {
    const { cashFlage, companyFlag } = this.state;
    const { form: { getFieldDecorator }, assetAccount, dispatch } = this.props;
    const { paramCash, paramCompany, type } = assetAccount;
    return (
      <GContainer>
        <GHeader
          route={[
            {name: '首页', path: `/${window.__themeKey}/dashboard`},
            {name: '资金账户' },
          ]}
        />

        <GPage className={cn('assetAccount')}>
          <div style={{position: 'relative', top: '0', left: '0', padding: '0 30px'}} className={cn({downline: type === '2' })}>
            <Button
              style={{position: 'absolute', top: '20px', right: '30px', zIndex: '1', backgroundColor: '#F2F2F2'}}
              onClick={() => this.handleExport()}
            >导出充值记录</Button>
            <Tabs activeKey={type} onChange={K => this.tabsCallback(K)} animated={false} >
              <TabPane tab="现金账户充值记录" key="1">
                <Form layout="inline" style={{paddingBottom: 16}}>
                  <FormItem >
                    <RangePicker
                      value={[
                        paramCash.startDate ? Moment(paramCash.startDate, dateFormat) : undefined,
                        paramCash.endDate ? Moment(paramCash.endDate, dateFormat) : undefined,
                      ]}
                      onChange={(date, dateStr) => {
                        dispatch({
                          type: 'assetAccount/setParamCash',
                          payload: { startDate: dateStr[0], endDate: dateStr[1] },
                        });
                      }}
                    />
                    {/* )} */}
                  </FormItem>
                  <FormItem >
                    <Button onClick={() => this.commonSearchOne()} type="primary" style={{width: '75px'}}> 查询 </Button>
                  </FormItem>
                  <FormItem >
                    {
                  cashFlage === false ? <Button onClick={() => this.highSearch()} style={{ backgroundColor: '#F2F2F2' }}>高级查询 <Icon type="down" /></Button> :
                  <Button onClick={() => this.highSearch()} style={{ backgroundColor: '#F2F2F2' }}>收起查询<Icon type="up" /></Button>
                }

                  </FormItem>
                  {
                cashFlage === false ? '' :
                <div style={{marginTop: '16px'}}>
                  <FormItem label="打款渠道" >
                    {getFieldDecorator('payment0', {
                      initialValue: paramCash.channelType ? paramCash.channelType : '',
                      rules: [
                        // { required: true, message: '必填项' }
                      ] })(
                        <Select
                          style={{ width: 180 }}
                          placeholder="请选择"
                          onChange={(a, b) => {
                          //  console.log('onChangeonChangeonChangeonChange');
                            dispatch({
                              type: 'assetAccount/setParamCash',
                              payload: {channelType: b.props.value},
                            });
                          }}
                        >
                          <Option value="">全部</Option>
                          <Option value="yeepay_zzy_cash">线上支付(网银支付)</Option>
                          <Option value="ALIPAY_zzy_cash">线上支付(支付宝支付)</Option>
                          <Option value="WXPAY_zzy_cash" >线上支付(微信支付)</Option>
                          <Option value="bank_transfer">线下银行汇款</Option>
                        </Select>
                    )}

                  </FormItem>
                  <FormItem label="账务类型" >
                    {getFieldDecorator('type0', {
                      initialValue: paramCash.financialType ? paramCash.financialType : undefined,
                      // rules: [{ required: true, message: '必填项' }]
                    })(
                      // <Input />
                      <Select
                        style={{ width: 180 }}
                        placeholder="请选择"
                        onChange={(a, b) => {
                        //  console.log('onChangeonChangeonChangeonChange');
                          dispatch({
                            type: 'assetAccount/setParamCash',
                            payload: {financialType: b.props.value},
                          });
                        }}
                      >
                        <Option value="1">现金账户充值</Option>
                      </Select>

                    )}

                  </FormItem >
                  <FormItem label="状态" >
                    {getFieldDecorator('status0', {
                      initialValue: paramCash.status ? paramCash.status : '',
                      // rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                      // <Input />
                      <Select
                        style={{ width: 180 }}
                        placeholder="请选择"
                        onChange={(a, b) => {
                        //  console.log('onChangeonChangeonChangeonChange');
                          dispatch({
                            type: 'assetAccount/setParamCash',
                            payload: {status: b.props.value},
                          });
                        }}
                      >
                        <Option value="">全部</Option>
                        <Option value="1">审核通过</Option>
                        <Option value="3">审核中</Option>
                        <Option value="2">审核不通过</Option>
                        {/*<Option value="4">待付款</Option>*/}

                      </Select>
                    )}
                  </FormItem>

                </div>
              }
                </Form>
                {assetAccount && assetAccount.listOfCash && assetAccount.listOfCash.data &&
                <Table
                  loading={assetAccount.isLoad}
                  rowKey="id"
                  columns={this.columns}
                  scroll={{ x: 1660, y: 550 }}
                  dataSource={assetAccount.listOfCash.data.list}
                  pagination={false}
                  bordered
                />
              }

                <div className={cn('gray-block')}>
                  {assetAccount && assetAccount.listOfCash && assetAccount.listOfCash.data && assetAccount.listOfCash.data.statistical &&
                  <div>{assetAccount.listOfCash.data.statistical.total}条充值记录，
                    <i style={{color: '#32B16C'}}>充值成功{assetAccount.listOfCash.data.statistical.success}笔，</i>
                    <i style={{color: '#FDC56B'}}>审核中{assetAccount.listOfCash.data.statistical.underreview}笔，</i>
                    <i style={{color: '#FF4D4F'}}>审核不通过{assetAccount.listOfCash.data.statistical.failure}笔, </i>
                    {/*<i style={{color: '#1890FF'}}>待付款{assetAccount.listOfCash.data.statistical.pendingpayment}笔</i>*/}
                  </div>
                  }
                  {assetAccount && assetAccount.listOfCash && assetAccount.listOfCash.data && assetAccount.listOfCash.data.statisticalAmount &&
                  <div> 现金账户：
                    累计充值{Tools.getViewPrice(assetAccount.listOfCash.data.statisticalAmount.totalamount, '', false, 2, ',', '.')}元，
                    实际到账{Tools.getViewPrice(assetAccount.listOfCash.data.statisticalAmount.actualArrival, '', false, 2, ',', '.')}元
                  </div>
                  }
                </div>

                {assetAccount && assetAccount.listOfCash && assetAccount.listOfCash.data && assetAccount.listOfCash.data.list && assetAccount.listOfCash.data.list.length > 0 ?
                  <div className={cn('footer-pagination-placeholder')} style={{height: '72px', backgroundColor: '#fff'}}>
                    <Affix offsetBottom={0}>
                      <div className={cn('footer-pagination')}>
                        <Pagination
                          current={assetAccount.listOfCash.pageIndex}
                          total={assetAccount.listOfCash.totalCount}
                          pageSize={assetAccount.listOfCash.pageSize}
                          showQuickJumper
                          showSizeChanger
                          pageSizeOptions={['10', '20', '30', '40', '50']}
                          onChange={(i, c) => {
                            dispatch({
                              type: 'assetAccount/setParamCash',
                              payload: { pageIndex: i, pageSize: c },
                            });
                            setTimeout(() => {
                              this.onSearch();
                            }, 16);
                          }}
                          onShowSizeChange={(i, c) => {
                            dispatch({
                              type: 'assetAccount/setParamCash',
                              payload: { pageIndex: i, pageSize: c },
                            });
                            setTimeout(() => {
                              this.onSearch();
                            }, 16);
                          }}
                          showTotal={() => (
                            `共${assetAccount.listOfCash.totalCount || 0}条数据`
                          )}
                        />
                      </div>
                    </Affix>
                  </div> : ''

              }
              </TabPane>
              <TabPane tab="单位福利账户充值记录" key="2">
                <Form layout="inline" style={{paddingBottom: 16}}>
                  <FormItem >
                    {/* {getFieldDecorator('timeOne', {
                // rules: [{ required: true, message: 'Please input your username!' }],
              })( */}
                    <RangePicker
                      value={[
                        paramCompany.startDate ? Moment(paramCompany.startDate, dateFormat) : undefined,
                        paramCompany.endDate ? Moment(paramCompany.endDate, dateFormat) : undefined,
                      ]}
                      onChange={(date, dateStr) => {
                        dispatch({
                          type: 'assetAccount/setParamCompany',
                          payload: { startDate: dateStr[0], endDate: dateStr[1] },
                        });
                      }}
                    />
                    {/* )} */}
                  </FormItem>
                  <FormItem >
                    <Button onClick={() => this.commonSearchTwo()} type="primary" style={{width: '75px'}}> 查询 </Button>
                  </FormItem>
                  <FormItem >
                    {
                  companyFlag === false ? <Button onClick={() => this.highSearchCompany()} style={{ backgroundColor: '#F2F2F2' }}>高级查询 <Icon type="down" /></Button> :
                  <Button onClick={() => this.highSearchCompany()} style={{ backgroundColor: '#F2F2F2' }}>收起查询<Icon type="up" /></Button>
                }

                    {/*  */}
                  </FormItem>
                  {
                companyFlag === false ? '' :
                <div style={{marginTop: '16px'}}>
                  <FormItem label="打款渠道" >
                    {getFieldDecorator('payment', {
                      initialValue: paramCompany.channelType ? paramCompany.channelType : '',
                      // rules: [{ required: true, message: '必填项' }],
                    })(
                      // <Input />
                      <Select
                        style={{ width: 180 }}
                        placeholder="请选择"
                        onChange={(a, b) => {
                          //  console.log('onChangeonChangeonChangeonChange');
                          dispatch({
                            type: 'assetAccount/setParamCompany',
                            payload: {channelType: b.props.value},
                          });
                        }}
                      >
                        <Option value="">全部</Option>
                        {/* <Option value="yeepay">线上支付(网银支付)</Option> */}
                        <Option value="ALIPAY_1">线上支付(支付宝支付)</Option>
                        <Option value="WXPAY_1" >线上支付(微信支付)</Option>
                        <Option value="bank_transfer">线下银行汇款</Option>
                      </Select>
                    )}

                  </FormItem>
                  <FormItem label="账务类型" >
                    {getFieldDecorator('type', {
                      initialValue: paramCompany.financialType ? paramCompany.financialType : '',
                      // rules: [{ required: true, message: '必填项' }],
                    })(
                      // <Input />
                      <Select
                        style={{ width: 180 }}
                        placeholder="请选择"
                        onChange={(a, b) => {
                        //  console.log('onChangeonChangeonChangeonChange');
                          dispatch({
                            type: 'assetAccount/setParamCompany',
                            payload: {financialType: b.props.value},
                          });
                        }}
                      >
                        <Option value="1">单位福利账户充值</Option>
                      </Select>
                    )}

                  </FormItem >
                  <FormItem label="状态" >
                    {getFieldDecorator('status', {
                      initialValue: paramCompany.status ? paramCompany.status : '',
                      // rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                      // <Input />
                      <Select
                        style={{ width: 180 }}
                        placeholder="请选择"
                        onChange={(a, b) => {
                          // console.log(a, b, 'onChangeonChangeonChangeonChange');
                          dispatch({
                            type: 'assetAccount/setParamCompany',
                            payload: {status: b.props.value},
                          });
                        }}
                      >
                        <Option value="">全部</Option>
                        <Option value="1">审核通过</Option>
                        <Option value="3">审核中</Option>
                        <Option value="2">审核不通过</Option>
                        {/*<Option value="4">待付款</Option>*/}
                      </Select>
                    )}
                  </FormItem>
                </div>
              }
                </Form>
                {assetAccount && assetAccount.listOfCompany && assetAccount.listOfCompany.data &&
                <Table
                  loading={assetAccount.isLoad}
                  rowKey="id"
                  columns={this.columnsCompany}
                  scroll={{ x: 1660, y: 550 }}
                  dataSource={assetAccount.listOfCompany.data.list}
                  pagination={false}
                  bordered
                />
              }

                <div className={cn('gray-block')}>
                  {
                    assetAccount && assetAccount.listOfCompany && assetAccount.listOfCompany.data && assetAccount.listOfCompany.data.statistical &&
                    <div>{assetAccount.listOfCompany.data.statistical.total}条充值记录，
                      <i style={{color: '#32B16C'}}>充值成功{assetAccount.listOfCompany.data.statistical.success}笔，</i>
                      <i style={{color: '#FDC56B'}}>审核中{assetAccount.listOfCompany.data.statistical.underreview}笔，</i>
                      <i style={{color: '#FF4D4F'}}>审核不通过{assetAccount.listOfCompany.data.statistical.failure}笔, </i>
                      {/*<i style={{color: '#1890FF'}}>待付款{assetAccount.listOfCompany.data.statistical.pendingpayment}笔</i>*/}
                    </div>
                  }
                  {
                    assetAccount && assetAccount.listOfCompany && assetAccount.listOfCompany.data && assetAccount.listOfCompany.data.statisticalAmount &&
                    <div> 现金账户：
                      累计充值{Tools.getViewPrice(assetAccount.listOfCompany.data.statisticalAmount.totalamount, '', false, 2, ',', '.')}元，
                      实际到账{Tools.getViewPrice(assetAccount.listOfCompany.data.statisticalAmount.actualArrival, '', false, 2, ',', '.')}元
                    </div>
                  }
                </div>


                {assetAccount && assetAccount.listOfCompany && assetAccount.listOfCompany.data && assetAccount.listOfCompany.data.list && assetAccount.listOfCompany.data.list.length > 0 ?
                  <div className={cn('footer-pagination-placeholder')} style={{height: '72px', backgroundColor: '#fff'}}>
                    <Affix offsetBottom={0}>
                      <div className={cn('footer-pagination')}>
                        <Pagination
                          // style={{ float: 'right', marginTop: '16px' }}
                          current={assetAccount.listOfCompany.pageIndex}
                          total={assetAccount.listOfCompany.totalCount}
                          pageSize={assetAccount.listOfCompany.pageSize}
                          showQuickJumper
                          showSizeChanger
                          pageSizeOptions={['10', '20', '30', '40', '50']}
                          onChange={(i, c) => {
                            dispatch({
                              type: 'assetAccount/setParamCompany',
                              payload: { pageIndex: i, pageSize: c },
                            });
                            setTimeout(() => {
                              this.onSearchCompany();
                            }, 16);
                          }}
                          onShowSizeChange={(i, c) => {
                            dispatch({
                              type: 'assetAccount/setParamCompany',
                              payload: { pageIndex: i, pageSize: c },
                            });
                            setTimeout(() => {
                              this.onSearchCompany();
                            }, 16);
                          }}
                          showTotal={() => (
                            `共${assetAccount.listOfCompany.totalCount}条数据`
                          )}
                        />
                      </div>
                    </Affix>
                  </div> : ''
              }
              </TabPane>
            </Tabs>
          </div>
        </GPage>
      </GContainer>
    );
  }
}

const CustomizedForm = Form.create({})(Class);
export default connect(state => state)(hot(module)(CustomizedForm));

