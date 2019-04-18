import React from 'react';
import './style.less';
import { formatMoney, accMul } from 'client/utils/formatData';
import { Table, Affix, Popover, Icon, message } from 'antd';

const TableViewSuccessed = (props) => {
  const {
    dispatch,
    dataSource,
    queryDetailBtnLoad,
    onSearch,
    total,
    pageIndex,
    pageSize,
    affix,
  } = props;

  const sendMoneyToOne = (record) => {
    dispatch({
      type: 'taxSendDetailRecord/sendMoneyToOne',
      payload: {
        outTradeNo: record.outTradeNo,
        recordsIds: record.id,
        callback: () => message.success('放款成功'),
      }
    })
  };

  const columns = [
    {
      title: '收款户名',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      // className: 'thead-item1',
    },
    {
      title: '组织易代发(元)',
      dataIndex: 'oaiWagesPaying',
      key: 'oaiWagesPaying',
      align: 'center',
      // className: 'thead-item2',
      render: val => formatMoney(accMul(val, 0.01), true, 2),
    },
    {
      title: '证件号码',
      dataIndex: 'certificateCode',
      key: 'certificateCode',
      align: 'center',
      // className: 'thead-item3',
    },
    {
      title: '订单号',
      dataIndex: 'outTradeNo',
      align: 'center',
      // className: 'thead-item4',
    },
    {
      title: '打款渠道',
      dataIndex: 'paymentChannelDesc',
      align: 'center',
      // className: 'thead-item5',
    },
    {
      title: '税务管理模式',
      dataIndex: 'taxModelDesc',
      align: 'center',
      // className: 'thead-item6',
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      align: 'center',
      // className: 'thead-item7',
      // render: (val, record) => {
      //   if (record.status === 2 || record.status === 3) {
      //     return <span style={{ color: '#FCB12F' }}>{val}</span>;
      //   } else if (record.status === 4) {
      //     return <span style={{ color: '#32B16C' }}>发放成功</span>;
      //   } else {
      //     return val;
      //   }
      // },
    },
    {
      title: '操作',
      align: 'center',
      render: (val, record) => {
        if (record.statusDesc === '待收款' && record.payStatus) {
          return <span><a onClick={() => sendMoneyToOne(record)}>放款</a></span>
        } else {
          return "————"
        }
      }
    }
  ];

  const pagination = {
    total,
    current: pageIndex,
    pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    showTotal: _total => `共${_total}条数据`,
    onChange: (_pageIndex, _pageSize) => {
      dispatch({
        type: 'taxSendDetailRecord/setCondition',
        payload: {
          pageIndex: _pageIndex,
          pageSize: _pageSize,
        },
      });
      setTimeout(() => {
        onSearch();
      }, 16);
    },
    onShowSizeChange: (_pageIndex, _pageSize) => {
      dispatch({
        type: 'taxSendDetailRecord/setCondition',
        payload: {
          pageIndex: _pageIndex,
          pageSize: _pageSize,
        },
      });
      setTimeout(() => {
        onSearch();
      }, 16);
    },
  };

  const affixChange = (_affix) => {
    dispatch({
      type: 'taxSendDetailRecord/updateState',
      payload: {
        affix: _affix,
      },
    });
  };

  return (
    <div>
      {/*<Affix offsetTop={46 + 46 + 62} onChange={affixChange}>*/}
        <div style={{width: '100%', height: '20px', backgroundColor: '#fff'}}/>
      {/*</Affix>*/}
      {/*<Affix offsetTop={46 + 46 + 82} onChange={affixChange}>*/}
      {/*<div*/}
          {/*className="thead"*/}
          {/*style={{*/}
            {/*borderBottom: `${affix || dataSource.length === 0 ? '1px solid #e8e8e8' : '0'}`,*/}
          {/*}}*/}
        {/*>*/}
          {/*<div className="thead-item1">收款户名</div>*/}
          {/*<div className="thead-item2">组织易代发(元)</div>*/}
          {/*<div className="thead-item3">证件号码</div>*/}
          {/*<div className="thead-item4">订单号</div>*/}
          {/*<div className="thead-item5">打款渠道</div>*/}
          {/*<div className="thead-item6">*/}
              {/*税务管理模式&nbsp;*/}
            {/*<Popover*/}
              {/*placement="bottomRight"*/}
              {/*content={<span><span>TPT：</span>所得税代征模式</span>}*/}
            {/*>*/}
              {/*<Icon type="question-circle" theme="filled" style={{color: '#FFBE4D', fontSize: '16px'}}/>*/}
            {/*</Popover>*/}
          {/*</div>*/}
          {/*<div className="thead-item7">状态</div>*/}
      {/*</div>*/}
      {/*</Affix>*/}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        bordered
        loading={queryDetailBtnLoad}
        rowKey={record => record.id}
        // showHeader={false}
      />
    </div>
  );
};

export default TableViewSuccessed;
