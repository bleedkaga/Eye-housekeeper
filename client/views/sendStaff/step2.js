import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Table, Button, Icon, Popconfirm, Affix, message} from 'antd';
import SearchForm from 'client/views/staff/components/SearchForm';
import Tools from 'client/utils/tools';
import FormPwdModal from 'client/components/FormPwdModal';

import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // selectedRows: [], //当前选择的item
      // selectedRowKeys: [], //当前选择的itemKey
      visiblePwd: false, //添加支付密码
    };

    this.tableRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const {sendStaff, dispatch} = this.props;
        const {step2} = sendStaff;
        const list = sendStaff.userList || [];
        //先将当前页数据全删除
        const sr = step2.selectedRows.filter(item => !list.find(o => o.mappingId === item.mappingId));

        dispatch({
          type: 'sendStaff/setStep2',
          payload: {
            selectedRowKeys,
            selectedRows: sr.concat(selectedRows),
          },
        });
      },
      getCheckboxProps: record => ({
        disabled: record.disabled === true,
      }),
    };

    this.columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '联系电话',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
      },
      {
        title: '所属部门',
        dataIndex: 'department',
        key: 'department',
        render: t => (t || '-'),
      },
    ];

    this.columns2 = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (_, __, index) => index + 1,
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '联系电话',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
      },
      {
        title: '所属部门',
        dataIndex: 'department',
        key: 'department',
        render: t => (t || '-'),
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (_, item) => <a href="javascript:" onClick={() => this.cancelUser(item)}>删除</a>,
      },
    ];
  }

  componentDidMount() {
    const {dispatch, global} = this.props;
    const queue = [];
    queue.push(
      dispatch({
        type: 'sendStaff/queryDepartment',
        payload: {companyGroupId: global.account.companyId}, //部门查询不区分工会吧
      })
    );
    queue.push(this.getData());
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  cancelUser(item) {
    const {sendStaff: {step2: {selectedRows, selectedRowKeys}}} = this.props;
    const index = selectedRowKeys.findIndex(k => k === item.mappingId);
    selectedRowKeys.splice(index, 1);
    selectedRows.splice(index, 1);
    this.setState({});
  }

  cancelAllUser() {
    this.props.dispatch({
      type: 'sendStaff/setStep2',
      payload: {
        selectedRowKeys: [],
        selectedRows: [],
      },
    });
  }

  selectAllUser() {
    const {dispatch} = this.props;
    const params = this.getCondition();
    dispatch({
      type: 'sendStaff/getSelectedMember',
      payload: {...params},
      callback: (res) => {
        if (res.code === 0) {
          const list = res.data || [];
          const arr1 = []; //keys
          const arr2 = [];
          list.forEach((item) => {
            item.key = item.mappingId;
            arr1.push(item.mappingId);
            arr2.push(item);
          });

          dispatch({
            type: 'sendStaff/setStep2',
            payload: {
              selectedRowKeys: arr1,
              selectedRows: arr2,
            },
          });
        }
      },
    });
  }

  getCondition() {
    const {global, sendStaff: {condition}} = this.props;

    const params = {
      companyId: global.account.companyId, //查询工会会员不需要换成 groupId
      ...condition,
      type: condition.type === undefined || condition.type === '' ? 3 : condition.type, //查询带上 type 全部=3
      // type: 3, //发福利查询带上 type 固定=3
    };

    if (Array.isArray(params.operationlike)) {
      params.operationlike = params.operationlike.join('_');
    }

    if (window.__themeKey === 'union') {
      //工会需要带上 identityId 工会标识：1工会会员，2否工会会员
      params.identityId = 1;
    }
    //去掉 undefined
    Object.keys(params).forEach((k) => {
      params[k] = params[k] === undefined ? '' : params[k];
    });

    return params;
  }

  getData() {
    const params = this.getCondition();
    return this.props.dispatch({type: 'sendStaff/queryUserStatus', payload: {...params}});
  }

  handleSubmit = (values) => {
    // 处理身份标识
    const {dispatch} = this.props;
    dispatch({
      type: 'sendStaff/setCondition',
      payload: {...values, pageIndex: 1},
    });
    setTimeout(() => this.getData(), 16);
  };

  loadReasonsData = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendStaff/findSecondValList',
      payload: {
        dict_code: 'releaseReason',
        selectedOptions,
        end: selectedOptions.length === 2,
      },
    });
  };

  onNext() {
    const {dispatch, next, global, sendStaff: {step2: {selectedRows}}} = this.props;


    if (!selectedRows.length) {
      return message.error('请选择发送人员名单');
    }
    const arr = [];
    selectedRows.forEach((item) => {
      arr.push({id: item.mappingId, n: item.userName});
    });

    dispatch({
      type: 'sendStaff/sendType',
      payload: {
        sendMoneyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId, //ok
        accountId: global.account.accountId, //ok
        userJsonStr: JSON.stringify(arr),
      },
      callback: (res) => {
        if (res.code === 0) {
          next && next();
        } else if (res.message === '请先设置支付密码') {
          this.setState({visiblePwd: true});
        }
      },
    });
  }

  render() {
    const {history, sendStaff, dispatch, global, pwd} = this.props;

    const {step1, condition, step2: {selectedRows, selectedRowKeys}} = sendStaff;

    const amount = step1.amount || 0; //人均发放多钱

    return (<div className={'step2'}>
      <div className={cn('step2-condition')}>
        {/*TODO 这里的高级查询太麻烦，先用电子档案的用着*/}
        <SearchForm
          ref={e => (this._searchForm = e)}
          showType={false}
          dispatch={dispatch}
          staff={sendStaff}
          dispatchKey={'sendStaff'}
          leaveStaff={false}
          global={global}
          history={history}
          handleSelect={e => this.handleSubmit(e)}
        />
        <div className={cn('row')}>
          <div className={cn('col', 'col-top')}>
            <div className={cn('step2-left-table')}>
              <Table
                size={'small'}
                rowSelection={{...this.tableRowSelection, selectedRowKeys}}
                title={() => (<div className={cn('table-title', 'f-cb')}>
                  查询结果&nbsp;<i>（共{sendStaff.totalCount}名）</i>
                  <Button
                    onClick={() => this.selectAllUser()}
                    size="small"
                    className={cn('f-fr')}
                    disabled={!sendStaff.totalCount || selectedRows.length === sendStaff.totalCount}
                  >选择全部</Button>
                </div>)}
                rowKey={record => record.mappingId}
                dataSource={sendStaff.userList}
                columns={this.columns}
                bordered
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '40', '50'],
                  size: 'small',
                  total: sendStaff.totalCount,
                  pageSize: condition.pageSize,
                  current: condition.pageIndex,
                  showQuickJumper: true,
                  // showSizeChanger: true,
                  // showTotal: () => `共${sendStaff.totalCount}条`,
                  onShowSizeChange: (current, pageSize) => {
                    dispatch({type: 'sendStaff/setCondition', payload: {pageSize, pageIndex: 1}});
                    setTimeout(() => {
                      this.getData();
                    }, 16);
                  },
                  onChange: (pageIndex) => {
                    dispatch({type: 'sendStaff/setCondition', payload: {pageIndex}});
                    setTimeout(() => {
                      this.getData();
                    }, 16);
                  },
                }}
                loading={sendStaff.isLoadUser}
              />
            </div>
          </div>
          <div className={cn('col-center')}>
            <div className={cn('arrow')}><Icon type="arrow-right" style={{fontSize: 24, color: '#ccc'}}/></div>
          </div>
          <div className={cn('col', 'col-top')}>
            <Table
              className={cn('table2')}
              size={'small'}
              title={() => (<div className={cn('table-title', 'table-title2', 'f-cb')}>
                <i>已选&nbsp;{selectedRows.length}人</i>
                <Popconfirm title={<div style={{minWidth: 160}}>确定删除全部？</div>} onConfirm={() => this.cancelAllUser()}>
                  <Button disabled={!selectedRows.length} size="small" className={cn('f-fr')}>全部删除</Button>
                </Popconfirm>
              </div>)}
              rowKey={record => record.mappingId}
              dataSource={selectedRows}
              columns={this.columns2}
              bordered
              pagination={{
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                size: 'small',
                total: selectedRows.length,
                pageSize: condition.pageSize,
                showQuickJumper: true,
              }}
            />
          </div>
        </div>
      </div>
      <div className={cn('footer-block-zwf')}>
        <Affix offsetBottom={0}>
          <div className={cn('footer-block', 'f-cb')}>
            <div
              className={cn('f-fl')}
            >发放总额：<i>{Tools.getViewPrice(amount * selectedRows.length, undefined, true)} 元</i>
            </div>
            <Button
              loading={sendStaff.isLoad}
              className={cn('f-fr')}
              type={'primary'}
              onClick={() => this.onNext()}
            >下一步</Button>
            <Button className={cn('f-fr')} type={'gray'} onClick={() => this.props.prev()}>返回上一步</Button>
          </div>
        </Affix>
      </div>
      <FormPwdModal
        pwd={pwd}
        global={global}
        dispatch={dispatch}
        title={'设置支付密码'}
        wrappedComponentRef={e => (this._pwdForm = e)}
        visible={this.state.visiblePwd}
        onOk={() => {
          this.setState({visiblePwd: false});
          this.onNext();
        }}
        onCancel={() => {
          this.setState({visiblePwd: false});
        }}
      />
    </div>);
  }
}


export default connect(state => state)(hot(module)(Class));
