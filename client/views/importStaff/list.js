/* eslint-disable react/no-multi-comp */
import React from 'react';
import cn from 'classnames';
import {connect} from 'dva';
import {hot} from 'react-hot-loader';
import {Table, Pagination, Affix, Divider, Input, message, Button} from 'antd';
import {ImportState} from 'client/utils/enums';
import Tool from 'client/utils/tools';
import './style.less';


const EditableRow = props => (<tr {...props} />);

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {className, onClick, children, editing, dataIndex, item} = this.props;
    if (editing) {
      item[`_${dataIndex}`] = item[dataIndex];
      return (<td className={className} onClick={onClick}><Input
        defaultValue={item[dataIndex]}
        onChange={(e) => {
          item[`_${dataIndex}`] = e.target.value;
        }}
      /></td>);
    } else {
      return (<td className={className} onClick={onClick}>{children}</td>);
    }
  }
}

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.tableColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (e, o, index) => index + 1,
      },
      {
        title: '导入状态',
        dataIndex: 'state',
        key: 'state',
        render: (state) => {
          if (state === ImportState.success) {
            return <div style={{color: '#32B16C', minWidth: '100px'}}>导入成功</div>;
          } else if (state === ImportState.fail) {
            return <div style={{color: '#FF4D4F', minWidth: '100px'}}>导入失败</div>;
          } else {
            return <div style={{color: '#FEAE22', minWidth: '100px'}}>待导入</div>;
          }
        },
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        editable: true,
        onCell: (item, rowIndex) => ({
          item,
          rowIndex,
          dataIndex: 'userName',
          editing: this.isEditing(item),
        }),
      },
      {
        title: '联系电话',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
        onCell: (item, rowIndex) => ({
          item,
          rowIndex,
          dataIndex: 'mobilePhone',
          editing: this.isEditing(item),
        }),
      },
      {
        title: '证件号',
        dataIndex: 'certificateCode',
        key: 'certificateCode',
        onCell: (item, rowIndex) => ({
          item,
          rowIndex,
          dataIndex: 'certificateCode',
          editing: this.isEditing(item),
        }),
      },
      {
        title: '状态说明',
        dataIndex: 'reason',
        key: 'reason',
        render: (e, item) => {
          if (item.state === ImportState.fail) {
            return <div style={{color: '#FF4D4F', minWidth: '160px'}}>{item.reason ? item.reason : ''}</div>;
          } else {
            return <div style={{minWidth: '160px'}}>{item.reason ? item.reason : ''}</div>;
          }
        },
      },
      {
        width: '170px',
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (e, item) => {
          const editable = this.isEditing(item);
          return editable ?
            (<div>
              <a href="javascript:" onClick={() => this.onSave(item)}>保存</a>
              <Divider type="vertical"/>
              <a href="javascript:" onClick={this.onCancel}>取消</a>
            </div>) :
            (<a href="javascript:" onClick={() => this.onEdit(item)}>编辑</a>);
        },
      },
    ];

    this.state = {
      editingKey: '',
      status: 0, //当前状态 0待导入 1导入玩不 -1 导入中断
    };
  }

  componentDidMount() {
    this.getTryData(1);
  }

  getTryData(pageIndex, isEnd) {
    if (pageIndex <= 0) pageIndex = 1;
    const {dispatch, global} = this.props;
    return dispatch({
      type: 'importStaff/tryList',
      payload: {
        isEnd,
        type: 1,
        pageIndex,
        companyId: global.account.companyId, //ok
        operationId: global.account.accountId, //ok
      },
    });
  }

  getData(pageIndex, isEnd) {
    if (pageIndex <= 0) pageIndex = 1;
    const {dispatch, global} = this.props;
    return dispatch({
      type: 'importStaff/list',
      payload: {
        type: 2,
        pageIndex,
        companyId: global.account.companyId, //ok
        operationId: global.account.accountId, //ok
        isEnd,
      },
    });
  }

  isEditing = record => record.id === this.state.editingKey;

  onCancel = () => {
    this.setState({editingKey: ''});
  };

  onEdit(item) {
    this.setState({editingKey: item.id});
  }

  onSave(item) {
    if (!item._userName) return message.error('姓名不能为空');
    if (!item._mobilePhone) return message.error('电话不能为空');
    if (!item._certificateCode) return message.error('证件号不能为空');
    const {dispatch, importStaff} = this.props;

    const tempItem = {...item};
    tempItem.userName = Tool.trimSpace(item._userName, true);
    tempItem.mobilePhone = item._mobilePhone;
    tempItem.certificateCode = item._certificateCode;
    delete tempItem._userName;
    delete tempItem._mobilePhone;
    delete tempItem._certificateCode;

    dispatch({
      type: 'importStaff/updateTemporaryData',
      payload: {
        ...tempItem,
        __autoLoading: true,
      },
      callback: (res) => {
        if (res.code === 0) {
          item.userName = Tool.trimSpace(item._userName, true);
          item.mobilePhone = item._mobilePhone;
          item.certificateCode = item._certificateCode;
          this.onCancel();
          this.getTryData(importStaff.pageIndex, true); //刷新当前页面
          message.success('修改成功');
        }
      },
    });
  }

  onImport() {
    const {dispatch} = this.props;
    //导入人员
    dispatch({type: 'importStaff/set', payload: {isTableLoad: true, isImportLoad: true}});
    this._import(() => {
      this.getData(1, true);
      this.setState({
        status: 1,
      });
    }, () => {
      this.setState({
        status: -1,
      });
    });
  }

  _import(cb1, cb2) {
    const {dispatch, global} = this.props;
    dispatch({
      type: 'importStaff/startBulkImport',
      payload: {
        companyId: global.account.companyId, //ok
        operationName: global.account.realName, //ok
        operationId: global.account.accountId, //ok
      },
      callback: (res, list) => {
        if (res.code === 0) {
          if (list.length > 0) {
            this._import(cb1, cb2);
          } else {
            //上传完毕（成功）
            this.getData(1, true);
            dispatch({type: 'importStaff/set', payload: {isTableLoad: false, isImportLoad: false, list: []}});
            cb1 && cb1(res);
          }
        } else {
          //上传完毕（失败）
          this.getData(1, true);
          dispatch({type: 'importStaff/set', payload: {isTableLoad: false, isImportLoad: false}});
          cb2 && cb2(res);
        }
      },
    });
  }

  render() {
    const {importStaff, dispatch, close} = this.props;
    const {status} = this.state;
    const {failure, success} = importStaff;

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    return (
      <div style={{padding: '30px'}}>
        {
          status === 1 ? [
            <div key={'status-1-0'} className={cn('table-tips')}>提示：导入信息有误，请在页面表格内修改后重新导入或在模板表格文件内修改后重新上传。</div>,
            <div key={'status-1-1'} className={cn('table-title-rel')}>
              导入成功<i>{success}条</i>，导入失败<em>{failure}条</em>
            </div>,
          ] : <div className={cn('table-title')}>总共<i>{importStaff.total}条</i>，当前准备导入<i>{importStaff.currentTotal}条</i>
          </div>
        }
        <Table
          bordered
          loading={importStaff.isTableLoad}
          className={cn('components-table-demo-nested', 'goods-table')}
          rowKey={(item, index) => `${item.id}-${index}`}
          columns={this.tableColumns}
          dataSource={importStaff.list}
          pagination={false}
          components={components}
        />
        <div className={cn('footer-pagination-placeholder')} style={{height: '72px'}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${importStaff.currentTotal}条数据`}
                showSizeChanger
                onShowSizeChange={(pageIndex, pageSize) => {
                  dispatch({type: 'importStaff/getList', payload: {pageIndex: 1, pageSize}});
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'importStaff/getList', payload: {pageIndex}});
                }}
                current={importStaff.pageIndex}
                pageSize={importStaff.pageSize}
                total={importStaff.currentTotal}
              />
            </div>
          </Affix>
        </div>
        {
          status === 1 && failure === 0 ?
            <Button
              className={cn('importStaff-upload')}
              type={'primary'}
              onClick={() => {
                close && close();
              }}
            >重新上传</Button> :
            <Button
              loading={importStaff.isImportLoad}
              className={cn('importStaff-upload')}
              type={'primary'}
              onClick={() => this.onImport()}
            >{status === 0 ? '开始上传' : '重试'}</Button>
        }
        {
          status === -1 || (status === 1 && failure !== 0) ? <Button
            className={cn('importStaff-upload')}
            style={{marginLeft: 20}}
            onClick={() => {
              close && close();
            }}
          >重新上传</Button> : null
        }
      </div>
    );
  }
}

export default connect(state => state)(hot(module)(Class));

