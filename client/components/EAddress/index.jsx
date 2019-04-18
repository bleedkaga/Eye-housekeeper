import React from 'react';
import cn from 'classnames';
import { Form, Button, Alert, Cascader, Input, Modal, Icon } from 'antd';
import { connect } from 'dva';
import { hot } from 'react-hot-loader';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 8},
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 4 },
  },
};
const buttonItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};


class EAddressComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applyInvoice: {...this.props.applyInvoicesPaper.applyInvoice},
    };
  }

  componentWillUnmount() {
  }

  handleSubmit = (e) => {
    const { global, dispatch, dict } = this.props;
    const { pcaData } = dict;
    const that = this;
    const { applyInvoicesPaper } = this.props;
    const { EAddressIsFirstEdit } = applyInvoicesPaper.preSubmit;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const companyId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok
        const pAddress = pcaData.filter(item => item.value === values.recipientDetailCode[0])[0];
        const cAddress = pAddress.children.filter(item => item.value === values.recipientDetailCode[1])[0];
        const aAddress = cAddress.children.filter(item => item.value === values.recipientDetailCode[2])[0];

        const recipient = {
          recipientProvince: values.recipientDetailCode[0],
          recipientCity: values.recipientDetailCode[1],
          recipientArea: values.recipientDetailCode[2],
          recipientAddress: `${pAddress.label}${cAddress.label}${aAddress.label}${values.recipientDetailAddress}`,
          companyId, //ok
        };
        const data = Object.assign(recipient, values);
        const payload = {
          recipientAddress: recipient.recipientAddress,
          recipientName: values.recipientName,
          recipientPhone: values.recipientPhone,
          recipientProvince: recipient.recipientProvince,
          recipientCity: recipient.recipientCity,
          recipientArea: recipient.recipientArea,
          recipientDetailAddress: values.recipientDetailAddress,
          companyId, //ok
        };

        // 如果没有邮寄地址需要首次保存邮寄地址
        if (EAddressIsFirstEdit) {
          dispatch({
            type: 'applyInvoicesPaper/saveForm',
            payload,
            callback() {
              that.props.onSave(data);
            },
          });
        } else {
          that.props.onSave(data);
        }
      }
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { recipientProvince, recipientCity, recipientArea} = this.state.applyInvoice;
    if (!recipientProvince || !recipientCity || !recipientArea) {
      dispatch({
        type: 'dict/findPCAS',
        payload: {
          selectedOptions: [],
        },
      });
    } else {
      dispatch({
        type: 'dict/findPCAS',
        payload: {
          selectedOptions: [{value: recipientProvince}, {value: recipientCity}, {value: recipientArea}],
        },
      });
    }
  }

  loadAreaAddress = (selectedOptions) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/findPCAS',
      payload: {
        selectedOptions,
      },
    });
  };

  back = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyInvoicesPaper/set',
      payload: {
        preSubmit: {
          step: 1,
        },
      },
    });
  }

  render() {
    const { getFieldDecorator} = this.props.form;
    const { dict } = this.props;
    const options = dict.pcaData;
    const { recipientProvince, recipientCity, recipientArea} = this.state.applyInvoice;
    const { applyInvoice } = this.state;
    const isHide = !applyInvoice.recipientName && !applyInvoice.recipientPhone && !applyInvoice.recipientDetailAddress;


    return (
      <Modal
        visible
        footer={null}
        className={cn('custom-add-modal')}
        width={600}
        onCancel={this.back}
      >
        <div className={cn('set-eaddress')}>
          <div className={cn('m-header')}>
            <div className={cn('m-step')}>
              <span
                className={cn('back')}
                onClick={this.back}
              >
                <Icon type="arrow-left"/>
                <label>返回</label>
              </span>
              <span> 邮寄地址 </span>
            </div>
            <div className={cn('close')}>
              <i className={cn('icon-close')}/>
            </div>

          </div>
          <div className={cn('m-body')}>
            <div className={cn('eaddress-container')}>
              <Alert message="温馨提示：该邮寄信息将作为默认地址保存，如需修改请到“邮寄地址”页进行修改。" type="warning" />
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="收件地址">
                  {
                    getFieldDecorator('recipientDetailCode', {
                      initialValue: !recipientProvince ? null : [recipientProvince, recipientCity, recipientArea],
                      rules: [
                        { required: true, message: '请选择省市区' },
                      ],
                    })(
                      <Cascader
                        placeholder="省(直辖市/自治区)/市(区)/区(县)"
                        options={options}
                        loadData={this.loadAreaAddress}
                        onChange={(e) => {
                          this.setState({
                            applyInvoice: {
                              ...applyInvoice,
                              recipientProvince: e[0] || '', //省
                              recipientCity: e[1] || '', //市
                              recipientArea: e[2] || '', //区
                            },
                          });
                        }}
                      />
                    )
                  }
                </FormItem>

                <FormItem {...formItemLayout} wrapperCol={{xs: {span: 14, offset: 7}}}>
                  {
                    getFieldDecorator('recipientDetailAddress', {
                      initialValue: applyInvoice.recipientDetailAddress,
                      rules: [
                        { required: true, message: '请输入详细地址' },
                      ],
                    })(
                      <Input placeholder="请输入详细地址" />
                    )
                  }
                </FormItem>

                <FormItem {...formItemLayout} label="收件人姓名">
                  {
                    getFieldDecorator('recipientName', {
                      initialValue: applyInvoice.recipientName,
                      rules: [
                        { required: true, message: '请输入收件人姓名' },
                      ],
                    })(
                      <Input placeholder="请输入" />
                    )
                  }
                </FormItem>

                <FormItem {...formItemLayout} label="联系电话">
                  {
                    getFieldDecorator('recipientPhone', {
                      initialValue: applyInvoice.recipientPhone,
                      rules: [
                        { required: true, message: '请输入联系电话' },
                        { pattern: /^[\d]{11}$/, message: '请输入合法的电话号码' },
                      ],
                    })(
                      <Input placeholder="请输入" maxLength={11}/>
                    )
                  }
                </FormItem>

                <FormItem {...buttonItemLayout} className={cn('btn-group')}>
                  <Button type="primary" htmlType="submit">保存</Button>
                  <Button onClick={this.back} className={cn(isHide && 'hide')}>取消</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const EAddressForm = Form.create()(EAddressComponent);


export default connect(state => state)(hot(module)(EAddressForm));

