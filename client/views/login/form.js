import React from 'react';
import cn from 'classnames';
import {Form, Input, Button} from 'antd';

const FormItem = Form.Item;

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {handleSubmit, form} = this.props;

    form.validateFields((err) => {
      if (!err) {
        const fields = form.getFieldsValue();
        const {username, password} = fields;
        console.log(username, password);
        handleSubmit && handleSubmit(username, password);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (<Form onSubmit={this.handleSubmit} className={cn('login-form')}>
      <FormItem>
        <div className={cn('login-input')}>
          {getFieldDecorator('useranme', {
            rules: [
              {required: true, message: '请输入登录账号'},
              {pattern: /^[\d]{11}$/, message: '请输入正确的手机号'},
            ],
          })(<Input placeholder={'请输入登录账号'}/>)}
        </div>
      </FormItem>
      <FormItem>
        <div className={cn('login-input')}>
          {getFieldDecorator('password', {
            rules: [
              {required: true, message: '请输入登录密码'},
            ],
          })(
            <Input type={'password'} placeholder={'请输入登录密码'}/>
          )}
        </div>
      </FormItem>
      <FormItem>
        <Button className={cn('login-play')} type="primary" htmlType="submit">
          登录
        </Button>
      </FormItem>
    </Form>);
  }
}


const Form2 = Form.create()(Class);
export default Form2;
