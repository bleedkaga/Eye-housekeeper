import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Affix, Button, DatePicker, Select, Table, Pagination} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import moment from 'moment';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

import './style.less';

const dateFormat = 'YYYY-MM-DD';

const informWaies = {
  1: {name: '系统', value: 1},
  2: {name: '短信', value: 2},
  3: {name: '语音', value: 3},
};

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch, location, location: {state = {}}} = this.props;
    //判断是否是后退 设置条件参数值
    if (location.search || state.__back) {
      dispatch({type: 'notice/setCondition', payload: location.search});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'notice/resetCondition'});
    }

    this.tableColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '发送时间',
        dataIndex: 'createtime',
        key: 'createtime',
        width: 200,
        // render: v => Tools.formatDatetime(v, undefined, 1),
      },
      {
        title: '发送类型',
        dataIndex: 'informWay',
        key: 'informWay',
        width: 150,
        render: (e) => {
          const o = informWaies[e];
          return o ? o.name : '-';
        },
      },
      {
        title: '发送成功/失败',
        dataIndex: 'successAccount',
        key: 'successAccount',
        width: 200,
        render: (_, item) => (<span><i style={{color: '#32B16C'}}>{item.successAccount || 0}人</i>/<em
          style={{color: '#FF4D4F'}}
        >{item.failAccount || 0}人</em></span>),
      },
      {
        title: '信息费(元)',
        dataIndex: 'cost',
        key: 'cost',
        width: 200,
        render: e => Tools.getViewPrice(e),
      },
      {
        title: '发送内容',
        dataIndex: 'informCountent',
        key: 'informCountent',
        w: 400,
        render: (e, item) => (<div className={cn('f-toe', 'f-tal')} style={{maxWidth: 400 - 34}}>
          <div style={{fontWeight: 'bold'}}>{item.messageTitle}</div>
          {e}
        </div>),
      },
      {
        title: '操作',
        key: 'operate',
        dataIndex: 'operate',
        width: 186,
        fixed: 'right',
        render: (_, item) => (<div className={cn('notice-operate')}>
          <a
            href="javascript:;"
            onClick={() => {
              RH(this.props.history, 'notice', '/org/editNotice', {state: {item}});
            }}
          >编辑内容</a>
          <a
            href="javascript:;"
            onClick={() => {
              RH(this.props.history, 'noticeInventory', `/org/noticeInventory/${item.id}`);
            }}
          >查看明细</a>
        </div>),
      },
    ];

    this.state = {};
  }

  componentDidMount() {
    this.onSearch();
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  onSearch() {
    const {dispatch} = this.props;
    dispatch({type: 'notice/get', payload: {}});
  }

  render() {
    const {dispatch, notice, history} = this.props;
    const {condition} = notice;

    let count = 0;
    this.tableColumns.forEach(o => (count += (o.w ? (o.w + 32) : o.width) || 0));

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '通知管理'},
        ]}
      />
      <GPage className={cn('notice')}>
        <div className={cn('notice-top')}>
          <Button
            type={'primary'}
            onClick={() => {
              RH(history, 'sendNotice', '/org/sendNotice');
            }}
          >发送消息通知</Button>
        </div>
        <div className={cn('notice-menu')}>
          <DatePicker.RangePicker
            format={dateFormat}
            placeholder={['开始时间', '结束时间']}
            value={[
              condition.startDate ? moment(condition.startDate, dateFormat) : undefined,
              condition.endDate ? moment(condition.endDate, dateFormat) : undefined,
            ]}
            onChange={(date, dateStr) => {
              dispatch({
                type: 'notice/setCondition',
                payload: {startDate: dateStr[0], endDate: dateStr[1]},
              });
            }}
          />
          <span className={cn('menu-name')}>发放事由：</span>
          <Select
            allowClear
            className={cn('menu-select')}
            placeholder={'请选择'}
            value={condition.type || undefined}
            onChange={(v) => {
              dispatch({
                type: 'notice/setCondition',
                payload: {type: v},
              });
            }}
          >
            {Object.keys(informWaies).map((k) => {
              const o = informWaies[k];
              return (<Select.Option value={o.value} key={k}>{o.name}</Select.Option>);
            })}
          </Select>
          <Button
            style={{marginLeft: '20px', width: 80}}
            type="primary"
            onClick={() => {
              dispatch({type: 'notice/setCondition', payload: {pageIndex: 1}});
              this.onSearch();
            }}
          >查询</Button>
        </div>
        <Table
          scroll={{x: count}}
          bordered
          loading={notice.isLoad}
          className={cn('components-table-demo-nested', 'goods-table')}
          rowKey={(item, index) => `${item.id}-${index}`}
          columns={this.tableColumns}
          dataSource={notice.list}
          pagination={false}
        />
        <div className={cn('footer-pagination-placeholder')} style={{height: 72}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${notice.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'notice/setCondition', payload: {pageSize, pageIndex: 1}});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'notice/setCondition', payload: {pageIndex}});
                  this.onSearch();
                }}
                current={notice.condition.pageIndex}
                pageSize={notice.condition.pageSize}
                total={notice.totalCount}
              />
            </div>
          </Affix>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
