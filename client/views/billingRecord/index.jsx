import React from 'react';
import cn from 'classnames';

import { GContainer, GHeader, GPage} from 'client/components/GLayout';
import { Table, Affix, Pagination, Popover } from 'antd';
import { connect } from 'dva';
import { hot } from 'react-hot-loader';
import './style.less';

//发票详情与发票预览需要用到公用样式
import '../applyInvoicePaper/style.less';

import GTitle from 'client/components/GTitle';
import Tools from 'client/utils/tools';
import { CopyBoard } from 'client/components/CopyBoard';
import InvoiceDetailAndPreview from '../../components/InvoiceDetailAndPreview';

class BillingRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
    const { dispatch, location, location: { state = {}}} = this.props;
    if (location.search || state.__back) {
      dispatch({type: 'billingRecord/setCondition', payload: location.search});
    } else {
      dispatch({type: 'billingRecord/resetCondition'});
    }
  }

  componentDidMount() {
    this.onSearch();
  }

  onSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'billingRecord/get',
      payload: {},
    });
  }

  render() {
    const that = this;
    const { billingRecord, dispatch, global } = this.props;
    const { invoiceDetailRecord } = billingRecord;
    const tableData = invoiceDetailRecord.data;
    const {previewVisible} = this.state;
    const companyGroupId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok
    const columns = [
      {
        title: '发票申请编号',
        dataIndex: 'applyInvoiceCode',
        key: 'applyInvoiceCode',
      },
      {
        title: '发票申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
        render: v => Tools.formatDatetime(v, undefined, 1),
      },
      {
        title: '已申请发票（张）',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
      },
      {
        title: '计税合计总额',
        dataIndex: 'invoiceAmount',
        key: 'invoiceAmount',
        render: (value, row) => Tools.getViewPrice(row.invoiceAmount, '', false, 2, ','),
      },
      {
        title: '发票类型',
        dataIndex: 'invoiceType',
        key: 'invoiceType',
        render(text, row) {
          const arr = [];
          row.detailList.forEach((item) => {
            arr.push(<div className={cn('line-table')}>{item.invoiceTypeDesc}</div>);
          });
          return arr;
        },
      },
      {
        title: '货物或应税劳务、服务名称',
        dataIndex: 'invoiceServiceName',
        key: 'invoiceServiceName',
        render(text, row) {
          const arr = [];
          row.detailList.forEach((item) => {
            arr.push(<div className={cn('line-table')}>{item.invoiceServiceName}</div>);
          });
          return arr;
        },
      },
      {
        title: '单张发票金额',
        dataIndex: 'invoiceMoney',
        key: 'invoiceMoney',
        render(text, row) {
          const arr = [];
          row.detailList.forEach((item) => {
            arr.push(<div className={cn('line-table')}>{Tools.getViewPrice(item.invoiceMoney, '', false, 2, ',')}</div>);
          });
          return arr;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render(text, row) {
          const arr = [];
          row.detailList.forEach((item) => {
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
        title: '备注',
        dataIndex: 'express',
        key: 'express',
        width: 300,
        render(text, row) {
          const arr = [];
          row.detailList.forEach((item) => {
            arr.push(
              <div className={cn('line-table')}>
                <CopyBoard {...item}/>
              </div>
            );
          });
          return arr;
          // return <CopyBoard {...row.detailList[row.invoiceIndex]}/>;
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 80,
        render(text, row) {
          const arr = [];
          row.detailList.forEach(() => {
            arr.push(
              <div className={cn('line-table')}>
                <a
                  href="javascript:;"
                  onClick={() => {
                    dispatch({
                      type: 'billingRecord/showInvoiceDetail',
                      payload: {
                        companyId: companyGroupId, //ok
                        batchId: row.id,
                      },
                    });
                    that.setState({
                      previewVisible: true,
                    });
                  }}
                >查看</a>
              </div>
            );
          });
          return arr;
        },

      },
    ];

    return (
      <GContainer className={cn('home-view')}>
        <GHeader
          route={[
            {name: '开票管理', path: `/${window.__themeKey}/taxation`},
            {name: '发票申请', path: `/${window.__themeKey}/taxation/dashboard`},
          ]}
        />
        <GPage top={208} bottom={25}>
          {
            <div className={'billing-record-panel'} >
              <div className={'header'}>
                <GTitle>开票记录</GTitle>
              </div>
              <div className={'invoice-container'}>
                <div className={cn('table-container')}>
                  <Table
                    pagination={false}
                    loading={billingRecord.isLoad}
                    columns={columns}
                    bordered
                    rowKey={(item, index) => `${item.id}-${index}`}
                    dataSource={tableData}
                  />
                </div>
                <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
                  <Affix offsetBottom={0}>
                    <div className={cn('footer-pagination')}>
                      <Pagination
                        pageSizeOptions={['10', '20', '30', '40', '50']}
                        defaultCurrent={1}
                        showTotal={() => `共${billingRecord.invoiceDetailRecord.totalCount}条数据`}
                        showSizeChanger
                        onShowSizeChange={(current, pageSize) => {
                          dispatch({type: 'billingRecord/setCondition', payload: {pageSize, pageIndex: 1}});
                          setTimeout(() => {
                            this.onSearch();
                          }, 16);
                        }}
                        showQuickJumper
                        onChange={(pageIndex) => {
                          dispatch({type: 'billingRecord/setCondition',
                            payload: {
                              pageIndex,
                            }});
                          setTimeout(() => {
                            this.onSearch();
                          }, 16);
                        }}
                        current={billingRecord.invoiceDetailRecord.pageIndex}
                        pageSize={billingRecord.invoiceDetailRecord.pageSize}
                        total={billingRecord.invoiceDetailRecord.totalCount}
                      />
                    </div>
                  </Affix>
                </div>
              </div>
            </div>
          }
        </GPage>


        {/* 查看开票记录 */}
        {
          previewVisible && (<InvoiceDetailAndPreview
            showInvoiceDetail={billingRecord.showInvoiceDetail}
            dispatch={dispatch}
            onClose={() => {
              this.setState({
                previewVisible: false,
              });
            }}
          />)
        }
      </GContainer>);
  }
}
export default connect(state => state)(hot(module)(BillingRecord));
