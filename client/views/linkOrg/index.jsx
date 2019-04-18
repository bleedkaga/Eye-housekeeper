import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Table, Popconfirm} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import FormModal from 'client/components/FormModal';
import GTitle from 'client/components/GTitle';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      modal: {
        title: '标题', //弹窗的标题
        type: 1, //弹窗的类型
        obj: {}, //弹窗的对象
      },
    };

    this.columns = [
      {
        title: '单位名称',
        dataIndex: 'associatedName',
        key: 'associatedName',
      },
      {
        title: '社会统一信用代码/组织机构代码',
        dataIndex: 'creditCode',
        key: 'creditCode',
      },
      {
        title: '状态',
        dataIndex: 'statusRegister',
        key: 'statusRegister',
        render: (e, item) => {
          if (item.isAdd) {
            return '-';
          }
          return (
            <span>{item.statusRegister === '1' ? '已注册' : '未注册'}</span>
          );
        },
      },
      {
        title: '人员变更通知',
        dataIndex: 'userChangeInform',
        key: 'userChangeInform',
        render: (e, item) => {
          if (item.isAdd) {
            return '-';
          }
          return (
            <span>{item.userChangeInform === '1' ? '通知' : '不通知'}</span>
          );
        },
      },
      {
        title: '操作',
        key: 'operate',
        width: '20%',
        render: (e, item) => {
          if (item.isDef) return '-';
          return (<span>
            <a
              href="javascript:"
              className={cn('has-text')}
              style={{marginRight: 30}}
              onClick={() => this.onEdit(item)}
            >编辑</a>
            <Popconfirm title={<div style={{minWidth: 160}}>是否解除关联？</div>} onConfirm={() => this.onDelete(item)}>
              <a href="javascript:" className={cn('has-text')}>解除关联</a>
            </Popconfirm>
          </span>);
        },
      },
    ];
  }

  componentDidMount() {
    this.refresh();

    const {dispatch, global: {account: {groupId}}} = this.props; //ok

    if (groupId) { //ok
      dispatch({
        type: 'unionInfo/getGroupByIdDetailToCompany',
        payload: {groupId}, //ok
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'unionInfo/reset'});
  }

  // componentWillReceiveProps(){
  // }


  handleSubmit = (e) => {
    e.preventDefault();
    const form = this.formRef.props.form;
    const {modal} = this.state;
    const {dispatch, global} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const {item} = modal.obj;

        if (modal.obj.id) {
          //编辑
          dispatch({
            type: 'unionInfo/updateCompanyAssociated',
            payload: {
              id: modal.obj.id,
              companyGroupId: global.account.companyId, //ok
              modifier: `${global.account.accountId}_${global.account.realName}`, //ok
              companyType: modal.type, // 1表示工商，2表示非工商
              userChangeInform: values.notice,
              ...this.getSendData(item),
            },
            callback: (res) => {
              if (res.code === 0) {
                this.handleCancel();
                this.refresh();
              }
            },
          });
        } else {
          //新增
          dispatch({
            type: 'unionInfo/insertCompanyAssociated',
            payload: {
              companyGroupId: global.account.companyId, //ok
              operationer: `${global.account.accountId}_${global.account.realName}`, //ok
              status: 1, //1表示单位，2表示工会
              companyType: modal.type, // 1表示工商，2表示非工商
              userChangeInform: values.notice,
              ...this.getSendData(item),
            },
            callback: (res) => {
              if (res.code === 0) {
                this.handleCancel();
                this.refresh();
              }
            },
          });
        }
      }
      // form.resetFields();
    });
  };

  onDelete = (item) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'unionInfo/deleteCompanyAssociated',
      payload: {
        id: item.id,
      },
    });
  };

  onEdit = (item) => {
    this.formRef.props.form.resetFields();
    const type = parseInt(item.companyType, 10);
    const temp = {};
    if (type === 1) {
      //工商
      temp.companyId = item.associatedId || ''; //ok
      temp.KeyNo = item.keyNo;
      temp.Name = item.associatedName;
      temp.No = item.no;
    } else {
      //非工商
      temp.companyId = item.associatedId; //ok
      temp.companyName = item.associatedName; //ok
    }

    this.setState({
      visible: true,
      modal: {
        title: type === 1 ? '新增工商登记企业' : '新增非工商登记组织',
        type, //弹窗的类型
        obj: {
          id: item.id,
          item: temp,
          name: item.associatedName,
          notice: item.userChangeInform,
        }, //弹窗的对象
      },
    });
  };

  refresh() {
    const {dispatch, global} = this.props;
    dispatch({
      type: 'unionInfo/getCompanyAssociatedList',
      payload: {companyGroupId: global.account.companyId}, //ok
    });
  }

  handleCancel = () => {
    this.props.dispatch({type: 'unionInfo/set', payload: {modalList: []}});
    this.setState({visible: false});
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  onOpenType1() {
    this.formRef.props.form.resetFields();
    this.setState({
      visible: true,
      modal: {
        title: '新增工商登记企业', //弹窗的标题
        type: 1, //弹窗的类型
        obj: {}, //弹窗的对象
      },
    });
  }

  onOpenType2() {
    this.formRef.props.form.resetFields();
    this.setState({
      visible: true,
      modal: {
        title: '新增非工商登记组织', //弹窗的标题
        type: 2, //弹窗的类型
        obj: {}, //弹窗的对象
      },
    });
  }

  getSendData(item) {
    const opt = {
      associatedId: item.companyId || item.KeyNo, //ok
      associatedName: item.companyName || item.Name, //ok
    };
    if (item.KeyNo && item.No) {
      opt.keyNo = item.KeyNo;
      opt.no = item.No;
    }
    return opt;
  }

  render() {
    const {visible, modal} = this.state;
    const {unionInfo, dispatch, global} = this.props;

    const dataSourceList =
      unionInfo.groupAssociatedDef.id ? [unionInfo.groupAssociatedDef].concat(unionInfo.companyAssociatedList)
        : unionInfo.companyAssociatedList;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '组织结构', path: `/${window.__themeKey}/hr/depart`},
          {name: '关联单位'},
        ]}
      />
      <GPage className={cn('linkOrg')}>
        <GTitle>设置关联单位</GTitle>
        <div className={cn('linkOrg-tab')}>
          <div className={cn('top')}>
            <Button type={'primary'} onClick={() => this.onOpenType1()}>新增工商登记企业</Button>
            <Button className={cn('golden')} onClick={() => this.onOpenType2()}>新增非工商登记组织</Button>
          </div>
          <Table
            rowKey={record => record.id}
            dataSource={dataSourceList}
            columns={this.columns}
            bordered
            pagination={{
              pageSizeOptions: ['10', '20', '30', '40', '50'],
              total: dataSourceList.length,
              pageSize: unionInfo.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              current: unionInfo.pageIndex,
              showTotal: _total => `共${_total}条数据`,
              onChange: (pageIndex) => {
                dispatch({type: 'unionInfo/set', payload: {pageIndex}});
              },
              onShowSizeChange: (current, pageSize) => {
                dispatch({type: 'unionInfo/set', payload: {pageSize, pageIndex: 1}});
              },
            }}
            loading={unionInfo.isLoad}
          />
          <FormModal
            global={global}
            dispatch={dispatch}
            unionInfo={unionInfo}
            dispatchKey={'unionInfo'}
            companyGroupStatus={1}
            wrappedComponentRef={this.saveFormRef}
            visible={visible}
            type={modal.type}
            title={modal.title}
            obj={modal.obj}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
          />
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
