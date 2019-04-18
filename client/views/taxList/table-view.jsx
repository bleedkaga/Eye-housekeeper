import React from 'react';
import './style.less';
import cn from 'classnames';
import {Table, Affix, Modal, Form, Input, Button, message} from 'antd';
import CheckTaskModal from 'client/components/CheckTaskModal';
import RH from 'client/routeHelper';

const FormItem = Form.Item;

let curActiveItem = {};

const TableView = (props) => {
  const {
    dispatch,
    form,
    dataSource,
    total,
    pageIndex,
    pageSize,
    // queryContent,
    // type,
    affix,
    tabLoading,
    bindBankModalVisible,
    bindBankBtnLoad,
    title,
    userName,
    certificateCode,
    openAccount,
    reservedPhone,
    onSearch,
    mappingId,
  } = props;

  const {getFieldDecorator, validateFields} = form;
  const formItemLayout = {
    labelCol: {
      span: 9,
    },
    wrapperCol: {
      span: 11,
    },
  };

  let _ctm = null;

  const handleBindBank = (record) => {
    dispatch({
      type: 'taxList/updateState',
      payload: {
        bindBankModalVisible: true,
        title: record.isbank === 1 ? '修改银行账户' : '设置银行账户',
        userName: record.username,
        certificateCode: record.certificateCode,
        openAccount: record.openAccount,
        reservedPhone: record.reservedPhone,
        mappingId: record.mappingId,
      },
    });
  };

  const closeBindBank = () => {
    dispatch({
      type: 'taxList/updateState',
      payload: {
        bindBankModalVisible: false,
        userName: '',
        certificateCode: '',
        openAccount: '',
        reservedPhone: '',
        mappingId: '',
      },
    });
  };

  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'taxList/bindBankNo',
          payload: {
            mappingId,
            ...values,
            callback: () => {
              message.success('成功');
              // dispatch({
              //   type: 'taxList/queryPersonList',
              //   payload: {
              //     type,
              //     pageIndex: 1,
              //     pageSize: 10,
              //   },
              // });
              setTimeout(() => {
                onSearch();
              }, 16);
            },
          },
        });
      }
    });
  };

  const columns = [
    {
      title: '序号',
      align: 'center',
      className: 'thead-item1',
      key: 'id',
      render: (val, record, index) => (index + 1),
    },
    {
      title: '姓名',
      dataIndex: 'username',
      className: 'thead-item2',
      align: 'center',
      key: 'username',
    },
    {
      title: '身份证',
      className: 'thead-item3',
      dataIndex: 'certificateCode',
      align: 'center',
    },
    {
      title: '银行卡号',
      className: 'thead-item4',
      key: 'openAccount',
      dataIndex: 'openAccount',
      align: 'center',
      render: (text, record) =>
        (<span
          key={record.openAccount}
          className={`${'center'} ${text !== null ? 'normal' : 'didNot'}`}
        >
          {text || '未设置'}
        </span>),
    },
    {
      title: '银行预留手机号',
      className: 'thead-item5',
      dataIndex: 'reservedPhone',
      key: 'reservedPhone',
      align: 'center',
      render: (text, record) =>
        (<span
          key={record.openAccount}
          className={`${'center'} ${text !== null ? 'normal' : 'didNot'}`}
        >
          {text || '未设置'}
        </span>),
    },
    {
      title: '状态',
      className: 'thead-item6',
      dataIndex: 'isbank',
      key: 'isbank',
      align: 'center',
      render: (text, record) =>
        (<span
          key={record.mappingId}
          className={`${'center'} ${text === 1 ? 'normal' : 'warning'}`}
        >
          {text === 0 ? '未绑定' : '正常'}
        </span>),
    },
    {
      title: '操作',
      className: 'thead-item7',
      dataIndex: 'operation',
      key: 'operation',
      align: 'operation',
      render: (text, record) => {
        let official = '';
        record.isbank === 1 ? official = '修改银行账户' : official = '设置银行账户';
        return (<div>
          <a
            key={record.mappingId}
            onClick={() => {
              handleBindBank(record);
            }}
            style={{cursor: 'point'}}
          >{official}</a>
          <a
            href={'javascript:;'}
            style={{marginLeft: 5}}
            onClick={() => {
              curActiveItem = record;
              _ctm.onShow();
            }}
          >{record.judgeTask === 1 ? '修改任务' : '设置任务'}</a>
        </div>);
      },
    }];
  const pagination = {
    total,
    current: pageIndex,
    pageSize,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: _total => `共${_total}条数据`,
    onChange: (_pageIndex, _pageSize) => {
      dispatch({type: 'taxList/setCondition', payload: {pageIndex: _pageIndex, pageSize: _pageSize}});
      setTimeout(() => {
        onSearch();
      }, 16);
      // dispatch({
      //   type: 'taxList/queryPersonList',
      //   payload: {
      //     pageIndex: _pageIndex,
      //     pageSize: _pageSize,
      //     type,
      //     queryContent,
      //   },
      // });
    },
    onShowSizeChange: (_pageIndex, _pageSize) => {
      dispatch({type: 'taxList/setCondition', payload: {pageIndex: _pageIndex, pageSize: _pageSize}});
      setTimeout(() => {
        onSearch();
      }, 16);
      // dispatch({
      //   type: 'taxList/queryPersonList',
      //   payload: {
      //     pageIndex: _pageIndex,
      //     pageSize: _pageSize,
      //     type,
      //     queryContent,
      //   },
      // });
    },
  };
  /*const affixChange = (_bool) => {
    dispatch({
      type: 'taxList/updateState',
      payload: {
        affix: _bool,
      },
    });
  };*/
  return (
    <div className="table-view">
      {/*<div style={{height: 53}}>*/}
      {/*<Affix*/}
      {/*offsetTop={46 + 46 + 113}*/}
      {/*onChange={affixChange}*/}
      {/*>*/}
      <div
        className={cn({
          thead: true,
          'thead-bottom-border': affix || dataSource.length === 0,
        })}
      >
        <div className="thead-item1">序号</div>
        <div className="thead-item2">收款户名</div>
        <div className="thead-item3">证件号码</div>
        <div className="thead-item4">银行卡号</div>
        <div className="thead-item5">银行预留手机号</div>
        <div className="thead-item6">状态</div>
        <div className="thead-item7">操作</div>
      </div>
      {/*</Affix>*/}
      {/*</div>*/}
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        showHeader={false}
        loading={tabLoading}
        rowKey={record => `__${record.mappingId}`}
      />
      <Modal
        title={title}
        visible={bindBankModalVisible}
        width={729}
        footer={null}
        onCancel={closeBindBank}
        destroyOnClose
        wrapClassName={cn('set-bank-modal-wrap')}
      >
        <Form className={cn('set-bank-modal-form')}>
          <FormItem
            label="银行户名"
            {...formItemLayout}
          >
            {getFieldDecorator('userName', {
              initialValue: userName,
            })(
              <span style={{color: '#333'}}>{userName}</span>
            )}
          </FormItem>
          <FormItem
            label="身份证号"
            {...formItemLayout}
          >
            {getFieldDecorator('certificateCode', {
              initialValue: certificateCode,
            })(
              <span style={{color: '#333'}}>{certificateCode}</span>
            )}
          </FormItem>
          <FormItem
            label="银行卡号"
            {...formItemLayout}
          >
            {getFieldDecorator('openAccount', {
              getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
              initialValue: openAccount,
              rules: [
                {required: true, message: '请输入银行卡号'},
                {max: 21, message: '请输入正确的银行卡号'},
              ],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label="银行预留手机号"
            {...formItemLayout}
          >
            {getFieldDecorator('reservedPhone', {
              getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
              initialValue: reservedPhone,
              rules: [
                {len: 11, message: '请输入正确的手机号'},
              ],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            wrapperCol={{
              offset: 9,
              span: 13,
            }}
          >
            <div
              style={{
                marginTop: '30px',
                width: '242px',
                height: '41px',
              }}
            >
              <Button
                type="primary"
                style={{
                  marginRight: '24px',
                  width: '109px',
                  height: '41px',
                }}
                onClick={handleSubmit}
                loading={bindBankBtnLoad}
              >
                确定
              </Button>
              <Button
                style={{
                  width: '109px',
                  height: '41px',
                }}
                onClick={closeBindBank}
              >
                取消
              </Button>
            </div>
          </FormItem>
        </Form>
      </Modal>
      <CheckTaskModal
        ref={e => (_ctm = e)}
        getList={(next) => {
          dispatch({
            type: 'taxList/getClassification',
            callback: (res) => {
              if (res.code === 0) {
                next(true, res.data);
              } else {
                next(false, []);
              }
            },
          });
        }}
        getData={(next) => {
          dispatch({
            type: 'taxList/getUserCustomTask',
            payload: {
              mappingId: curActiveItem.mappingId,
            },
            callback: (res) => {
              if (res.code === 0) {
                const d = res.data || {};
                let list = [];
                if (d.taskId) list = d.taskId.split(',');
                next(true, list);
              } else {
                next(false, []);
              }
            },
          });
        }}
        onOk={(taskId) => {
          const un = message.loading('保存中...', 15);
          dispatch({
            type: 'taxList/addUserCustomTask',
            payload: {
              mappingId: curActiveItem.mappingId,
              taskId,
            },
            callback: (res) => {
              un();
              if (res.code === 0) {
                curActiveItem.judgeTask = 1;
                _ctm.onHide();
                dispatch({type: 'taxList/updateState'});
              }
            },
          });
        }}
        toCenter={() => RH(null, 'taskCenter', '/org/salary/taskCenter')}
      />
    </div>
  );
};

export default Form.create()(TableView);
