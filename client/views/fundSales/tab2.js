import React from 'react';
import cn from 'classnames';
import {Button, Affix, DatePicker, Icon, Table, Pagination, Select} from 'antd';
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
      dispatch({type: 'fundSales/setTabCondition', payload: location.search, index: 2});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'fundSales/resetTabCondition', index: 2});
    }

    this.tableColumns = [
      {
        title: '入账时间',
        dataIndex: 'accountEntryTime',
        align: 'center',
        fixed: 'left',
        width: 240,
        render: text => text.split('.')[0],
      },
      {
        title: '收款主体',
        dataIndex: 'collectionSubject',
        align: 'center',
        fixed: 'left',
        width: 220,
        render: (text, record) => {
          switch (text) {
            case '个人':
              return <div>个人 <a onClick={() => this.gotoDetail(record)}>查看</a></div>;
            default:
              return text;
          }
        },
      },
      {
        title: '订单流水',
        dataIndex: 'orderWater',
        align: 'center',
        width: 320,
      },
      {
        title: '资金流水',
        dataIndex: 'capitalFlow',
        align: 'center',
        width: 320,
      },
      {
        title: '账务类型',
        dataIndex: 'financialTypeDesc',
        align: 'center',
        width: 100,
        render: text => (
          <div className="margin-center text-hidden" title={text}>{text}</div>),
      },
      {
        title: '入账类型',
        dataIndex: 'entryTypeDesc',
        align: 'center',
        width: 120,
        render: text => (
          <div className="margin-center text-hidden" title={text}>{text}</div>),
      },
      {
        title: '打款渠道',
        dataIndex: 'channelDesc',
        align: 'center',
        width: 220,
        key: 'statusDesc',
      },
      {
        title: '入账金额（元）',
        dataIndex: 'creditAmount',
        align: 'center',
        fixed: 'right',
        width: 150,
        key: 'statusDesc',
        render: text => Tools.getViewPrice(text),
      }, {
        title: '账户结余（元）',
        dataIndex: 'accountBalance',
        align: 'center',
        width: 150,
        fixed: 'right',
        key: 'statusDesc',
        render: text => Tools.getViewPrice(text),
      },

    ];

    this.state = {
      inquire: false,
    };
  }

  handleExport() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fundSales/companyExport',
      payload: {},
      callback(res) {
        window.location.href = res.data.url;
      },
    });
  }

  componentDidMount() {
    this.onSearch();
  }

  onSearch() {
    const {dispatch} = this.props;
    return dispatch({type: 'fundSales/getTab2Data', payload: {}});
  }

  render() {
    const {dispatch, fundSales: {tab2 = {}, exportIsLoad}} = this.props;
    const { inquire } = this.state;
    const {condition} = tab2;
    const tabIndex = 2;

    return (
      <div className={cn('tab', 'tab1')}>
        <div className={cn('pcr-condition')}>
          <Button
            loading={exportIsLoad}
            className={cn('export-recharge')}
            disabled={tab2.list.length === 0}
            type={'default'}
            onClick={() => this.handleExport()}
            htmlType={'button'}
          >导出充值记录</Button>

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
                index: tabIndex,
              });
            }}
          />
          <Button
            style={{marginLeft: 43, width: 76}}
            type="primary"
            htmlType={'submit'}
            onClick={() => {
              dispatch({type: 'fundSales/setTabCondition', payload: {pageIndex: 1}, index: tabIndex});
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
                <span>打款渠道：</span>
                <Select
                  className={cn('channel-select')}
                  placeholder={'请选择'}
                  allowClear
                  onChange={(value) => {
                    dispatch({type: 'fundSales/setTabCondition', payload: {channelType: value}, index: tabIndex});
                  }}
                  value={condition.channelType}
                >
                  {
                    [
                      {label: '全部', value: ''},
                      {label: '线上支付(支付宝支付)', value: 'ALIPAY_1'},
                      {label: '线上支付(微信支付)', value: 'WXPAY_1'},
                      // {label: '线上支付(网银支付)', value: 'yeepay'},
                      {label: '线下银行汇款', value: 'bank_transfer'},
                    ].map(o => <Option value={o.value}>{o.label}</Option>)
                  }
                </Select>
              </div>

              <div className={'search-item'}>
                <span>账务类型：</span>
                <Select
                  className={cn('channel-select')}
                  placeholder={'请选择账务类型'}
                  value={condition.financialType}
                  onChange={(value) => {
                    dispatch({type: 'fundSales/setTabCondition', payload: {financialType: value}, index: tabIndex});
                  }}
                >
                  {
                    [
                      {label: '全部', value: ''},
                      {label: '单位福利账户充值', value: '1'},
                    ].map(o => <Option value={o.value}>{o.label}</Option>)
                  }
                </Select>
              </div>

              <div className={'search-item'}>
                <span>状态：</span>
                <Select
                  className={cn('channel-select')}
                  placeholder={'请选择'}
                  value={condition.status}
                  onChange={(value) => {
                    dispatch({type: 'fundSales/setTabCondition', payload: {status: value}, index: tabIndex});
                  }}
                >
                  {
                    [
                      {label: '全部', value: ''},
                      {label: '审核通过', value: '1'},
                      {label: '审核中', value: '3'},
                      {label: '审核不通过', value: '2'},
                      {label: '待付款', value: '4'},
                    ].map(o => <Option value={o.value}>{o.label}</Option>)
                  }
                </Select>
              </div>
            </div>
          )
        }

        <Table
          bordered
          loading={tab2.isLoad}
          dataSource={tab2.list}
          pagination={false}
          rowKey={(item, index) => `${item ? item.id : 'cell'}-${index}`}
          columns={this.tableColumns}
          scroll={{x: [0, ...this.tableColumns].reduce((total, item) => (total + (item.width || 0)))}}
        />

        <div className={cn('footer-pagination-placeholder')} style={{height: 72}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${tab2.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'fundSales/setTabCondition', payload: {pageSize, pageIndex: 1}, index: tabIndex});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'fundSales/setTabCondition', payload: {pageIndex}, index: tabIndex});
                  this.onSearch();
                }}
                current={tab2.condition.pageIndex}
                pageSize={tab2.condition.pageSize}
                total={tab2.totalCount}
              />
            </div>
          </Affix>
        </div>

      </div>
    );
  }
}


export default hot(module)(Class);
