import React from 'react';
import cn from 'classnames';
import { Form, Radio, Button, Modal } from 'antd';
import { connect } from 'dva';
import { hot } from 'react-hot-loader';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 8},
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 4 },
  },
};
const buttonItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};


class SetTaxType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      value: null,
      options: [
        { label: '一般纳税人', value: 1},
        { label: '小规模纳税人', value: 2},
      ],
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { options } = this.state;
        const value = options.filter(item => item.value === values.taxType)[0];
        this.setState({
          modalVisible: true,
          value,
        });
      }
    });
  }

  confirm = () => {
    const {value} = this.state;
    const { dispatch, global } = this.props;
    const companyGroupId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok
    const that = this;

    dispatch({
      type: 'applyInvoicesPaper/saveForm',
      payload: {
        taxpayerType: value.value,
        companyId: companyGroupId, //ok
      },
      callback() {
        that.setState({
          modalVisible: false,
        });
        that.props.onSave(value);
      },
    });
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {options} = this.state;
    const { applyInvoicesPaper } = this.props;
    return (
      <div style={{marginTop: 44}}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="纳税人类型">
            {
              getFieldDecorator('taxType', {
                rules: [
                  {
                    required: true,
                    message: '请选择一种纳税人',
                  },
                ],
              })(
                <RadioGroup options={options}/>
              )
          }
          </FormItem>
          <FormItem {...buttonItemLayout} style={{textAlign: 'center'}}>
            <Button
              className={cn('btn-primary', 'save')}
              type="primary"
              htmlType="submit"
              size="large"
            >保存</Button>
          </FormItem>
        </Form>

        <Modal
          title="提示"
          className={cn('gsg-modal')}
          visible={this.state.modalVisible}
          onOk={() => this.confirm()}
          centered
          width={520}
          onCancel={() => this.handleCancel()}
        >
          <p className={cn('tips', 'f-tac')} style={{fontSize: 16, padding: '30px 0 '}}>纳税人类型仅能设置一次，设置成功后无法修改。</p>
        </Modal>
      </div>
    );
  }
}
const WrapperSetTaxType = Form.create()(SetTaxType);
export default connect(state => state)(hot(module)(WrapperSetTaxType));
