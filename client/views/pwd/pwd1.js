import React from 'react';
import {connect} from 'dva';
import {withRouter} from 'dva/router';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, message} from 'antd';
import SendCode from 'client/components/SendCode';
import Tools from 'client/utils/tools';
import {goBack} from 'client/routeHelper';

import './style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
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

  // componentWillReceiveProps(){
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, global} = this.props;

    form.validateFields({force: true}, (err) => {
      if (!err) {
        const fields = form.getFieldsValue();
        const {editPassword, vfcode} = fields;
        dispatch({
          type: 'pwd/updatePassWord',
          payload: {
            phone: global.account.phone,
            accountId: global.account.accountId, //ok
            vfcode,
            password: editPassword,
            type: 1, //1表示登录密码  2表示支付密码
          },
          callback: (res) => {
            if (res.code === 0) {
              dispatch({type: 'pwd/reset'});
              const un = message.success('修改登录密码成功，2秒后重新登录');
              setTimeout(() => {
                un();
                Tools.logout();
              }, 2000);
            }
          },
        });
      }
    });
  };


  render() {
    const {history, form, pwd, dispatch, global} = this.props;
    const {getFieldDecorator} = form;

    return (<div className={'pwd1'}>
      <Form
        hideRequiredMark
        className={cn('pwd-form')}
        onSubmit={this.handleSubmit}
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
                id={'pwd1-send-code'}
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
                  if (pwd.pwd1.editPassword == value) {
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

        <div className={cn('pwd-btns')}>
          <Button loading={pwd.isLoad} className={cn('login-play')} type="primary" htmlType="submit">
            保存
          </Button>
          <Button onClick={() => {
            goBack(history);
          }}
          >取消</Button>
        </div>
      </Form>
    </div>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'pwd/setPwd1', props.pwd.pwd1, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.pwd.pwd1, fieldContainer),
})(Class);

export default connect(state => state)(withRouter(hot(module)(FormClass)));
