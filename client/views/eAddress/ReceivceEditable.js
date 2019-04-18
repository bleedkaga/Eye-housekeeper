import React from 'react';
import {Form, Button, Input, Cascader} from 'antd';
import {connect} from 'dva';
import {hot} from 'react-hot-loader';
import cn from 'classnames';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};


class ReceiveEditable extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const that = this;
    const {dispatch, global, dict} = this.props;
    const {pcaData} = dict;
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.error('form validate error: ', err);
      } else {
        const pAddress = pcaData.filter(item => item.value === values.recipientDetailCode[0])[0];
        const cAddress = pAddress.children.filter(item => item.value === values.recipientDetailCode[1])[0];
        const aAddress = cAddress.children.filter(item => item.value === values.recipientDetailCode[2])[0];

        const recipient = {
          recipientProvince: values.recipientDetailCode[0],
          recipientCity: values.recipientDetailCode[1],
          recipientArea: values.recipientDetailCode[2],
          recipientAddress: `${pAddress.label}${cAddress.label}${aAddress.label}${values.recipientDetailAddress}`,
        };

        const mergedParam = Object.assign(recipient, values);

        dispatch({
          type: 'eaddress/saveForm',
          payload: {
            companyId: window.__themeKey === 'org' ? global.account.companyId : global.account.groupId,
            ...mergedParam,
          },
          callback() {
            that.props.save();
          },
        });
      }
    });
  };

  loadAreaAddress = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findPCAS',
      payload: {
        selectedOptions,
      },
    });
  };

  cancel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'eaddress/set',
      payload: {
        edit: false,
      },
    });
  }

  componentDidMount() {
    const {dispatch, eaddress} = this.props;
    const {recipientProvince, recipientCity, recipientArea} = eaddress.info;

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

  render() {
    const {form, dispatch, eaddress, dict} = this.props;
    const {getFieldDecorator} = form;
    const {pcaData} = dict;
    const {recipientProvince, recipientCity, recipientArea} = eaddress.info;
    const options = pcaData;

    // 非首次编辑显示取消按钮
    const isFirstEdit = !recipientProvince && !recipientCity && !recipientArea;

    //pattern: /^[1-9]\d*$/, message: '请输入合法的电话号码',
    return (
      <Form
        onSubmit={this.handleSubmit}
        className={cn('recevice-form')}
      >
        <FormItem {...formItemLayout} label="收件地址：">
          {getFieldDecorator('recipientDetailCode', {
            initialValue: !recipientProvince ? null : [recipientProvince, recipientCity, recipientArea],
            rules: [{
              required: true,
              message: '请选择',
            }],
          })(
            <Cascader
              options={options}
              placeholder="省(市/自治区)/市(区)/区(县)"
              loadData={this.loadAreaAddress}
              onChange={(e) => {
                dispatch({
                  type: 'eaddress/setFrom',
                  payload: {
                    recipientProvince: e[0] || '', //省
                    recipientCity: e[1] || '', //市
                    recipientArea: e[2] || '', //区
                  },
                });
              }}
            />
          )}
        </FormItem>

        <FormItem
          wrapperCol={{offset: 6, span: 18}}
        >
          {
            getFieldDecorator('recipientDetailAddress', {
              initialValue: eaddress.info.recipientDetailAddress,
              rules: [
                {
                  required: true, message: '请输入详细地址',
                },
              ],
            })(
              <Input placeholder="请输入详细地址"/>
            )
          }
        </FormItem>

        <FormItem {...formItemLayout} label="收件人姓名">
          {
            getFieldDecorator('recipientName', {
              initialValue: eaddress.info.recipientName,
              rules: [
                {
                  required: true, message: '请输入收件人姓名',
                },
              ],
            })(
              <Input placeholder="请输入"/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="联系电话">
          {
            getFieldDecorator('recipientPhone', {
              initialValue: eaddress.info.recipientPhone,
              rules: [
                {
                  required: true, message: '请输入联系电话',
                },
                {
                  pattern: /^[\d]{11}$/, message: '请输入合法的电话号码',
                },
              ],
            })(
              <Input maxLength={11} placeholder="请输入"/>
            )
          }
        </FormItem>
        <FormItem
          wrapperCol={{
            offset: 6,
            span: 18,
          }}
          className={cn('eaddress-btn-group')}
        >
          <Button
            loading={eaddress.isLoad}
            className={cn('standard')}
            size="large"
            type={'primary'}
            htmlType={'submit'}
          >
            保存
          </Button>
          {
            !isFirstEdit && (<Button className={'standard'} size="large" type={'default'} onClick={this.cancel}>
              取消
            </Button>)
          }
        </FormItem>
      </Form>
    );
  }
}

const FormClass = Form.create({
  // mapPropsToFields: props => Tools.getMapPropsToFields(props.eaddress.info, fieldContainer),
})(ReceiveEditable);

export default connect(state => state)(hot(module)(FormClass));
