import React from 'react';
import cn from 'classnames';
import {Modal, Input, Form} from 'antd';

import './style.less';

const {TextArea} = Input;

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  static defaultProps = {
    value: '',
    label: '',
    title: '',
    max: 120,
  };

  componentWillUnmount() {
  }

  render() {
    const {value} = this.state;
    const {props} = this;
    const {form, max} = props;
    const {getFieldDecorator} = form;

    const fieldValue = form.getFieldValue('value') || '';

    const curr = max - fieldValue.length;

    return (
      <Modal
        className="gsg-modal confirmInput"
        title={props.title}
        visible={props.visible}
        onOk={(e) => {
          e.preventDefault();
          form.validateFields((err) => {
            if (!err) {
              form.resetFields();
              props.onOk && props.onOk(fieldValue);
            }
          });
        }}
        onCancel={() => {
          form.resetFields();
          props.onCancel && props.onCancel();
        }}
      >
        <Form className={cn('confirmInput-box')}>
          <Form.Item
            label={props.label}
            labelCol={{span: 5}}
            wrapperCol={{span: 24 - 5}}
          >
            <div className={cn('textarea')}>
              {
                getFieldDecorator('value', {
                  initialValue: value,
                  rules: [{max, message: `最多只能输入${max}个字符`}],
                })(
                  <TextArea placeholder={`请输入${props.label}`}/>
                )
              }
              <em><i style={{color: curr < 0 ? '#FF4D4F' : '#32B16C'}}>{curr < 0 ? 0 : curr}</i>/{max}</em>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Class);
