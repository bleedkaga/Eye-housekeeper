import React from 'react';
import cn from 'classnames';
import {Form, Input, Select, Button, Radio} from 'antd';
import Tools from 'client/utils/tools';
import {goBack} from 'client/routeHelper';

import './style.less';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group;

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

  componentWillUnmount() {
    fieldContainer = {};
  }

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
    const {dispatch, form, history, addStaff, global, id} = this.props;
    const {getFieldDecorator} = form;
    const isEdit = !!id;
    return (
      <div className={cn('tab1')}>
        <Form className={cn('tab1-form')} onSubmit={this.handleSubmit}>

          <div className={cn('tab-tips')}>{isEdit ? '' : '*基本资料所有内容必填'}</div>

          <FormItem {...formItemLayout} label={'手机号'}>
            {getFieldDecorator('mobilePhone', {
              validateFirst: true,
              rules: [
                {required: true, message: '请输入手机号'},
                {pattern: /^[\d]{11}$/, message: '请输入正确的手机号'},
              ],
            })(
              <Input
                disabled={isEdit}
                maxLength={11}
                placeholder={'请输入'}
                addonAfter={isEdit ? null : <Button
                  loading={addStaff.isVerify}
                  onClick={() => {
                    form.validateFields(['mobilePhone'], (err) => {
                      if (!err) {
                        dispatch({
                          type: 'addStaff/phoneVerification',
                          payload: {
                            companyId: global.account.companyId,
                            phone: addStaff.tab1.mobilePhone,
                          },
                        });
                      }
                    });
                  }}
                >检测</Button>}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'姓名'}>
            {getFieldDecorator('userName', {
              rules: [
                {required: true, message: '请输入姓名'},
              ],
            })(
              <Input disabled={isEdit} placeholder={'请输入'} maxLength={30}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'证件类型'}>
            {getFieldDecorator('certificateTypeCode', {
              rules: [
                {required: true, message: '请选择证件类型'},
              ],
            })(
              <Select disabled={isEdit} placeholder="请选择">
                {addStaff.idType ? addStaff.idType.map((item, index) => (<Select.Option
                  key={`it-${index}`}
                  value={item.dicval}
                >{item.dicname}</Select.Option>)) : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'证件号'}>
            {getFieldDecorator('certificateCode', {
              rules: [
                {required: true, message: '请输入证件号'},
              ],
            })(
              <Input disabled={isEdit} placeholder={'请输入'} maxLength={20}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否为工会会员">
            {getFieldDecorator('identityId', {
              initialValue: addStaff.tab1.identityId,
              rules: [
                {required: true, message: '请选择会员类型'},
              ],
            })(
              <RadioGroup>
                <Radio value={1}>是</Radio>
                <Radio value={2}>不是</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <div className={cn('tab-btns')}>
            <Button loading={addStaff.isLoad} type="primary" htmlType="submit">
              保存
            </Button>
            <Button onClick={() => {
              goBack(history);
            }}
            >取消</Button>
          </div>
        </Form>

      </div>
    );
  }
}

let fieldContainer = {};

const Form3 = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'addStaff/setTab1', props.addStaff.tab1, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.addStaff.tab1, fieldContainer),
})(Class);
export default Form3;
