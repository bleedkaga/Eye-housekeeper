import React from 'react';
import cn from 'classnames';
import {Affix, Pagination} from 'antd';

export default class extends React.Component {
  paginationChange = (i, c) => {
    const { dispatch, onSearch} = this.props;
    dispatch({
      type: 'assetAccount/setParamCash',
      payload: { pageIndex: i, pageSize: c },
    });
    setTimeout(() => {
      onSearch && onSearch();
    }, 16);
  };

  render() {
    const { pageIndex, totalCount, pageSize} = this.props;
    return (
      <div className={cn('footer-pagination-placeholder')} style={{height: '72px', backgroundColor: '#fff'}}>
        <Affix offsetBottom={0}>
          <div className={cn('footer-pagination')}>
            <Pagination
              current={pageIndex}
              total={totalCount}
              pageSize={pageSize}
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['10', '20', '30', '40', '50']}
              onChange={(i, c) => this.paginationChange(i, c)}
              onShowSizeChange={(i, c) => this.paginationChange(i, c)}
              showTotal={() => (
                `共${totalCount || 0}条数据`
              )}
            />
          </div>
        </Affix>
      </div>
    );
  }
}
