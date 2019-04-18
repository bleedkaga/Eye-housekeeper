import React from 'react';
import { connect } from 'dva';
import {
  Table, Tabs, Form, DatePicker, Select, Button, Icon,
  Pagination, Input, Affix,
  //  Input, Button
} from 'antd';
import { hot } from 'react-hot-loader';
import cn from 'classnames';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import { GContainer, GHeader, GPage } from 'client/components/GLayout';
import Moment from 'moment';

import './style.less';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Item: FormItem } = Form;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';


class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flage: false,
    };
    this.columns = [
      { title: '入账时间',
        dataIndex: 'accountEntryTime',
        align: 'center',
        fixed: 'left',
        width: 200,
        render: accountEntryTime => (Moment(accountEntryTime).format('YYYY-MM-DD HH:mm:ss'))},
      { title: '收款主体',
        dataIndex: 'collectionSubject',
        align: 'center',
        fixed: 'left',
        width: 250,
        render: (text, record) => {
          switch (text) {
            case '个人':
              return <div>个人   <a onClick={() => this.gotoDetail(record)}>查看</a></div>;
            default:
              return text;
          }
        },
      },
      { title: '订单流水', dataIndex: 'orderWater', align: 'center', width: 300 },
      { title: '资金流水', dataIndex: 'capitalFlow', align: 'center', width: 250 },
      { title: '账务类型', dataIndex: 'financialTypeDesc', align: 'center', width: 180 },
      { title: '入账类型', dataIndex: 'entryTypeDesc', align: 'center', width: 150 },
      { title: '打款渠道', dataIndex: 'channelDesc', align: 'center', width: 200 },
      { title: '入账金额（元）',
        dataIndex: 'creditAmount',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: (text, item) => {
          if (item.entryTypeDesc === '收入') {
            return <div style={{ color: '#32B16C' }}>{Tools.getViewPrice(text, '', false, 2, ',', '.')}</div>;
          } else if (item.entryTypeDesc === '支出') {
            return <div style={{ color: '#FF4D4F' }}>-{Tools.getViewPrice(text, '', false, 2, ',', '.')}</div>;
          }
        },
      },
      { title: '账户结余（元）',
        dataIndex: 'accountBalance',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: accountBalance => (Tools.getViewPrice(accountBalance, '', false, 2, ',', '.')),
      },
    ];
    this.unlisten = props.history.listen((e) => {
      const {dispatch} = props;
      dispatch({ type: 'unionAssetStream/set', payload: {urlSuffix: e.search}});
      // console.log(e, 'eeeeeeeeeeeeeeee');
      if (e.pathname === `/${window.__themeKey}/cloud/unionAssetStream`) {
        const params = Tools.queryToParams(e.search);
        const o = this.getCurrentParams();
        this.getData({ ...o, ...params }); //查询
      }
    });
  }

  componentDidMount() {
    const { dispatch, location, location: { state = {} } } = this.props;
    // console.log(this.props, 'this.props;this.props>>>>>>');
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      dispatch({ type: 'unionAssetStream/setParamCash', payload: searchParams });
    } else {
      //空的
      dispatch({ type: 'unionAssetStream/resetParamCash' });
    }
    setTimeout(() => {
      this.onSearch();
    }, 16);
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

    RH(history, 'cloud/unionAssetStream', `/${window.__themeKey}/cloud/unionAssetStream`, { search: q, replace: true });
  }

  //获取redux中的的参数
  getCurrentParams() {
    const { unionAssetStream } = this.props;
    const o = { ...unionAssetStream.paramCash };
    //这里可以做一些特殊操作
    return o;
  }

  getData(params) {
    const { dispatch, global } = this.props;
    const { groupId } = global.account; //ok

    dispatch({ type: 'unionAssetStream/originPullCash', payload: { ...params, moneyId: groupId } });//ok
  }

  highSearch() {
    const { flage } = this.state;
    this.setState({
      flage: !flage,
    });
  }

  highSearchCompany() {
    const { companyFlage } = this.state;
    this.setState({
      companyFlage: !companyFlage,
    });
  }

  handleClickSearch() { //点击查询按钮
    const {dispatch, form: { validateFields }} = this.props;
    validateFields((errors, values) => {
      dispatch({type: 'unionAssetStream/setParamCash',
        payload: {pageIndex: 1, orderWater: values.order || ''},
      });
      setTimeout(() => {
        this.onSearch();
      }, 16);
      // console.log(values, 'kankandingdanhao+++++++');
    });
  }

  gotoDetail(record) {
    const {history} = this.props;
    const obj = {
      orderWater: record.orderWater,
      pageIndex: 1,
      pageSize: 10,
    };
    const q = Tools.paramsToQuery(obj);
    // console.log(record, obj, q, 'QQQQQQQ');
    RH(history, 'cloud/unionAssetStreamPersonalDetail', `/${window.__themeKey}/cloud/unionAssetStreamPersonalDetail`, {search: q, replace: true});
  }

  handleExport() {
    const {unionAssetStream, dispatch, global} = this.props;
    const { groupId } = global.account; //ok
    const param = Object.assign(unionAssetStream.paramCash, {moneyId: groupId}); //ok
    dispatch({
      type: 'unionAssetStream/cashExport',
      payload: param,
      callback: (res) => {
        window.location.href = res.data.url;
        // console.log(res, '回调的cash');
      },
    });
  }

  render() {
    const { unionAssetStream, dispatch } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { flage } = this.state;
    const { paramCash } = unionAssetStream;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '工会资金流水'},
        ]}
      />
      <GPage className={cn('unionAssetStream')}>
        <div style={{position: 'relative', top: '0', left: '0', padding: '0 30px'}}>
          <Button style={{position: 'absolute', top: '20px', right: '30px', zIndex: '1', backgroundColor: '#F2F2F2'}} onClick={() => this.handleExport()} >导出账户流水</Button>

          <Tabs defaultActiveKey="2" >
            <TabPane tab="工会福利账户资金流水" key="2" >
              <Form layout="inline" style={{paddingBottom: 16}}>
                <FormItem >
                  <RangePicker
                    value={[
                      paramCash.startDate ? Moment(paramCash.startDate, dateFormat) : undefined,
                      paramCash.endDate ? Moment(paramCash.endDate, dateFormat) : undefined,
                    ]}
                    onChange={(date, dateStr) => {
                      dispatch({
                        type: 'unionAssetStream/setParamCash',
                        payload: { startDate: dateStr[0], endDate: dateStr[1] },
                      });
                    }}
                  />

                </FormItem>
                <FormItem >
                  <Button
                    style={{width: '75px'}}
                    onClick={() => this.handleClickSearch()}
                    type="primary"
                  > 查询 </Button>
                </FormItem>
                <FormItem >
                  {
                  flage === false ? <Button onClick={() => this.highSearch()} style={{ backgroundColor: '#F2F2F2' }}>高级查询 <Icon type="down" /></Button> :
                  <Button onClick={() => this.highSearch()} style={{ backgroundColor: '#F2F2F2' }}>收起查询<Icon type="up" /></Button>
                }

                  {/*  */}
                </FormItem>
                {
                flage === false ? '' :
                <div style={{marginTop: '16px'}}>
                  <FormItem label="订单流水号" >
                    {getFieldDecorator('order', {
                      initialValue: paramCash.orderWater ? paramCash.orderWater : '',
                      rules: [
                        {
                          required: false,
                          pattern: /^[1-9]\d*$/,
                          message: '请输入数字，且不超过32位！',
                        },
                      ],
                    })(
                      <Input maxLength="32" type="text" />
                    )}

                  </FormItem>
                  <FormItem label="收款主体" >
                    {getFieldDecorator('takeIn', {
                      initialValue: paramCash.collectionSubject ? paramCash.collectionSubject : '',
                      // rules: [{ required: true, message: '必填项!' }],
                    })(
                      <Select
                        initialValue="个人"
                        style={{ width: 150 }}
                        placeholder="请选择"
                        onChange={(a, b) => {
                          dispatch({
                            type: 'unionAssetStream/setParamCash',
                            payload: { collectionSubject: b.props.value },
                          });
                        }}
                      >
                        <Option value="">全部</Option>
                        <Option value="个人">个人</Option>
                        <Option value="部门">部门</Option>
                        <Option value="供应链">供应链</Option>
                      </Select>
                    )}

                  </FormItem >
                  <FormItem label="打款渠道" >
                    {getFieldDecorator('pay', {
                      initialValue: paramCash.channel ? paramCash.channel : '',
                      //  rules: [{ required: true, message: '必填项!' }],
                    })(
                      <Select
                        style={{ width: 180 }}
                        placeholder="请选择"
                        onChange={(a, b) => {
                          dispatch({
                            type: 'unionAssetStream/setParamCash',
                            payload: { channel: b.props.value },
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
                  <FormItem label="账务类型" >
                    {getFieldDecorator('type', {
                      initialValue: paramCash.financialType ? paramCash.financialType : '',
                    })(
                      <Select
                        style={{ width: 150 }}
                        placeholder="请选择"
                        onChange={(a, b) => {
                          dispatch({
                            type: 'unionAssetStream/setParamCash',
                            payload: { financialType: b.props.value },
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

              {
                unionAssetStream && unionAssetStream.listOfCash && unionAssetStream.listOfCash.data &&
                <Table
                  loading={unionAssetStream.isLoad}
                  rowKey="id"
                  columns={this.columns}
                  scroll={{ x: 1790, y: 550 }}
                  dataSource={unionAssetStream.listOfCash.data}
                  pagination={false}
                  bordered
                />
              }

              {unionAssetStream && unionAssetStream.listOfCash && unionAssetStream.listOfCash.data && unionAssetStream.listOfCash.data.length > 0 ?
                <div className={cn('footer-pagination-placeholder')} style={{height: '72px', backgroundColor: '#fff'}}>
                  <Affix offsetBottom={0}>
                    <div className={cn('footer-pagination')}>
                      <Pagination
                        current={unionAssetStream.listOfCash.pageIndex}
                        total={unionAssetStream.listOfCash.totalCount}
                        pageSize={unionAssetStream.listOfCash.pageSize}
                        showQuickJumper
                        showSizeChanger
                        pageSizeOptions={['10', '20', '30', '40', '50']}
                        onChange={(i, c) => {
                          dispatch({
                            type: 'unionAssetStream/setParamCash',
                            payload: { pageIndex: i, pageSize: c },
                          });
                          setTimeout(() => {
                            this.onSearch();
                          }, 16);
                        }
            }
                        onShowSizeChange={(i, c) => {
                          dispatch({
                            type: 'unionAssetStream/setParamCash',
                            payload: { pageIndex: i, pageSize: c },
                          });
                          setTimeout(() => {
                            this.onSearch();
                          }, 16);
                        }
            }
                        showTotal={() => (
                          `共${unionAssetStream.listOfCash.totalCount}条数据`
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
    </GContainer>);
  }
}

const CustomizedForm = Form.create({})(Class);
export default connect(state => state)(hot(module)(CustomizedForm));
