import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Table, Input, Pagination, Modal, Affix} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
// import {formatMoney, accMul} from 'client/utils/formatData';
import RH from '../../routeHelper';
import GTitle from 'client/components/GTitle';
// import RH from '../../routeHelper';
// import Upload from 'client/components/Upload';
// import AjaxMap from 'client/services/public';
// import Payment from 'client/components/Payment';
import Tools from 'client/utils/tools';
import moment from 'moment';


import './style.less';

const Search = Input.Search;

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deptName: '',
      pageIndex: 1,
      pageSize: 10,
      // 详情模态框数据参数
      detailPageIndex: 1,
      detailPageSize: 5,
      detailModalVisible: false,
      moneyId: null, //查询每一项详情的时候需要用到的数据
    };
  }

  componentDidMount() {
    const {dispatch, location, location: {state = {}}} = this.props;
    const {deptName, pageIndex, pageSize} = this.state;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      dispatch({
        type: 'transferStatistics/queryAssociatedUnitIssueBalance',
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
        type: 'transferStatistics/queryAssociatedUnitIssueBalance',
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
      RH(history, 'transferStatistics', `/${window.__themeKey}/hr/coupons/transferStatistics`, {
        search: q,
        replace: true,
      });
    } else {
      RH(history, 'transferStatistics', `/${window.__themeKey}/spring/coupons/transferStatistics`, {
        search: q,
        replace: true,
      });
    }
  }

  // componentWillReceiveProps(){
  // }

  render() {
    const {history, transferStatistics, dispatch} = this.props;

    const columns = [
      {
        title: '序',
        align: 'center',
        dataIndex: 'index',
      },
      {
        title: '单位名称',
        align: 'center',
        dataIndex: 'moneyName',
      },
      {
        title: '发放总额度（元）',
        align: 'center',
        dataIndex: 'quotaRechargeTotalAmount',
        render: text =>
          // formatMoney(accMul(text, 0.01)); 原來的带有￥的
          Tools.getViewPrice(text, ''),
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (<a
          href="javascript:void(0)"
          onClick={() => {
            this.setState({
              moneyId: record.moneyId,
            });
            dispatch({
              type: 'transferStatistics/getReleaseDetailedData',
              payload: {
                pageIndex: this.state.detailPageIndex,
                pageSize: this.state.detailPageSize,
                acceptId: record.moneyId,
                __autoLoading: true,
              },
            });
            this.setState({
              detailModalVisible: true,
            });
            // console.log("发放清单", record);
            // this.fetchGetReleaseDetailedData({ acceptId: record.moneyId });
          }}
        >
          发放清单
        </a>),
      },
    ];
    //详情页面的行参数
    const detailColumns = [
      {
        title: '序',
        align: 'center',
        dataIndex: 'index',
        width: 120,
      },
      {
        title: '时间',
        align: 'center',
        dataIndex: 'createtime',
        width: 240,
        render: text => moment(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '发放额度（元）',
        align: 'center',
        dataIndex: 'quotaBalance',
        width: 240,
        render: text => Tools.getViewPrice(text, ''),
      },
    ];

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '弹性福利', path: `/${window.__themeKey}/hr/coupons`},
          {name: '单位福利转账统计'},
        ]}
      />

      <GPage>
        <div className={cn('transferStatistics')}>
          <Modal
            className={cn('transfer-statistics-modal')}
            footer={false}
            title={'发放清单'}
            width={'660px'}
            visible={this.state.detailModalVisible}
            onCancel={
              () => {
                this.setState({
                  detailModalVisible: false,
                  detailPageIndex: 1,
                  detailPageSize: 5,
                });
                dispatch({
                  type: 'transferStatistics/set',
                  payload: {
                    detailDataSource: [], //详情页面的数据
                    detailTotalCount: 0, //详情页总数据
                  },
                });
              }
            }
          >
            <Table
              bordered
              columns={detailColumns}
              dataSource={transferStatistics.detailDataSource}
              rowKey={'index'}
              pagination={false}
              defaultExpandAllRows
            />
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${transferStatistics.detailTotalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  this.setState({
                    detailPageIndex: 1,
                    detailPageSize: pageSize,
                  }, () => {
                    dispatch({
                      type: 'transferStatistics/getReleaseDetailedData',
                      payload: {
                        pageIndex: this.state.detailPageIndex,
                        pageSize: this.state.detailPageSize,
                        acceptId: this.state.moneyId,
                        __autoLoading: true,
                      },
                    });
                  });
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  this.setState({
                    detailPageIndex: pageIndex,
                  }, () => {
                    dispatch({
                      type: 'transferStatistics/getReleaseDetailedData',
                      payload: {
                        pageIndex: this.state.detailPageIndex,
                        pageSize: this.state.detailPageSize,
                        acceptId: this.state.moneyId,
                        __autoLoading: true,
                      },
                    });
                  });
                }}
                current={this.state.detailPageIndex}
                pageSize={this.state.detailPageSize}
                total={transferStatistics.detailTotalCount}
              />
            </div>
          </Modal>
          <GTitle>各单位福利转账统计</GTitle>
          <div>
            <div className={cn('search')}>
              <Search
                style={{height: '32px'}}
                placeholder={'请输入单位名称'}
                enterButton={'查询'}
                onSearch={(value) => {
                  // console.log("搜索", value)
                  this.setState({
                    deptName: value,
                  }, () => {
                    const {deptName, pageSize} = this.state;
                    dispatch({
                      type: 'transferStatistics/queryAssociatedUnitIssueBalance',
                      payload: {
                        deptName,
                        pageIndex: 1,
                        pageSize,
                      },
                    });
                  });
                  this.setState({
                    pageIndex: 1,
                  });
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
                  dataSource={transferStatistics.dataSource}
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
                      showTotal={() => `共${transferStatistics.totalCount}条数据`}
                      showSizeChanger
                      onShowSizeChange={(current, pageSize) => {
                        this.setState({
                          pageIndex: 1,
                          pageSize,
                        }, () => {
                          dispatch({
                            type: 'transferStatistics/queryAssociatedUnitIssueBalance',
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
                      showQuickJumper
                      onChange={(pageIndex) => {
                        this.setState({
                          pageIndex,
                        }, () => {
                          dispatch({
                            type: 'transferStatistics/queryAssociatedUnitIssueBalance',
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
                      total={transferStatistics.totalCount}
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
