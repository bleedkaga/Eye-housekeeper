import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Table, Pagination, Button, Affix, Popconfirm, Icon} from 'antd';

import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import ChoosePerson from 'client/components/ChoosePerson';
import BIconfont from 'client/components/BIconfont';
import MashUpInput from 'client/components/MashUpInput';

import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);
    const {global} = props;

    //删除
    this.del = (o, index) => (
      <Popconfirm
        title={'你确定取消管理员吗？'}
        icon={<Icon type="info-circle" style={{color: 'red', fontSize: '15px'}} theme="filled"/>}
        onConfirm={() => {
          const {dispatch, global: g} = this.props;
          dispatch({
            type: 'administrator/deleteAccountById',
            payload: {
              index,
              id: o.id,
              operationer: `${g.account.companyId}_${g.account.realName}`,
            },
          });
        }}
      >
        <a href="javascript:">移除管理员</a>
      </Popconfirm>
    );

    this.tableColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        key: 'realName',
      },
      {
        title: '手机号',
        key: 'phone',
        dataIndex: 'phone',
      },
      {
        title: '身份',
        key: 'isMaster',
        dataIndex: 'isMaster',
        render: v => (v === 1 ?
          <span style={{color: '#333'}}>超级管理员</span> :
          <span style={{color: '#999'}}>普通管理员</span>),
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (e, item, index) => {
          if (global.account.accountId === item.id) { //ok
            return (
              <div className={cn('operation-btns')}>
                <a href="javascript:" onClick={() => this._cp.onShow()}>移交超级管理员</a>
              </div>
            );
          }

          //TODO 这个判断先这样
          if (global.account.isMaster === 1) {
            //当前用户是超级管理员
            return (
              <div className={cn('operation-btns', 'operation-btns2')}>
                <a
                  href="javascript:"
                  className={cn('green')}
                  onClick={() => {
                    RH(props.history, 'editAdmin', `/${window.__themeKey}/editAdmin/${item.id}`);
                  }}
                >编辑</a>
                {this.del(item, index)}
              </div>
            );
          } else {
            //当前用户是普通管理员
            return (
              <div className={cn('operation-btns')}>
                <a
                  href="javascript:"
                  className={cn('green')}
                  onClick={() => {
                    RH(props.history, 'editAdmin', `/${window.__themeKey}/editAdmin/${item.id}`);
                  }}
                >编辑</a>
                {this.del(item, index)}
              </div>
            );
          }
        },
      },
    ];

    this.unlisten = props.history.listen((e) => {
      if (e.pathname === `/${window.__themeKey}/administrator`) {
        const params = Tools.queryToParams(e.search);
        const o = this.getCurrentParams();
        this.getData({...o, ...params}); //查询
      }
    });
    this.state = {};
  }

  componentDidMount() {
    const {dispatch, location, location: {state = {}}} = this.props;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      dispatch({type: 'administrator/setCondition', payload: searchParams});
    } else {
      //空的
      dispatch({type: 'administrator/resetCondition'});
    }

    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
  }

  // componentWillReceiveProps(){
  // }

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

  //获取redux中的的参数
  getCurrentParams() {
    const {administrator} = this.props;
    const o = {...administrator.condition};
    //这里可以做一些特殊操作
    return o;
  }

  onSearch() {
    const {history} = this.props;
    const o = this.getCurrentParams();

    const q = Tools.paramsToQuery(o);

    RH(history, 'administrator', `/${window.__themeKey}/administrator`, {search: q, replace: true});
  }

  getData(params) {
    const {dispatch, global} = this.props;
    const idType = window.__themeKey === 'org' ? 1 : 2;
    //管理员统一公司ID
    dispatch({type: 'administrator/get', payload: {...params, companyId: global.account.companyId, type: idType}}); //ok
  }

  render() {
    const {administrator, dispatch, history, global} = this.props;
    const {condition} = administrator;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '管理员设置'},
        ]}
      />
      <GPage className={cn('administrator')}>
        <div style={{height: 72}}>
          <Affix offsetTop={46 + 46}>
            <div className={cn('condition')}>
              <Button
                className={cn('add-admin')}
                type="primary"
                onClick={() => {
                  RH(history, 'addAdmin', `/${window.__themeKey}/addAdmin`);
                }}
              >
                <BIconfont
                  type="single-people"
                  className={'btn-icon'}
                  style={{fontSize: 20}}
                />
                新增管理员
              </Button>

              {/*<div className={cn('condition-input')}>
                <Input
                  placeholder={'请输入'}
                  value={condition.realName}
                  onChange={(e) => {
                    dispatch({type: 'administrator/setCondition', payload: {realName: e.target.value}});
                  }}
                  onPressEnter={() => {
                    dispatch({type: 'administrator/setCondition', payload: {pageIndex: 1}});
                    setTimeout(() => {
                      this.onSearch();
                    }, 16);
                  }}
                  addonAfter={<Button
                    type="primary"
                    onClick={() => {
                      dispatch({type: 'administrator/setCondition', payload: {pageIndex: 1}});
                      setTimeout(() => {
                        this.onSearch();
                      }, 16);
                    }}
                  >查询</Button>}
                />
              </div>*/}
              <MashUpInput
                width={250}
                height={34}
                value={condition.realName}
                onChange={(e) => {
                  dispatch({type: 'administrator/setCondition', payload: {realName: e.target.value}});
                }}
                onSearch={() => {
                  dispatch({type: 'administrator/setCondition', payload: {pageIndex: 1}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
              />
            </div>
          </Affix>
        </div>

        <Table
          bordered
          loading={administrator.isLoad}
          className={cn('components-table-demo-nested', 'goods-table')}
          rowKey={(item, index) => `${item.id}-${index}`}
          columns={this.tableColumns}
          dataSource={administrator.list}
          pagination={false}
        />

        <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${administrator.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'administrator/setCondition', payload: {pageSize, pageIndex: 1}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'administrator/setCondition', payload: {pageIndex}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
                current={administrator.condition.pageIndex}
                pageSize={administrator.condition.pageSize}
                total={administrator.totalCount}
              />
            </div>
          </Affix>
        </div>
      </GPage>
      <ChoosePerson
        ref={e => (this._cp = e)}
        show={false}
        currentPhone={global.account.phone}
        onChange={(pageIndex, demtNameOruserName, departmentCode, next) => {
          dispatch({
            type: 'administrator/queryManager',
            payload: {
              companyId: global.account.companyId,
              pageSize: 5, //固定为5
              demtNameOruserName,
              departmentCode,
              pageIndex,
            },
            callback: next,
          });
        }}
        getDepartment={(next) => {
          dispatch({
            type: 'administrator/queryDepartment',
            payload: {
              companyGroupId: global.account.companyId, //ok
            },
            callback: next,
          });
        }}
        onOk={(item) => {
          dispatch({
            type: 'administrator/handOverManager',
            payload: {
              companyId: global.account.companyId, //ok
              accountId: global.account.accountId, //ok
              operationerId: global.account.accountId, //ok
              operationer: `${global.account.accountId}_${global.account.realName}`, //ok
              newName: item.userName,
              newPhone: item.mobilePhone,
            },
            callback: (res) => {
              if (res.code === 0) {
                Tools.logout('移交成功，登出中...');
              }
            },
          });
        }}
      />
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
