import React from 'react';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Modal, Form, Input} from 'antd';
import SendCode from 'client/components/SendCode';
import Tools from 'client/utils/tools';

import './style.less';


const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 15,
    offset: 1,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'global/getVfCodePhoneToken'});
  }

  componentWillUnmount() {
    fieldContainer = {};
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, global, onOk} = this.props;

    form.validateFields({force: true}, (err) => {
      if (!err) {
        const fields = form.getFieldsValue();
        const {editPassword, vfcode} = fields;
        dispatch({
          type: 'pwd/updatePassWord',
          payload: {
            phone: global.account.phone, //ok
            accountId: global.account.accountId, //ok
            vfcode,
            password: editPassword,
            type: 2, //1表示登陆密码  2表示支付密码
          },
          callback: (res) => {
            if (res.code === 0) {
              dispatch({type: 'pwd/reset'});
              onOk && onOk();
            }
          },
        });
      }
    });
  };

  render() {
    const {
      title, visible, onCancel, form, width = 600, dispatch, pwd, global,
    } = this.props;

    const {getFieldDecorator} = form;
    return (<Modal
      className={cn('gsg-modal', 'pwd-tab-modal')}
      title={title}
      width={width}
      visible={visible}
      okButtonProps={{loading: pwd.isLoad}}
      onOk={this.handleSubmit}
      onCancel={onCancel}
      okText={'保存'}
    >
      <div className={'pwd-modal-box'}>
        <Form
          hideRequiredMark
          className={cn('pwd-form')}
        >
          <FormItem{...formItemLayout} label={'手机号'}>
            <div className={cn('pwd-text')}>{Tools.getHidePhone(global.account.phone)}</div>
          </FormItem>
          <FormItem {...formItemLayout} label={'验证码'}>
            {getFieldDecorator('vfcode', {
              rules: [
                {required: true, message: '请输入验证码'},
              ],
            })(
              <Input
                type={'text'}
                className={cn('suffix-close-input', 'send-code-input')}
                placeholder={'请输入'}
                addonAfter={<SendCode
                  className={cn('pwd-send-code')}
                  id={'pwd2-send-code'}
                  send={(sending, okNext, noNext) => {
                    form.validateFields(['phone'], (err) => {
                      if (!err) {
                        sending();
                        dispatch({
                          type: 'pwd/getVerificationCode',
                          payload: {phone: global.account.phone},
                          callback: (res) => {
                            res.code === 0 ? okNext() : noNext();
                          },
                        });
                      }
                    });
                  }}
                />}
              />
            )}

          </FormItem>

          <FormItem {...formItemLayout} label={'新密码'}>
            {getFieldDecorator('editPassword', {
              rules: [
                {required: true, message: '请输入新密码'},
              ],
            })(
              <Input
                type={'password'}
                className={cn('suffix-close-input')}
                placeholder={'请输入'}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'重复密码'}>
            {getFieldDecorator('affirmPassword', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (pwd.pwd2.editPassword == value) {
                      callback();
                    } else {
                      callback(true);
                    }
                  },
                  message: '两次密码不一致',
                },
              ],
            })(
              <Input
                type={'password'}
                className={cn('suffix-close-input')}
                placeholder={'请输入'}
              />
            )}
          </FormItem>
        </Form>
      </div>
    </Modal>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'pwd/setPwd2', props.pwd.pwd2, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.pwd.pwd2, fieldContainer),
})(Class);

export default hot(module)(FormClass);
