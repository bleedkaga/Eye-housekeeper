import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Affix, Button, Row, Col, Table, Input, message, Modal, Form} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import { formatMoney, accMul } from 'client/utils/formatData';
import BIconfont from 'client/components/BIconfont';
import GTitle from 'client/components/GTitle';
// import Upload from 'client/components/Upload';
// import AjaxMap from 'client/services/public';
// import Payment from 'client/components/Payment';


import './style.less';
import RH, {goBack} from '../../routeHelper';
import Tools from '../../utils/tools';
// import RH from '../../routeHelper';

const FormItem = Form.Item;

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moneyVisible: false,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendDepartment/getDeptMenu',
      payload: {
        __autoLoading: true,
      },
    });
    dispatch({
      type: 'sendDepartment/findBalance',
      payload: {
        __autoLoading: true,
      },
    });
  }

  componentWillUnmount() {
  }

  //设置配发金额
  setAmount = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendDepartment/updateDepartmentByKey',
      payload: {
        key: record.id,
        editable: true,
      },
    });
  };

  //输入框改变触发的事件
  onChange = (key, value) => {
    const {dispatch} = this.props;
    let flag = false;
    // const moneyPattern = /^\d+$|^\d+\.\d{1,2}$|^0\.\d{1,2}$/
    const numberPattern = /^\d+$|^\d+\.\d+$|^0\.\d+$/; // 判断是否数字
    flag = numberPattern.test(value);
    dispatch({
      type: 'sendDepartment/updateDepartmentByKey',
      payload: {
        key,
        amount: flag ? Number(accMul(value, 100)) : '',
      },
    });
  };

  //点击保存金额的按钮
   save = (record) => {
     const {dispatch} = this.props;
     // const moneyPattern = /^\d+$|^\d+\.\d{1,2}$|^0\.\d{1,2}$/
     const moneyPattern = /^(0|\+?[1-9][0-9]*)$/;
     if (!moneyPattern.test(record.amount)) {
       return message.error('请输入正确的金额，小数点后最多两位');
     }

     dispatch({
       type: 'sendDepartment/updateDepartmentAmount',
       payload: {
         key: record.id,
         amount: Number(record.amount),
       },
     });

     dispatch({
       type: 'sendDepartment/updateDepartmentByKey',
       payload: {
         key: record.id,
         editable: false,
       },
     });

     dispatch({ type: 'sendDepartment/updateCacheDepartment' });
   };

  cancel = (record) => {
    const {dispatch, sendDepartment} = this.props;
    const findDataByData = (id, tree, arr) => {
      if (!tree || tree.length <= 0) {
        return null;
      }

      for (const item of tree) {
        if (item.id === id) {
          return item;
        }
        return findDataByData(id, item.children, arr);
      }

      return null;
    };

    const cacheAmount = findDataByData(record.id, sendDepartment.cacheDepartmentInfos, []);

    dispatch({
      type: 'sendDepartment/updateDepartmentByKey',
      payload: {
        key: record.id,
        editable: false,
        amount: (cacheAmount && cacheAmount.amount) || 0,
      },
    });
  };

  cancelSend = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendDepartment/cancelSend',
    });
  };

  genSendMoneyDepartmentInfos = (tree, arr) => {
    if (!tree || tree.length <= 0) {
      return arr;
    }

    for (const item of tree) {
      this.genSendMoneyDepartmentInfos(item.children, arr);

      if (item.amount !== undefined) {
        arr.push({
          id: item.id,
          departmentName: item.departmentName,
          amount: item.amount,
        });
      }
    }
    return arr;
  };

  isEditing = (tree, arr) => {
    if (!tree || tree.length <= 0) {
      return arr;
    }

    for (const item of tree) {
      this.isEditing(item.children, arr);

      if (item.editable) {
        arr.push(true);
      }
    }

    return arr;
  };

  getDeptMoneyArryJson = () => {
    const {sendDepartment} = this.props;
    const newDepartmentInfos = this.genSendMoneyDepartmentInfos(sendDepartment.departmentInfos, []);
    return newDepartmentInfos;
  };

  showInputPayPass = () => {
    const {sendDepartment} = this.props;
    const deptMoneyArryJson = this.getDeptMoneyArryJson();
    let sendTotalCore = 0;
    if (deptMoneyArryJson.length === 0) {
      message.error('请设置部门配发金额');
      return;
    }

    if (this.isEditing(sendDepartment.departmentInfos, []).length > 0) {
      message.error('请先保存设置的金额');
      return;
    }
    // 判断发送金额是否为0
    for (let i = 0; i < deptMoneyArryJson.length; i++) {
      sendTotalCore += deptMoneyArryJson[i].amount;
    }
    if (sendTotalCore <= 0.0001) {
      message.error('发放额度不得小于0.01');
      return false;
    }
    this.setState({
      moneyVisible: true,
    });
  };


  send = (password) => {
    const {dispatch, sendDepartment, history} = this.props;
    const secondPath = window.__themeKey === 'org' ? 'hr' : 'spring';
    const { totalMoney } = sendDepartment;
    const deptMoneyArryJson = this.getDeptMoneyArryJson();
    const payload = {
      totalMoney: Number(totalMoney),
      deptMoneyArryJsonStr: JSON.stringify(deptMoneyArryJson),
      payPwd: password,
    };
    dispatch({ type: 'sendDepartment/insertBatchMoneyDeptQuota', payload }).then(
      (res) => {
        if (res.code === 0) {
          RH(history, 'welfareRecords', `/${window.__themeKey}/${secondPath}/welfareRecords`,
            {search: '?pageIndex=1&pageSize=10&createTimeStart=&createTimeEnd=&t=1'});
        }
      }
    );
  };

  handleSubmit(e) {
    e.preventDefault();
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        // this.props.send(values.password);
        this.send(values.password);
      }
    });
  }

  clearPayPassword() {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      password: '',
    });
    this.setState({
      moneyVisible: false,
    });
  }
  // componentWillReceiveProps(){
  // }

  render() {
    const {history, sendDepartment} = this.props;
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: '部门',
      align: 'left',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: '30%',
      // className: cn('text-left'),
    }, {
      title: '部门人数',
      dataIndex: 'staffNumber',
      key: 'staffNumber',
      className: cn('column-align-center'),
    }, {
      title: '配发金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: '30%',
      className: cn('column-align-center'),
      render: (text, record) => {
        if (record.editable) {
          return (<Input
            style={{ width: '60%', textAlign: 'center' }}
            placeholder="请输入"
            // addonAfter="金额"
            defaultValue={(record.amount === undefined || record.amount === '' || record.amount === null) ? '' : accMul(record.amount, 0.01)}
            onChange={e => this.onChange(record.id, e.target.value)}
            maxLength={7}
          />);
        } else {
          return (record.amount === '0' || record.amount === 0 || record.amount === undefined || record.amount === '' || record.amount === null) ? '' : formatMoney(accMul(record.amount, 0.01), true);
        }
      },
    }, {
      title: '操作',
      className: cn('column-align-center'),
      width: '30%',
      render: (text, record) => {
        if (record.editable) {
          return (<div>
            <a onClick={() => this.save(record)}>保存</a>
            {/*<Popconfirm title="您确认取消吗？" onConfirm={() => this.cancel(record)}>*/}
            <a style={{ marginLeft: 12 }} onClick={() => this.cancel(record)}>取消</a>
            {/*</Popconfirm>*/}
          </div>);
        } else {
          return (<a onClick={() => this.setAmount(record)}>设置配发金额</a>);
        }
      },
    }];

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '弹性福利', path: `/${window.__themeKey}/hr/coupons`},
          {name: '配发给部门'},
        ]}
      />

      <GPage>
        <Modal
          width={500}
          footer={null}
          visible={this.state.moneyVisible}
          title="支付密码"
          onCancel={() => this.clearPayPassword()}
          // onOk={e => this.handleSubmit(e)}
        >
          <Form >
            <Row className={cn('departModal-style')} gutter={12}>
              <Col span={6} className={cn('pwd-title')}>
                <span>支付密码:</span>
              </Col>
              <Col span={14} className={cn('ipt-title')}>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [
                      { required: true, message: '请输入支付密码' },
                    ],
                  })(
                    <Input type="password" suffix={<BIconfont type="anquanmima" style={{color: 'green', fontSize: '25px'}}/>} placeholder="请输入支付密码" maxLength="16"/>
                  )}
                </FormItem>
              </Col>
              <Col span={24} className={cn('btn-group')}>
                <Button style={{marginRight: '25px'}} onClick={() => this.clearPayPassword()}>取消</Button>
                <Button type={'primary'} onClick={e => this.handleSubmit(e)}>确定</Button>
              </Col>
            </Row>
          </Form>
        </Modal>
        <div className={cn('sendDepartment')}>
          <GTitle>配发给部门</GTitle>
          <div>
            <div className={cn('table-style')}>
              <div className={cn('table-1')}>
                <Table
                  columns={columns}
                  dataSource={sendDepartment.departmentInfos}
                  rowKey={record => record.id}
                  pagination={false}
                  defaultExpandAllRows
                />
              </div>
            </div>
          </div>
        </div>
        <div className={cn('footer-block-zwf')}>
          <Affix offsetBottom={0}>
            <div className={cn('bottom-style')}>
              <span>
                配发总金额:
                {window.__themeKey === 'org' ?
                  <span className={cn('money-style')}>
                    {Tools.getViewPrice(sendDepartment.totalMoney, '')}元
                    {/*{formatMoney(accMul(sendDepartment.totalMoney, 0.01), true)}元*/}
                  </span> :
                  <span className={cn('money-style')} style={{ color: '#FF6767' }}>
                    {Tools.getViewPrice(sendDepartment.totalMoney, '')}元
                    {/*{formatMoney(accMul(sendDepartment.totalMoney, 0.01), true)}元*/}
                  </span>}
              </span>
              <span style={{marginLeft: '35px'}}>
                  当前可用余额:
                {window.__themeKey === 'org' ?
                  <span className={cn('money-style')} style={{ color: '#3C4FA0' }}>
                    {Tools.getViewPrice(sendDepartment.showBalance, '')}元
                    {/*{formatMoney(sendDepartment.showBalance, true)}元*/}
                  </span> :
                  <span className={cn('money-style')} style={{ color: '#FF6767' }}>
                    {Tools.getViewPrice(sendDepartment.showBalance, '')}元
                    {/*{formatMoney(sendDepartment.showBalance, true)}元*/}
                  </span>}
              </span>
              <div className={cn('send-btns')}>
                <Button onClick={() => goBack(history)}>取消发放</Button>
                <Button style={{ marginLeft: '20px' }} type="primary" onClick={() => this.showInputPayPass()}>确认发放</Button>
              </div>
            </div>
          </Affix>
        </div>
      </GPage>
    </GContainer>);
  }
}
export default Form.create()(connect(state => state)(hot(module)(Class)));

