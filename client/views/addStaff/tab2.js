import React from 'react';
import cn from 'classnames';
import {Form, Input, Select, Button, DatePicker, TreeSelect} from 'antd';
import moment from 'moment';
import Tools from 'client/utils/tools';
import {goBack} from 'client/routeHelper';

import './style.less';

const dateFormat = 'YYYY-MM-DD';

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
    const {dispatch, form, history, addStaff} = this.props;
    const {getFieldDecorator} = form;

    return (
      <div className={cn('tab2')}>
        <Form className={cn('tab2-form')} onSubmit={this.handleSubmit}>

          <div className={cn('row')}>
            <div className={cn('col')}>
              <FormItem {...formItemLayout} label={'工号'}>
                {getFieldDecorator('workNumber', {})(
                  <Input placeholder={'请输入'} maxLength={18}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'岗位'}>
                {getFieldDecorator('job', {})(
                  <Input placeholder={'请输入'} maxLength={10}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'职级'} >
                {getFieldDecorator('rank', {})(
                  <Input placeholder={'请输入'} maxLength={10}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'入职日期'}>
                <DatePicker
                  className={'form-date-picker'}
                  format={dateFormat}
                  placeholder={'选择日期'}
                  value={addStaff.tab2.entryDate ? moment(addStaff.tab2.entryDate, dateFormat) : undefined}
                  onChange={(date, dateStr) => {
                    dispatch({
                      type: 'addStaff/setTab2',
                      payload: {entryDate: dateStr},
                    });
                  }}
                />
              </FormItem>
            </div>
            <div className={cn('col')}>
              <FormItem {...formItemLayout} label={'所属部门'}>
                {getFieldDecorator('departmentCode', {})(
                  <TreeSelect
                    allowClear
                    style={{width: '100%'}}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={addStaff.department}
                    placeholder={'请选择'}
                    treeDefaultExpandAll
                    onChange={(e, [department], node) => {
                      /*const {pos} = node.triggerNode.props;
                      const p = pos.split('-');
                      p.shift();
                      console.log('当前', e, department);
                      console.log('层级');
                      const temp = (arr, idents, rel = [], i = 0) => {
                        const ident = idents[i];
                        if (ident) {
                          const item = arr[ident];
                          rel.push({value: item.value, title: item.title});
                          temp(item.children, idents, rel, ++i);
                        } else {
                          console.log(rel);
                        }
                      };
                      temp(addStaff.department, p);*/
                      dispatch({type: 'addStaff/setTab2', payload: {department}});
                    }}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'职务'} >
                {getFieldDecorator('position', {})(
                  <Input placeholder={'请输入'} maxLength={10}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'邮箱'}>
                {getFieldDecorator('email', {})(
                  <Input placeholder={'请输入'}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'用工性质'}>
                {getFieldDecorator('natureWork', {})(
                  <Select placeholder="请选择">
                    {addStaff.employmentnature ? addStaff.employmentnature.map((item, index) => (<Select.Option
                      key={`ee-${index}`}
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
    Tools.setOnFieldsChange(props.dispatch, 'addStaff/setTab2', props.addStaff.tab2, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.addStaff.tab2, fieldContainer),
})(Class);
export default Form3;
