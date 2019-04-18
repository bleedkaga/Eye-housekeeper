import React from 'react';
import cn from 'classnames';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import moment from 'moment';

import {connect} from 'dva';
import {hot} from 'react-hot-loader';
import {DatePicker, Select, Button, Alert, Table, Affix, Pagination} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';

import './style.less';

const {RangePicker} = DatePicker;
const {Option} = Select;
const dateFormat = 'YYYY-MM-DD';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectList: [
        { name: '全部', value: '1,2' },
        { name: '现金账户充值', value: '1' },
        { name: '单位福利账户充值', value: '2' },
      ],
      groupList: [
        { name: '工会福利账户充值', value: '3'},
      ],
    };
    const { dispatch, location, location: { state = {}}} = this.props;
    if (location.search || state.__back) {
      dispatch({type: 'applyInvoices/setCondition', payload: location.search});
    } else {
      dispatch({type: 'applyInvoices/resetCondition'});
    }
    if (!location.search) {
      dispatch({
        type: 'applyInvoices/setCondition',
        payload: {
          accountType: window.__themeKey === 'org' ? ['1', '2'] : ['3'],
        },
      });
    }
  }

  componentDidMount() {
    this.onSearch();
  }

  onSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyInvoices/getData',
      payload: {},
    });
  }

  render() {
    const {applyInvoices, dispatch, location, history } = this.props;
    const {selectList, groupList} = this.state;
    const options = window.__themeKey === 'org' ? selectList : groupList;
    const {condition, page} = applyInvoices;
    const defaultRangePicker = Tools.queryToParams(location.search);
    const columns = [{
      title: '流水号',
      dataIndex: 'rechargeNumber',
      align: 'center',
      key: 'rechargeNumber',
      width: 270,
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '充值时间',
      dataIndex: 'rechargeTime',
      align: 'center',
      key: 'rechargeTime',
      width: 220,
      render: v => Tools.formatDatetime(v, undefined, 1),
    }, {
      title: '充值金额（元）',
      dataIndex: 'rechargeAmount',
      key: 'rechargeAmount',
      align: 'center',
      width: 150,
      render: (value, row) => Tools.getViewPrice(row.rechargeAmount),
    }, {
      title: '已开票金额（元）',
      dataIndex: 'invoiceExpend',
      key: 'invoiceExpend',
      align: 'center',
      width: 150,
      render: (value, row) => Tools.getViewPrice(row.invoiceExpend),
    }, {
      title: '可开票金额（元）',
      dataIndex: 'invoiceBalance',
      key: 'invoiceBalance',
      align: 'center',
      width: 150,
      render: (value, row) => Tools.getViewPrice(row.invoiceBalance),
    }, {
      title: '账务类型',
      dataIndex: 'accountType',
      key: 'accountType',
      align: 'center',
      width: 150,
      render: (type) => {
        if (type === 1) {
          return <span>现金账户充值</span>;
        } else if (type === 2) {
          return <span>单位福利账户充值</span>;
        } else if (type === 3) {
          return <span>工会福利账户充值</span>;
        }
      },
    }, {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: 190,
      render: (text, record) => (
        <span className={cn('table-applyinvoice-btn')}>
          <a
            href="javascript:;"
            style={{display: record.invoiceBalance === 0 ? 'none' : 'inline-block'}}
            onClick={() => {
              let q = {invoiceId: record.id, amount: record.invoiceBalance};
              q = Tools.paramsToQuery(q);
              RH(history, 'applyInvoicePaper', `/${window.__themeKey}/taxation/applyInvoices/applyInvoicePaper`, {
                search: q,
              });
            }}
          >申请开票</a>
          <a
            href="javascript:;"
            style={{display: record.invoiceRecordStatus === 0 ? 'none' : 'inline-block'}}
            onClick={
              () => {
                let q = {invoiceId: record.id, pageIndex: 1, pageSize: 10};
                q = Tools.paramsToQuery(q);
                RH(history, 'billingRecord', `/${window.__themeKey}/taxation/applyInvoices/billingRecord`, {
                  search: q,
                });
              }
            }
          >开票记录</a>
        </span>
      ),
    }];

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '发票申请', path: ''},
        ]}
      />
      <GPage>
        {
          <div className={cn('apply-invoices')}>
            <div className={cn('m-page-layout-panel')}>
              <div className={cn('m-page-layout-header')}>
                <div className={cn('m-page-layout-headerinline')}>
                  <span className={cn('m-page-layout-header-label')}>可开票金额</span>
                  <span className={cn('m-page-layout-header-money')}>{Tools.getViewPrice(page.amountMoney, '', false, 2, ',')}元</span>
                </div>
              </div>
              <div className={cn('bodyes')}>
                <div className={cn('m-page-layout-query')}>
                  <div className="time-range">
                    <RangePicker
                      format={dateFormat}
                      placeholder={['开始时间', '结束时间']}
                      value={[
                        condition.startTime ? moment(condition.startTime, dateFormat) : '',
                        condition.endTime ? moment(condition.endTime, dateFormat) : '',
                      ]}
                      defaultValue={
                        [
                          defaultRangePicker.startTime ? moment(defaultRangePicker.startTime, dateFormat) : undefined,
                          defaultRangePicker.endTime ? moment(defaultRangePicker.endTime, dateFormat) : undefined,
                        ]
                      }
                      onChange={(date, dateStr) => {
                        dispatch({
                          type: 'applyInvoices/setCondition',
                          payload: {startTime: dateStr[0], endTime: dateStr[1]},
                        });
                      }}
                    />
                  </div>

                  <div className="account-type">
                    <span>账务类型:</span>
                    <Select
                      defaultValue={applyInvoices.condition.accountType.join(',')}
                      onChange={(value) => {
                        dispatch({
                          type: 'applyInvoices/setCondition',
                          payload: {accountType: [value]},
                        });
                      }}
                      style={{width: '180px', height: '34px'}}
                    >
                      {
                        options.map((item, index) => (
                          <Option value={item.value} key={`accountType-${index}`}>{item.name}</Option>
                        ))
                      }
                    </Select>
                  </div>

                  <Button
                    type="primary"
                    title=""
                    onClick={() => {
                      dispatch({type: 'applyInvoices/setCondition', payload: {pageIndex: 1}});
                      setTimeout(() => {
                        this.onSearch();
                      }, 16);
                    }}
                  >查询</Button>
                </div>
                <Alert message="温馨提示：根据国家税务总局要求，开具增值税发票时税收分类简称将会打印在发票票面“货物或应税劳务、服务名称”栏次中，请您申请开票时仔细确认！" type="warning"/>
                <Table
                  loading={applyInvoices.isLoad}
                  bordered
                  dataSource={applyInvoices.page.data}
                  columns={columns}
                  rowKey={(item, index) => `${item.id}-${index}`}
                  style={{marginTop: '14px'}}
                  pagination={false}
                  align="center"
                />

                {/*页脚Affix有个BUG，解决这个BUG需要这个页脚占位符需要和真正footer-pagination一样高（72px就是footer-pagination的高）*/}
                <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
                  <Affix offsetBottom={0}>
                    <div className={cn('footer-pagination')}>
                      <Pagination
                        defaultCurrent={1}
                        showTotal={() => `共${page.totalCount}条数据`}
                        showSizeChanger
                        onShowSizeChange={(current, pageSize) => {
                          dispatch({type: 'applyInvoices/setCondition', payload: {pageSize, pageIndex: 1}});
                          setTimeout(() => {
                            this.onSearch();
                          }, 16);
                        }}
                        pageSizeOptions={['10', '20', '30', '40', '50']}
                        showQuickJumper
                        onChange={(pageIndex) => {
                          dispatch({type: 'applyInvoices/setCondition', payload: {pageIndex}});
                          setTimeout(() => {
                            this.onSearch();
                          }, 16);
                        }}
                        current={applyInvoices.condition.pageIndex}
                        pageSize={applyInvoices.condition.pageSize}
                        total={page.totalCount}
                      />
                    </div>
                  </Affix>
                </div>
              </div>
            </div>
          </div>
        }
      </GPage>

    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
