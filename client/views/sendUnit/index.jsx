import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Affix, Button, Row, Col, Table, Input, message, Popconfirm, Modal, Form} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import { formatMoney, accMul, dataIsNull } from 'client/utils/formatData';
import RH, {goBack} from '../../routeHelper';
import BIconfont from 'client/components/BIconfont';
import GTitle from 'client/components/GTitle';
// import RH from '../../routeHelper';
// import Upload from 'client/components/Upload';
// import AjaxMap from 'client/services/public';
// import Payment from 'client/components/Payment';
import Tools from 'client/utils/tools';

import './style.less';

const FormItem = Form.Item;

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moneyVisible: false,
      pageIndex: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    const {dispatch, location, location: {state = {}}} = this.props;
    if (location.search || state.__back) {
      const searchParams = Tools.queryToParams(location.search);
      this.paramsInit(searchParams);
      this.setState({
        pageIndex: searchParams.pageIndex,
        pageSize: searchParams.pageSize,
      });
    }
    dispatch({
      type: 'sendUnit/getCompanyAssociatedByIdOrTotalPeople',
      payload: {
        __autoLoading: true,
      },
    });
    dispatch({
      type: 'sendUnit/findBalance',
      payload: {
        __autoLoading: true,
      },
    });
    setTimeout(() => {
      this.onSearch();
    }, 16);
  }

  componentWillUnmount() {
  }

  //设置配发金额
  setAmount = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendUnit/updateUnitsById',
      payload: {
        id: record.id,
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
      type: 'sendUnit/updateUnitsById',
      payload: {
        id: key,
        amount: flag ? Number(accMul(value, 100)) : '',
      },
    });
  };

  getCurrentParams() {
    const o = {
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize,
    };
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

  onSearch() {
    const {history} = this.props;
    const o = this.getCurrentParams();
    const q = Tools.paramsToQuery(o);
    RH(history, 'sendUnit', window.__themeKey === 'org' ? `/${window.__themeKey}/hr/coupons/sendUnit` : `/${window.__themeKey}/spring/coupons/sendUnit`, {search: q, replace: true});
  }

  //点击保存金额的按钮
  save = (record) => {
    const {dispatch, sendUnit} = this.props;
    // const moneyPattern = /^\d+$|^\d+\.\d{1,2}$|^0\.\d{1,2}$/
    const moneyPattern = /^(0|\+?[1-9][0-9]*)$/;
    if (!moneyPattern.test(record.amount)) {
      return message.error('请输入正确的金额，小数点后最多两位');
    }


    dispatch({
      type: 'sendUnit/updateUnitsById',
      payload: {
        id: record.id,
        editable: false,
        amount: Number(record.amount),
      },
    });

    dispatch({
      type: 'sendUnit/updateUnitAmount',
      payload: {
        id: record.id,
        amount: Number(record.amount),
      },
    });

    dispatch({
      type: 'sendUnit/set',
      payload: {
        cacheUnits: sendUnit.units.slice(),
      },
    });
  };

  cancel = (record) => {
    const {sendUnit, dispatch} = this.props;
    const cacheItem = sendUnit.cacheUnits.find(item => item.id === record.id);

    dispatch({
      type: 'sendUnit/updateUnitsById',
      payload: {
        id: record.id,
        amount: cacheItem.amount || 0,
        editable: false,
      },
    });
  };

  cancelSend = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendUnit/cancelSend',
    });
  };

  getUnitMoneyArryJson = () => {
    const newUnits = [];
    const {sendUnit} = this.props;
    for (const item of sendUnit.units) {
      if (!dataIsNull(item.amount) && Number(item.amount) > 0.0001) {
        newUnits.push({
          id: item.id,
          companyName: item.associatedName,
          amount: item.amount,
          auditStatus: item.auditStatus,
        });
      }
    }
    return newUnits;
  };

  showInputPayPass = () => {
    const {sendUnit} = this.props;
    const unitMoneyArryJson = this.getUnitMoneyArryJson();
    let sendTotalCore = 0;
    if (unitMoneyArryJson.length === 0) {
      message.error('请设置关联单位配发积分');
      return false;
    }

    // 看是否还有处于编辑状况的接口
    const isEditing = sendUnit.units.find(item => item.editable);
    if (isEditing) {
      message.error('请先保存');
      return false;
    }
    // 判断发送金额是否为0
    for (let i = 0; i < unitMoneyArryJson.length; i++) {
      sendTotalCore += unitMoneyArryJson[i].amount;
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
    const {dispatch, sendUnit, history} = this.props;
    const secondPath = window.__themeKey === 'org' ? 'hr' : 'spring';
    const { totalMoney } = sendUnit;
    const unitMoneyArryJson = this.getUnitMoneyArryJson();
    const payload = {
      totalMoney: Number(totalMoney),
      moneyArryJsonStr: JSON.stringify(unitMoneyArryJson),
      payPwd: password,
    };
    dispatch({ type: 'sendUnit/insertBatchMoneyCompanyQuota', payload }).then(
      (res) => {
        if (res.code === 0) {
          RH(history, 'welfareRecords', `/${window.__themeKey}/${secondPath}/welfareRecords`,
            {search: '?pageIndex=1&pageSize=10&createTimeStart=&createTimeEnd=&t=2'});
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
    const {history, sendUnit} = this.props;
    const { getFieldDecorator } = this.props.form;
    const pagination = {
      current: this.state.pageIndex,
      pageSize: this.state.pageSize,
      total: sendUnit.units.length,
      onChange: (pageIndex) => {
        this.setState({
          pageIndex,
        }, () => {
          this.onSearch();
        });
      },
      onShowSizeChange: (current, pageSize) => {
        this.setState({
          pageIndex: 1,
          pageSize,
        }, () => {
          this.onSearch();
        });
      },
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      showTotal: () => (`     共${sendUnit.units.length}条记录`),
      size: 'small',
      showQuickJumper: true,
    };
    const columns = [{
      title: window.__themeKey === 'org' ? '单位/组织名称' : '单位/工会名称',
      dataIndex: 'associatedName',
      key: 'associatedName',
    }, {
      title: window.__themeKey === 'org' ? '单位/组织人数' : '单位/工会人数',
      dataIndex: 'count',
      key: 'count',
      className: cn('column-align-center'),
    }, {
      title: window.__themeKey === 'org' ? '发放额度(元)' : '发放额度(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: '30%',
      className: window.__themeKey === 'org' ? cn('column-align-center-company') : cn('column-align-center-group'),
      render: (text, record) => {
        if (record.editable) {
          return (<Input
            style={{ width: '60%', textAlign: 'center' }}
            placeholder="请输入"
            addonAfter=""
            defaultValue={(record.amount === undefined || record.amount === '' || record.amount === null) ? '' : accMul(record.amount, 0.01)}
            onChange={e => this.onChange(record.id, e.target.value)}
            maxLength={7}
          />);
        } else {
          return (record.amount === 0 || record.amount === '0' || record.amount === undefined || record.amount === '' || record.amount === null) ? '' : formatMoney(accMul(record.amount, 0.01), true);
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
            <Popconfirm title="您确认取消吗？" onConfirm={() => this.cancel(record)}>
              <a style={{ marginLeft: 12 }}>取消</a>
            </Popconfirm>
          </div>);
        } else {
          return <a onClick={() => this.setAmount(record)}>设置配发金额</a>;
        }
      },
    }];

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '弹性福利', path: `/${window.__themeKey}/hr/coupons`},
          {name: '发放关联单位'},
        ]}
      />

      <GPage>
        <Modal
          visible={this.state.moneyVisible}
          width={500}
          footer={null}
          title="输入支付密码"
          onCancel={() => this.clearPayPassword()}
          // onOk={e => this.handleSubmit(e)}
        >
          <Form >
            <Row className={cn('unitModal-style')} gutter={12}>
              <Col span={6} className={cn('pwd-title')}>
                <span>支付密码:</span>
              </Col>
              <Col className={cn('ipt-title')} span={14}>
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
        <div className={cn('sendUnit')}>
          <GTitle>发放给关联单位</GTitle>
          <div>
            <div className={cn('table-style')}>
              <div>
                <Table
                  bordered
                  columns={columns}
                  pagination={pagination}
                  dataSource={sendUnit.units}
                  rowKey={record => record.id}
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
                  <span className={cn('money-style')} style={{ color: '#3C4FA0'}}>
                    {Tools.getViewPrice(sendUnit.totalMoney, '')}元
                    {/*{formatMoney(accMul(sendUnit.totalMoney, 0.01), true)}元*/}
                  </span> :
                  <span className={cn('money-style')} style={{ color: '#FF6767' }}>
                    {Tools.getViewPrice(sendUnit.totalMoney, '')}元
                    {/*{formatMoney(accMul(sendUnit.totalMoney, 0.01), true)}元*/}
                  </span>}
              </span>
              <span style={{marginLeft: '35px'}}>
              当前可用余额:
                {window.__themeKey === 'org' ?
                  <span className={cn('money-style')} style={{ color: '#3C4FA0' }}>
                    {Tools.getViewPrice(sendUnit.showBalance, '')}
                    {/*{formatMoney(sendUnit.showBalance, true)}元*/}
                  </span> :
                  <span className={cn('money-style')} style={{ color: '#FF6767' }}>
                    {Tools.getViewPrice(sendUnit.showBalance, '')}
                    {/*{formatMoney(sendUnit.showBalance, true)}元*/}
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
