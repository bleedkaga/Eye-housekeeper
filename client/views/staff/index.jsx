import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Table, Popconfirm, Modal, Form, Select, Row, Col, Input, Affix, Pagination} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import BIcon from 'client/components/BIconfont';
import CheckModal from 'client/components/CheckModal';
import {StaffState, StaffAuditState} from 'client/utils/enums';
// import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
// import PM from 'client/utils/pageManage';

import SearchForm from './components/SearchForm';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const contentMaxLength = 120;//离职原因字数限制
class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUnionModal: false, //工会离职模态框
      showModal: false, //离职模态框
      selectedRows: [], //当前选择的item
      selectedRowKeys: [], //当前选择的itemKey
    };

    const {dispatch, location, location: {state = {}}} = this.props;

    if (location.search || state.__back) {
      dispatch({type: 'staff/setCondition', payload: location.search });
    } else {
      dispatch({type: 'staff/resetCondition'});
      dispatch({type: 'staff/set', payload: {loadMore: false}});
    }

    this.tableRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const list = this.props.staff.userList || [];
        //先将当前页数据全删除
        const sr = this.state.selectedRows.filter(item => !list.find(o => o.id === item.id));

        this.setState({
          selectedRowKeys,
          selectedRows: sr.concat(selectedRows),
        });
      },
      getCheckboxProps: record => ({
        disabled: record.disabled === true,
      }),
    };

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
            className={'f-toe'}
            title={item.userName}
            onClick={() => {
              RH(props.history, 'addStaff', `/org/hr/editStaff/${item.id}`, {state: {name: item.userName}});
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
        title: '证件号',
        dataIndex: 'certificateCode',
        className: 'center',
        width: 200,
      },
      {
        title: '所属部门',
        dataIndex: 'department',
        className: 'center',
        width: 150,
        render: text => (<div
          title={text}
          className={'f-toe'}
          style={{maxWidth: 150 - 34}}
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
        w: 150,
        render: text => <div title={text} className={'f-toe'} style={{maxWidth: 150 - 34, margin: 'auto'}}>{text}</div>,
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
        render: (text, record) => {
          const {staffState} = record;
          if (staffState === StaffState.toBeAudited) {
            const title = `您确认要不通过【${record.userName}】吗？`;
            return (
              <div>
                <Popconfirm
                  title={title}
                  onConfirm={() => this.handleUnAudit(record)
                  }
                  okText="确认"
                  cancelText="取消"
                >
                  <a>不通过</a>
                </Popconfirm>
                <a
                  href={'javascript:;'}
                  onClick={() => {
                    RH(props.history, 'addStaff', `/org/hr/editStaff/${record.id}`, {state: {name: record.userName}});
                  }}
                  style={{marginLeft: 12}}
                >
                  通过
                </a>
              </div>
            );
          } else {
            return (
              <a
                href="javascript:void(0)"
                onClick={() => this.seeModal(record)}
              >
                离职
              </a>
            );
          }
        },
      },
    ];
    //状态
    this.renderState = (values) => {
      if (values === StaffState.normal) {
        return <span>正常</span>;
      } else if (values === StaffState.toBeAudited) {
        return <span className={'fail'}>待审核</span>;
      } else if (values === StaffState.unActive) {
        return <span className={'gray'} >未激活</span>;
      }
    };
  }

  componentDidMount() {
    const {dispatch, global} = this.props;

    this.onSearch();

    //基础查询--选择部门
    dispatch({
      type: 'staff/queryDepartment',
      payload: {
        deptId: global.account.deptIds,
        companyGroupId: global.account.companyId, //ok
      },
    });
    //拉取离职原因
    const dictCodesArr = [
      'resignationType',
    ];
    dispatch({type: 'staff/initResignationType', payload: {dict_codes: dictCodesArr.join(',')}});
  }

  onSearch() {
    this.props.dispatch({type: 'staff/queryUserStatus', payload: {}});
  }

  //显示离职模态框
  seeModal(record) {
    const {dispatch} = this.props;

    if (record.identityId === 1) {
      this.setState({
        showUnionModal: true,
      });
      dispatch({type: 'staff/set', payload: {groupMemberLeave: {}}});
      dispatch({type: 'staff/set', payload: {groupMemberLeave: record}});
    } else {
      this.setState({showModal: true});
      dispatch({type: 'staff/set', payload: {groupMemberLeave: {}}});
      dispatch({type: 'staff/set', payload: {groupMemberLeave: record}});
    }
  }

  //关闭工会离职模态框
  closeUnionIcon() {
    this.setState({showUnionModal: false});
  }

  //关闭离职模态框
  closeIcon() {
    this.setState({showModal: false});
  }

  //查询
  handleSubmit(values) {
    const {dispatch} = this.props;
    dispatch({type: 'staff/setCondition', payload: {...values, pageIndex: 1}});
    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  //下载员工信息表
  downloadStaffInfo() {
    const {dispatch, global} = this.props;
    dispatch({type: 'staff/getExportMember', payload: {companyId: global.account.companyId}}); //ok
  }

  //认证审核不通过
  handleUnAudit(record) {
    const {dispatch, global} = this.props;
    dispatch({
      type: 'staff/approved',
      payload: {
        userIds: record.id,
        userName: record.userName,
        licenseNumber: record.certificateCode,
        phone: record.mobilePhone,
        auditStatus: StaffAuditState.unPass,
        operationName: global.account.realName, //ok
        operationId: global.account.accountId, //ok
      },
    });
  }

  //渲染离职原因
  renderOption = (field) => {
    const {staff} = this.props;
    const options = staff[field].map(item => (
      <Option key={item.value} value={item.value}>
        {item.label}
      </Option>
    ));

    return options;
  };

  // 会员离职例会转到离职模态框
  handleEdit() {
    this.setState({showUnionModal: false, showModal: true});
  }

  //会员跳转到工会，会员管理页面
  moveUnion() {
    const {history} = this.props;
    RH(history, 'unionStaff', '/union/unionStaff');
  }

  // 限制离职原因最大字数
  handleContentLength() {
    const {getFieldValue} = this.props.form;
    let ret = 0;
    const title = getFieldValue('reasonLeaving') === undefined ? '' : getFieldValue('reasonLeaving');
    if (title.length > contentMaxLength) {
      ret = 0;
    } else {
      ret = contentMaxLength - title.length;
    }
    return ret;
  }

  //离职提交
  handleLeaveSubmit() {
    const {form, dispatch, staff, global} = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      //离职原因
      dispatch({
        type: 'staff/userDeparture',
        payload: {
          id: staff.groupMemberLeave.id ? staff.groupMemberLeave.id : '',
          operationName: global.account.realName, //ok
          operationId: global.account.accountId, //ok
          resignationType: (values.resignationData && values.resignationData.key) ? values.resignationData.key : '',
          resignationTypeDesc: (values.resignationData && values.resignationData.label) ? values.resignationData.label : '',
          reasonLeaving: values.reasonLeaving ? values.reasonLeaving : '',
        },
      });
      this.setState({showModal: false});
    });
  }

  //跳转到新增成员
  addStaff() {
    const {history} = this.props;
    RH(history, 'addStaff', '/org/hr/addStaff');
  }

  //人事异动
  changeDepartment() {
    this.getQueryDepartment();
    this._cm.onReset();
    this._cm.onShow();
  }

  getQueryDepartment(demtName = '') {
    const {dispatch, global} = this.props;
    return dispatch({
      type: 'staff/pdtQueryDepartment',
      payload: {companyGroupId: global.account.companyId, demtName}, //ok
    });
  }

  onPDTComplete(department) {
    const {selectedRows} = this.state;
    const {dispatch, global} = this.props;
    const ids = selectedRows.map(item => item.id);
    dispatch({
      type: 'staff/personnelDepartmentTransfer',
      payload: {
        companyId: global.account.companyId, //ok
        userIds: ids.join(','),
        depatmentId: department.id,
        __autoLoading: true,
      },
      callback: (res) => {
        if (res.code === 0) {
          this.setState({selectedRows: [], selectedRowKeys: []}, () => {
            this.onSearch(); //刷新
          });
        }
      },
    });
  }

  render() {
    const {showUnionModal, showModal, selectedRows} = this.state;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {staff, dispatch, global, history} = this.props;

    let count = 0;
    this.columns.forEach(o => (count += (o.w ? (o.w + 32) : o.width) || 0));
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '电子档案'},
        ]}
      />
      <GPage className={'staff-container'}>
        <div style={{padding: '0 25px'}}>
          <div className={'btn-box'}>
            <Button type="primary" className={'btn'} onClick={() => this.addStaff()}>
              <BIcon
                type="single-people"
                className={'btn-icon'}
              /> 新增成员</Button>
            <Button
              className={'btn btn-color'}
              onClick={() => RH(history, 'importStaff', '/org/hr/importStaff')}
            ><BIcon
              type="mutl-people"
              className={'btn-icon'}
            />批量导入</Button>
            <Button
              className={'btn btn-color'}
              disabled={!selectedRows.length}
              onClick={() => this.changeDepartment()}
            >
              <BIcon type="renshiyidong" className={'btn-icon'}/>人事异动
            </Button>
            <Button className={'btn btn-color'} disabled>邀请成员</Button>
            <Button className={'btn btn-staff btn-color'} onClick={() => this.downloadStaffInfo()}>导出员工信息表</Button>
          </div>
          <div className={'content-box'}>
            <SearchForm
              ref={e => (this._searchForm = e)}
              dispatch={dispatch}
              staff={staff}
              global={global}
              history={history}
              handleSelect={(values) => { this.handleSubmit(values); }}
            />
            <Table
              dataSource={staff.userList}
              columns={this.columns}
              bordered
              scroll={{x: count}}
              rowSelection={{...this.tableRowSelection, selectedRowKeys: this.state.selectedRowKeys}}
              pagination={false}
              loading={staff.isLoad}
            />
          </div>
        </div>
        {/**分页 */}
        <div className={cn('footer-pagination-placeholder')} style={{height: '60px'}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${staff.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'staff/setCondition', payload: {pageSize, pageIndex: 1}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'staff/setCondition', payload: {pageIndex}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
                current={staff.condition.pageIndex}
                pageSize={staff.condition.pageSize}
                total={staff.totalCount}
              />
            </div>
          </Affix>
        </div>
        <Modal
          title={
            <span style={{fontSize: 18}}>
          离职员工
            </span>
          }
          visible={showUnionModal}
          className={'model-leave'}
          closable
          destroyOnClose
          onCancel={() => this.closeUnionIcon()}
          footer=""
        >
          <div className={'leave-info-dis'}>
            <p>
              <span>
                {staff.groupMemberLeave.userName}

                是工会会员，请先进行转会操作，
              </span>
              <span>
            如直接离职，该人员将会自动离会。
              </span>
            </p>


          </div>
          <div className={'union-leave-btn-box'}>

            <Button
              key="move"
              className={'btn-modal'}
              onClick={() => this.moveUnion()}
              type="primary"
            >
              转会
            </Button>


            <Button
              key="submit"
              className={'btn-modal btn-leave-union'}
              onClick={() => this.handleEdit()}
            >
              离职离会
            </Button>
            <Button
              key="back"
              className={'btn-modal btn-cancel-leave'}
              onClick={() => this.closeUnionIcon()}
            >
              取消
            </Button>
          </div>
        </Modal>
        {/**填写信息模态框 */}
        <Modal
          title={
            <span>
              离职员工
            </span>
          }
          className={'model-leave-two'}
          visible={showModal}
          closable
          onCancel={() => this.closeIcon()}
          destroyOnClose
          footer=""
        >
          <div className={'zhu'}>
            <p>注：离职原因会保存入员工电子档案中，并采用区块链加密技术，一经填写，无法修改，请谨慎填写。</p>
          </div>
          <Form
            layout={'inline'}
            className={'leave-modal-form'}
            onSubmit={e => this.handleLeaveSubmit(e.preventDefault())}
          >
            <Row>
              <Col>
                <FormItem label="离职原因">
                  {getFieldDecorator('resignationData', {
                    rules: [
                      {
                        required: true, message: '填写原因',
                      }],
                  })(
                    <Select
                      placeholder="请选择"
                      labelInValue
                      className={'leave-reason-select'}
                      allowClear
                    >
                      {this.renderOption('resignationType')}
                    </Select>
                  )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem style={{marginLeft: 80}}>
                  {getFieldDecorator('reasonLeaving', {})(
                    <TextArea
                      placeholder="请输入详细原因(120字以内)"
                      maxLength={contentMaxLength}
                      className={'reason-leaving-input'}
                    />
                  )}
                  <div className={'text-number'}>
                    <span
                      style={{color: (getFieldValue('reasonLeaving') && getFieldValue('reasonLeaving').length >= contentMaxLength) ? '#FF4D4F' : '#32B16C'}}
                    >{this.handleContentLength()}</span>/120
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className={'btn-box'}>
                  <Button htmlType="submit" type="primary" className={'btn-modal'}>
                    确定
                  </Button>
                  <Button className={'btn-modal btn-cancel-leave'} onClick={() => this.closeIcon()}>
                    取消
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
      </GPage>

      <CheckModal
        multiple={false}
        ref={e => (this._cm = e)}
        show={false}
        departmentName={global.account.companyName}
        placeholder={'输入部门名称'}
        list={staff.pdtDepartment}
        checked={[]}
        onSearch={(name) => {
          this.getQueryDepartment(name);
        }}
        onOk={(data = []) => {
          this.onPDTComplete(data[0]);
        }}
      />
    </GContainer>);
  }
}

const Form2 = Form.create()(Class);

export default connect(state => state)(hot(module)(Form2));

