import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import { Alert, Radio, Modal, message, Spin } from 'antd';

import {GContainer, GHeader, GPage} from 'client/components/GLayout';

import './style.less';
import RecipientEmailEditable from './components/RecipientEmailEditable';

// Components
const RadioGroup = Radio.Group;

function TaxRadios(props) {
  return (
    <div className={'editable'}>
      <RadioGroup onChange={props.onChange} value={props.taxpayerType}>
        {
          props.taxpayerTypeList.map((item, index) => (
            <Radio value={item.taxpayerType} key={index}>{item.taxpayerTypeDesc}</Radio>
          ))
        }
      </RadioGroup>
      <a onClick={() => props.save()}>保存</a>
    </div>
  );
}

function TaxText(props) {
  return (<p>{props.taxpayerTypeDesc}</p>);
}


function RecipientEmailStatic(props) {
  return (
    <li>
      <span className={'label-name'}>完税证明收件箱：</span>
      <div className={'email-edit'}>
        <p className="editing">
          <span className="text">{props.recipientEmail}</span>
          <a href="javascript:" onClick={props.onEdit} >编辑</a>
        </p>
      </div>
    </li>
  );
}

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { dispatch, global } = this.props;
    const companyId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok
    dispatch({
      type: 'invoinceInfo/queryInvoiceBaseInfo',
      payload: {
        companyId, //ok
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoiceInfo/reset',
    });
  }

  onChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoinceInfo/setInvoiceInfo',
      payload: {
        taxpayerType: e.target.value,
      },
    });
  };

  save() {
    const { invoinceInfo } = this.props;
    const info = invoinceInfo.invoiceInfo;
    if (!info.taxpayerType) {
      message.error('请选择纳税人类型');
      return;
    }
    this.setState({
      modalVisible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  recipientEmailSave(email) {
    const { dispatch, global } = this.props;
    const regexp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!regexp.test(email)) {
      message.error('请输入正确的邮箱');
      return;
    }

    dispatch({
      type: 'invoinceInfo/saveForm',
      payload: {
        companyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId, //ok
        recipientEmail: email,
      },
      callback: () => {
        dispatch({
          type: 'invoinceInfo/set',
          payload: {
            emailEdit: false,
          },
        });
        dispatch({
          type: 'invoinceInfo/setInvoiceInfo',
          payload: {
            recipientEmail: email,
          },
        });
      },
    });
  }

  recipientEmailEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoinceInfo/set',
      payload: {
        emailEdit: true,
      },
    });
  };

  recipientEmailChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoinceInfo/setInvoiceInfo',
      payload: {
        recipientEmail: e.target.value,
      },
    });
  }

  confirm = () => {
    const { dispatch, invoinceInfo, global} = this.props;
    const that = this;
    dispatch({
      type: 'invoinceInfo/saveForm',
      payload: {
        companyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId, //ok
        taxpayerType: invoinceInfo.invoiceInfo.taxpayerType,
      },
      callback() {
        that.handleCancel();
        that.getData();
      },
    });
  }

  render() {
    const { invoinceInfo, dispatch } = this.props;
    const info = invoinceInfo.invoiceInfo;
    // 纳税人选择
    let TaxPayerRadio = null;
    if (invoinceInfo.taxpayerInit) {
      TaxPayerRadio = (<TaxRadios
        {...info}
        taxpayerType={info.taxpayerType || ''}
        onChange={this.onChange}
        save={() => this.save()}
      />);
    } else {
      TaxPayerRadio = <TaxText {...info}/>;
    }

    // 完税证明收件箱
    let recipientEmail = null;
    if (invoinceInfo.emailInit || invoinceInfo.emailEdit) {
      recipientEmail = (<RecipientEmailEditable
        {...info}
        onSave={value => this.recipientEmailSave(value)}
        onChange={e => this.recipientEmailChange(e)}
        onCancel={() => {
          dispatch({
            type: 'invoinceInfo/set',
            payload: {
              emailEdit: false,
            },
          });
        }}
      />);
    } else {
      recipientEmail = <RecipientEmailStatic {...info} onEdit={this.recipientEmailEdit}/>;
    }

    const currentName = window.__themeKey === 'org' ? '单位' : '工会';

    return (<GContainer className={cn('home-view', 'invoicesInfo')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '开票信息'},
        ]}
      />

      <div className={cn('invoices-info-panel')}>

        <GPage top={0} bottom={88}>
          {
            <Spin delay={100} spinning={invoinceInfo.isLoad}>
              <div className={'invoices-info'}>

                <Alert message="温馨提示：如需修改开票信息，请联系客户经理。" type="warning" />
                <div className={'invoices-info-container'}>
                  <ul style={{paddingBottom: 10}}>
                    <li>
                      <span className={'label-name'}>{currentName}名称：</span>
                      <div>
                        <p>{info.companyName}</p>
                      </div>
                    </li>
                    <li>
                      <span className={'label-name'} >纳税人类型：</span>
                      <div>
                        { TaxPayerRadio }
                      </div>
                    </li>

                    <li>
                      <span className={'label-name'}>纳税人识别号：</span>
                      <div>
                        <p>{info.uniformCreditCode}</p>
                      </div>
                    </li>

                    <li>
                      <span className={'label-name'}>{currentName}注册地址：</span>
                      <div>
                        <p>{info.address}</p>
                      </div>
                    </li>

                    <li>
                      <span className={'label-name'}>联系电话：</span>
                      <div>
                        <p>{info.phoneNumber}</p>
                      </div>
                    </li>

                    <li>
                      <span className={'label-name'}>开户行及账号：</span>
                      <div>
                        <p>{info.bank}  {info.bankAccount}</p>
                      </div>
                    </li>

                    <li>
                      <span className={cn('label-name multi', window.__themeKey === 'union' && 'hide')}>
                        <b className={'mul'}>开票范围： </b>
                        <b className={'mul'}>(众包服务费) </b>
                      </span>
                      <span className={cn('label-name multi', window.__themeKey === 'org' && 'hide')}>
                        <b className={'mul'}>开票范围： </b>
                      </span>
                      <div>
                        <ul className="invoices-area">
                          {info.invoiceScopeList.filter(item => item.type === 1).map((item, index) => (
                            <li key={index}>{item.name}</li>
                          ))}
                        </ul>
                      </div>
                    </li>

                    <li className={cn(window.__themeKey === 'union' && 'hide')}>
                      <span className={'label-name multi'}>
                        <b className={'mul'}>开票范围： </b>
                        <b className={'mul'}>(企业福利) </b>
                      </span>
                      <div>
                        <ul className="invoices-area">
                          {info.invoiceScopeList.filter(item => item.type === 2).map((item, index) => (
                            <li key={index}>{item.name} </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                    {
                      recipientEmail
                    }
                  </ul>
                </div>
              </div>
            </Spin>
          }
        </GPage>

      </div>


      {/* 纳税人类型的提示与保存 */}
      <Modal
        title="提示"
        className={cn('gsg-modal')}
        visible={this.state.modalVisible}
        onOk={() => this.confirm()}
        centered
        width={520}
        onCancel={() => this.handleCancel()}
      >
        <p className={cn('tips', 'f-tac')} style={{fontSize: 16, padding: '30px 0 '}}>纳税人类型仅能设置一次，设置成功后无法修改。</p>
      </Modal>

    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
