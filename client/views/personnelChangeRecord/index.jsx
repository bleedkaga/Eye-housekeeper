import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Table, DatePicker, Pagination, Button, Affix} from 'antd';
import moment from 'moment';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Tools from 'client/utils/tools';
import GTitle from 'client/components/GTitle';
import './style.less';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';


class Class extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch, location, location: {state = {}}} = this.props;
    //判断是否是后退 设置条件参数值
    if (location.search || state.__back) {
      dispatch({type: 'personnelChangeRecord/setCondition', payload: location.search});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'personnelChangeRecord/resetCondition'});
    }

    this.tableColumns = [
      {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: v => Tools.formatDatetime(v, undefined, 1),
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '证件号码',
        dataIndex: 'certificateCode',
        key: 'certificateCode',
      },
      {
        title: '手机号',
        key: 'mobilePhone',
        dataIndex: 'mobilePhone',
      },
      {
        title: '变更操作',
        key: 'statusRedundancy',
        dataIndex: 'statusRedundancy',
        render: v => (v === '入职' ? <span style={{color: '#666'}}>{v}</span> : <span style={{color: '#999'}}>{v}</span>),
      },
      {
        title: '操作人',
        key: 'operation',
        dataIndex: 'operation',
        render: (v) => {
          if (v) return v.split('_')[1] || '-';
          return '-';
        },
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
    dispatch({type: 'personnelChangeRecord/get', payload: {}});
  }

  render() {
    const {personnelChangeRecord, dispatch} = this.props;
    const {condition} = personnelChangeRecord;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '人员变更记录'},
        ]}
      />
      <GPage className={cn('personnelChangeRecord')}>
        <GTitle>人员变更记录</GTitle>
        {/*<div className={cn('pcr-title')}>人员变更记录 <Icon type="close" className={cn('f-fr')}/></div>*/}
        {/*46 + 46 是导航条高 + 面包屑的高*/}
        <div style={{height: 72}}>
          <Affix offsetTop={46 + 46}>
            <div className={cn('pcr-condition')}>
              <RangePicker
                format={dateFormat}
                placeholder={['开始时间', '结束时间']}
                value={[
                  condition.startTime ? moment(condition.startTime, dateFormat) : undefined,
                  condition.endTime ? moment(condition.endTime, dateFormat) : undefined,
                ]}
                onChange={(date, dateStr) => {
                  dispatch({
                    type: 'personnelChangeRecord/setCondition',
                    payload: {startTime: dateStr[0], endTime: dateStr[1]},
                  });
                }}
              />
              <Button
                style={{marginLeft: '17px', width: 80}}
                type="primary"
                onClick={() => {
                  dispatch({type: 'personnelChangeRecord/setCondition', payload: {pageIndex: 1}});
                  this.onSearch();
                }}
              >查询</Button>
            </div>
          </Affix>
        </div>
        <div style={{padding: '0 30px'}}>
          <Table
            bordered
            loading={personnelChangeRecord.isLoad}
            className={cn('components-table-demo-nested', 'goods-table')}
            rowKey={(item, index) => `${item.id}-${index}`}
            columns={this.tableColumns}
            dataSource={personnelChangeRecord.list}
            pagination={false}
          />
        </div>
        {/*页脚Affix有个BUG，解决这个BUG需要这个页脚占位符需要和真正footer-pagination一样高（72px就是footer-pagination的高）*/}
        <div className={cn('footer-pagination-placeholder')} style={{height: 72}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${personnelChangeRecord.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'personnelChangeRecord/setCondition', payload: {pageSize, pageIndex: 1}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'personnelChangeRecord/setCondition', payload: {pageIndex}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
                current={personnelChangeRecord.condition.pageIndex}
                pageSize={personnelChangeRecord.condition.pageSize}
                total={personnelChangeRecord.totalCount}
              />
            </div>
          </Affix>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
