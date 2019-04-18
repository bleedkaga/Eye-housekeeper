import React from 'react';
import cn from 'classnames';
import Tools from 'client/utils/tools';
import { Form, Button, Spin } from 'antd';
import { connect } from 'dva';
import { hot } from 'react-hot-loader';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};


class ReceiveStatic extends React.Component {
  componentWillUnmount() {
    fieldContainer = {};
  }

  render() {
    const { form, dispatch, eaddress } = this.props;
    const { getFieldDecorator } = form;
    if (eaddress.isload) {
      return (
        <Spin />
      );
    }
    return (
      <Form
        onSubmit={this.handleSubmit}
        className={cn('recevice-form')}
      >
        <FormItem {...formItemLayout} label="收件地址：">
          {getFieldDecorator('username', {})(
            <div >
              <p>{eaddress.info.recipientAddress}</p>
            </div>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="收件人姓名">
          {
            getFieldDecorator('receiveAddress', {})(
              <p>{eaddress.info.recipientName}</p>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="联系电话">
          {
            getFieldDecorator('receiveAddress', {
            })(
              <p>{eaddress.info.recipientPhone}</p>
            )
          }
        </FormItem>
        <FormItem
          wrapperCol={{
            offset: 6,
            span: 18,
          }}
        >
          <Button
            className={cn('standard')}
            size="large"
            type={'primary'}
            onClick={() => {
              dispatch({
                type: 'eaddress/set',
                payload: {
                  edit: true,
                },
              });
            }}
          >
            编辑
          </Button>
        </FormItem>
      </Form>
    );
  }
}

let fieldContainer = {};
const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'eaddress/setReceivceAddress', props.eaddress.setReceivceAddress, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.eaddress.setReceivceAddress, fieldContainer),
})(ReceiveStatic);

export default connect(state => state)(hot(module)(FormClass));
