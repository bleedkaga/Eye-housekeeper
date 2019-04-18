import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Table, DatePicker, Input, Button, Pagination, Affix} from 'antd';
import moment from 'moment';

import {GContainer, GHeader, GPage} from 'client/components/GLayout';

import './style.less';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';


class Class extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch, location, location: {state = {}}} = this.props;
    //判断是否是后退 设置条件参数值
    if (location.search || state.__back) {
      //是后退, -------------- 注意这里的other是你们需要添加的额外参数，预防多种情况
      dispatch({type: 'listTable/setCondition', payload: location.search, other: {a: 1}});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'listTable/resetCondition'});
    }

    this.tableColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '名称',
        dataIndex: 'userName',
        key: 'userName',
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
    this.props.dispatch({type: 'listTable/getData', payload: {}});
  }

  render() {
    const {listTable, dispatch} = this.props;
    const {condition} = listTable;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '当前页面'},
        ]}
      />
      <GPage style={{padding: 30}}>
        <span style={{color: 'var(--default-color)'}}>首页</span>
        <RangePicker
          format={dateFormat}
          placeholder={['开始时间', '结束时间']}
          value={[
            condition.startTime ? moment(condition.startTime, dateFormat) : undefined,
            condition.endTime ? moment(condition.endTime, dateFormat) : undefined,
          ]}
          onChange={(date, dateStr) => {
            dispatch({type: 'listTable/setCondition', payload: {startTime: dateStr[0], endTime: dateStr[1]}});
          }}
        />

        <Input
          placeholder={'文本关键字'}
          value={condition.keywords}
          onChange={(e) => {
            dispatch({type: 'listTable/setCondition', payload: {keywords: e.target.value}});
          }}
        />

        <Button
          type={'primary'}
          onClick={() => {
            dispatch({type: 'listTable/setCondition', payload: {pageIndex: 1}});
            this.onSearch();
          }}
        >
          查询
        </Button>

        <Table
          loading={listTable.isLoad}
          className={cn('components-table-demo-nested', 'goods-table')}
          rowKey={(item, index) => `${item.id}-${index}`}
          columns={this.tableColumns}
          dataSource={listTable.list}
          pagination={false}
        />

        {/*页脚Affix有个BUG，解决这个BUG需要这个页脚占位符需要和真正footer-pagination一样高（72px就是footer-pagination的高）*/}
        <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${listTable.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'listTable/setCondition', payload: {pageSize, pageIndex: 1}});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'listTable/setCondition', payload: {pageIndex}});
                  this.onSearch();
                }}
                current={listTable.condition.pageIndex}
                pageSize={listTable.condition.pageSize}
                total={listTable.totalCount}
              />
            </div>
          </Affix>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
