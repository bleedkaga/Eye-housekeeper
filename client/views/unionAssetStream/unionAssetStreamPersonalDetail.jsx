import React from 'react';
import { connect } from 'dva';
// import {Switch} from 'dva/router';
// import {renderRoutes} from 'react-router-config';
import {
  Table,
  Pagination, Affix,
} from 'antd';
import { hot } from 'react-hot-loader';
import cn from 'classnames';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import { GContainer, GHeader, GPage } from 'client/components/GLayout';
import Moment from 'moment';
import GTitle from 'client/components/GTitle';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    //   flage: false,
    };
    this.columns = [
      // { title: '状态',
      //   align: 'center',
      //   dataIndex: 'statusDesc',
      //   render: (statusDesc) => {
      //     if (statusDesc === '未完成') {
      //       return <div style={{ color: '#FFBE4D' }}>未完成</div>;
      //     } else {
      //       return <div >已完成</div>;
      //     }
      //   },
      // },
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
      // console.log(e, 'eeeeeeeeeeeeeeee');
      if (e.pathname === `/${window.__themeKey}/cloud/unionAssetStreamPersonalDetail`) {
        const params = Tools.queryToParams(e.search);
        const o = this.getCurrentParams();
        this.getData({ ...o, ...params }); //查询
      }
    });
  }

  componentDidMount() {
    const { dispatch, location, location: { state = {} } } = this.props;
    // console.log(this.props, 'this.props;this.props<<<<<;');
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      // console.log(searchParams, '赚的参数。。');
      this.paramsInit(searchParams);
      dispatch({ type: 'unionAssetStream/setParamDetail', payload: searchParams });
    } else {
      //空的
      dispatch({ type: 'unionAssetStream/setParamDetail' });
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

    RH(history, 'cloud/unionAssetStreamPersonalDetail', `/${window.__themeKey}/cloud/unionAssetStreamPersonalDetail`, { search: q, replace: true });
  }

  //获取redux中的的参数
  getCurrentParams() {
    const { unionAssetStream } = this.props;
    const o = { ...unionAssetStream.paramDetail };
    //这里可以做一些特殊操作
    return o;
  }

  getData(params) {
    const { dispatch, global } = this.props;
    const { groupId } = global.account;//ok

    dispatch({ type: 'unionAssetStream/originPullDetail', payload: { ...params, moneyId: groupId } }); //ok
  }

  handleClose() {
    const { history, unionAssetStream} = this.props;
    // console.log(this.props, 'MMMMMMM888');
    RH(history, 'cloud/unionAssetStream', `/${window.__themeKey}/cloud/unionAssetStream`, {search: unionAssetStream.urlSuffix, replace: true});
  }

  render() {
    const { unionAssetStream, dispatch } = this.props;
    // const { paramCash } = unionAssetStream;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '工会资金流水明细'},
        ]}
      />
      <GPage>
        <GTitle onClose={() => this.handleClose()}>资金流水明细</GTitle>
        <div style={{padding: '0 34px'}}>
          {/* <div style={{position: 'relative'}}>
          <p style={{
            display: 'block',
            height: '58px',
            padding: '21px 0 20px 0',
            fontSize: '17px',
            lineHeight: '17px',
            textAlign: 'center',
            color: '#333',
            fontWeight: '600',
            borderBottom: '1px solid #E5E5E5',
          }}
          >
        资金流水明细</p>
          <Icon
            type="close"
            style={{fontSize: '17px', position: 'absolute', top: '21px', right: '26px', cursor: 'pointer'}}
            onClick={() => this.handleClose()}
          />
        </div> */}
          {unionAssetStream && unionAssetStream.listOfDetail && unionAssetStream.listOfDetail.data &&
          <p
            style={{height: '13px', lineHeight: '13px', fontSize: '13px', margin: '24px 16px 16px 0', fontWeight: '600'}}
          >支出总金额：{Tools.getViewPrice(unionAssetStream.listOfDetail.data.statistics.totalAmount, '', false, 2, ',', '.')}元，
          总人数：{unionAssetStream.listOfDetail.data.statistics.total}人
          </p>
        }

          {unionAssetStream && unionAssetStream.listOfDetail && unionAssetStream.listOfDetail.data &&
          <Table
            // style={{padding: '0 16px'}}
            bordered
            rowKey="id"
            columns={this.columns}
            dataSource={unionAssetStream.listOfDetail.data.list}
            pagination={false}
          />
              }
          <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
            <Affix offsetBottom={0}>
              <div className={cn('footer-pagination', 'clearfix')}>
                <Pagination
                  style={{ margin: ' 10px 16px 30px 16px', float: 'right' }}
                  current={unionAssetStream.listOfDetail.pageIndex}
                  total={unionAssetStream.listOfDetail.totalCount}
                  pageSize={unionAssetStream.listOfDetail.pageSize}
                  showQuickJumper
                  showSizeChanger
                  pageSizeOptions={['10', '20', '30', '40', '50']}
                  onChange={(i, c) => {
                    dispatch({
                      type: 'unionAssetStream/setParamDetail',
                      payload: { pageIndex: i, pageSize: c },
                    });
                    setTimeout(() => {
                      this.onSearch();
                    }, 16);
                  }
              }
                  onShowSizeChange={(i, c) => {
                    dispatch({
                      type: 'unionAssetStream/setParamDetail',
                      payload: { pageIndex: i, pageSize: c },
                    });
                    setTimeout(() => {
                      this.onSearch();
                    }, 16);
                  }
              }
                  showTotal={() => (
                    `共${unionAssetStream.listOfDetail.totalCount}条数据`
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
