import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Icon} from 'antd';
import SendCode from 'client/components/SendCode';
import LoginLayout from 'client/components/LoginLayout';
import Tools from 'client/utils/tools';
import Config from 'client/config';
import RH from 'client/routeHelper';

import '../login/style.less';

const FormItem = Form.Item;

class Class extends React.Component {
  constructor(props) {
    super(props);

    Tools.updateFullScreenPathTheme(Config.routeType.org.key);

    this.state = {};
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'global/getVfCodePhoneToken'});
  }

  componentWillUnmount() {
    fieldContainer = {};
  }

  // componentWillReceiveProps(){
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, history} = this.props;

    form.validateFields((err) => {
      if (!err) {
        const fields = form.getFieldsValue();
        const {phone, code} = fields;
        dispatch({
          type: 'global/verificationCodeCheck',
          payload: {phone, vfcode: code},
          callback: () => {
            RH(history, 'editPwd', '/editPwd');
          },
        });
      }
    });
  };

  render() {
    const {history, form, forget, dispatch, global} = this.props;
    const {getFieldDecorator} = form;

    return (<LoginLayout>
      <div className={cn('login-title', 'f-ffa')}>
        密码找回
      </div>
      <Form
        onSubmit={this.handleSubmit}
        className={cn('login-form')}
      >
        <FormItem>
          <div className={cn('login-input')}>
            {getFieldDecorator('phone', {
              rules: [
                {required: true, message: '请输入您的手机号'},
                {pattern: /^[\d]{11}$/, message: '请输入正确的手机号'},
              ],
            })(
              <Input
                className={cn('suffix-close-input')}
                placeholder={'请输入您的手机号'}
                // suffix={forget.from.phone ? <span onClick={() => {
                //   form.setFieldsValue({phone: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
          </div>
        </FormItem>
        <FormItem>
          <div className={cn('login-input')}>
            {getFieldDecorator('code', {
              rules: [
                {required: true, message: '请输入验证码'},
              ],
            })(
              <Input
                type={'text'}
                className={cn('suffix-close-input', 'send-code-input')}
                placeholder={'请输入验证码'}
                // suffix={forget.from.code ? <span onClick={() => {
                //   form.setFieldsValue({code: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
            <SendCode
              id={'forget-send-code'}
              send={(sending, okNext, noNext) => {
                form.validateFields(['phone'], (err) => {
                  if (!err) {
                    sending();
                    dispatch({
                      type: 'forget/getVerificationCode',
                      payload: {phone: forget.from.phone},
                      callback: (res) => {
                        res.code === 0 ? okNext() : noNext();
                      },
                    });
                  }
                });
              }}
            />
          </div>
        </FormItem>
        <FormItem>
          <Button className={cn('login-play')} type={'primary'} htmlType={'submit'} loading={global.isLoad}>
            验证手机
          </Button>
        </FormItem>
      </Form>
      <a
        href={'javascript:;'}
        className={cn('login-forget', 'has-text')}
        onClick={() => {
          RH(history, 'login', '/login');
        }}
      >返回登录</a>
    </LoginLayout>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'forget/setFrom', props.forget.from, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.forget.from, fieldContainer),
})(Class);

export default connect(state => state)(hot(module)(FormClass));
