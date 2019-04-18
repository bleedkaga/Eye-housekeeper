import React from 'react';
import { connect } from 'dva';
import {
  Table,
  Pagination, Affix,
} from 'antd';
import { hot } from 'react-hot-loader';
import cn from 'classnames';
import GTitle from 'client/components/GTitle';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import { GContainer, GHeader, GPage } from 'client/components/GLayout';
import Moment from 'moment';


class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrHidden: '',
    };
    this.columnsHave = [
      { title: '状态',
        align: 'center',
        dataIndex: 'statusDesc',
        render: (statusDesc) => {
          if (statusDesc === '未完成') {
            return <div style={{ color: '#FFBE4D' }}>未完成</div>;
          } else {
            return <div >已完成</div>;
          }
        },
      },
      { title: '入账时间',
        align: 'center',
        dataIndex: 'createtime',
        render: createtime => Moment(createtime).format('YYYY-MM-DD HH:mm:ss'),
      },
      { title: '收款主体', align: 'center', dataIndex: 'collectionSubject'},
      { title: '订单流水', align: 'center', dataIndex: 'orderWater'},
      { title: '资金流水', align: 'center', dataIndex: 'capitalFlow'},
      { title: '财务类型', align: 'center', dataIndex: 'financialTypeDesc'},
      { title: '入账类型', align: 'center', dataIndex: 'entryTypeDesc' },
      { title: '打款渠道', align: 'center', dataIndex: 'channelDesc'},
      { title: '入账金额（元）',
        align: 'center',
        dataIndex: 'creditAmount',
        key: '6',
        render: (text, item) => {
          if (item.entryTypeDesc === '收入') {
            return <div style={{ color: '#32B16C' }}>{Tools.getViewPrice(text, '', false, 2, ',', '.')}</div>;
          } else if (item.entryTypeDesc === '支出') {
            return <div style={{ color: '#FF4D4F' }}>-{Tools.getViewPrice(text, '', false, 2, ',', '.')}</div>;
          }
        },
      },
    ];
    this.columnsNo = [
      { title: '入账时间',
        align: 'center',
        dataIndex: 'createtime',
        render: createtime => Moment(createtime).format('YYYY-MM-DD HH:mm:ss'),
      },
      { title: '收款主体', align: 'center', dataIndex: 'collectionSubject'},
      { title: '订单流水', align: 'center', dataIndex: 'orderWater'},
      { title: '资金流水', align: 'center', dataIndex: 'capitalFlow'},
      { title: '财务类型', align: 'center', dataIndex: 'financialTypeDesc'},
      { title: '入账类型', align: 'center', dataIndex: 'entryTypeDesc' },
      { title: '打款渠道', align: 'center', dataIndex: 'channelDesc'},
      { title: '入账金额（元）',
        align: 'center',
        dataIndex: 'creditAmount',
        key: '6',
        render: (text, item) => {
          if (item.entryTypeDesc === '收入') {
            return <div style={{ color: '#32B16C' }}>{Tools.getViewPrice(text, '', false, 2, ',', '.')}</div>;
          } else if (item.entryTypeDesc === '支出') {
            return <div style={{ color: '#FF4D4F' }}>-{Tools.getViewPrice(text, '', false, 2, ',', '.')}</div>;
          }
        },
      },
    ];
    this.unlisten = props.history.listen((e) => {
      if (e.pathname === `/${window.__themeKey}/cloud/assetStreamPersonalDetail`) {
        const params = Tools.queryToParams(e.search);
        const o = this.getCurrentParams();
        this.getData({ ...o, ...params }); //查询
      }
    });
  }

  componentDidMount() {
    const { dispatch, location, location: { state = {} } } = this.props;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.setState({
        showOrHidden: searchParams.type,
      });
      this.paramsInit(searchParams);
      dispatch({ type: 'assetStream/setParamDetail', payload: searchParams });
    } else {
      //空的
      dispatch({ type: 'assetStream/setParamDetail' });
    }
    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
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

  onSearch() {
    const { history } = this.props;
    const o = this.getCurrentParams();

    const q = Tools.paramsToQuery(o);

    RH(history, 'cloud/assetStreamPersonalDetail', `/${window.__themeKey}/cloud/assetStreamPersonalDetail`, { search: q, replace: true });
  }

  //获取redux中的的参数
  getCurrentParams() {
    const { assetStream } = this.props;
    const o = { ...assetStream.paramDetail };
    //这里可以做一些特殊操作
    return o;
  }

  getData(params) {
    const { dispatch, global } = this.props;
    const { companyId } = global.account;
    dispatch({ type: 'assetStream/originPullDetail', payload: { ...params, moneyId: companyId } });
  }

  handleClose() {
    const { history, assetStream} = this.props;
    RH(history, 'cloud/assetStream', `/${window.__themeKey}/cloud/assetStream`, {search: assetStream.urlSuffix});
  }

  render() {
    const { assetStream, dispatch } = this.props;
    const {showOrHidden} = this.state;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '资金流水明细'},
        ]}
      />
      <GPage>
        <GTitle onClose={() => this.handleClose()}>资金流水明细</GTitle>
        <div style={{padding: '0 34px'}}>
          {
            showOrHidden === '1' ?
              assetStream && assetStream.personalDetailList && assetStream.personalDetailList.data &&
              (<p
                style={{
                  fontSize: '14px',
                  margin: '24px 0 16px 0',
                  fontWeight: '600',
                }}
              >
              支出总金额：{Tools.getViewPrice(assetStream.personalDetailList.data.statistics.totalAmount, '', false, 2, ',', '.')}元，
              总人数：{assetStream.personalDetailList.data.statistics.total}人,
              待入账 ：{assetStream.personalDetailList.data.statistics.unAccountEntry}笔，
              已入账 ：{assetStream.personalDetailList.data.statistics.accountEntry}笔
              </p>) :
              assetStream && assetStream.personalDetailList && assetStream.personalDetailList.data &&
              (<p
                style={{
                  fontSize: '14px',
                  margin: '24px 0 16px 0',
                  fontWeight: '600',
                }}
              >
              支出总金额：{Tools.getViewPrice(assetStream.personalDetailList.data.statistics.totalAmount, '', false, 2, ',', '.')}元，
              总人数：{assetStream.personalDetailList.data.statistics.total}人
              </p>)

          }

          {
            assetStream && assetStream.personalDetailList && assetStream.personalDetailList.data &&
              <Table
                // style={{marginTop: '24px'}}
                bordered
                rowKey="id"
                columns={assetStream.personalDetailList.data.list && typeof (assetStream.personalDetailList.data.list[0].status) === 'number' ? this.columnsHave : this.columnsNo}
                dataSource={assetStream.personalDetailList.data.list}
                pagination={false}
              />
          }
          <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
            <Affix offsetBottom={0}>
              <div className={cn('footer-pagination', 'clearfix')}>
                <Pagination
                  style={{margin: ' 10px 16px 30px 16px', float: 'right'}}
                  current={assetStream.personalDetailList.pageIndex}
                  total={assetStream.personalDetailList.totalCount}
                  pageSize={assetStream.personalDetailList.pageSize}
                  showQuickJumper
                  showSizeChanger
                  pageSizeOptions={['10', '20', '30', '40', '50']}
                  onChange={(i, c) => {
                    dispatch({
                      type: 'assetStream/setParamDetail',
                      payload: {pageIndex: i, pageSize: c},
                    });
                    setTimeout(() => {
                      this.onSearch();
                    }, 16);
                  }
            }
                  onShowSizeChange={(i, c) => {
                    dispatch({
                      type: 'assetStream/setParamDetail',
                      payload: {pageIndex: i, pageSize: c},
                    });
                    setTimeout(() => {
                      this.onSearch();
                    }, 16);
                  }
            }
                  showTotal={() => (
                    `共${assetStream.personalDetailList.totalCount}条数据`
                  )}
                />
              </div>
            </Affix>
          </div>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
