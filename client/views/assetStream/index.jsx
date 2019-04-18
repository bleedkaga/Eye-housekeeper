import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import {
  Form, Button, DatePicker, Input, Table, Pagination, Select, Icon, Tabs, Affix,
} from 'antd';
import Moment from 'moment';

import './style.less';

const {TabPane} = Tabs;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const {Option} = Select;
const dateFormat = 'YYYY-MM-DD';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '入账时间',
        dataIndex: 'accountEntryTime',
        align: 'center',
        fixed: 'left',
        width: 200,
        render: accountEntryTime => (Moment(accountEntryTime).format('YYYY-MM-DD HH:mm:ss')),
      },
      {
        title: '收款主体',
        dataIndex: 'collectionSubject',
        align: 'center',
        fixed: 'left',
        width: 250,
        render: (text, record) => {
          switch (text) {
            case '个人':
              return <div>个人 <a onClick={() => this.gotoDetail(record)}>查看</a></div>;
            default:
              return text;
          }
        },
      },
      {title: '订单流水', dataIndex: 'orderWater', align: 'center', width: 300},
      {title: '资金流水', dataIndex: 'capitalFlow', align: 'center', width: 250},
      {title: '账务类型', dataIndex: 'financialTypeDesc', align: 'center', width: 180},
      {title: '入账类型', dataIndex: 'entryTypeDesc', align: 'center', width: 150},
      {title: '打款渠道', dataIndex: 'channelDesc', align: 'center', width: 200},
      {
        title: '入账金额（元）',
        dataIndex: 'creditAmount',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: (text, item) => {
          if (item.entryTypeDesc === '收入') {
            return <div style={{color: '#32B16C'}}>{Tools.getViewPrice(text, '', false, 2, ',', '.')}</div>;
          } else if (item.entryTypeDesc === '支出') {
            return <div style={{color: '#FF4D4F'}}>-{Tools.getViewPrice(text, '', false, 2, ',', '.')}</div>;
          }
        },
      },
      {
        title: '账户结余（元）',
        dataIndex: 'accountBalance',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: accountBalance => (
          Tools.getViewPrice(accountBalance, '', false, 2, ',', '.')
        ),
      },
    ];
    this.unlisten = props.history.listen((e) => {
      const {dispatch} = props;
      dispatch({type: 'assetStream/set', payload: {urlSuffix: e.search}});
      if (e.pathname === `/${window.__themeKey}/cloud/assetStream`) {
        const params = Tools.queryToParams(e.search);
        if (params.type === '1') {
          const o = this.getCurrentParams();
          this.getData({...o, ...params}); //查询现金
        } else if (params.type === '2') {
          const o = this.getCurrentParamsCompany();
          this.getDataCompany({...o, ...params}); //查询单位
        }
      }
    });
    this.state = {
      cashFlage: false,
      companyFlag: false,
    };
  }


  componentDidMount() {
    const {dispatch, location, location: {state = {}}} = this.props;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      if (searchParams.type === '1') {
        dispatch({type: 'assetStream/setParamCash', payload: searchParams});
        // delete searchParams.type;
        dispatch({type: 'assetStream/set', payload: {type: searchParams.type}});
        setTimeout(() => {
          this.onSearch();
        }, 16);
      } else {
        dispatch({type: 'assetStream/setParamCompany', payload: searchParams});
        dispatch({type: 'assetStream/set', payload: {type: searchParams.type}});
        setTimeout(() => {
          this.onSearchCompany();
        }, 16);
      }
    } else {
      //空的
      dispatch({type: 'assetStream/set', payload: {type: '1'}});
      dispatch({type: 'assetStream/resetParamCash'});
      dispatch({type: 'assetStream/resetParamCompany'});
      setTimeout(() => {
        this.onSearch();
      }, 16);
      //   setTimeout(() => {
      //     this.onSearchCompany();
      //   }, 16);
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   const { assetStream } = this.props;
  //   console.log('下一个type值：', nextProps.assetStream.type, assetStream.type);

  //   return (assetStream.type !== nextProps.assetStream.type) || !(assetStream[assetStream.type === '1' ? 'cashList' : 'companyList'].data);
  // }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
    // this.unlistenCompany && this.unlistenCompany();
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
    const {history} = this.props;
    const o = this.getCurrentParams();
    const q = Tools.paramsToQuery(o);
    RH(history, 'cloud/assetStream', `/${window.__themeKey}/cloud/assetStream`, {search: q, replace: true});
  }

  onSearchCompany() {
    const {history} = this.props;
    const o = this.getCurrentParamsCompany();
    const q = Tools.paramsToQuery(o);
    RH(history, 'cloud/assetStream', `/${window.__themeKey}/cloud/assetStream`, {search: q, replace: true});
  }

  //获取redux中的的参数
  getCurrentParams() {
    const {assetStream} = this.props;
    const o = {...assetStream.paramCash, type: assetStream.type};
    //这里可以做一些特殊操作
    return o;
  }

  getCurrentParamsCompany() {
    const {assetStream} = this.props;
    const o = {...assetStream.paramCompany, type: assetStream.type};
    return o;
  }

  getData(params) {
    const {dispatch, global} = this.props;
    const {companyId} = global.account; //ok
    dispatch({type: 'assetStream/originPullCash', payload: {...params, moneyId: companyId}}); //ok
  }

  getDataCompany(params) {
    const {dispatch, global} = this.props;
    const {companyId} = global.account; //ok
    dispatch({type: 'assetStream/originPullCompany', payload: {...params, moneyId: companyId}}); //ok
  }

  cashLink() { //切换页面
    const {history, dispatch} = this.props;
    dispatch({
      type: 'assetStream/set',
      payload: {cssShow: false},
    });
    RH(history, 'cloud/assetStream1', `/${window.__themeKey}/cloud/assetStream1`, {replace: true});
  }

  highSearch() {
    const {cashFlage} = this.state;
    this.setState({
      cashFlage: !cashFlage,
    });
  }

  highSearchCompany() {
    const {companyFlag} = this.state;
    this.setState({
      companyFlag: !companyFlag,
    });
  }


  commonSearchOne() { //查询按钮-现金
    const {dispatch} = this.props;
    dispatch({
      type: 'assetStream/setParamCash',
      payload: {pageIndex: 1},
    });
    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  commonSearchTwo() { //查询按钮-单位
    const {dispatch} = this.props;
    dispatch({
      type: 'assetStream/setParamCompany',
      payload: {pageIndex: 1},
    });
    setTimeout(() => {
      this.onSearchCompany();
    }, 16);
  }

  tabsCallback(k) {
    // console.log(k, 'KKKKK////');
    const {dispatch} = this.props;
    dispatch({
      type: 'assetStream/set',
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


  gotoDetail(record) {
    // const {form: {getFieldDecorator}, , dispatch} = this.props;
    const {history, assetStream} = this.props;
    const obj = {
      orderWater: record.orderWater,
      pageIndex: 1,
      pageSize: 10,
      type: assetStream.type,
    };
    const q = Tools.paramsToQuery(obj);
    RH(history, 'cloud/assetStreamPersonalDetail', `/${window.__themeKey}/cloud/assetStreamPersonalDetail`, {
      search: q,
    });
  }

  handleExport() {
    const {assetStream, dispatch, global} = this.props;
    const {companyId} = global.account;
    if (assetStream.type === '1') {
      const param = Object.assign(assetStream.paramCash, {moneyId: companyId});
      dispatch({
        type: 'assetStream/cashExport',
        payload: param,
        callback: (res) => {
          window.location.href = res.data.url;
          // console.log(res, '回调的cash');
        },
      });
    } else if (assetStream.type === '2') {
      const param = Object.assign(assetStream.paramCompany, {moneyId: companyId});
      dispatch({
        type: 'assetStream/companyExport',
        payload: param,
        callback: (res) => {
          window.location.href = res.data.url;
          // console.log(res, '回调的');
        },
      });
    }
  }


  render() {
    const {cashFlage, companyFlag} = this.state;
    const {form: {getFieldDecorator}, assetStream, dispatch} = this.props;
    const {paramCash, paramCompany, type} = assetStream;
    return (
      <GContainer>
        <GHeader
          route={[
            {name: '首页', path: `/${window.__themeKey}/dashboard`},
            {name: '资金流水'},
          ]}
        />
        <GPage className={cn('assetStream')}>
          <div style={{position: 'relative', top: '0', left: '0', padding: '0 30px'}} className={cn({downline: type === '2' })}>
            <Button
              style={{position: 'absolute', top: '20px', right: '30px', zIndex: '1', backgroundColor: '#F2F2F2'}}
              onClick={() => this.handleExport()}
            >导出账户流水</Button>
            <Tabs activeKey={type} onChange={K => this.tabsCallback(K)} animated={false}>
              <TabPane tab="现金账户" key="1">
                <Form layout="inline" style={{paddingBottom: 16}}>
                  <FormItem>
                    {/* {getFieldDecorator('timeOne', {
                  // rules: [{ required: true, message: 'Please input your username!' }],
                })( */}
                    <RangePicker
                      value={[
                        paramCash.startDate ? Moment(paramCash.startDate, dateFormat) : undefined,
                        paramCash.endDate ? Moment(paramCash.endDate, dateFormat) : undefined,
                      ]}
                      onChange={(date, dateStr) => {
                        dispatch({
                          type: 'assetStream/setParamCash',
                          payload: {startDate: dateStr[0], endDate: dateStr[1]},
                        });
                      }}
                    />
                    {/* )} */}
                  </FormItem>
                  <FormItem>
                    <Button onClick={() => this.commonSearchOne()} type="primary" style={{width: '75px'}}> 查询 </Button>
                  </FormItem>
                  <FormItem>
                    {
                      cashFlage === false ?
                        <Button onClick={() => this.highSearch()} style={{backgroundColor: '#F2F2F2'}}>高级查询 <Icon
                          type="down"
                        /></Button> :
                        <Button onClick={() => this.highSearch()} style={{backgroundColor: '#F2F2F2'}}>收起查询<Icon
                          type="up"
                        /></Button>
                    }

                    {/*  */}
                  </FormItem>
                  {
                    cashFlage === false ? '' :
                    <div style={{marginTop: '16px'}}>
                      <FormItem label="订单流水号">
                        {getFieldDecorator('order0', {
                          initialValue: paramCash.orderWater ? paramCash.orderWater : '',
                          rules: [
                            {
                              required: false,
                              pattern: /^[1-9]\d*$/,
                              message: '请输入数字，且不超过32位！',
                            },
                          ],
                        })(
                          <Input
                            maxLength="32"
                            type="text"
                            onChange={(e) => {
                              dispatch({
                                type: 'assetStream/setParamCash',
                                payload: {orderWater: e.target.value},
                              });
                            }}
                          />
                        )}

                      </FormItem>
                      <FormItem label="收款主体">
                        {getFieldDecorator('takeIn0', {
                          initialValue: paramCash.collectionSubject ? paramCash.collectionSubject : '',
                          // rules: [{ required: true, message: 'Please input your username!' }],
                        })( //initialValue="0"
                          <Select
                            style={{width: 150}}
                            placeholder="请选择"
                              // setFieldsValue={paramCash.collectionSubject ? paramCash.collectionSubject : ''}
                            onChange={(a, b) => {
                              // console.log('onChangeonChangeonChangeonChange');
                              dispatch({
                                type: 'assetStream/setParamCash',
                                payload: {collectionSubject: b.props.value},
                              });
                            }}
                          >
                            <Option value="">全部</Option>
                            <Option value="个人">个人</Option>
                            <Option value="系统">系统</Option>
                            <Option value="大数据">大数据</Option>
                          </Select>
                        )}

                      </FormItem>
                      <FormItem label="打款渠道">
                        {getFieldDecorator('pay0', {
                          initialValue: paramCash.channel ? paramCash.channel : '',
                          // rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                          <Select
                            style={{width: 180}}
                            placeholder="请选择"
                              // setFieldsValue={paramCash.channel ? paramCash.channel : ''}
                            onChange={(a, b) => {
                              // console.log(a, b, 'onChangeonChangeonChangeonChange');
                              dispatch({
                                type: 'assetStream/setParamCash',
                                payload: {channel: b.props.value},
                              });
                            }}
                          >
                            <Option value="">全部</Option>
                            <Option value="0">线下银行汇款</Option>
                            <Option value="1">线上支付(支付宝支付)</Option>
                            <Option value="2">线上支付(微信支付)</Option>
                            <Option value="3">线上支付(网银支付)</Option>
                            {/* <Option value="4">单位福利账户</Option>
                              <Option value="5">关联单位福利账户</Option> */}
                            <Option value="6">现金账户</Option>
                          </Select>
                        )}
                      </FormItem>
                      <FormItem label="账务类型">
                        {getFieldDecorator('type0', {
                          initialValue: paramCash.financialType ? paramCash.financialType : '',
                          // rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                          <Select
                            style={{width: 120}}
                            placeholder="请选择"
                              // setFieldsValue={paramCash.financialType ? paramCash.financialType : ''}
                            onChange={(a, b) => {
                              // console.log('onChangeonChangeonChangeonChange');
                              dispatch({
                                type: 'assetStream/setParamCash',
                                payload: {financialType: b.props.value},
                              });
                            }}
                          >
                            <Option value="">全部</Option>
                            <Option value="0">现金账户充值</Option>
                            <Option value="1">服务费</Option>
                            {/* <Option value="2">福利发放</Option>
                              <Option value="3">福利充值</Option>
                              <Option value="4">福利转账</Option> */}
                            <Option value="5">打款</Option>
                          </Select>
                        )}
                      </FormItem>
                    </div>
                  }
                </Form>
                <Table
                  loading={assetStream.isLoad}
                  rowKey="id"
                  columns={this.columns}
                  scroll={{x: 1830, y: 550}}
                  dataSource={assetStream.cashList.data}
                  pagination={false}
                  bordered
                />
                {assetStream && assetStream.cashList && assetStream.cashList.data && assetStream.cashList.data.length > 0 ?
                  <div className={cn('footer-pagination-placeholder')} style={{height: '72px', backgroundColor: '#fff'}}>
                    <Affix offsetBottom={0}>
                      <div className={cn('footer-pagination')}>
                        <Pagination
                    // style={{margin: ' 10px 0 30px 0', float: 'right'}}
                          current={assetStream.cashList.pageIndex}
                          total={assetStream.cashList.totalCount}
                          pageSize={assetStream.cashList.pageSize}
                          showQuickJumper
                          showSizeChanger
                          pageSizeOptions={['10', '20', '30', '40', '50']}
                          onChange={(i, c) => {
                            dispatch({
                              type: 'assetStream/setParamCash',
                              payload: {pageIndex: i, pageSize: c},
                            });
                            setTimeout(() => {
                              this.onSearch();
                            }, 16);
                          }}
                          onShowSizeChange={(i, c) => {
                            dispatch({
                              type: 'assetStream/setParamCash',
                              payload: {pageIndex: i, pageSize: c},
                            });
                            setTimeout(() => {
                              this.onSearch();
                            }, 16);
                          }}
                          showTotal={() => (
                            `共${assetStream.cashList.totalCount}条数据`
                          )}
                        />
                      </div>
                    </Affix>
                  </div> : ''
                }

                {/* } */}
              </TabPane>
              <TabPane tab="单位福利账户" key="2">
                <Form layout="inline" style={{paddingBottom: 16}}>
                  {/* <Form  > */}
                  <FormItem>
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
                          type: 'assetStream/setParamCompany',
                          payload: {startDate: dateStr[0], endDate: dateStr[1]},
                        });
                      }}
                    />
                    {/* )} */}
                  </FormItem>
                  <FormItem>
                    <Button onClick={() => this.commonSearchTwo()} type="primary" style={{width: '75px'}}> 查询 </Button>
                  </FormItem>
                  <FormItem>
                    {
                      companyFlag === false ?
                        <Button onClick={() => this.highSearchCompany()} style={{backgroundColor: '#F2F2F2'}}>高级查询 <Icon
                          type="down"
                        /></Button> :
                        <Button onClick={() => this.highSearchCompany()} style={{backgroundColor: '#F2F2F2'}}>收起查询<Icon
                          type="up"
                        /></Button>
                    }

                    {/*  */}
                  </FormItem>
                  {
                    companyFlag === false ? '' :
                    <div style={{marginTop: '16px'}}>
                      <FormItem label="订单流水号">
                        {getFieldDecorator('order', {
                          initialValue: paramCompany.orderWater ? paramCompany.orderWater : '',
                          rules: [
                            {
                              required: false,
                              pattern: /^[1-9]\d*$/,
                              message: '请输入数字，且不超过32位！',
                            },
                          ],
                        })(
                          <Input
                            maxLength="32"
                            type="text"
                            onChange={(e) => {
                              dispatch({
                                type: 'assetStream/setParamCompany',
                                payload: {orderWater: e.target.value},
                              });
                            }}
                          />
                        )}

                      </FormItem>
                      <FormItem label="收款主体">
                        {getFieldDecorator('takeIn', {
                          initialValue: paramCompany.collectionSubject ? paramCompany.collectionSubject : '',
                          // rules: [{ required: true, message: 'Please input your username!' }],
                        })( //initialValue="0"
                          <Select
                            style={{width: 150}}
                            placeholder="请选择"
                              // setFieldsValue={paramCompany.collectionSubject ? paramCompany.collectionSubject : ''}
                            onChange={(a, b) => {
                              // console.log('onChangeonChangeonChangeonChange');
                              dispatch({
                                type: 'assetStream/setParamCompany',
                                payload: {collectionSubject: b.props.value},
                              });
                            }}
                          >
                            <Option value="">全部</Option>
                            <Option value="个人">个人</Option>
                            <Option value="部门">部门</Option>
                            <Option value="供应链">供应链</Option>
                          </Select>
                        )}

                      </FormItem>
                      <FormItem label="打款渠道">
                        {getFieldDecorator('pay', {
                          //  rules: [{ required: true, message: '必填项!' }],
                          initialValue: paramCompany.channel ? paramCompany.channel : '',
                        })(
                          <Select
                            style={{width: 180}}
                              // onChange={this.handleChange}
                            placeholder="请选择"
                            onChange={(a, b) => {
                              // console.log('onChangeonChangeonChangeonChange');
                              dispatch({
                                type: 'assetStream/setParamCompany',
                                payload: {channel: b.props.value},
                              });
                            }}
                          >
                            <Option value="">全部</Option>
                            <Option value="0">线下银行汇款</Option>
                            <Option value="1">线上支付(支付宝支付)</Option>
                            <Option value="2">线上支付(微信支付)</Option>
                            {/* <Option value="3">线上支付(网银支付)</Option> */}
                            <Option value="4">单位福利账户</Option>
                            <Option value="5">关联单位福利账户</Option>
                            <Option value="7">工会福利账户</Option>
                            {/* <Option value="6">现金账户</Option> */}
                            <Option value="8">关联工会福利账户</Option>
                          </Select>
                        )}
                      </FormItem>
                      <FormItem label="账务类型">
                        {getFieldDecorator('type', {
                          initialValue: paramCompany.financialType ? paramCompany.financialType : '',
                          // rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                          <Select
                            style={{width: 120}}
                            placeholder="请选择"
                              // setFieldsValue={paramCompany.financialType ? paramCompany.financialType : ''}
                            onChange={(a, b) => {
                              // console.log('onChangeonChangeonChangeonChange');
                              dispatch({
                                type: 'assetStream/setParamCompany',
                                payload: {financialType: b.props.value},
                              });
                            }}
                          >
                            <Option value="">全部</Option>
                            {/* <Option value="0">现金账户充值</Option>
                            <Option value="1">服务费</Option> */}
                            <Option value="2">福利发放</Option>
                            <Option value="3">福利充值</Option>
                            <Option value="4">福利转账</Option>
                          </Select>
                        )}
                      </FormItem>
                    </div>
                  }
                </Form>

                <Table
                  loading={assetStream.isLoad}
                  rowKey="id"
                  columns={this.columns}
                  scroll={{x: 1830, y: 550}}
                  dataSource={assetStream.companyList.data}
                  pagination={false}
                  bordered
                />
                {/* {assetStream && */}
                {assetStream && assetStream.companyList && assetStream.companyList.data && assetStream.companyList.data.length > 0 ?
                  <div className={cn('footer-pagination-placeholder')} style={{height: '72px', backgroundColor: '#fff'}}>
                    <Affix offsetBottom={0}>
                      <div className={cn('footer-pagination')}>
                        <Pagination
                          current={assetStream.companyList.pageIndex}
                          total={assetStream.companyList.totalCount}
                          pageSize={assetStream.companyList.pageSize}
                          showQuickJumper
                          showSizeChanger
                          pageSizeOptions={['10', '20', '30', '40', '50']}
                          onChange={(i, c) => {
                            dispatch({
                              type: 'assetStream/setParamCompany',
                              payload: {pageIndex: i, pageSize: c},
                            });
                            setTimeout(() => {
                              this.onSearchCompany();
                            }, 16);
                          }}
                          onShowSizeChange={(i, c) => {
                            dispatch({
                              type: 'assetStream/setParamCompany',
                              payload: {pageIndex: i, pageSize: c},
                            });
                            setTimeout(() => {
                              this.onSearchCompany();
                            }, 16);
                          }}
                          showTotal={() => (
                            `共${assetStream.companyList.totalCount}条数据`
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

