import React from 'react';
import { connect } from 'dva';
import cn from 'classnames';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import './style.less';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import { Affix } from 'antd';
import HeaderView from './header-view';
import TableView from './table-view';

class TaxSendRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.unlisten = props.history.listen((e) => {
      if (e.pathname === `/${window.__themeKey}/salary/taxSendRecord`) {
        const params = Tools.queryToParams(e.search);
        const o = this.getCurrentParams();
        this.getData({...o, ...params}); //查询
      }
    });
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'taxSendRecord/querySendRecord',
    //   payload: {
    //     pageIndex: 1,
    //     pageSize: 10,
    //   },
    // });
    const {dispatch, location, location: {state = {}}} = this.props;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      dispatch({type: 'taxSendRecord/setCondition', payload: searchParams});
    } else {
      //空的
      dispatch({type: 'taxSendRecord/resetCondition'});
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

    RH(history, 'taxSendRecord', `/${window.__themeKey}/salary/taxSendRecord`, {search: q, replace: true});
  }

  getData(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'taxSendRecord/querySendRecord',
      payload: {
        ...params,
      },
    });
  }

  //获取redux中的的参数
  getCurrentParams() {
    const {taxSendRecord} = this.props;
    const o = {...taxSendRecord.condition};
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
    const { taxSendRecord, dispatch, history } = this.props;
    const headerViewProps = {
      ...taxSendRecord,
      dispatch,
      onSearch: this.onSearch.bind(this),
    };

    const tableViewProps = {
      ...taxSendRecord,
      dispatch,
      history,
      onSearch: this.onSearch.bind(this),
    };

    return (
      <GContainer className={cn('home-view')}>
        <GHeader
          route={[
            {name: '首页', path: `/${window.__themeKey}/dashboard`},
            {name: '发放记录'},
          ]}
        />
        <GPage className={'taxSendRecord'}>
          <div style={{height: 91}}>
            <Affix offsetTop={46 + 46}>
              <HeaderView {...headerViewProps}/>
            </Affix>
          </div>

          <TableView {...tableViewProps}/>
        </GPage>
      </GContainer>
    );
  }
}

export default connect(({taxSendRecord}) => ({taxSendRecord}))(TaxSendRecord);
