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
      dispatch({type: 'fundAccount/setTabCondition', payload: location.search, index: 1});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'fundAccount/resetTabCondition', index: 1});
    }

    this.tableColumns = [
      {
        title: '充值时间',
        key: 'createtime',
        dataIndex: 'createtime',
        align: 'center',
        width: 180,
      },
      {
        title: '入账时间',
        dataIndex: 'finishTime',
        align: 'center',
        width: 180,
        render: text => text,
      },
      {
        title: '流水号',
        dataIndex: 'outTradeNo',
        align: 'center',
        width: 320,
      },
      {
        title: '充值金额（元）',
        dataIndex: 'amount',
        align: 'center',
        width: 150,
        render: text => Tools.getViewPrice(text),
      },
      {
        title: '实际到账金额（元）',
        dataIndex: 'actualAmount',
        align: 'center',
        width: 180,
        render: text => Tools.getViewPrice(text),
      },
      {
        title: '打款渠道',
        dataIndex: 'channelName',
        align: 'center',
        width: 150,
        render: text => (
          <div style={{width: 320 - 36}} className="margin-center text-hidden" title={text}>{text}</div>),
      },
      {
        title: '账务类型',
        dataIndex: 'financialTypeRedundancy',
        align: 'center',
        width: 150,
        render: text => (
          <div style={{width: 300 - 36}} className="margin-center text-hidden" title={text}>{text}</div>),
      },
      {
        title: '状态',
        dataIndex: 'statusDesc',
        align: 'center',
        width: 150,
        key: 'statusDesc',
        render: (text, data) => {
          const {statusDesc} = data;
          switch (statusDesc) {
            case '审核中':
              return <div className={cn('record-3')}>{statusDesc}</div>;
            case '审核通过':
              return <div className={cn('record-2')}>{statusDesc}</div>;
            case '审核不通过':
              return <div className={cn('record-4')}>{statusDesc}</div>;
            case '待付款':
              return <div className={cn('record-5')}>{statusDesc}</div>;
            default:
              return <div>--</div>;
          }
        },
      },
    ];

    this.state = {
      inquire: false,
    };
  }

  handleExport() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fundAccount/cashExport',
      payload: {},
      callback(res) {
        window.location.href = res.data.url;
      },
    });
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'fundAccount/getTab1Data',
      payload: {},
    });
  }

  onSearch() {
    const {dispatch} = this.props;
    return dispatch({type: 'fundAccount/getTab1Data', payload: {}});
  }

  render() {
    const {dispatch, fundAccount: {tab1 = {}, exportIsLoad}} = this.props;
    const { inquire } = this.state;
    const {condition} = tab1;

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
                type: 'fundAccount/setTabCondition',
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
              dispatch({type: 'fundAccount/setTabCondition', payload: {pageIndex: 1}, index: 1});
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
                  onChange={(value) => {
                    dispatch({type: 'fundAccount/setTabCondition', payload: {channelType: value}, index: 1});
                  }}
                  value={condition.channelType}
                >
                  {
                    [
                      {label: '全部', value: ''},
                      {label: '线上支付(网银支付)', value: 'yeepay_zzy_cash'},
                      {label: '线上支付(支付宝支付)', value: 'ALIPAY_zzy_cash'},
                      {label: '线上支付(微信支付)', value: 'WXPAY_zzy_cash'},
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
                    dispatch({type: 'fundAccount/setTabCondition', payload: {financialType: value}, index: 1});
                  }}
                >
                  {
                    [
                      {label: '全部', value: ''},
                      {label: '现金账户充值', value: '1'},
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
                    dispatch({type: 'fundAccount/setTabCondition', payload: {status: value}, index: 1});
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
          loading={tab1.isLoad}
          dataSource={tab1.list}
          pagination={false}
          rowKey={(item, index) => `${item ? item.id : 'cell'}-${index}`}
          columns={this.tableColumns}
          scroll={{x: [0, ...this.tableColumns].reduce((total, item) => (total + (item.width || 0)))}}
        />

        <div className={cn('record-info')}>
          <p>
            <span className={cn('record-1')}>{tab1.statistical.total}条充值记录，</span>
            <span className={cn('record-2')}>充值成功{tab1.statistical.success}笔，</span>
            <span className={cn('record-3')}>审核中{tab1.statistical.underreview}笔，</span>
            <span className={cn('record-4')}>审核不通过{tab1.statistical.failure}笔，</span>
            <span className={cn('record-5')}>待付款{tab1.statistical.pendingpayment}笔</span>
          </p>
          <p>
            <span>现金账户：累计充值 {Tools.getViewPrice(tab1.statisticalAmount.totalamount)} 元，实际到账{Tools.getViewPrice(tab1.statisticalAmount.actualArrival)}元</span>
          </p>
        </div>

        <div className={cn('footer-pagination-placeholder')} style={{height: 72}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${tab1.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'fundAccount/setTabCondition', payload: {pageSize, pageIndex: 1}, index: 1});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'fundAccount/setTabCondition', payload: {pageIndex}, index: 1});
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
