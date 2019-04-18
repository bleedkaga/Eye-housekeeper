import React from 'react';
import AJAX from 'client/utils/ajax';
import API from 'client/services/capacityTax';
import './style.less';
import HintInput from 'client/components/HintInput';
import { Form, Input, Row, Col, Button, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class TrialForms extends React.Component {
  // 提交表单, 计算单个用户薪筹
  handleSubmit = (e) => {
    e.preventDefault();
    const { updateState } = this.props;
    const { validateFields } = this.props.form;
    updateState({
      startTrialBtnLoading: true,
    });
    this.queryData((rel) => {
      if (!rel) {
        updateState({
          startTrialBtnLoading: false,
        });
        return;
      }
      validateFields((err, values) => {
        if (!err) {
          AJAX.post(API.taxTrialOne, values).then((res) => {
            if (res && res.code === 0) {
              updateState({
                startTrialBtnLoading: false,
                trialFull: true,
                schemeData: res.data,
              });
            } else {
              updateState({
                startTrialBtnLoading: false,
              });
            }
          });
        }
      });
    });
  };

  // 当应发工资, 户口类型, 当前社保缴纳标准, 都没错的时候, 请求回显数据
  queryData = (cb) => {
    const { validateFields, setFieldsValue } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        AJAX.post(API.taxTrial, values).then((res) => {
          if (res && res.code === 0) {
            for (const [key, value] of Object.entries(res.data)) {
              if (key === "companyId") continue; // eslint-disable-line
              setFieldsValue({[key]: value});
            }
            cb && cb(true);
          } else {
            cb && cb(false);
          }
        });
      } else {
        cb && cb(false);
      }
    });
  };

  // 应发工资
  preTaxValidate = (proxy) => {
    const { setFields } = this.props.form;
    const { value } = proxy.target;
    if (value === '') {
      setFields({["preTaxSalary"]: {value, errors: [new Error("请输入税前薪资金额")]}}); // eslint-disable-line
    } else
    if (value > 9999999.99) {
      setFields({["preTaxSalary"]: {value, errors: [new Error("您输入的数额太大")]}}); // eslint-disable-line
      setFields({["securityPaymentBase"]: {value: "18318"}}); // eslint-disable-line
      this.bothOfThem('preTaxSalary', value);
    } else
    if (value < 0.01) {
      setFields({["preTaxSalary"]: {value, errors: [new Error("您输入的数额太小")]}}); // eslint-disable-line
      setFields({["securityPaymentBase"]: {value: "3664"}}); // eslint-disable-line
      this.bothOfThem('preTaxSalary', value);
    } else {
      if (value < 3664) {
        setFields({["securityPaymentBase"]: {value: "3664"}}); // eslint-disable-line
      } else if (value > 18318) {
        setFields({["securityPaymentBase"]: {value: "18318"}}); // eslint-disable-line
      } else {
        setFields({["securityPaymentBase"]: {value}}); // eslint-disable-line
      }
      this.bothOfThem('preTaxSalary', value);
      this.queryData();
    }
  };

  // 户口类型选择
  accountTypeBlur = (value) => {
    const { setFields } = this.props.form;

    if (value == 'null') {
      setFields({["accountType"]: { value: null, errors: [new Error("请选择户口类型")] }}) // eslint-disable-line
    } else {
      this.queryData();
    }
  };

  // 当前社保缴纳标准
  paymentBaseBlur = (proxy) => {
    const { setFields } = this.props.form;
    const { value } = proxy.target;
    if (value > 18318) {
      setFields({["securityPaymentBase"]: { value: "18318", errors: [new Error("请输入3664-18318.00区间内的数字")] }}); // eslint-disable-line
      this.bothOfThem('securityPaymentBase', value);
    } else
    if (value < 3664) {
      setFields({["securityPaymentBase"]: { value: "3664", errors: [new Error("请输入3664-18318.00区间内的数字")] }}); // eslint-disable-line
      this.bothOfThem('securityPaymentBase', value);
    } else {
      this.bothOfThem('securityPaymentBase', value);
      this.queryData();
    }
  };

  // 其他表单校验
  otherValidate = (event, proxy) => {
    const { setFields } = this.props.form;
    const { value } = event.target;
    if (value > 99999.99) {
      setFields({[proxy]: { value: '', errors: [new Error('您输入的数额太大')] }});
      this.bothOfThem(proxy, value);
    } else {
      this.bothOfThem(proxy, value, this.queryData);
    }
  };

  // 保留两位小数
  bothOfThem = (proxy, value, callback) => {
    const { setFields } = this.props.form;
    const tmp = value.split('.');
    const dot = tmp && tmp.length > 1 && tmp[1].length > 2;
    if (dot) {
      setFields({[proxy]: {value: "", errors: [new Error("小数点后两位数字")]}}) // eslint-disable-line
    } else {
      callback && callback();
    }
  };

  render() {
    const { form, startTrialBtnLoading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };

    const maybeSelect = [
      {
        label: '请选择',
        value: null,
      },
      {
        label: '城镇',
        value: '城镇',
      },
      {
        label: '非城镇',
        value: '非城镇',
      },
    ];

    return (
      <div>
        <p style={{ marginBottom: '10px' }}>薪税筹划试算（请填入试算样本的薪筹机构）</p>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span="12">
              <FormItem
                label="应发工资"
                {...formItemLayout}
              >
                {getFieldDecorator('preTaxSalary', {
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入税前薪资金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} placeholder="0" onBlur={this.preTaxValidate}/>
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="户口类型"
                {...formItemLayout}
              >
                {getFieldDecorator('accountType', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '请选择户口类型' },
                  ],
                })(
                  <Select onBlur={this.accountTypeBlur}>
                    {maybeSelect.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span="12">
              <FormItem
                label="社会平均工资标准"
                {...formItemLayout}
              >
                {getFieldDecorator('clubLevel', {
                  initialValue: '6106',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入社会平均工资标准金额' },
                  ],
                })(
                  <HintInput
                    hasUnit
                    tooltipContent="重庆市2018年7月1日后社会平均工资标准为6106元"
                  />
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="当前缴纳社保标准"
                {...formItemLayout}
              >
                {getFieldDecorator('securityPaymentBase', {
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入当前缴纳社保标准金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} placeholder="0" onBlur={this.paymentBaseBlur}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span="12">
              <FormItem
                label="社保(公司缴纳)"
                {...formItemLayout}
              >
                {getFieldDecorator('securityCompanyPayment', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入社保公司缴纳金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'securityCompanyPayment')}/>
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="社保(个人缴纳)"
                {...formItemLayout}
              >
                {getFieldDecorator('securityEmployeePayment', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入社保个人缴纳金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'securityEmployeePayment')}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span="12">
              <FormItem
                label="公积金(公司缴纳)"
                {...formItemLayout}
              >
                {getFieldDecorator('providentCompanyPaymentPart', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入公积金公司缴纳金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'providentCompanyPaymentPart')}/>
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="公积金(个人缴纳)"
                {...formItemLayout}
              >
                {getFieldDecorator('providentPersonalPart', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入公积金个人缴纳金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'providentPersonalPart')}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span="12">
              <FormItem
                label="企业年金（公司缴纳)"
                {...formItemLayout}
              >
                {getFieldDecorator('companyAnnuityPaymentPart', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入企业年金公司缴纳金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'companyAnnuityPaymentPart')}/>
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="企业年金（个人缴纳)"
                {...formItemLayout}
              >
                {getFieldDecorator('companyAnnuityPersonalPayment', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入企业年金个人缴纳金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'companyAnnuityPersonalPayment')}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span="12">
              <FormItem
                label="补充医疗保险"
                {...formItemLayout}
              >
                {getFieldDecorator('companyMedicalInsurance', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入补充医疗保险金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'companyMedicalInsurance')}/>
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="教育培训经费"
                {...formItemLayout}
              >
                {getFieldDecorator('educationTrainingFunds', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入教育培训经费' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'educationTrainingFunds')}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span="12">
              <FormItem
                label="个税起征点"
                {...formItemLayout}
              >
                {getFieldDecorator('incomeTaxExemption', {
                  initialValue: '5000',
                  rules: [
                    { required: true, message: '' },
                  ],
                })(
                  <HintInput
                    hasUnit
                    disabled
                    tooltipContent="2018年10月1日后个税起征点标准为5000元"
                  />
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="应扣个税"
                {...formItemLayout}
              >
                {getFieldDecorator('shouldBeDeducted', {
                  initialValue: '0',
                  rules: [
                    { required: true, message: '' },
                  ],
                })(
                  <Input disabled suffix={<span>元</span>}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span="12">
              <FormItem
                label="其他应扣除部分"
                {...formItemLayout}
              >
                {getFieldDecorator('other', {
                  initialValue: '0',
                  getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : ''),
                  rules: [
                    { required: true, message: '请输入其他应扣除部分金额' },
                  ],
                })(
                  <Input suffix={<span>元</span>} onBlur={e => this.otherValidate(e, 'other')}/>
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="税后发放薪资"
                {...formItemLayout}
              >
                {getFieldDecorator('employeesActualWages', {
                  initialValue: '0',
                  rules: [
                    { required: true, message: '' },
                  ],
                })(
                  <Input disabled suffix={<span>元</span>}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            wrapperCol={{
              span: 10,
              offset: 11,
            }}
          >
            <Button type="primary" htmlType="submit" loading={startTrialBtnLoading}>开始试算</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(TrialForms);
