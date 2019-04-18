import React from 'react';
import './style.less';
import cn from 'classnames';
import moment from 'moment';
import RH from 'client/routeHelper';
import Tools from 'client/utils/tools';
import { formatMoney, accMul } from 'client/utils/formatData';
import ModalView from './modal-view';
import { Table, Affix, Modal } from 'antd';

const TableView = (props) => {
  const {
    dispatch,
    history,
    dataSource,
    tableViewLoading,
    total,
    pageIndex,
    pageSize,
    // startTime,
    // endTime,
    // orderId,
    // status,
    confirmed, // 待放款
    fail, // 部分完成
    success, // 完成
    allTotal, // 订单条数
    pendingPayment, // 待付款
    pendingloan, // 进行中
    affix,
    onSearch,
  } = props;

  // 付款
  const payment = (_data) => {
    RH(history, 'taxPlan', `/${window.__themeKey}/salary/taxPlan`, {
      outTradeNo: _data.outTradeNo,
      step: 2,
      currentScheme: _data.typeDesc === '自定义方案' ? '2' : '1',
      isPayment: true,
      personCount: _data.personCount,
      totalMoney: _data.total,
      serviceCharge: _data.serviceCharge,
      totalAmount: (_data.total - _data.serviceCharge),
      paymentMethod: _data.paymentMethod,
    });
  };

  // 下载
  const downScheme = (_data) => {
    dispatch({
      type: 'taxSendRecord/downScheme',
      payload: {
        outTradeNo: _data.outTradeNo,
        type: _data.typeDesc === '自定义方案' ? 2 : 1,
      },
    });
  };

  // 显示 modal
  const showModal = (_data, _type) => {
    dispatch({
      type: 'taxSendRecord/updateState',
      payload: {
        visible: true,
        modalType: _type,
        outTradeNo: _data.outTradeNo,
        title: _type === 1 ? '系统通知' : '提醒工作人员确认',
      },
    });
  };

  // 查看
  const catDetail = (_data, status) => {
    const queryParams = {
      outTradeNo: _data.outTradeNo,
      status: status || '0',
      scheme: _data.typeDesc === '系统方案' ? '1' : '2',
      pageIndex: 1,
      pageSize: 10,
    };
    const search = Tools.paramsToQuery(queryParams);
    RH(
      history,
      'taxSendDetailRecord',
      `/${window.__themeKey}/salary/taxSendDetailRecord`,
      {
        search,
        push: true,
      }
    );
  };

  // 温馨提示 modal
  const tipsModal = (record) => {
    let tipsText = '任务正在进行中， 是否提前结束任务';

    if (record.distributionMethod) {
      tipsText = '任务正在进行中， 是否提前结束任务';
    } else {
      tipsText = '任务正在进行中， 是否提前结束任务，并下发任务费用。';
    }

    Modal.confirm({
      iconType: '-',
      icon: '-',
      title: <h1 style={{fontSize: '18px', textAlign: 'center'}}>温馨提示</h1>,
      content: <h1 style={{fontSize: '16px', textAlign: 'center'}}>{tipsText}</h1>,
      okText: '确认',
      cancelText: '取消',
      className: 'gsg-modal',
      onOk: () => {overTask(record.outTradeNo)}
    })
  };

  // 结束任务
  const overTask = (otn) => {
    dispatch({
      type: 'taxSendRecord/overTask',
      payload: {
        outTradeNo: otn,
      }
    })
  };

  // 放款
  const sendMoney = (otn) => {
    Modal.confirm({
      iconType: '-',
      icon: '-',
      title: <h1 style={{fontSize: '18px', textAlign: 'center'}}>温馨提示</h1>,
      content: <h1 style={{fontSize: '16px', textAlign: 'center'}}>是否确认对任务订单进行放款，确认放款，任务费用将打款到承包方账户</h1>,
      okText: '确认',
      cancelText: '取消',
      className: 'gsg-modal',
      onOk: () => {
        dispatch({
          type: 'taxSendRecord/sendMoney',
          payload: {
            outTradeNo: otn,
          }
        })
      }
    })
  };

  // 订单未付款
  const orderUnpay = (record) => {
    // 后付款
    if (record.paymentMethod) {
      switch (record.status) {
        // 待确认
        case 2:
          return (<span><a onClick={() => showModal(record, 2)}>提醒确认</a><a onClick={() => catDetail(record)}>查看</a></span>);
        // 待付款
        case 1:
          return (<span><a onClick={() => payment(record)}>付款</a><a onClick={() => catDetail(record)}>查看</a></span>);
        // 失效
        case -2:
          return (<span><a onClick={() => catDetail(record)}>查看</a></span>)
      }
    } else {
      switch (record.status) {
        case 2:
          return (<span><a onClick={() => showModal(record, 2)}>提醒确认</a><a onClick={() => catDetail(record)}>查看</a></span>);
        case 1:
          return (<span><a onClick={() => showModal(record, 1)}>撤销</a><a onClick={() => catDetail(record)}>查看</a></span>);
        case -2:
          return (<span><a onClick={() => catDetail(record)}>查看</a></span>)
      }
    }
  };

  // 订单付款
  const orderPay = (record) => {
    // 如果是后付款
    if (record.paymentMethod) {
      switch(record.status) {
        // 待生效
        case 0:
          return (<span><a onClick={() => showModal(record, 1)}>撤销</a><a onClick={() => catDetail(record)}>查看</a></span>);
        // 进行中
        case 1:
          return (<span><a onClick={() => catDetail(record)}>查看</a><a onClick={() => tipsModal(record)}>结束任务</a></span>)
      }
    } else {
      switch (record.status) {
        case 0:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record)}>查看</a></span>);
        case 1:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record)}>查看</a><a onClick={() => tipsModal(record)}>结束任务</a></span>)
      }
    }
  };

  // 订单任务完成
  const orderTaskFull = (record) => {
    if (record.distributionMethod === 0) {
      switch (record.status) {
        // 待放款
        case 1:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record)}>查看</a></span>);
        // 放款中
        case 2:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record)}>查看</a></span>);
        // 完成
        case 3:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record, '8')}>查看</a></span>);
        // 失败
        case -2:
          return (<span><a onClick={() => catDetail(record, '-2')}>继续执行</a><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record)}>查看</a></span>)
      }
    } else {
      switch (record.status) {
        case 1:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record)}>查看</a><a onClick={() => sendMoney(record.outTradeNo)}>放款</a></span>);
        case 2:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record)}>查看</a></span>);
        case 3:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record, '8')}>查看</a></span>);
        case -1:
          return (<span><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record, '8')}>查看</a><a onClick={() => sendMoney(record.outTradeNo)}>放款</a></span>)
        case -2:
          return (<span><a onClick={() => catDetail(record, '-2')}>继续执行</a><a onClick={() => downScheme(record)}>下载方案</a><a onClick={() => catDetail(record)}>查看</a></span>)
      }
    }
  };



  const columns = [
    {
      title: '订单创建时间',
      align: 'center',
      // className: 'thead-item1',
      dataIndex: 'createtime',
      render: val => moment(val).format('YYYY-MM-DD-HH:mm'),
    },
    {
      title: '订单号',
      align: 'center',
      // className: 'thead-item2',
      dataIndex: 'outTradeNo',
    },
    {
      title: '打款渠道',
      align: 'center',
      // className: 'thead-item3',
      dataIndex: 'paymentChannelDesc',
    },
    {
      title: '人数',
      align: 'center',
      // className: 'thead-item4',
      dataIndex: 'personCount',
    },
    {
      title: '总额',
      align: 'center',
      // className: 'thead-item5',
      dataIndex: 'total',
      render: val => formatMoney(accMul(val, 0.01), true, 2),
    },
    {
      title: '类型',
      align: 'center',
      // className: 'thead-item6',
      dataIndex: 'typeDesc',
    },
    {
      title: '任务周期',
      align: 'center',
      dataIndex: 'taskEndTime',
      render: (val, record) => {
        return <span>{record.taskStartTime} —— {record.taskEndTime}</span>
      }
    },
    {
      title: '放款方式',
      align: 'center',
      dataIndex: 'distributionMethodDesc',
    },
    {
      title: '状态',
      align: 'center',
      // className: 'thead-item7',
      dataIndex: 'statusDesc',
      // render: (val) => {
      //   switch (val) {
      //     case 1:
      //       return (<span>等待付款</span>);
      //     case 4:
      //       return (<span>完成</span>);
      //     case 2:
      //     case 3:
      //       return (<span>付款待确认</span>);
      //     case -2:
      //       return (<span>部分未执行</span>);
      //     default:
      //       return (<span>error</span>);
      //   }
      // },
    },
    {
      title: '操作',
      align: 'center',
      className: 'operator-a', // thead-item8
      dataIndex: 'statusDsc',
      render: (val, record) => {
        switch(record.orderStatus) {
          case 0:
            return orderUnpay(record);
          case 1:
            return orderPay(record);
          case 2:
            return orderTaskFull(record);
          default:
            return <span>————</span>
        }
        // switch (record.status) {
        //   case 1:
        //     return (
        //       <span>
        //         <a style={{color: '#5F7AEB'}} onClick={() => payment(record)}>付款</a>
        //         <span style={{display: 'inline-block', width: '15px'}}/>
        //         <a style={{color: '#666'}} onClick={() => showModal(record, 1)}> 撤销</a>
        //       </span>);
        //   case 4:
        //     return (
        //       <span>
        //         <a style={{color: '#32B16C'}} onClick={() => downScheme(record)}>下载方案 </a>
        //         <span style={{display: 'inline-block', width: '15px'}}/>
        //         <a style={{color: '#999'}} onClick={() => catDetail(record)}> 查看</a>
        //       </span>);
        //   case 2:
        //   case 3:
        //     return (
        //       <span>
        //         <a style={{color: '#4DC2FF'}} onClick={() => showModal(record, 2)}>提醒确认 </a>
        //         <span style={{display: 'inline-block', width: '15px'}}/>
        //         <a style={{color: '#999'}} onClick={() => catDetail(record)}> 查看</a>
        //       </span>);
        //   case -2:
        //     return (<span>
        //       <a style={{color: '#FBA818'}} onClick={() => catDetail(record)}>继续执行</a>
        //     </span>);
        //   default:
        //     return (<span>error</span>);
        // }
      },
    },
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
        type: 'taxSendRecord/setCondition',
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
        type: 'taxSendRecord/setCondition',
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

  const renderFooter = () => (
    <div style={{ fontWeight: 400 }}>
      <span style={{color: '#333'}}>{allTotal}条订单记录，</span>
      <span style={{color: '#5F7AEB'}}>等待付款{pendingPayment}个订单，</span>
      <span style={{color: '#FBA818'}}>部分完成{fail}个订单，</span>
      <span style={{color: '#4DC2FF'}}>待放款{confirmed}个订单，</span>
      <span style={{color: '#32B16C'}}>进行中{pendingloan}个订单。</span>
    </div>
  );

  const affixChange = (_bool) => {
    dispatch({
      type: 'taxSendRecord/updateState',
      payload: {
        affix: _bool,
      },
    });
  };

  return (
    <div className="table-view">
      {/*<div style={{height: 53}}>*/}
      {/*<Affix offsetTop={46 + 46 + 91} onChange={affixChange}>*/}
      {/*<div*/}
        {/*className={cn({*/}
          {/*thead: true,*/}
          {/*'thead-bottom-border': affix || dataSource.length === 0,*/}
        {/*})}*/}
      {/*>*/}
        {/*<div className="thead-item1">订单创建时间</div>*/}
        {/*<div className="thead-item2">订单号</div>*/}
        {/*<div className="thead-item3">打款渠道</div>*/}
        {/*<div className="thead-item4">人数</div>*/}
        {/*<div className="thead-item5">总额</div>*/}
        {/*<div className="thead-item6">类型</div>*/}
        {/*<div className="thead-item7">状态</div>*/}
        {/*<div className="thead-item8">操作</div>*/}
      {/*</div>*/}
      {/*</Affix>*/}
      {/*</div>*/}
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        loading={tableViewLoading}
        pagination={pagination}
        rowKey={record => record.id}
        // footer={renderFooter}
        // showHeader={false}
      />
      <ModalView {...props}/>
    </div>
  );
};

export default TableView;
