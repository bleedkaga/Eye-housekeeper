import React from 'react';
import './style.less';
import { formatMoney, accMul } from 'client/utils/formatData';
import TaxHeaderData from 'client/components/TaxHeaderData';
import RH from 'client/routeHelper';
import PollingRequest from 'client/utils/pollingRequest';
import cn from 'classnames';
import { Table, Popover, Icon, Affix, Button } from 'antd';

class TableViewFailed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      affix: false,
    };
  }

  sendAgenCallback = () => {
    const { history, dispatch, outTradeNo} = this.props;
    const { pathname } = history.location;
    if (pathname.indexOf('taxPlan') > -1) {
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          step: 3,
          outTradeNo,
          showAnimate: true, // 显示动画
          showResult: false, // 显示结果
        },
      });
      PollingRequest.pollingResult(dispatch, outTradeNo);
    } else {
      RH(history, 'taxPlan', `/${window.__themeKey}/salary/taxPlan`);
      setTimeout(() => {
        dispatch({
          type: 'taxPlan/updateState',
          payload: {
            step: 3,
            outTradeNo,
            showAnimate: true, // 显示动画
            showResult: false, // 显示结果
          },
        });
        PollingRequest.pollingResult(dispatch, outTradeNo);
      }, 16);
    }
  };

  sendAgen = () => {
    const { dispatch, outTradeNo } = this.props;
    dispatch({
      type: 'taxSendDetailRecord/sendAgen',
      payload: {
        pageIndex: 1,
        pageSize: 10000,
        outTradeNo,
        status: '-2',
        callback: this.sendAgenCallback.bind(this),
      },
    });
  };

  render() {
    const { affix } = this.state;

    const {
      history,
      dataSource,
      total,
      pageIndex,
      pageSize,
      onSearch,
      sendAgenBtnLoad,
      queryDetailBtnLoad,
    } = this.props;

    const { pathname } = history.location;

    const offsetTop = pathname.indexOf('taxPlan') > -1 ? 0 : 62;

    const taxHeaderProps = {
      ...this.props,
      has_hint: true,
      fail_hint: true,
      hidden_service_money: true
    };

    const columns = [
      {
        title: '收款户名',
        dataIndex: 'userName',
        align: 'center',
        className: 'fail-thead-item1',
      },
      {
        title: '组织易代发(元)',
        dataIndex: 'oaiWagesPaying',
        align: 'center',
        className: 'fail-thead-item2',
        render: val => formatMoney(accMul(val, 0.01), true, 2),
      },
      {
        title: '证件号码',
        dataIndex: 'certificateCode',
        align: 'center',
        className: 'fail-thead-item3',
      },
      {
        title: '订单号',
        align: 'center',
        dataIndex: 'outTradeNo',
        className: 'fail-thead-item4',
      },
      {
        title: '打款渠道',
        align: 'center',
        dataIndex: 'paymentChannelDesc',
        className: 'fail-thead-item5',
      },
      {
        title: <div>
          <Popover
            placement="bottomRight"
            content={<span><span>TPT：</span>所得税代征模式</span>}
          >
            税务管理模式 <Icon type="question-circle" theme="filled" style={{color: '#FFBE4D', fontSize: '16px'}}/>
          </Popover>
        </div>,
        dataIndex: 'taxModelDesc',
        align: 'center',
        className: 'fail-thead-item6',
      },
      {
        title: '状态',
        dataIndex: 'statusDesc',
        align: 'center',
        className: 'fail-thead-item7',
      },
      {
        title: '失败原因',
        dataIndex: 'openapiDesc',
        align: 'center',
        className: 'fail-thead-item8',
        render: val => <span style={{ color: '#FF4D4F' }}>{val || '未知错误'}</span>,
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
        onSearch({pageIndex: _pageIndex, pageSize: _pageSize, status: '-2'});
      },
      onShowSizeChange: (_pageIndex, _pageSize) => {
        onSearch({pageIndex: _pageIndex, pageSize: _pageSize, status: '-2'});
      },
    };

    return (
      <div className={cn('table-fail-component')}>
        <TaxHeaderData {...taxHeaderProps}/>
        {/*<Affix offsetTop={46 + 46 + offsetTop}>*/}
        <div style={{ width: '100%', height: '20px', backgroundColor: '#fff' }}/>
        {/*</Affix>*/}
        {/*<Affix offsetTop={46 + 46 + offsetTop + 20} onChange={_affix => this.setState({ affix: _affix })}>*/}
        <div
          className="fail-thead"
          style={{
            borderBottom: `${affix || dataSource.length === 0 ? '1px solid #e8e8e8' : '0'}`,
          }}
        >
          <div className="fail-thead-item1">收款户名</div>
          <div className="fail-thead-item2">组织易代发(元)</div>
          <div className="fail-thead-item3">证件号码</div>
          <div className="fail-thead-item4">订单号</div>
          <div className="fail-thead-item5">打款渠道</div>
          <div className="fail-thead-item6">
                税务管理模式&nbsp;
            <Popover
              placement="bottomRight"
              content={<span><span>TPT：</span>所得税代征模式</span>}
            >
              <Icon type="question-circle" theme="filled" style={{color: '#FFBE4D', fontSize: '16px'}}/>
            </Popover>
          </div>
          <div className="fail-thead-item7">状态</div>
          <div className="fail-thead-item8">失败原因</div>
        </div>
        {/*</Affix>*/}
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={queryDetailBtnLoad}
          rowKey={record => record.id}
          showHeader={false}
        />
        <Affix offsetBottom={0}>
          <div className="footer_affix_btn_wrap">
            <Button
              type="primary"
              className="send_agen_btn"
              loading={sendAgenBtnLoad}
              onClick={this.sendAgen.bind(this)}
            >
              再次执行
            </Button>
          </div>
        </Affix>
      </div>
    );
  }
}

export default TableViewFailed;
