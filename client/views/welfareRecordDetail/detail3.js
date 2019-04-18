import React from 'react';
import cn from 'classnames';
import {Table, Pagination, Button, Affix, message} from 'antd';
import GTitle from 'client/components/GTitle';
import Tools from 'client/utils/tools';

import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);

    const {match: {params = {}}} = props;

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
        title: '单位名称',
        dataIndex: 'acceptName',
        align: 'center',
        width: 200,
        render: text => text,
      },
      {
        title: '发放金额(元)',
        dataIndex: 'quotaRechargeAmount',
        align: 'center',
        width: 160,
        render: text => Tools.getViewPrice(text),
      },
    ];

    this.state = {
      id: params.id || '',
    };
  }

  componentWillMount() {
    this.onSearch();
  }

  onSearch() {
    const {dispatch} = this.props;
    dispatch({type: 'welfareRecordDetail/getDetail3', payload: {recordId: this.state.id}});
  }


  onExport() {
    const {dispatch} = this.props;
    const {id} = this.state;
    const un = message.loading('加载中...', 15);
    dispatch({type: 'welfareRecordDetail/getExportUrl3', payload: {recordId: id}}).then((url) => {
      const timer = setTimeout(() => {
        un();
        clearTimeout(timer);
      }, 200);
      url && (window.location = url);
    });
  }

  render() {
    const {dispatch, welfareRecordDetail} = this.props;
    const {detail3} = welfareRecordDetail;

    return (<div className={cn('inner')}>
      <GTitle>发放清单</GTitle>
      <div className={cn('box')}>
        <div className={cn('extra', 'f-cb')} style={{paddingTop: 10}}>
          <Button className={cn('f-fr')} onClick={() => this.onExport()}>导出发放明细</Button>
        </div>
        <Table
          bordered
          loading={detail3.isLoad}
          dataSource={detail3.list}
          pagination={false}
          rowKey={(item, index) => `${item ? item.id : 'cell'}-${index}`}
          columns={this.columns}
        />
        <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                className="pagination"
                showTotal={() => `共${detail3.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'welfareRecordDetail/setDetail3', payload: {pageIndex: 1, pageSize}});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'welfareRecordDetail/setDetail3', payload: {pageIndex}});
                  this.onSearch();
                }}
                current={detail3.pageIndex}
                pageSize={detail3.pageSize}
                total={detail3.totalCount}
              />
            </div>
          </Affix>
        </div>
      </div>
    </div>);
  }
}

export default Class;
