import React from 'react';
import cn from 'classnames';
import {Table, Pagination, Button, Input, Affix, message} from 'antd';
import GTitle from 'client/components/GTitle';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);

    const {match: {params = {}}, location: {state = {}}} = props;

    this.secondPath = window.__themeKey === 'org' ? 'hr' : 'spring';

    this.columns = [
      {
        title: '序号',
        key: 'no',
        align: 'center',
        width: 80,
        render: (txt, row, idx) => idx + 1,
      },
      {
        title: '状态',
        dataIndex: 'statusDesc',
        align: 'center',
        width: 200,
        render: text => text,
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        align: 'center',
        width: 250,
        render: text => text,
      },
      {
        title: '电话',
        dataIndex: 'mobilePhone',
        align: 'center',
        width: 250,
      },
      {
        title: '证件号',
        dataIndex: 'certificateCode',
        width: 250,
        align: 'center',
      },
      {
        title: '发放金额(元)',
        dataIndex: 'amount',
        align: 'center',
        width: 250,
        render: text => Tools.getViewPrice(text),
      },
      {
        title: '流水号',
        dataIndex: 'sendMoneyId',
        align: 'center',
        fixed: 'right',
        width: 380,
        render: text => text,
      },
    ];

    this.state = {
      id: params.id || '',
      data: state.data || {},
      userName: '',
      mobilePhone: '',
    };
  }

  componentWillMount() {
    this.onSearch();
  }

  onSearch() {
    const {dispatch} = this.props;
    dispatch({type: 'welfareRecordDetail/getDetail1', payload: {outTradeNo: this.state.data.outTradeNo}});
  }

  onReplay() {
    const {history} = this.props;
    RH(history, 'sendStaff', `/${window.__themeKey}/${this.secondPath}/coupons/sendstaff/${this.state.id}`);
  }

  onExport() {
    const {dispatch} = this.props;
    const {data} = this.state;
    const un = message.loading('加载中...', 15);
    dispatch({type: 'welfareRecordDetail/getExportUrl1', payload: {outTradeNo: data.outTradeNo}}).then((url) => {
      const timer = setTimeout(() => {
        un();
        clearTimeout(timer);
      }, 200);
      url && (window.location = url);
    });
  }

  render() {
    const {dispatch, welfareRecordDetail} = this.props;
    const {detail1} = welfareRecordDetail;

    let succeedNum = 0;
    let failNum = 0;

    if (detail1.list && detail1.list.length) {
      if (detail1.list[0].statusDesc === '成功') {
        succeedNum = detail1.totalCount;
      } else {
        failNum = detail1.totalCount;
      }
    }

    return (<div className={cn('inner')}>
      <GTitle>发放明细</GTitle>
      <div className={cn('box')}>
        <div className={cn('pcr-condition')}>
          <span className={cn('label')}>姓名：</span>
          <Input
            className={cn('input')}
            placeholder="请输入"
            value={this.state.userName}
            onChange={(e) => {
              this.setState({userName: e.target.value});
            }}
          />
          <span className={cn('label')} style={{marginLeft: 27}}>电话号码：</span>
          <Input
            className={cn('input')}
            placeholder="请输入"
            value={this.state.mobilePhone}
            onChange={(e) => {
              this.setState({mobilePhone: e.target.value});
            }}
          />

          <Button
            style={{marginLeft: '30px', width: 80}}
            type="primary"
            onClick={() => {
              dispatch({
                type: 'welfareRecordDetail/setDetail1',
                payload: {pageIndex: 1, userName: this.state.userName, mobilePhone: this.state.mobilePhone},
              });
              this.onSearch();
            }}
          >查询</Button>
        </div>
        <div className={cn('extra', 'f-cb')}>
          <span>发放成功<i style={{color: '#32B16C'}}>{succeedNum}</i>人，发放失败<i
            style={{color: '#FF4D4F'}}
          >{failNum}</i>人 </span>
          {failNum ?
            <span>，您可以点击<a className="text-blue" onClick={() => this.onReplay()}>重试</a> 将失败记录重新发放。</span> : null}
          <Button className={cn('f-fr')} onClick={() => this.onExport()}>导出发放明细</Button>
        </div>
        <Table
          bordered
          loading={detail1.isLoad}
          dataSource={detail1.list}
          pagination={false}
          rowKey={(item, index) => `${item ? item.id : 'cell'}-${index}`}
          columns={this.columns}
          scroll={{x: [0, ...this.columns].reduce((total, item) => (total + (item.width || 0)))}}
        />
        <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                className="pagination"
                showTotal={() => `共${detail1.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'welfareRecordDetail/setDetail1', payload: {pageIndex: 1, pageSize}});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'welfareRecordDetail/setDetail1', payload: {pageIndex}});
                  this.onSearch();
                }}
                current={detail1.pageIndex}
                pageSize={detail1.pageSize}
                total={detail1.totalCount}
              />
            </div>
          </Affix>
        </div>
      </div>
    </div>);
  }
}

export default Class;
