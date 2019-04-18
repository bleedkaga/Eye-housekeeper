import React from 'react';
import { connect } from 'dva';
import cn from 'classnames';
import { hot } from 'react-hot-loader';
import { Alert, Table, Affix, Pagination, Popover } from 'antd';

import { GContainer, GHeader, GPage } from 'client/components/GLayout';
import Tools from 'client/utils/tools';

import './style.less';

// Components
import AdvancedQuery from './advancedQuery';
import { CopyBoard } from 'client/components/CopyBoard';
import InvoiceDetailAndPreview from '../../components/InvoiceDetailAndPreview';


class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
    const { dispatch, location, location: { state = {}}} = this.props;
    if (location.search || state.__back) {
      dispatch({type: 'applyRecord/setCondition', payload: location.search});
    } else {
      dispatch({type: 'applyRecord/resetCondition'});
    }

    if (!location.search) {
      dispatch({
        type: 'applyRecord/setCondition',
        payload: {
          accountType: window.__themeKey === 'org' ? ['1', '2'] : ['3'],
        },
      });
    }
  }

  onSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyRecord/getApplyRecordList',
      payload: {},
    });
  }

  componentDidMount() {
    this.onSearch();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyRecord/reset',
    });
  }

  renderContent(value, row = {}) {
    const obj = {
      children: value,
      props: {
        rowSpan: row.invoiceIndex ? 0 : row.invoiceList.length,
      },
    };
    return obj;
  }

  columns = [
    {
      key: 'applyInvoiceCode',
      title: '发票申请编号',
      dataIndex: 'applyInvoiceCode',
      align: 'center',
      width: 130,
      fixed: 'left',
      render: (v, a) => {
        const arr = [];
        a.invoiceList.forEach(() => {
          arr.push(<div className={'line-table'}>{v}</div>);
        });
        return arr;
      },
    },
    {
      key: 'rechargeNumber',
      title: '充值流水号',
      dataIndex: 'rechargeNumber',
      align: 'center',
      width: 250,
      render: (v, a) => {
        const arr = [];
        a.invoiceList.forEach(() => {
          arr.push(<div className={'line-table'}>{v}</div>);
        });
        return arr;
      },
    },
    {
      key: 'rechargeTime',
      title: '充值时间',
      dataIndex: 'rechargeTime',
      width: 180,
      align: 'center',
      render: (v, a) => {
        const arr = [];
        a.invoiceList.forEach(() => {
          arr.push(<div className={'line-table'}>{Tools.formatDatetime(v, undefined, 1)}</div>);
        });
        return arr;
      },
    },
    {
      key: 'applyTime',
      title: '发票申请时间',
      dataIndex: 'applyTime',
      width: 180,
      align: 'center',
      render: v => Tools.formatDatetime(v, undefined, 1),
    },
    {
      key: 'invoiceNumber',
      title: '已申请发票（张）',
      dataIndex: 'invoiceNumber',
      width: 170,
      align: 'center',
    },
    {
      key: 'invoiceAmount',
      title: '计税合计总额',
      dataIndex: 'invoiceAmount',
      width: 150,
      align: 'center',
      render: (value, row) => Tools.getViewPrice(row.invoiceAmount, '', false, 2, ','),
    },
    {
      key: 'accountDesc',
      title: '账务类型',
      dataIndex: 'accountDesc',
      width: 160,
      align: 'center',
    },
    {
      key: 'invoiceTitle',
      title: '发票抬头',
      dataIndex: 'invoiceTitle',
      width: 260,
      align: 'center',
    },
    {
      key: 'invoiceCompany',
      title: '开票单位',
      dataIndex: 'invoiceCompany',
      width: 260,
      align: 'center',
    },
    {
      key: 'invoiceType',
      title: '发票类型',
      dataIndex: 'invoiceType',
      width: 160,
      align: 'center',
      render: (v, a) => {
        const arr = [];
        a.invoiceList.forEach((item) => {
          arr.push(<div className={'line-table'}>{item.invoiceTypeDesc}</div>);
        });
        return arr;
      },
    },
    {
      key: 'invoiceServiceName',
      title: '货物或应税劳务、服务名称',
      dataIndex: 'invoiceServiceName',
      width: 260,
      align: 'center',
      render: (v, a) => {
        const arr = [];
        a.invoiceList.forEach((item) => {
          arr.push(<div className={'line-table'}>{item.invoiceServiceName}</div>);
        });
        return arr;
      },
    },
    {
      key: 'invoiceMoney',
      title: '单张发票金额',
      dataIndex: 'invoiceMoney',
      width: 160,
      align: 'center',
      render: (text, row) => {
        const arr = [];
        row.invoiceList.forEach((item) => {
          arr.push(<div className={'line-table'}>{Tools.getViewPrice(item.invoiceMoney, '', false, 2, ',')}</div>);
        });
        return arr;
      },
    },
    {
      key: 'statusDesc',
      title: '状态',
      dataIndex: 'statusDesc',
      width: 160,
      align: 'center',
      render: (text, row) => {
        const arr = [];
        row.invoiceList.forEach((item) => {
          const {statusDesc, status } = item;
          if (status === 3) {
            arr.push(
              <div className={cn('line-table')}>
                <span className={cn(`status-${status}`)}>{statusDesc}
                  {/*<Popover*/}
                  {/*title={''}*/}
                  {/*arrowPointAtCenter*/}
                  {/*content={item.rejectedReason}*/}
                  {/*trigger="click"*/}
                  {/*>*/}
                  {/*<a href="javascript:;"> [原因]</a>*/}
                  {/*</Popover>*/}
                </span>
              </div>
            );
          } else {
            arr.push(
              <div className={cn('line-table')}>
                <span className={cn(`status-${status}`)}>{statusDesc} </span>
              </div>
            );
          }
        });
        return arr;
      },
    },
    {
      key: 'expressCompany',
      title: '备注',
      dataIndex: 'expressCompany',
      width: 300,
      align: 'center',
      render: (text, row) => {
        const arr = [];
        row.invoiceList.forEach((item) => {
          arr.push(
            <div className={cn('line-table')}>
              <CopyBoard {...item}/>
            </div>
          );
        });
        return arr;
      },
    },
    {
      key: 'action',
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (text, row) => {
        const arr = [];
        row.invoiceList.forEach(() => {
          arr.push(
            <div className={cn('line-table')}>
              <span className={cn('operation-tabline-inline')}>
                <a href="javascript:" onClick={() => { this.requestInvoiceDetail(row); }}>查看</a>
              </span>
            </div>
          );
        });
        return arr;
      },
    },
  ];

  requestInvoiceDetail(row) {
    const that = this;
    const { dispatch, global } = this.props;
    const companyGroupId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok
    dispatch({
      type: 'applyRecord/showInvoiceDetail',
      payload: {
        companyId: companyGroupId, //ok
        batchId: row.id,
      },
      callback() {
        that.setState({
          previewVisible: true,
        });
      },
    });
  }


  render() {
    const { applyRecord, dispatch } = this.props;
    const { condition, totalCount } = applyRecord;
    const tableData = applyRecord.list;
    const { previewVisible} = this.state;


    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          { name: '首页', path: `/${window.__themeKey}/dashboard` },
          { name: '申请记录', path: `/${window.__themeKey}/taxation/dashboard` },
        ]}
      />

      <div className={cn('apply-record')}>

        <GPage top={0} bottom={88}>
          {
            <div className={cn('page-layout-panel')}>
              <AdvancedQuery
                onSubmit={(e) => {
                  const search = Tools.paramsToQuery(e);
                  dispatch({
                    type: 'applyRecord/setCondition',
                    payload: search,
                  });
                  this.onSearch();
                }}
                defaultData={applyRecord.condition}
              />
              <Alert message="温馨提示：您的发票申请我公司会在5个工作日内受理并邮寄至贵公司。" type="warning" />
              <Table
                bordered
                loading={applyRecord.isLoad}
                dataSource={tableData}
                pagination={false}
                rowKey={(item, index) => `${item ? item.id : 'cell'}-${index}`}
                columns={this.columns}
                scroll={{ x: 2685}}
                style={{ marginTop: '14px' }}
              />
              <div className={cn('footer-pagination-placeholder')} style={{ height: '72px' }}>
                <Affix offsetBottom={0}>
                  <div className={cn('footer-pagination')}>
                    <Pagination
                      defaultCurrent={1}
                      showTotal={() => `共${totalCount}条数据`}
                      showSizeChanger
                      pageSizeOptions={['10', '20', '30', '40', '50']}
                      onShowSizeChange={(current, pageSize) => {
                        dispatch({
                          type: 'applyRecord/setCondition',
                          payload: Tools.paramsToQuery({ pageSize, pageIndex: 1 }),
                        });
                        this.onSearch();
                      }}
                      showQuickJumper
                      onChange={(pageIndex) => {
                        dispatch({
                          type: 'applyRecord/setCondition',
                          payload: Tools.paramsToQuery({ pageIndex }),
                        });
                        this.onSearch();
                      }}
                      current={condition.pageIndex}
                      pageSize={condition.pageSize}
                      total={parseInt(totalCount || 0, 10)}
                    />
                  </div>
                </Affix>
              </div>
            </div>
          }
        </GPage>

      </div>

      {/*发票详情与预览*/}
      {
        previewVisible &&
        (<InvoiceDetailAndPreview
          showInvoiceDetail={applyRecord.showInvoiceDetail}
          dispatch={dispatch}
          onClose={() => {
            this.setState({previewVisible: false});
          }}
        />)
      }
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
