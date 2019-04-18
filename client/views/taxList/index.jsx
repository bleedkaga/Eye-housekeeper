import React from 'react';
import './style.less';
import { connect } from 'dva';
import cn from 'classnames';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import HeaderView from './header-view';
import TableView from './table-view';
import { Affix } from 'antd';

class TaxList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.unlisten = props.history.listen((e) => {
      if (e.pathname === `/${window.__themeKey}/salary/taxList`) {
        const params = Tools.queryToParams(e.search);
        const o = this.getCurrentParams();
        this.getData({...o, ...params}); //查询
      }
    });
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'taxList/queryPersonList',
    //   payload: {
    //     type: 0,
    //     pageIndex: 1,
    //     pageSize: 10,
    //   },
    // });
    const {dispatch, location, location: {state = {}}} = this.props;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      dispatch({type: 'taxList/setCondition', payload: searchParams});
    } else {
      //空的
      dispatch({type: 'taxList/resetCondition'});
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

    RH(history, 'taxList', `/${window.__themeKey}/salary/taxList`, {search: q, replace: true});
  }

  getData(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'taxList/queryPersonList',
      payload: {
        ...params,
      },
    });
  }

  //获取redux中的的参数
  getCurrentParams() {
    const {taxList} = this.props;
    const o = {...taxList.condition};
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
    const { taxList, global, dispatch } = this.props;
    const headerViewProps = {
      dispatch,
      ...taxList,
      companyId: global.account.companyId, //ok
      onSearch: this.onSearch.bind(this),
    };

    const tableViewProps = {
      ...taxList,
      dispatch,
      onSearch: this.onSearch.bind(this),
    };

    return (
      <GContainer className={cn('home-view')}>
        <GHeader
          route={[
            {name: '首页', path: `/${window.__themeKey}/dashboard`},
            {name: '众包名单'},
          ]}
        />
        <GPage className={cn('taxList')}>

          <div style={{height: 113}}>
            <Affix offsetTop={46 + 46}>
              <div style={{width: '100%'}}>
                <HeaderView {...headerViewProps}/>
              </div>
            </Affix>
          </div>

          <TableView {...tableViewProps}/>
        </GPage>
      </GContainer>
    );
  }
}

export default connect(({taxList, global}) => ({taxList, global}))(TaxList);
