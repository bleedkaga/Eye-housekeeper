import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Icon, Modal} from 'antd';

import LoginLayout from 'client/components/LoginLayout';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';
import Config from 'client/config';


import './style.less';

const FormItem = Form.Item;

class Class extends React.Component {
  constructor(props) {
    super(props);
    Tools.updateFullScreenPathTheme(Config.routeType.org.key);

    this.state = {
      text: '登录',
      companies: [],
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props.dispatch({type: 'login/reset'});
    fieldContainer = {};
  }

  // componentWillReceiveProps(){
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch} = this.props;

    form.validateFields((err) => {
      if (!err) {
        const fields = form.getFieldsValue();
        const {loginPhone, password} = fields;
        dispatch({
          type: 'login/login',
          payload: {loginPhone, password},
          cbType2: (rel) => {
            this.setState({companies: rel || []});
          },
        });
      }
    });
  };

  onCompanyLogin(item) {
    const {dispatch} = this.props;
    dispatch({
      type: 'login/loginChoose',
      payload: {id: item.id},
    });
  }

  render() {
    const {text, companies} = this.state;
    const {history, form, login} = this.props;
    const {getFieldDecorator} = form;

    return (<LoginLayout>
      <div className={cn('login-title', 'f-ffa')}>
        {text}
      </div>
      <Form
        onSubmit={this.handleSubmit}
        className={cn('login-form')}
      >
        <FormItem>
          <div className={cn('login-input')}>
            {getFieldDecorator('loginPhone', {
              rules: [
                {required: true, message: '请输入登录账号'},
              ],
            })(
              <Input
                // onFocus={() => {
                //   this.setState({text: '登录'});
                // }}
                className={cn('suffix-close-input')}
                placeholder={'请输入登录账号'}
                // suffix={login.from.loginPhone ? <span onClick={() => {
                //   form.setFieldsValue({loginPhone: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
          </div>
        </FormItem>
        <FormItem>
          <div className={cn('login-input')}>
            {getFieldDecorator('password', {
              rules: [
                {required: true, message: '请输入登录密码'},
              ],
            })(
              <Input
                type={'password'}
                className={cn('suffix-close-input')}
                placeholder={'请输入登录密码'}
                // suffix={login.from.password ? <span onClick={() => {
                //   form.setFieldsValue({password: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
          </div>
        </FormItem>
        <FormItem>
          <Button loading={login.isLoad} className={cn('login-play')} type="primary" htmlType="submit">
            登录
          </Button>
        </FormItem>
      </Form>
      <a
        href={'javascript:;'}
        className={cn('login-forget', 'has-text')}
        onClick={() => {
          RH(history, 'forget', '/forget');
        }}
      >忘记密码</a>
      <Modal
        title={'请选择您要操作的单位'}
        className={cn('login-select-org')}
        width={500}
        closable={false}
        visible={!!companies.length}
        footer={null}
      >
        <div className={cn('content')}>
          {
            companies.map((item, index) => (<button
              key={`btn-${index}`}
              onClick={() => this.onCompanyLogin(item)}
              className={cn('item')}
            >{item.companyName}</button>))
          }
        </div>
      </Modal>
    </LoginLayout>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'login/setFrom', props.login.from, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.login.from, fieldContainer),
})(Class);

export default connect(state => state)(hot(module)(FormClass));
