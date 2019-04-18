import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Form, Table, Input, Affix, Pagination, TreeSelect, Icon, Popover} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import './style.less';

import GTitle from 'client/components/GTitle';

const FormItem = Form.Item;
class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    const {dispatch, location, location: {state = {}}, dispatchKey} = this.props;
    if (location.search || state.__back) {
      dispatch({type: `${dispatchKey}/setCondition`, payload: location.search });
    } else {
      dispatch({type: `${dispatchKey}/resetCondition`});
    }

    this.columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        className: 'center',
        width: 100,
        fixed: 'left',
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
        title: '离职前所属部门',
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
        title: '离职前岗位',
        dataIndex: 'job',
        className: 'center',
        w: 200,
        render: text => <div title={text} className={'f-toe'} style={{maxWidth: 200 - 34, margin: 'auto'}}>{text}</div>,
      },
      {
        title: '离职前职务',
        dataIndex: 'position',
        className: 'center',
        w: 200,
        render: text => <div title={text} className={'f-toe'} style={{maxWidth: 200 - 34, margin: 'auto'}}>{text}</div>,
      },
      {
        title: '离职前职级',
        dataIndex: 'rank',
        className: 'center',
        w: 200,
        render: text => <div title={text} className={'f-toe'} style={{maxWidth: 200 - 34, margin: 'auto'}}>{text}</div>,
      },

      {
        title: '离职原因',
        dataIndex: 'reasonLeaving',
        className: 'center',
        width: 250,
        fixed: 'right',
        render: (text, record) => this.reasonLeavingRender(record),

      },

    ];
  }

  static defaultProps = {
    dispatchKey: 'leaveStaff',
  };

  componentDidMount() {
    const {dispatch, dispatchKey, global} = this.props;
    this.onSearch();

    //基础查询--选择部门
    dispatch({ type: `${dispatchKey}/queryDepartment`, payload: { deptId: global.account.deptIds, companyGroupId: global.account.companyId } });
  }


  onSearch() {
    const {dispatch, dispatchKey, global} = this.props;
    dispatch({ type: `${dispatchKey}/checkOutResignationStaff`, payload: { companyId: global.account.companyId }});
  }


  reasonLeavingRender(record) {
    return (
      <div className={'leave-reason-box'}>
        <p style={{marginBottom: 0, border: 0}}>{record.resignationTypeDesc ? `[${record.resignationTypeDesc}]` : ''}</p>
        <Popover
          content={<div className={'leave-reason-content'} >{record.reasonLeaving ? `${record.reasonLeaving}` : ''}</div>}
          title="离职详细原因"
        >
          <p className={'leave-reason-text'}>{record.reasonLeaving ? `${record.reasonLeaving}` : ''}</p>
        </Popover>


      </div>
    );
  }

  //查询
  handleSelect() {
    const {dispatch, form, dispatchKey} = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return false;
      }
      //处理选择部门
      if (Array.isArray(values.departmentTree)) {
        values.depamtId = values.departmentTree[values.departmentTree.length - 1];
        delete values.departmentTree;
      }
      dispatch({ type: `${dispatchKey}/setCondition`, payload: {...values, pageIndex: 1} });
      setTimeout(() => {
        this.onSearch();
      }, 16);
    });
  }

  updateCondition(k, v) {
    const {dispatch, dispatchKey} = this.props;
    dispatch({type: `${dispatchKey}/setCondition`, payload: {[k]: v}});
  }

  render() {
    const {leaveStaff, dispatch, dispatchKey} = this.props;
    const {condition} = leaveStaff;
    const {getFieldDecorator} = this.props.form;
    let count = 0;
    this.columns.forEach(o => (count += (o.w ? (o.w + 32) : o.width) || 0));
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '电子档案', path: '/org/hr/staff'},
          {name: '离职人员'},
        ]}
      />
      <GPage className={'leave-staff-container'}>

        <GTitle>离职人员</GTitle>
        <div className={'content-box'}>
          <div className={'base-search-box clearfix'}>
            <Form className={'leave-staff-form'} layout={'inline'} onSubmit={(e) => { e.preventDefault(); this.handleSelect(); }}>
              <FormItem label="选择部门" >
                {getFieldDecorator('depamtId', {

                  rules: [],
                  initialValue: condition.depamtId || undefined,
                })(
                  <TreeSelect
                    allowClear
                    className={'cascader-primary'}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={leaveStaff.department}
                    placeholder={'请选择'}
                    treeDefaultExpandAll
                    onChange={(e, [department]) => {
                      dispatch({type: `${dispatchKey}/setDepartment`, payload: {department}});
                    }}
                  />
                )}
              </FormItem>
              <FormItem style={{float: 'right'}}>
                <div className={'condition-box'}>
                  {getFieldDecorator('condition', {
                    initialValue: condition.condition,

                  })(
                    <Input
                      placeholder="姓名、电话、证件号"
                      maxLength={20}
                      className={'condition-input'}
                      // suffix={condition.condition ? <span onClick={() => {
                      //   this.props.form.setFieldsValue({condition: ''});
                      // }}
                      // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                      onChange={(e) => {
                        this.updateCondition('condition', e.target.value);
                      }}
                      onPressEnter={e => this.props.handleSelect(e)}
                    />
                  )}

                  <Button
                    type="primary"
                    htmlType="submit"
                    className={'base-search-btn'}
                  >
          查询
                  </Button>

                </div>
              </FormItem>
            </Form>

          </div>
          <Table
            dataSource={leaveStaff.userLeaveList}
            columns={this.columns}
            bordered
            scroll={{ x: count }}
            pagination={false}
            loading={leaveStaff.isLoad}
          />
        </div>
        {/**分页 */}
        <div className={cn('footer-pagination-placeholder')} style={{height: '60px'}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${leaveStaff.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'leaveStaff/setCondition', payload: {pageSize, pageIndex: 1}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'leaveStaff/setCondition', payload: {pageIndex}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
                current={leaveStaff.condition.pageIndex}
                pageSize={leaveStaff.condition.pageSize}
                total={leaveStaff.totalCount}
              />
            </div>
          </Affix>
        </div>


      </GPage>
    </GContainer>);
  }
}
const Form2 = Form.create()(Class);

export default connect(state => state)(hot(module)(Form2));

