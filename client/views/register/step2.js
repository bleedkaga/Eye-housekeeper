import React from 'react';
import {connect} from 'dva';
import {withRouter} from 'dva/router';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Icon} from 'antd';
import Tools from 'client/utils/tools';
import Config from 'client/config';

import '../login/style.less';
import './style.less';

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
    const {form, next} = this.props;

    form.validateFields({force: true}, (err) => {
      if (!err) {
        next && next();
      }
    });
  };

  render() {
    const {form, register} = this.props;
    const {getFieldDecorator} = form;

    return (<div className={'step1'}>
      <div className={cn('step-title')}>设置管理员密码</div>
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
                // suffix={register.step2.editPassword ? <span onClick={() => {
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
                    if (register.step2.editPassword == value) {
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
                // suffix={register.step2.affirmPassword ? <span onClick={() => {
                //   form.setFieldsValue({affirmPassword: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
          </div>
        </FormItem>
        <FormItem>
          <Button className={cn('login-play')} type={'primary'} htmlType={'submit'}>
            下一步
          </Button>
        </FormItem>
      </Form>
    </div>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'register/setStep2', props.register.step2, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.register.step2, fieldContainer),
})(Class);

export default connect(state => state)(withRouter(hot(module)(FormClass)));
