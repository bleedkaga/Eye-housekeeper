import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Table, Input, Pagination, Affix} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
// import { formatMoney, accMul } from 'client/utils/formatData';
import RH from '../../routeHelper';
import GTitle from 'client/components/GTitle';
// import RH from '../../routeHelper';
// import Upload from 'client/components/Upload';
// import AjaxMap from 'client/services/public';
// import Payment from 'client/components/Payment';
import Tools from 'client/utils/tools';


import './style.less';

const Search = Input.Search;

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deptName: '',
      pageIndex: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    const {dispatch, location, location: {state = {}}} = this.props;
    const {deptName, pageIndex, pageSize} = this.state;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      dispatch({
        type: 'quotaBalance/quotaAllowanceDepartment',
        payload: {
          deptName: searchParams.deptName || '',
          pageIndex: searchParams.pageIndex,
          pageSize: searchParams.pageSize,
          __autoLoading: true,
        },
      });
      this.setState({
        deptName: searchParams.deptName || '',
        pageIndex: searchParams.pageIndex,
        pageSize: searchParams.pageSize,
      });
    } else {
      dispatch({
        type: 'quotaBalance/quotaAllowanceDepartment',
        payload: {
          deptName,
          pageIndex,
          pageSize,
          __autoLoading: true,
        },
      });
    }
    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  componentWillUnmount() {
  }

  paramsInit(params) {
    Object.keys(params).forEach((k) => {
      if (['pageIndex', 'pageSize'].indexOf(k) !== -1) {
        params[k] = parseInt(params[k], 10);
        if (isNaN(params[k])) { //eslint-disable-line
          delete params[k];
        }
      }
    });
  }

  getCurrentParams() {
    const o = {
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize,
      deptName: this.state.deptName,
    };
    //这里可以做一些特殊操作
    return o;
  }

  onSearch() {
    const {history} = this.props;
    const o = this.getCurrentParams();
    const q = Tools.paramsToQuery(o);
    if (window.__themeKey === 'org') {
      RH(history, 'quotaBalance', `/${window.__themeKey}/hr/coupons/quotaBalance`, {search: q, replace: true});
    } else {
      RH(history, 'quotaBalance', `/${window.__themeKey}/spring/coupons/quotaBalance`, {search: q, replace: true});
    }
  }
  // componentWillReceiveProps(){
  // }

  render() {
    const {quotaBalance, dispatch} = this.props;
    const columns = [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'index',
      },
      {
        title: '部门名称',
        align: 'center',
        dataIndex: 'deptName',
      },
      {
        title: '配发总额度（元）',
        align: 'center',
        dataIndex: 'quotaRechargeTotalAmount',
        render(text) {
          return Tools.getViewPrice(text, '');
        },
      },
      {
        title: '未使用额度（元）',
        align: 'center',
        dataIndex: 'quotaBalance',
        render(text) {
          return Tools.getViewPrice(text, '');
        },
      },
    ];

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '弹性福利', path: `/${window.__themeKey}/hr/coupons`},
          {name: '配额余量'},
        ]}
      />

      <GPage>
        <div className={cn('quotaBalance')}>
          <GTitle>各部门配额余量</GTitle>
          <div>
            <div className={cn('search')}>
              <Search
                style={{height: '32px'}}
                placeholder={'请输入部门名称'}
                enterButton={'查询'}
                onSearch={(value) => {
                  // console.log("搜索", value)
                  this.setState({
                    deptName: value,
                  }, () => {
                    const {deptName, pageSize} = this.state;
                    dispatch({
                      type: 'quotaBalance/quotaAllowanceDepartment',
                      payload: {
                        deptName,
                        pageIndex: 1,
                        pageSize,
                      },
                    });
                  });
                  this.setState({
                    pageIndex: 1,
                  })
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
              />
            </div>
            <div className={cn('table-style')}>
              <div className={cn('table-1')}>
                <Table
                  columns={columns}
                  dataSource={quotaBalance.dataSource}
                  rowKey={'index'}
                  pagination={false}
                  defaultExpandAllRows
                />
              </div>
              <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
                <Affix offsetBottom={0}>
                  <div className={cn('footer-pagination')}>
                    <Pagination
                      pageSizeOptions={['10', '20', '30', '40', '50']}
                      showTotal={() => `共${quotaBalance.totalCount}条数据`}
                      showSizeChanger
                      onShowSizeChange={(current, pageSize) => {
                        this.setState({
                          pageIndex: 1,
                          pageSize,
                        }, () => {
                          dispatch({
                            type: 'quotaBalance/quotaAllowanceDepartment',
                            payload: {
                              deptName: this.state.deptName,
                              pageIndex: this.state.pageIndex,
                              pageSize: this.state.pageSize,
                              __autoLoading: true,
                            },
                          });
                        });
                      }}
                      showQuickJumper
                      onChange={(pageIndex) => {
                        this.setState({
                          pageIndex,
                        }, () => {
                          dispatch({
                            type: 'quotaBalance/quotaAllowanceDepartment',
                            payload: {
                              deptName: this.state.deptName,
                              pageIndex: this.state.pageIndex,
                              pageSize: this.state.pageSize,
                              __autoLoading: true,
                            },
                          });
                        });
                        setTimeout(() => {
                          this.onSearch();
                        }, 16);
                      }}
                      current={this.state.pageIndex}
                      pageSize={this.state.pageSize}
                      total={quotaBalance.totalCount}
                    />
                  </div>
                </Affix>
              </div>
            </div>
          </div>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
