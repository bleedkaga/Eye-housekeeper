import React from 'react';
import cn from 'classnames';
import {Button, Affix, DatePicker, Icon, Table, Pagination, Select, Input, message} from 'antd';
import {hot} from 'react-hot-loader';
import moment from 'moment/moment';
import Tools from 'client/utils/tools';

import './style.less';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch, location, location: {state = {}}} = this.props;

    //判断是否是后退 设置条件参数值
    if (location.search || state.__back) {
      dispatch({type: 'fundSales/setTabCondition', payload: location.search, index: 1});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'fundSales/resetTabCondition', index: 1});
    }


    this.tableColumns = [
      {
        title: '入账时间',
        dataIndex: 'accountEntryTime',
        align: 'center',
        fixed: 'left',
        width: 200,
        render: accountEntryTime => accountEntryTime.split('.')[0],
      },
      {
        title: '收款主体',
        dataIndex: 'collectionSubject',
        align: 'center',
        fixed: 'left',
        width: 150,
        render: (text, record) => {
          switch (text) {
            case '个人':
              return <div>个人 <a onClick={() => this.gotoDetail(record)}>查看</a></div>;
            default:
              return text;
          }
        },
      },
      {title: '订单流水', dataIndex: 'orderWater', align: 'center', width: 350},
      {title: '资金流水', dataIndex: 'capitalFlow', align: 'center', width: 300},
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

    this.state = {
      inquire: false,
    };
  }

  handleExport() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fundSales/cashExport',
      payload: {},
      callback(res) {
        window.location.href = res.data.url;
      },
    });
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'fundSales/getTab1Data',
      payload: {},
    });
  }

  onSearch() {
    const {dispatch} = this.props;
    return dispatch({type: 'fundSales/getTab1Data', payload: {}});
  }

  render() {
    const {dispatch, fundSales: {tab1 = {}, exportIsLoad}} = this.props;
    const { inquire } = this.state;
    const {condition} = tab1;
    console.log(condition)
    return (
      <div className={cn('tab', 'tab1')}>
        <div className={cn('pcr-condition')}>
          <Button
            loading={exportIsLoad}
            className={cn('export-recharge')}
            disabled={tab1.list.length === 0}
            type={'default'}
            onClick={() => this.handleExport()}
            htmlType={'button'}
          >导出账户流水</Button>

          <RangePicker
            format={dateFormat}
            placeholder={['开始时间', '结束时间']}
            value={[
              condition.startDate ? moment(condition.startDate, dateFormat) : undefined,
              condition.endDate ? moment(condition.endDate, dateFormat) : undefined,
            ]}
            onChange={(date, dateStr) => {
              dispatch({
                type: 'fundSales/setTabCondition',
                payload: {startDate: dateStr[0], endDate: dateStr[1]},
                index: 1,
              });
            }}
          />
          <Button
            style={{marginLeft: 43, width: 76}}
            type="primary"
            htmlType={'submit'}
            onClick={() => {
              dispatch({type: 'fundSales/setTabCondition', payload: {pageIndex: 1}, index: 1});
              this.onSearch();
            }}
          >查询</Button>

          <Button
            style={{marginLeft: 23}}
            type="default"
            htmlType={'submit'}
            onClick={() => {
              this.setState({
                inquire: !inquire,
              });
            }}
          >高级查询 {
            inquire ? <Icon type="up" /> : <Icon type="down" />
          }</Button>
        </div>

        {
          inquire && (
            <div className={cn('advanced_inquire', 'clearfix')}>
              <div className={'search-item'}>
                <span>订单流水号：</span>
                <Input
                  type={'text'}
                  className={cn('channel-select')}
                  allowClear
                  value={condition.orderWater}
                  maxLength={32}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '');
                  }}
                  onChange={(e) => {
                    dispatch({type: 'fundSales/setTabCondition', payload: {orderWater: e.target.value}, index: 1});
                  }}
                  placeholder={'请输入订单流水号'}
                />
              </div>

              <div className={'search-item'}>
                <span>收款主体：</span>
                <Select
                  className={cn('channel-select')}
                  placeholder={'请选择收款主体'}
                  value={condition.collectionSubject}
                  onChange={(value) => {
                    dispatch({type: 'fundSales/setTabCondition', payload: {collectionSubject: value}, index: 1});
                  }}
                >
                  {
                    [
                      {label: '全部', value: ''},
                      {label: '个人', value: '个人'},
                      {label: '系统', value: '系统'},
                      {label: '大数据', value: '大数据'},
                    ].map(o => <Option value={o.value}>{o.label}</Option>)
                  }
                </Select>
              </div>

              <div className={'search-item'}>
                <span>打款渠道：</span>
                <Select
                  className={cn('channel-select')}
                  placeholder={'请选择'}
                  value={condition.channel}
                  onChange={(value) => {
                    dispatch({type: 'fundSales/setTabCondition', payload: {channel: value}, index: 1});
                  }}
                >
                  {
                    [
                      {label: '全部', value: ''},
                      {label: '线下银行汇款', value: '0'},
                      {label: '线上支付(支付宝支付)', value: '1'},
                      {label: '线上支付(微信支付)', value: '2'},
                      {label: '线上支付(网银支付)', value: '3'},
                      // {label: '单位福利账户', value: '4'},
                      // {label: '关联单位福利账户', value: '5'},
                      {label: '现金账户', value: '6'},

                    ].map(o => <Option value={o.value}>{o.label}</Option>)
                  }
                </Select>
              </div>

              <div className={'search-item'}>
                <span>账务类型：</span>
                <Select
                  className={cn('channel-select')}
                  placeholder={'请选择'}
                  value={condition.financialType}
                  onChange={(value) => {
                    dispatch({type: 'fundSales/setTabCondition', payload: {financialType: value}, index: 1});
                  }}
                >
                  {
                    [
                      {label: '全部', value: ''},
                      {label: '现金账户充值', value: '0'},
                      {label: '服务费', value: '1'},
                      // {label: '福利发放', value: '2'},
                      // {label: '福利充值', value: '3'},
                      // {label: '福利转账', value: '4'},
                      {label: '打款', value: '5'},

                    ].map(o => <Option value={o.value}>{o.label}</Option>)
                  }
                </Select>
              </div>
            </div>
          )
        }

        <Table
          bordered
          loading={tab1.isLoad}
          dataSource={tab1.list}
          pagination={false}
          columns={this.tableColumns}
          scroll={{x: [0, ...this.tableColumns].reduce((total, item) => (total + (item.width || 0)))}}
        />

        <div className={cn('footer-pagination-placeholder')} style={{height: 72}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${tab1.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'fundSales/setTabCondition', payload: {pageSize, pageIndex: 1}, index: 1});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'fundSales/setTabCondition', payload: {pageIndex}, index: 1});
                  this.onSearch();
                }}
                current={tab1.condition.pageIndex}
                pageSize={tab1.condition.pageSize}
                total={tab1.totalCount}
              />
            </div>
          </Affix>
        </div>

      </div>
    );
  }
}


export default hot(module)(Class);
