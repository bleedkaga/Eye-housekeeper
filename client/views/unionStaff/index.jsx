import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Table, Popconfirm, Modal, Form, Select, Spin, Affix, Pagination, message} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
// import BIcon from 'client/components/BIconfont';
import {StaffState} from 'client/utils/enums';
// import SearchForm from './components/SearchForm';
// import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
// import PM from 'client/utils/pageManage';
import SearchForm from 'client/views/staff/components/SearchForm';
import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      transferUnionUserName: '', //转会用户名
      transferUnionId: '', //转会Id
    };
    const {dispatch, location, location: {state = {}}} = this.props;

    if (location.search || state.__back) {
      dispatch({type: 'unionStaff/setCondition', payload: location.search });
    } else {
      dispatch({type: 'unionStaff/resetCondition'});
      dispatch({type: 'unionStaff/set', payload: {loadMore: false}});
    }

    this.columns = [
      {
        title: '工号',
        dataIndex: 'workNumber',
        className: 'center',
        width: 100,
        fixed: 'left',
        render: text => <div title={text} className={'f-toe'} style={{width: 100}}>{text}</div>,
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        className: 'center-line',
        width: 100,
        fixed: 'left',
        render: (text, item) => (
          <a
            href={'javascript:;'}
            style={{ color: ' #CFA972'}}
            onClick={() => {
              RH(props.history, 'editStaff', `/union/editStaff/${item.id}`, {state: {name: item.userName}});
            }}
          >
            {item.userName}
          </a>
        ),
      },
      {
        title: '联系电话',
        dataIndex: 'mobilePhone',
        className: 'center',
        width: 150,
      },
      {
        title: '所属部门',
        dataIndex: 'department',
        className: 'center',
        w: 200,
        render: text => (<div
          title={text}
          className={'f-toe'}
          style={{maxWidth: 200 - 34, margin: 'auto'}}
        >{text}</div>),
      },
      {
        title: '岗位',
        dataIndex: 'job',
        className: 'center',
        w: 200,
        render: text => <div title={text} className={'f-toe'} style={{maxWidth: 200 - 34, margin: 'auto'}}>{text}</div>,
      },
      {
        title: '职务',
        dataIndex: 'position',
        className: 'center',
        w: 200,
        render: text => <div title={text} className={'f-toe'} style={{maxWidth: 200 - 34, margin: 'auto'}}>{text}</div>,
      },
      {
        title: '职级',
        dataIndex: 'rank',
        className: 'center',
        w: 200,
        render: text => <div title={text} className={'f-toe'} style={{maxWidth: 200 - 34, margin: 'auto'}}>{text}</div>,
      },

      {
        title: '状态',
        dataIndex: 'staffState',
        className: 'center',
        width: 100,
        render: (text, record) => this.renderState(record.staffState),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        fixed: 'right',
        className: 'center-leave',
        render: (text, record) => { // eslint-disable-line
          if (record.staffState === StaffState.toBeAudited) {
            return '';
          }
          const title = `您确认要【${record.userName}】离会吗？`;
          return (<div className={'operation-container'}>
            <a onClick={() => this.handleTransferUnionModal(record)} style={{color: '#CFA972'}}>转会</a>
            <Popconfirm
              title={title}
              onConfirm={() => this.handleLeaveUnion(record)}
              okText="确认"
              cancelText="取消"
            >
              <a style={{color: '#FF6767'}}>离会</a>
            </Popconfirm>
          </div>);
        },
      },
    ];
    //状态
    this.renderState = (value) => {
      if (value === StaffState.normal) {
        return <span>正常</span>;
      } else if (value === StaffState.toBeAudited) {
        return <span className={'fail'}>待审核</span>;
      } else if (value === StaffState.unActive) {
        return <span className={'gray'}>未激活</span>;
      }
    };
  }


  componentDidMount() {
    const {dispatch, global} = this.props;


    this.onSearch();

    //基础查询--选择部门
    dispatch({ type: 'unionStaff/queryDepartment', payload: { deptId: global.account.deptIds, companyGroupId: global.account.companyId } }); //ok
  }


  onSearch() {
    this.props.dispatch({type: 'unionStaff/queryUserStatus', payload: {}});
  }


  //显示转会模态框
  handleTransferUnionModal(record) {
    this.setState({
      visible: true,
      transferUnionUserName: record.userName || '',
      transferUnionId: record.id || '',
    });
  }

  //取消模态框
  handleCancel() {
    this.setState({ visible: false });
  }

  //离会
  handleLeaveUnion(record) {
    const {dispatch, global} = this.props;
    dispatch({
      type: 'unionStaff/leaveOperation',
      payload: {
        id: record.id,
        companyId: global.account.companyId, //ok
        operationName: global.account.realName, //ok
        operationId: global.account.accountId, //ok
      },
      callback: (res) => {
        if (res.code === 0) {
          message.success(`工会会员【${record.userName}】已成功离会`);
          setTimeout(() => {
            this.onSearch();
          }, 16);
        }
      },
    });
  }

  //查询
  handleSubmit(values) {
    const {dispatch} = this.props;
    dispatch({ type: 'unionStaff/setCondition', payload: {...values, pageIndex: 1} });
    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  //下载会员信息表
  downloadStaffInfo() {
    const {dispatch, global} = this.props;
    dispatch({ type: 'unionStaff/getExportMember', payload: { companyId: global.account.companyId, identityId: 1 } });
  }

  //搜索单位改变事件
  handleChange(value) {
    const {dispatch} = this.props;
    if (value.length >= 2) {
      dispatch({
        type: 'unionStaff/findCompanyNameList',
        payload: { companyName: value, companyGroupStatus: 2, pageCount: 10 },
      });
    } else {
      // 重置搜索结果
      dispatch({ type: 'unionStaff/set', payload: { unionData: [] } });
    }
  }

  changeSelectName(value) {
    this.selectCompanyName = value;
  }

  //转会操作
  handleOk() {
    const {unionStaff, dispatch, global} = this.props;
    const selectCompany = unionStaff.unionData.filter(i => i.companyName === this.selectCompanyName)[0] || {};
    const {transferUnionId, transferUnionUserName} = this.state;
    if (!selectCompany.companyId) {
      return message.warning('没有找到该工会');
    }
    dispatch({
      type: 'unionStaff/transferOperation',
      payload: {
        id: transferUnionId,
        companyId: global.account.companyId, //ok
        acceptCompanyId: selectCompany.companyId,
        operationName: global.account.realName, //ok
        operationId: global.account.accountId, //ok
      },
      callback: (res) => {
        if (res.code === 0) {
          this.setState({ visible: false });
          message.success(`工会会员【${transferUnionUserName}】已成功转会到【${selectCompany.companyName}】`);
          setTimeout(() => {
            this.onSearch();
          }, 16);
        }
      },
    });
    this.selectCompanyName = '';
  }

  render() {
    const {unionStaff, dispatch, global, history} = this.props;
    const {visible, transferUnionUserName} = this.state;
    let count = 0;
    this.columns.forEach(o => (count += (o.w ? (o.w + 32) : o.width) || 0));
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '会员管理'},
        ]}
      />
      <GPage className={'unionStaff-container'}>
        <div style={{padding: '0 25px'}}>
          <div className={'btn-box clearfix'}>
            <Button className={'btn btn-staff btn-color'} onClick={() => this.downloadStaffInfo()} >导出会员信息表</Button>
          </div>
          <div className={'content-box'}>
            <SearchForm
              ref={e => (this._searchForm = e)}
              dispatch={dispatch}
              showType={false}
              staff={unionStaff}
              dispatchKey={'unionStaff'}
              global={global}
              leaveStaff={false}
              history={history}
              handleSelect={values => this.handleSubmit(values)}

            />
            <Table
              dataSource={unionStaff.userList}
              columns={this.columns}
              bordered
              scroll={{ x: count }}
              pagination={false}
              loading={unionStaff.isLoad}
            />
          </div>
          {/**分页 */}
          <div className={cn('footer-pagination-placeholder')} style={{height: '60px'}}>

            <Affix offsetBottom={0}>
              <div className={cn('footer-pagination')} >
                <Pagination
                  pageSizeOptions={['10', '20', '30', '40', '50']}
                  showTotal={() => `共${unionStaff.totalCount}条数据`}
                  showSizeChanger
                  onShowSizeChange={(current, pageSize) => {
                    dispatch({type: 'unionStaff/setCondition', payload: {pageSize, pageIndex: 1}});
                    setTimeout(() => {
                      this.onSearch();
                    }, 16);
                  }}
                  showQuickJumper
                  onChange={(pageIndex) => {
                    dispatch({type: 'unionStaff/setCondition', payload: {pageIndex}});
                    setTimeout(() => {
                      this.onSearch();
                    }, 16);
                  }}
                  current={unionStaff.condition.pageIndex}
                  pageSize={unionStaff.condition.pageSize}
                  total={unionStaff.totalCount}
                />
              </div>
            </Affix>
          </div>
          {/**转会 */}
          <Modal
            title={<span >转会</span>}
            visible={visible}
      // visible
            destroyOnClose
            onCancel={() => this.handleCancel()}
            footer=""
            className={'transfer-model'}
          >

            <div className={'model-content-box'}>
              <p className={'text-box'}>
                {`将【${transferUnionUserName}】转会到以下工会`}
              </p>
              <span style={{color: '#666666', marginRight: 10, fontFamily: 'MicrosoftYaHei'}}>工会名称:</span>
              <Select
                autoFocus
                allowClear
                mode="combobox"
                placeholder="工会名称"
                notFoundContent={unionStaff.isLoad ? <Spin size="small" /> : '没有工会数据'}
                filterOption={false}
                onSearch={value => this.handleChange(value)}
                onChange={value => this.changeSelectName(value)}
                onSelect={value => this.changeSelectName(value)}
                className={'select-union'}
              >
                {unionStaff.unionData.map(d => <Select.Option key={d.companyName}>{d.companyName}</Select.Option>)}

              </Select>
            </div>
            <div className={'btnModel-box'}>
              <Button type="primary" onClick={() => this.handleOk()}>确认</Button>
              <Button onClick={() => this.handleCancel()} style={{marginLeft: 33}}>取消</Button>
            </div>
          </Modal>
        </div>

      </GPage>
    </GContainer>);
  }
}

const Form2 = Form.create()(Class);

export default connect(state => state)(hot(module)(Form2));

