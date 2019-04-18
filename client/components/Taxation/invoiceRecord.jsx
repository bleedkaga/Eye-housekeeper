import React from 'react';
import cn from 'classnames';
import Tools from 'client/utils/tools';
import { Icon, Select, Input, Button, InputNumber, Popconfirm, Table } from 'antd';
import { connect } from 'dva';
import { hot } from 'react-hot-loader';
import { GContainer, GHeader, GPage} from 'client/components/GLayout';

// 表格头
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
    render(text, row, index) {
      return {
        props: {
          colSpan: row.detailList.length,
        },
      };
    },
  },
  {
    title: '发票类型',
    dataIndex: 'invoiceType',
    key: 'invoiceType',
    render(text, row, index) {
      return row.detailList.map(item => (
        <p>{item.invoiceTypeDesc}</p>
      ));
    },
  },
  {
    title: '货物或应税劳务、服务名称',
    dataIndex: 'invoiceServiceName',
    key: 'invoiceServiceName',
    render(text, row, index) {
      return row.detailList.map(item => (
        <p>{item.invoiceServiceName}</p>
      ));
    },
  },
  {
    title: '单张发票金额',
    dataIndex: 'invoiceMoney',
    key: 'invoiceMoney',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render(text, row, index) {
      return row.detailList.map(item => (
        <p>{item.statusDesc}</p>
      ));
    },
  },
  {
    title: '快递信息',
    dataIndex: 'express',
    key: 'express',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render() {
      return (<a href="javascript:">查看</a>);
    },
  },
];

class InvoiceRecord extends React.Component {
  constructor(props) {
    super(props);
  }

    handleChange = () => {

    };

    componentDidMount() {
      const { dispatch, invoiceId} = this.props;
      dispatch({
        type: 'applyInvoices/getInvoiceRecord',
        payload: {
          invoiceId,
          pageSize: 10,
          pageIndex: 1,
        },
      });
    }

    closeInvoice = () => {
      this.props.onCancel(false);
    };

    render() {
      const { applyInvoices, dispatch, invoiceId, global } = this.props;
      const { record } = applyInvoices;
      console.log(record);
      return (

        <div className={'apply-invoice-panel'} >
          <div className={'header'}>
            <span data-hide={applyInvoices.applyLoading}> 开票记录 </span>
            <div className={'close'}>
              <Icon type="close" size="large" onClick={this.closeInvoice} />
            </div>
          </div>
          <div className={'invoice-container'}>
            <Table
              loading={record.loading}
              columns={columns}
              bordered
              rowKey={(item, index) => `${item.id}-${index}`}
              dataSource={record.list}
            />
          </div>
        </div>
      );
    }
}

export default connect(state => state)(hot(module)(InvoiceRecord));
