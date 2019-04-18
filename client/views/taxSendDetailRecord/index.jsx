import React from 'react';
import './style.less';
import cn from 'classnames';
import { connect } from 'dva';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import GTitle from 'client/components/GTitle';
import TaxHeaderData from 'client/components/TaxHeaderData';
import TableViewFailed from 'client/components/TaxSendFailRecord';
import TableViewSuccessed from './table-view-successed';
import { Affix } from 'antd';

class TaxSendDetailRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { dispatch } = this.props;
    this.unlisten = props.history.listen((e) => {
      if (e.pathname === `/${window.__themeKey}/salary/taxSendDetailRecord`) {
        const params = Tools.queryToParams(e.search);
        const o = this.getCurrentParams();
        this.getData({...o, ...params}); //查询
        dispatch({
          type: 'taxSendDetailRecord/updateState',
          payload: {
            status: params.status,
            outTradeNo: params.outTradeNo,
            scheme: params.scheme,
          },
        });
      }
    });
  }

  componentDidMount() {
    const {dispatch, location, location: {state = {}}} = this.props;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      dispatch({type: 'taxSendDetailRecord/setCondition', payload: searchParams});
    } else {
      //空的
      dispatch({type: 'taxSendDetailRecord/resetCondition'});
    }

    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
  }

  onSearch() {
    const {history} = this.props;
    const o = this.getCurrentParams();

    const q = Tools.paramsToQuery(o);

    RH(history, 'taxSendDetailRecord', `/${window.__themeKey}/salary/taxSendDetailRecord`, {search: q, replace: true});
  }

  getData(params) {
    const { dispatch } = this.props;
    delete params.scheme;
    delete params.status;
    dispatch({
      type: 'taxSendDetailRecord/queryDetail',
      payload: {
        ...params,
      },
    });
  }

  //获取redux中的的参数
  getCurrentParams() {
    const {taxSendDetailRecord} = this.props;
    const o = {...taxSendDetailRecord.condition};
    //这里可以做一些特殊操作
    return o;
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

  render() {
    const { taxSendDetailRecord, dispatch, history } = this.props;
    const { status, scheme, outTradeNo } = taxSendDetailRecord;
    const tableViewProps = {
      dispatch,
      history,
      ...taxSendDetailRecord,
      onSearch: this.onSearch.bind(this),
    };

    const tableFailProps = {
      dispatch,
      history,
      ...taxSendDetailRecord,
      onSearch: (_data) => {
        dispatch({
          type: 'taxSendDetailRecord/setCondition',
          payload: {
            ..._data,
          },
        });
        setTimeout(() => {
          this.onSearch();
        }, 16);
      },
    };

    const taxHeaderData = {
      ...taxSendDetailRecord,
      hasExport: status === '8',
      exportClick: () => dispatch({
        type: 'taxSendRecord/downScheme',
        payload: {
          type: scheme === '1' ? 1 : 2,
          outTradeNo,
        },
      }),
      hidden_service_money: true
    };

    return (
      <GContainer className={cn('home-view')}>
        <GHeader
          route={[
            {name: '智能薪筹', path: `/${window.__themeKey}/salary/taskCenter`},
            {name: '发放记录', path: `/${window.__themeKey}/salary/taxSendRecord`},
            {name: '发放记录详情'},
          ]}
        />
        <GPage className={'taxSendDetailRecord'}>

          <div>
            <div style={{height: 62}}>
              <Affix offsetTop={46 + 46}>
                <GTitle
                  border
                  style={{backgroundColor: '#fff', height: '62px'}}
                >
                  {status !== '-2' ? '发放记录详情' : '继续执行'}
                </GTitle>
              </Affix>
            </div>
            <div className="send_record_detail_body">
              {status !== '-2' && <TaxHeaderData {...taxHeaderData}/>}
              {status !== '-2' ? <TableViewSuccessed {...tableViewProps}/> : <TableViewFailed {...tableFailProps}/>}
            </div>
          </div>
        </GPage>
      </GContainer>
    );
  }
}

export default connect(({taxSendDetailRecord}) => ({taxSendDetailRecord}))(TaxSendDetailRecord);
