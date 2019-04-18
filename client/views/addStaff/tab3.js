import React from 'react';
import cn from 'classnames';
import {Form, Input, Select, Button, DatePicker, Radio} from 'antd';
import moment from 'moment';
import Tools from 'client/utils/tools';
import {goBack} from 'client/routeHelper';

import './style.less';

const dateFormat = 'YYYY-MM-DD HH:mm';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
    offset: 1,
  },
};
const formItemLayoutFirst = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
    offset: 1,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount(){
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

  getBirthday() {
    const {addStaff: {tab3}} = this.props;
    if (
      tab3.yearBirth &&
      tab3.month &&
      tab3.date &&
      (tab3.hour || tab3.hour == '0') &&
      (tab3.minute || tab3.minute == '0')) {
      return moment(`${tab3.yearBirth}-${tab3.month}-${tab3.date} ${tab3.hour}:${tab3.minute}`, dateFormat);
    } else {
      return undefined;
    }
  }

  render() {
    const {dispatch, form, history, addStaff} = this.props;
    const {getFieldDecorator} = form;

    return (
      <div className={cn('tab3')}>
        <Form className={cn('tab3-form')} onSubmit={this.handleSubmit}>
          <div className={cn('row')}>
            <div className={cn('col', 'col-40')}>
              <FormItem {...formItemLayoutFirst} label={'性别'}>
                {getFieldDecorator('gender', {})(
                  <Radio.Group>
                    {
                      addStaff.gender ? addStaff.gender.map((item, index) => (<Radio
                        key={`gr-${index}`}
                        value={item.dicval}
                      >{item.dicname}</Radio>)) : null
                    }
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem {...formItemLayoutFirst} label={'婚姻状况'}>
                {getFieldDecorator('marriage', {})(
                  <Radio.Group>
                    {
                      addStaff.marryStatus ? addStaff.marryStatus.map((item, index) => (<Radio
                        key={`mss-${index}`}
                        value={item.dicval}
                      >{item.dicname}</Radio>)) : null
                    }
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem {...formItemLayoutFirst} label={'户籍类型'}>
                {getFieldDecorator('householdType', {})(
                  <Radio.Group>
                    {
                      addStaff.censusRegisterType ? addStaff.censusRegisterType.map((item, index) => (<Radio
                        key={`crt-${index}`}
                        value={item.dicval}
                      >{item.dicname}</Radio>)) : null
                    }
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem {...formItemLayoutFirst} label={'出生日期'}>
                <DatePicker
                  style={{width: '80%'}}
                  showTime={{format: 'HH:mm'}}
                  className={'form-date-picker'}
                  format={dateFormat}
                  placeholder={'选择日期'}
                  value={this.getBirthday()}
                  onChange={(date) => {
                    dispatch({
                      type: 'addStaff/setTab3',
                      payload: {
                        yearBirth: date ? date.format('Y') : '', //出生年
                        month: date ? date.format('M') : '', //月份
                        date: date ? date.format('D') : '', //日期
                        hour: date ? date.format('H') : '', //时间
                        minute: date ? date.format('m') : '', //分钟
                      },
                    });
                  }}
                />
              </FormItem>
            </div>
            <div className={cn('col')}>
              <FormItem {...formItemLayout} label={'国籍/地区'}>
                {getFieldDecorator('nationality', {})(
                  <Select placeholder="请选择">
                    {addStaff.nationality ? addStaff.nationality.map((item, index) => (<Select.Option
                      key={`ny-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'文化程度'}>
                {getFieldDecorator('levelEducation', {})(
                  <Select placeholder="请选择">
                    {addStaff.educationalLevel ? addStaff.educationalLevel.map((item, index) => (<Select.Option
                      key={`ell-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'政治面貌'}>
                {getFieldDecorator('politicalLandscape', {})(
                  <Select placeholder="请选择">
                    {addStaff.politicalStatus ? addStaff.politicalStatus.map((item, index) => (<Select.Option
                      key={`pss-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
            </div>
            <div className={cn('col')}>
              <FormItem {...formItemLayout} label={'身高'}>
                {getFieldDecorator('height', {})(
                  <Input placeholder={'请输入'} suffix={<i>厘米</i>} maxLength={3}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={'体重'}>
                {getFieldDecorator('weight', {})(
                  <Input placeholder={'请输入'} suffix={<i>kg</i>} maxLength={3}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={'血型'}>
                {getFieldDecorator('bloodType', {})(
                  <Select placeholder="请选择">
                    {addStaff.bloodType ? addStaff.bloodType.map((item, index) => (<Select.Option
                      key={`bte-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
            </div>
          </div>

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
    Tools.setOnFieldsChange(props.dispatch, 'addStaff/setTab3', props.addStaff.tab3, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.addStaff.tab3, fieldContainer),
})(Class);
export default Form3;
