import React from 'react';
import cn from 'classnames';
import {Button, Affix, DatePicker, Table, Pagination} from 'antd';
import {hot} from 'react-hot-loader';
import moment from 'moment/moment';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

import './style.less';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';


class Class extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch, location, location: {state = {}}, history} = this.props;
    //判断是否是后退 设置条件参数值
    if (location.search || state.__back) {
      dispatch({type: 'welfareRecords/setTabCondition', payload: location.search, index: 3});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'welfareRecords/resetTabCondition', index: 3});
    }

    this.secondPath = window.__themeKey === 'org' ? 'hr' : 'spring';

    this.tableColumns = [
      {
        title: '发放时间',
        dataIndex: 'createtime',
        align: 'center',
        width: 280,
        render: text => text,
      },
      {
        title: '发放总金额(元)',
        dataIndex: 'chargeSumMoney',
        align: 'center',
        width: 280,
        render: text => Tools.getViewPrice(text),
      },
      {
        title: '操作',
        key: 'option',
        align: 'center',
        width: 180,
        render: (txt, data) => (<a
          onClick={() => RH(history, 'welfareRecordDetail', `/${window.__themeKey}/${this.secondPath}/welfareRecordDetail/2/${data.id}`)}
        >发放清单</a>),
      },
    ];

    this.state = {};
  }

  componentDidMount() {
    this.onSearch();
  }

  onSearch() {
    const {dispatch} = this.props;
    return dispatch({type: 'welfareRecords/getTab3Data', payload: {}});
  }

  render() {
    const {dispatch, welfareRecords: {tab3 = {}}} = this.props;

    const {condition} = tab3;

    return (
      <div className={cn('tab', 'tab3')}>
        <div className={cn('pcr-condition')}>
          <span>发放时间： </span>
          <RangePicker
            format={dateFormat}
            placeholder={['开始时间', '结束时间']}
            value={[
              condition.createTimeStart ? moment(condition.createTimeStart, dateFormat) : undefined,
              condition.createTimeEnd ? moment(condition.createTimeEnd, dateFormat) : undefined,
            ]}
            onChange={(date, dateStr) => {
              dispatch({
                type: 'welfareRecords/setTabCondition',
                payload: {createTimeStart: dateStr[0], createTimeEnd: dateStr[1]},
                index: 3,
              });
            }}
          />
          <Button
            style={{marginLeft: '30px', width: 80}}
            type="primary"
            onClick={() => {
              dispatch({type: 'welfareRecords/setTabCondition', payload: {pageIndex: 1}, index: 3});
              this.onSearch();
            }}
          >查询</Button>
        </div>

        <Table
          bordered
          loading={tab3.isLoad}
          dataSource={tab3.list}
          pagination={false}
          rowKey={(item, index) => `${item ? item.id : 'cell'}-${index}`}
          columns={this.tableColumns}
          scroll={{x: [0, ...this.tableColumns].reduce((total, item) => (total + (item.width || 0)))}}
        />

        <div className={cn('footer-pagination-placeholder')} style={{height: 72}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${tab3.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'welfareRecords/setTabCondition', payload: {pageSize, pageIndex: 1}, index: 3});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'welfareRecords/setTabCondition', payload: {pageIndex}, index: 3});
                  this.onSearch();
                }}
                current={tab3.condition.pageIndex}
                pageSize={tab3.condition.pageSize}
                total={tab3.totalCount}
              />
            </div>
          </Affix>
        </div>
      </div>
    );
  }
}


export default hot(module)(Class);
