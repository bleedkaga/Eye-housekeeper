import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Table, message, Button, Divider, Modal} from 'antd';

import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import GTitle from 'client/components/GTitle';
import ConfirmInput from 'client/components/ConfirmInput';
import Tools from 'client/utils/tools';


import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch, location, location: {state = {}}} = this.props;

    if (location.search || state.__back) {
      dispatch({type: 'welfareApproval/setCondition', payload: location.search});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'welfareApproval/resetCondition'});
    }

    this.tableColumns = [
      {
        title: '创建时间',
        dataIndex: 'createtime',
        key: 'createtime',
        w: 200,
        render: v => <div style={{minWidth: 200 - 34}}>{Tools.formatDatetime(v, undefined, 1)}</div>,
      },
      {
        title: '发放事由',
        dataIndex: 'transferReasonName',
        key: 'transferReasonName',
        width: 200 + 34,
        render: v => <div title={v} className={cn('f-toe')} style={{maxWidth: 200, margin: 'auto'}}>{v}</div>,
      },
      {
        title: '发放积分',
        dataIndex: 'amount',
        key: 'amount',
        w: 250,
        render: (v, item) => (
          <div style={{minWidth: 250}}>
            {Tools.getViewPrice(v, '')}元/人，共发放{item.personCount || 0}人，共计{Tools.getViewPrice(item.totalAmount, '')}元
            <br/>
            <a href="javascript:;" onClick={() => this.showPModal(item)}>查看人员名单</a>
          </div>
        ),
      },
      {
        title: '消费范围',
        dataIndex: 'consumptionOptions',
        key: 'consumptionOptions',
        width: 200 + 34,
        render: v => <div title={v} className={cn('f-toe')} style={{maxWidth: 200, margin: 'auto'}}>{v}</div>,
      },
      {
        title: '备注信息',
        dataIndex: 'note',
        key: 'note',
        width: 200 + 34,
        render: v => <div title={v} className={cn('f-toe')} style={{maxWidth: 200, margin: 'auto'}}>{v || '-'}</div>,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: 190,
        fixed: 'right',
        render: (_, item, index) => (<div className={cn('f-toe')}>
          <Button
            type={'primary'}
            loading={this.props.welfareApproval.isWALoading}
            onClick={() => this.auditSendMoneyTask(item, 1, index)}
          >通过</Button>
          <Divider type={'vertical'}/>
          <Button
            type={'gray'}
            loading={this.props.welfareApproval.isWALoading}
            onClick={() => this.setState({confirmInput: {item, status: 2, index}})}
          >不通过</Button>
        </div>),
      },
    ];

    this.tablePColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (_, __, index) => index + 1,
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '电话',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
      },
      {
        title: '证件号码',
        dataIndex: 'certificateCode',
        key: 'certificateCode',
      },
      {
        title: '发放金额',
        dataIndex: 'amount',
        key: 'amount',
        render: e => Tools.getViewPrice(e, ''),
      },
    ];
    this.state = {
      visible: false,
      confirmInput: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'welfareApproval/reset'});
  }

  getData() {
    const {dispatch} = this.props;
    dispatch({type: 'welfareApproval/getData', payload: {}});
  }

  getPData() {
    const {dispatch} = this.props;
    dispatch({type: 'welfareApproval/getPData', payload: {outTradeNo: this.currentModalItem.outTradeNo}});
  }

  showPModal(item) {
    this.setState({visible: true});
    this.currentModalItem = item;
    this.props.dispatch({type: 'welfareApproval/set', payload: {pCurrent: 1, pList: []}});
    this.getPData();
  }

  auditSendMoneyTask(item, status, index, reason) {
    const {dispatch, welfareApproval} = this.props;
    const opt = {
      status,
      id: item.id,
    };
    if (reason) opt.reason = reason;

    dispatch({
      type: 'welfareApproval/auditSendMoneyTask',
      payload: opt,
      callback: (res) => {
        message.success(res.message);
        const {list} = welfareApproval;
        list.splice(index, 1);
        dispatch({type: 'welfareApproval/set', payload: list});
      },
    });
  }

  render() {
    const {welfareApproval, dispatch} = this.props;
    const {visible} = this.state;
    let count = 0;
    this.tableColumns.forEach(c => (count += c.width || c.w || 0));
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '福利审批'},
        ]}
      />
      <GPage className={cn('welfareApproval')}>
        <GTitle>福利发放审批</GTitle>
        <div style={{padding: '30px 30px 0 30px'}}>
          <Table
            bordered
            scroll={{x: count}}
            loading={welfareApproval.isLoad}
            className={cn('goods-table')}
            rowKey={(item, index) => `${item.id}-${index}`}
            columns={this.tableColumns}
            dataSource={welfareApproval.list}
            pagination={false}
          />
        </div>
      </GPage>
      <Modal
        className={cn('gsg-modal')}
        visible={visible}
        title={'查看人员名单'}
        width={800}
        footer={null}
        onCancel={() => this.setState({visible: false})}
      >
        <Table
          size={'middle'}
          bordered
          columns={this.tablePColumns}
          loading={welfareApproval.isPLoad}
          rowKey={(item, index) => `${item.id}-${index}`}
          dataSource={welfareApproval.pList}
          pagination={{
            size: 'small',
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            total: welfareApproval.totalPCount,
            pageSize: welfareApproval.pPageSize,
            current: welfareApproval.pCurrent,
            showQuickJumper: true,
            // showSizeChanger: true,
            showTotal: () => `共${welfareApproval.totalPCount}条`,
            onChange: (pageIndex) => {
              dispatch({type: 'welfareApproval/set', payload: {pCurrent: pageIndex}});
              this.getPData();
            },
          }}
        />
      </Modal>

      <ConfirmInput
        visible={!!this.state.confirmInput}
        label={'拒绝原因：'}
        title="拒绝原因"
        onOk={(reason) => {
          const {confirmInput} = this.state;
          this.setState({confirmInput: false});
          this.auditSendMoneyTask(confirmInput.item, confirmInput.status, confirmInput.index, reason);
        }}
        onCancel={() => {
          this.setState({confirmInput: false});
        }}
      />

    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
