import React from 'react';
import cn from 'classnames';
import { Icon, Alert, Form, Cascader, Input, Button, Radio} from 'antd';
import './style.less';
// import { EAddress } from './../../routeHelper';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 8},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const buttonItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};


class EAddressComponent extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={cn('eaddress-container')}>
        <Alert message="温馨提示：该邮寄信息将作为默认地址保存，如需修改请到“邮寄地址”页进行修改。" type="warning" />
        <Form>
          <FormItem {...formItemLayout} label="收件地址">
            {
                            getFieldDecorator('address', {
                              rules: [{
                                required: true,
                                message: '请选择',
                              }],
                            })(
                              <Cascader placeholder="省(直辖市/自治区)/市(区)/区(县)" />
                            )
                        }
          </FormItem>

          <FormItem {...formItemLayout} wrapperCol={{sm: { span: 16, offset: 6 }}}>
            {
                            getFieldDecorator('address', {
                              rules: [{
                                required: true,
                                message: '请输入详细地址',
                              }],
                            })(
                              <Input placeholder="请输入详细地址" />
                            )
                        }
          </FormItem>

          <FormItem {...formItemLayout} label="收件人姓名">
            {
                            getFieldDecorator('address', {
                              rules: [{
                                required: true,
                                message: '请输入',
                              }],
                            })(
                              <Input placeholder="请输入" />
                            )
                        }
          </FormItem>

          <FormItem {...formItemLayout} label="联系电话">
            {
                            getFieldDecorator('address', {
                              rules: [{
                                required: true,
                                message: '请输入',
                              }],
                            })(
                              <Input placeholder="请输入" />
                            )
                        }
          </FormItem>
          <FormItem {...buttonItemLayout} style={{textAlign: 'center'}}>
            <Button type="primary" htmlType="submit">保存</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const EAddressForm = Form.create()(EAddressComponent);

const InvoiceDetail = props => (
  <div className={cn('invoice-detail-container')}>

    <div className={cn('invoice-detail-item')}>
      <h3 className={cn('invoice-detail-title')}>发票详情</h3>
      <div className={cn('invoice-detail-info')}>
        <div className={cn('invoice-left')}>
          <span>发票 ( 张 )：2</span>
        </div>
        <span>价税合计总额 ( 元 )：2</span>
      </div>
    </div>

    <div className={cn('invoice-detail-item')}>
      <h3 className={cn('invoice-detail-title')}>单位信息</h3>
      <div className={cn('invoice-detail-info')}>
        <div className={cn('invoice-left')}>
          <span>单位名称：重庆某某科技有限公司</span>
        </div>
        <span>纳税人类型：一般纳税人</span>
      </div>
    </div>

    <div className={cn('invoice-detail-item')}>
      <h3 className={cn('invoice-detail-title')}>邮寄信息</h3>
      <div className={cn('invoice-detail-info')}>
        <div className={cn('invoice-left')}>
          <p className="mul-cell">收件人姓名：王某某</p>
          <p className="mul-cell">详细地址：重庆市渝中区某某街某某号某某栋5楼</p>
        </div>
        <span>联系电话：13912345678</span>
      </div>
    </div>

    <div className={cn('invoice-detail-item')}>
      <h3 className={cn('invoice-detail-title')}>开票说明</h3>
      <div className={cn('invoice-detail-info')}>
        <p className="mul-cell">说明内容说明内容说明内容说明内容说明内容说明内容说明内容说明内容说明内容说明内容说明内容说明内容说明内容</p>
      </div>
    </div>

  </div>
);

class SetTaxType extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{marginTop: 24}}>
        <Form>
          <FormItem {...formItemLayout} label="纳税人类型">
            {
                            getFieldDecorator('taxType', {

                            })(
                              <RadioGroup options={
                                    [
                                      { label: '一般纳税人', value: 1},
                                      { label: '小规模纳税人', value: 2},
                                    ]
                                }
                              />
                            )
                        }
          </FormItem>
          <FormItem {...buttonItemLayout} style={{textAlign: 'center'}}>
            <Button className={cn('btn-primary')} type="primary" htmlType="submit" size="large">保存</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
const WrapperSetTaxType = Form.create()(SetTaxType);

const Step1 = () => (
  <div className={cn('record-modal')}>
    <div className={cn('record-mask')} />
    <div className={cn('record-modal-body')}>
      <div className={cn('m-header')}>
        <div className={cn('m-step')}>
          <span className={cn('back')}>
            <Icon type="arrow-left" />
            <label>返回</label>
          </span>
          <span>
                        设置纳税人类型
          </span>
        </div>
        <div className={cn('close')}>
          <i className={cn('icon-close')} />
        </div>

      </div>
      <div className={cn('m-body')}>
        <WrapperSetTaxType />
      </div>
    </div>
  </div>
);

const Step2 = () => (
  <div className={cn('record-modal')}>
    <div className={cn('record-mask')} />
    <div className={cn('record-modal-body')}>
      <div className={cn('m-header')}>
        <div className={cn('m-step')}>
          <span className={cn('back')}>
            <Icon type="arrow-left" />
            <label>返回</label>
          </span>
          <span>
                        邮寄地址
          </span>
        </div>
        <div className={cn('close')}>
          <i className={cn('icon-close')} />
        </div>

      </div>
      <div className={cn('m-body')}>
        <EAddressForm />
      </div>
    </div>
  </div>
);

const Step3 = props => (
  <div className={cn('record-modal')}>
    <div className={cn('record-mask')} />
    <div className={cn('record-modal-body')}>
      <div className={cn('m-header')}>
        <div className={cn('m-tab')}>
          <span className={cn('m-tab-item', props.tabindex == 1 ? 'active' : '')}>开票详情</span>
          <span className={cn('m-tab-item', props.tabindex == 2 ? 'active' : '')}>发票预览</span>
        </div>
        <div className={cn('close')}>
          <i className={cn('icon-close')} />
        </div>

      </div>
      <div className={cn('m-body')}>
        <InvoiceDetail />
      </div>
    </div>
  </div>
);

class RecordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabindex: 1,
    };
  }

  render() {
    const { tabindex } = this.state;
    const { step } = this.props;
    let StepComponent = null;
    if (step == 1) {
      StepComponent = <Step3 tabindex={tabindex}/>;
    }
    if (step == 2) {
      StepComponent = <Step2 tabindex={tabindex}/>;
    }
    if (step == 3) {
      StepComponent = <Step1 tabindex={tabindex}/>;
    }

    return (
      <div className={cn('record-modal')}>
        <div className={cn('record-mask')} />
        <div className={cn('record-modal-body')}>
          <div className={cn('m-header')}>
            <div className={cn('m-tab')}>
              <span className={cn('m-tab-item', props.tabindex == 1 ? 'active' : '')}>开票详情</span>
              <span className={cn('m-tab-item', props.tabindex == 2 ? 'active' : '')}>发票预览</span>
            </div>
            <div className={cn('close')}>
              <i className={cn('icon-close')} />
            </div>

          </div>
          <div className={cn('m-body')}>
            {
                            this.props.children
                        }
          </div>
        </div>
      </div>
    );
  }
}

export default RecordModal;
