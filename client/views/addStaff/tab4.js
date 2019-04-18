import React from 'react';
import cn from 'classnames';
import {Form, Radio, Select, Button} from 'antd';
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

  render() {
    const {form, history, addStaff} = this.props;
    const {getFieldDecorator} = form;

    return (
      <div className={cn('tab4')}>
        <Form className={cn('tab4-form')} onSubmit={this.handleSubmit}>
          <div className={cn('row')}>
            <div className={cn('col')}>
              <FormItem {...formItemLayout} label={'中共党员'}>
                {getFieldDecorator('communistPartyChina', {})(
                  <Select placeholder="请选择">
                    {addStaff.partyMembers ? addStaff.partyMembers.map((item, index) => (<Select.Option
                      key={`pms-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'劳动模范'}>
                {getFieldDecorator('modelLabor', {})(
                  <Select placeholder="请选择">
                    {addStaff.laborModel ? addStaff.laborModel.map((item, index) => (<Select.Option
                      key={`lml-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'工会职务'}>
                {getFieldDecorator('unionMember', {})(
                  <Select placeholder="请选择">
                    {addStaff.unionMembers ? addStaff.unionMembers.map((item, index) => (<Select.Option
                      key={`ums-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
            </div>
            <div className={cn('col')}>
              <FormItem {...formItemLayout} label={'共青团员'}>
                {getFieldDecorator('leagueMembers', {})(
                  <Select placeholder="请选择">
                    {addStaff.youthLeagueMembers ? addStaff.youthLeagueMembers.map((item, index) => (<Select.Option
                      key={`ylms-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'妇联工作'}>
                {getFieldDecorator('womanFederation', {})(
                  <Select placeholder="请选择">
                    {addStaff.womenFederation ? addStaff.womenFederation.map((item, index) => (<Select.Option
                      key={`wfn-${index}`}
                      value={item.dicval}
                    >{item.dicname}</Select.Option>)) : null}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'更多身份'}>
                {getFieldDecorator('identity', {})(
                  <Radio.Group>
                    {
                      addStaff.moreIdentities ? addStaff.moreIdentities.map((item, index) => (<Radio
                        key={`mis-${index}`}
                        value={item.dicval}
                      >{item.dicname}</Radio>)) : null
                    }
                  </Radio.Group>
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

const Form4 = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'addStaff/setTab4', props.addStaff.tab4, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.addStaff.tab4, fieldContainer),
})(Class);
export default Form4;
