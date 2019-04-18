import React from 'react';
import {connect} from 'dva';
import {Table, Tabs, Form, DatePicker, Select, Button, Icon,
  Pagination, Affix,
} from 'antd';
import {hot} from 'react-hot-loader';
import cn from 'classnames';
import Tools from 'client/utils/tools';
// import RH from 'client/routeHelper';
import TopComponent from './topComponent';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Moment from 'moment';

import './style.less';

const {RangePicker} = DatePicker;
const {TabPane} = Tabs;
const {Item: FormItem} = Form;
const {Option } = Select;
const dateFormat = 'YYYY-MM-DD';


class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flage: false,
    };
    this.columns = [
      { title: '充值时间', dataIndex: 'createtime', align: 'center', width: 250, fixed: 'left' },
      { title: '入账时间',
        dataIndex: 'finishTime',
        align: 'center',
        width: 250,
        fixed: 'left',
        render: (finishTime) => {
          if (finishTime) {
            return finishTime;
          } else {
            return ' _ _ ';
          }
        } },
      { title: '流水号', dataIndex: 'outTradeNo', align: 'center', width: 350 },
      { title: '充值金额（元）',
        dataIndex: 'amount',
        align: 'center',
        width: 180,
        render: amount => (Tools.getViewPrice(amount, '', false, 2, ',', '.')),
      },
      { title: '实际到账金额（元）',
        dataIndex: 'remittanceAmount',
        align: 'center',
        width: 180,
        render: remittanceAmount => (Tools.getViewPrice(remittanceAmount, '', false, 2, ',', '.')),
      },
      { title: '打款渠道', dataIndex: 'channelName', align: 'center', width: 200 },
      { title: '账务类型', dataIndex: 'financialTypeRedundancy', align: 'center', width: 200},
      { title: '状态',
        dataIndex: 'statusDesc',
        align: 'center',
        width: 180,
        fixed: 'right',
        render: (statusDesc) => {
          switch (statusDesc) {
            case '审核中':
              return <div style={{color: '#FFBE4D'}}>审核中</div>;
            case '审核通过':
              return <div style={{color: '#32B16C'}}>审核通过</div>;
            case '审核不通过':
              return <div style={{color: '#FF595B'}}>审核不通过</div>;
            case '待付款':
              return <div style={{color: '#1890FF'}}>待付款</div>;
            default:
              return statusDesc;
          }
        } },
    ];
    const {dispatch, location, location: {state = {}}} = this.props;
    //判断是否是后退 设置条件参数值
    if (location.search || state.__back) {
      //是后退, -------------- 注意这里的other是你们需要添加的额外参数，预防多种情况
      dispatch({type: 'unionAssetAccount/setParamCash', payload: location.search, other: {a: 1}});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'unionAssetAccount/resetParamCash'});
    }
  }

  componentDidMount() {
    this.onSearch();
  }

  onSearch() {
    this.props.dispatch({type: 'unionAssetAccount/originPullCash', payload: {}});
  }

  highSearch() {
    const {flage} = this.state;
    this.setState({
      flage: !flage,
    });
  }

  highSearchCompany() {
    const {companyFlage} = this.state;
    this.setState({
      companyFlage: !companyFlage,
    });
  }

  handleExport() {
    const {unionAssetAccount, dispatch, global} = this.props;
    const { groupId } = global.account;//ok
    const param = Object.assign(unionAssetAccount.paramCash, {moneyId: groupId}); //ok
    dispatch({
      type: 'unionAssetAccount/cashExport',
      payload: param,
      callback: (res) => {
        window.location.href = res.data.url;
        // console.log(res, '回调的cash');
      },
    });
  }

  render() {
    const {unionAssetAccount, dispatch} = this.props;
    const { getFieldDecorator } = this.props.form;
    const { flage } = this.state;
    const { paramCash} = unionAssetAccount;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '工会资金账户'},
        ]}
      />
      <GPage className={cn('unionAssetAccount')}>
        <TopComponent />
        <div style={{position: 'relative', top: '0', left: '0', padding: '0 30px'}}>
          <Button
            style={{position: 'absolute', top: '20px', right: '30px', zIndex: '1', backgroundColor: '#F2F2F2'}}
            onClick={() => this.handleExport()}
          >导出充值记录</Button>
          <Tabs defaultActiveKey="2" >
            <TabPane tab="工会福利账户充值记录" key="2" >
              <Form layout="inline" style={{paddingBottom: 16}}>
                <FormItem >
                  <RangePicker
                    value={[
                      paramCash.startDate ? Moment(paramCash.startDate, dateFormat) : undefined,
                      paramCash.endDate ? Moment(paramCash.endDate, dateFormat) : undefined,
                    ]}
                    onChange={(date, dateStr) => {
                      dispatch({
                        type: 'unionAssetAccount/setParamCash',
                        payload: {startDate: dateStr[0], endDate: dateStr[1]},
                      });
                    }}
                  />
                </FormItem>
                <FormItem >
                  <Button
                    style={{width: '75px'}}
                    type="primary"
                    onClick={() => {
                      dispatch({type: 'unionAssetAccount/setParamCash',
                        payload: {pageIndex: 1},
                      });
                      setTimeout(() => {
                        this.onSearch();
                      }, 16);
                    }
            }
                  > 查询 </Button>
                </FormItem>
                <FormItem >
                  {
                flage === false ?
                  <Button onClick={() => this.highSearch()} style={{backgroundColor: '#F2F2F2'}}> 高级查询 <Icon type="down" /></Button> :
                  <Button onClick={() => this.highSearch()} style={{backgroundColor: '#F2F2F2'}}> 收起查询<Icon type="up" /></Button>
              }

                  {/*  */}
                </FormItem>
                {
               flage === false ? '' :
               <div style={{marginTop: '16px'}}>
                 <FormItem label="打款渠道" >
                   {getFieldDecorator('payment', {
                     initialValue: paramCash.channelType ? paramCash.channelType : '',
                     // rules: [{ required: true, message: '必填项' }],
                   })(
                     <Select

                       style={{ width: 180 }}
                       placeholder="请选择"
                       onChange={(a, b) => {
                         dispatch({
                           type: 'unionAssetAccount/setParamCash',
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
                     initialValue: paramCash.financialType ? paramCash.financialType : '',
                     // rules: [{ required: true, message: '必填项' }],
                   })(
                     <Select
                       style={{ width: 180 }}
                       placeholder="请选择"
                       onChange={(a, b) => {
                         dispatch({
                           type: 'unionAssetAccount/setParamCash',
                           payload: {financialType: b.props.value},
                         });
                       }}
                     >
                       <Option value="2">工会福利账户充值</Option>
                     </Select>
                   )}

                 </FormItem >
                 <FormItem label="状态" >
                   {getFieldDecorator('status', {
                     initialValue: paramCash.status ? paramCash.status : '',
                     // rules: [{ required: true, message: 'Please input your username!' }],
                   })(
                     // <Input />
                     <Select
                       style={{ width: 180 }}
                       placeholder="请选择"
                       onChange={(a, b) => {
                         //  console.log(a, b, 'a, ba, b');
                         dispatch({
                           type: 'unionAssetAccount/setParamCash',
                           payload: {status: b.props.value},
                         });
                       }}
                     >
                       <Option value="">全部</Option>
                       <Option value="1">审核通过</Option>
                       <Option value="3">审核中</Option>
                       <Option value="2">审核不通过</Option>
                       <Option value="4">待付款</Option>
                     </Select>
                   )}
                 </FormItem>
               </div>
            }
              </Form>
              {unionAssetAccount && unionAssetAccount.listOfCash && unionAssetAccount.listOfCash.data &&
              <Table
                loading={unionAssetAccount.isLoad}
                rowKey="id"
                columns={this.columns}
                scroll={{x: 1790, y: 550}}
                dataSource={unionAssetAccount.listOfCash.data.list}
                pagination={false}
                bordered
              />
              }
              <div className={cn('gray-block')}>
                {unionAssetAccount && unionAssetAccount.listOfCash && unionAssetAccount.listOfCash.data && unionAssetAccount.listOfCash.data.statistical &&
                <div>{unionAssetAccount.listOfCash.data.statistical.total}条充值记录，
                  <i style={{color: '#32B16C'}}>充值成功{unionAssetAccount.listOfCash.data.statistical.success}笔，</i>
                  <i style={{color: '#FDC56B'}}>审核中{unionAssetAccount.listOfCash.data.statistical.underreview}笔，</i>
                  <i style={{color: '#FF4D4F'}}>审核不通过{unionAssetAccount.listOfCash.data.statistical.failure}笔，</i>
                  <i style={{color: '#1890FF'}}>待付款{unionAssetAccount.listOfCash.data.statistical.pendingpayment}笔</i>
                </div>
                }
                {
                  unionAssetAccount && unionAssetAccount.listOfCash && unionAssetAccount.listOfCash.data && unionAssetAccount.listOfCash.data.statisticalAmount &&
                  <div >工会福利账户：
                  累计充值{Tools.getViewPrice(unionAssetAccount.listOfCash.data.statisticalAmount.totalamount, '', false, 2, ',', '.')}元，
                  实际到账{Tools.getViewPrice(unionAssetAccount.listOfCash.data.statisticalAmount.actualArrival, '', false, 2, ',', '.')}元
                  </div>
                }
              </div>

              {unionAssetAccount && unionAssetAccount.listOfCash && unionAssetAccount.listOfCash.data && unionAssetAccount.listOfCash.data.list &&
              unionAssetAccount.listOfCash.data.list.length > 0 ?
                <div className={cn('footer-pagination-placeholder')} style={{height: '72px', backgroundColor: '#fff'}}>
                  <Affix offsetBottom={0}>
                    <div className={cn('footer-pagination')}>
                      <Pagination
                        current={unionAssetAccount.listOfCash.pageIndex}
                        total={unionAssetAccount.listOfCash.totalCount}
                        pageSize={unionAssetAccount.listOfCash.pageSize}
                        showQuickJumper
                        showSizeChanger
                        pageSizeOptions={['10', '20', '30', '40', '50']}
                        onChange={(i, c) => {
                          dispatch({
                            type: 'unionAssetAccount/setParamCash',
                            payload: {pageIndex: i, pageSize: c},
                          });

                          this.onSearch();
                        }
                }
                        onShowSizeChange={(i, c) => {
                          dispatch({
                            type: 'unionAssetAccount/setParamCash',
                            payload: {pageIndex: i, pageSize: c},
                          });

                          this.onSearch();
                        }
          }
                        showTotal={() => (
                          `共${unionAssetAccount.listOfCash.totalCount}条数据`
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
