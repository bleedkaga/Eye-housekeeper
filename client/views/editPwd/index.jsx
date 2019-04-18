import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Icon, message} from 'antd';
import LoginLayout from 'client/components/LoginLayout';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import Config from 'client/config';

import '../login/style.less';

const FormItem = Form.Item;

class Class extends React.Component {
  constructor(props) {
    super(props);

    Tools.updateFullScreenPathTheme(Config.routeType.org.key);

    this.state = {};
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    fieldContainer = {};
  }

  // componentWillReceiveProps(){
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch} = this.props;

    form.validateFields({force: true}, (err) => {
      if (!err) {
        const fields = form.getFieldsValue();
        const {editPassword} = fields;
        dispatch({
          type: 'editPwd/updatePassWord',
          payload: {password: editPassword},
          callback: (res) => {
            if (res.code === 0) {
              message.success('密码修改成功');
              setTimeout(() => {
                RH(null, 'login', '/login');
              }, 16);
            }
          },
        });
      }
    });
  };

  render() {
    const {form, editPwd} = this.props;
    const {getFieldDecorator} = form;

    return (<LoginLayout>
      <div className={cn('login-title', 'f-ffa')}>
        设置新密码
      </div>
      <Form
        onSubmit={this.handleSubmit}
        className={cn('login-form')}
      >
        <FormItem>
          <div className={cn('login-input')}>
            {getFieldDecorator('editPassword', {
              rules: [
                {required: true, message: '请输入新密码'},
              ],
            })(
              <Input
                type={'password'}
                className={cn('suffix-close-input')}
                placeholder={'请设置新密码'}
                // suffix={editPwd.from.editPassword ? <span onClick={() => {
                //   form.setFieldsValue({editPassword: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
          </div>
        </FormItem>
        <FormItem>
          <div className={cn('login-input')}>
            {getFieldDecorator('affirmPassword', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (editPwd.from.editPassword == value) {
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
                placeholder={'请确认新密码'}
                // suffix={editPwd.from.affirmPassword ? <span onClick={() => {
                //   form.setFieldsValue({affirmPassword: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
          </div>
        </FormItem>
        <FormItem>
          <Button loading={editPwd.isLoad} className={cn('login-play')} type={'primary'} htmlType={'submit'}>
            确认
          </Button>
        </FormItem>
      </Form>
    </LoginLayout>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'editPwd/setFrom', props.editPwd.from, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.editPwd.from, fieldContainer),
})(Class);

export default connect(state => state)(hot(module)(FormClass));
