import React from 'react';
import {connect} from 'dva';
import {withRouter} from 'dva/router';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Select, Row, Col, Cascader, Spin, message} from 'antd';
import Tools from 'client/utils/tools';
import Config from 'client/config';
import LoadingComplete, {Loading, CompleteTag} from 'client/components/IACLoading';

import '../login/style.less';
import './style.less';

const FormItem = Form.Item;

const labelColSpan = 4;

const formItemLayout = {
  labelCol: {
    span: labelColSpan,
  },
  wrapperCol: {
    span: 24 - labelColSpan,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);
    Tools.updateFullScreenPathTheme(Config.routeType.org.key);

    this.state = {
      isShowCompanyNameLoading: 0,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;

    const un = message.loading('加载中...', 15);
    Promise.all([
      // dispatch({type: 'global/findFirstValListNoAll', payload: {dict_codes: 'unitType,industry,unitNatureCode'}}),
      // dispatch({type: 'global/findProvince', payload: {}}),
      dispatch({type: 'dict/find', payload: {dict_codes: ['unitType', 'industry', 'unitNatureCode']}}), //获取一级字典
      dispatch({type: 'dict/findPCAS', payload: {street: true}}), //获取省
    ]).then(() => {
      un();
      // this.onNext(); //省市区暂不还原
    });
  }

  componentWillUnmount() {
    clearTimeout(this._companyNameLoading);
    fieldContainer = {};
  }

  // componentWillReceiveProps(){
  // }

  onNext() {
    const {register: {step3}, dispatch, global} = this.props;
    // && step3.city && step3.area && step3.streetTown
    if (step3.province) {
      //初始化市
      const p = global.areaAddressData.find(item => item.value === step3.province);
      if (p) {
        dispatch({
          type: 'global/findCity',
          payload: {selectedOptions: [p]},
          callback: () => {
            //区
            const c = p.children.find(item => item.value === step3.city);
            if (c) {
              dispatch({
                type: 'global/findArea',
                payload: {selectedOptions: [c]},
                callback: () => {
                  //街道
                  const a = c.children.find(item => item.value === step3.area);
                  if (a) {
                    dispatch({
                      type: 'global/findStreet',
                      payload: {selectedOptions: [a]},
                    });
                  }
                },
              });
            }
          },
        });
      }
    }
  }

  loadCompanyName = (value) => {
    clearTimeout(this._loadCompanyNameTimer);
    value = Tools.formatCompanyName(value);
    if (!value || value.length < 2) return false;
    const {dispatch, register} = this.props;
    this._loadCompanyNameTimer = setTimeout(() => {
      dispatch({
        type: 'register/searchCompanyName',
        payload: {
          companyName: value,
          phone: register.step1.phone,
          vfcode: register.step1.vfcode,
        },
      });
    }, 444);
  };

  loadIndustryType = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findCNext',
      payload: {
        dict_code: 'industry',
        selectedOptions,
      },
    });
  };

  loadAreaAddress = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findCPCAS',
      payload: {selectedOptions, street: true},
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, register, next} = this.props;

    form.validateFields((err) => {
      if (!err) {
        const {step3 = {}, step1 = {}, step2 = {}} = register;
        const param = {
          ...step3,
          ...step1,
          password: step2.editPassword,
        };

        param.companyName = param.companyName.split('@@')[0];

        //删除多余的数据
        delete param.socialTypeArr;
        delete param.areaAddress;
        delete param.agree;
        if (param.companyType == 1) {
          //工商注册
          delete param.uniformCreditCode;
          if (!param.keyNo || !param.creditCode) {
            dispatch({
              type: 'register/setStep3',
              payload: {
                companyName: '',
              },
            });
            return message.error('请选择正确单位名称');
          }
          param.no = param.no || param.creditCode;
        } else {
          delete param.keyNo;
          delete param.no;
          delete param.creditCode;
        }

        dispatch({
          type: 'register/insertRegisterCompany',
          payload: {
            ...param,
          },
          callback: (res) => {
            dispatch({
              type: 'login/loginChoose',
              payload: {
                id: res.data,
                __autoLoading: true,
              },
              callback: () => {
                next && next();
              },
            });
          },
        });
      }
    });
  };

  render() {
    const {form, register, global, dispatch, dict} = this.props;
    const {getFieldDecorator} = form;
    const {isShowCompanyNameLoading} = this.state;

    return (<div className={'step3'}>
      <div className={cn('step-title')}>完善信息</div>
      <Form
        onSubmit={this.handleSubmit}
        className={cn('step3-form')}
      >
        <FormItem
          {...formItemLayout}
          label="工商属性"
        >
          {getFieldDecorator('companyType', {
            rules: [
              {required: true, message: '请选择工商属性'},
            ],
          })(
            <Select placeholder={'请选择工商属性'}>
              {
                dict.unitType.map((item, index) => (<Select.Option
                  key={`unitType-${index}`}
                  value={item.value}
                >{item.label}</Select.Option>))
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="单位类型"
        >
          {getFieldDecorator('unitNatureCode', {
            rules: [
              {required: true, message: '请选择单位类型'},
            ],
          })(
            <Select placeholder={'请选择单位类型'}>
              {
                dict.unitNatureCode.map((item, index) => (<Select.Option
                  key={`unitNatureCode-${index}`}
                  value={item.value}
                >{item.label}</Select.Option>))
              }
            </Select>
          )}
        </FormItem>

        {
          register.step3.companyType == 1 ?
            <FormItem
              {...formItemLayout}
              label="单位名称"
            >
              {getFieldDecorator('companyName', {
                rules: [
                  {required: true, message: '请选择单位名称'},
                  {min: 2, message: '请至少输入2个字符查询单位名称'},
                ],
              })(
                <Select
                  disabled={isShowCompanyNameLoading === 1}
                  className={cn('suffix-close-input')}
                  placeholder={'请选择单位'}
                  filterOption={false}
                  showArrow={false}
                  showSearch
                  defaultActiveFirstOption={false}
                  onSearch={this.loadCompanyName}
                  notFoundContent={register.isLoadCompanyList ? <Spin size="small"/> : null}
                  onChange={(e, c) => {
                    const {item} = c.props;
                    dispatch({
                      type: 'register/setStep3',
                      payload: {
                        companyName: item.Name,
                        keyNo: item.KeyNo,
                        no: item.No,
                        creditCode: item.CreditCode,
                      },
                    });

                    this.setState({isShowCompanyNameLoading: 1});
                    this._companyNameLoading = setTimeout(() => {
                      this.setState({isShowCompanyNameLoading: 2});
                    }, 2000);
                  }}
                >
                  {register.companyList.map(d => (<Select.Option
                    key={`${d.Name}-${d.KeyNo}`}
                    item={d}
                    value={`${d.Name}@@${d.KeyNo}`}
                  >{d.Name}</Select.Option>))}
                </Select>
              )}
              {isShowCompanyNameLoading && isShowCompanyNameLoading !== 1 ? <CompleteTag/> : null}
              {isShowCompanyNameLoading === 1 ? <Loading/> : null}
              {isShowCompanyNameLoading === 2 ? <LoadingComplete/> : null}
            </FormItem> :
            <FormItem
              {...formItemLayout}
              label="单位名称"
            >
              {getFieldDecorator('companyName', {
                rules: [
                  {required: true, message: '请输入单位名称'},
                  {min: 2, message: '请输入与完整的单位名称'},
                ],
              })(
                <Input
                  className={cn('suffix-close-input')}
                  placeholder={'请输入单位名称'}
                  // suffix={register.step3.companyName ? <span onClick={() => {
                  //   form.setFieldsValue({companyName: ''});
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                />
              )}
            </FormItem>
        }

        {
          register.step3.companyType == 2 ?
            <FormItem
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 24 - 6,
              }}
              label="社会统一信用代码"
            >
              {getFieldDecorator('uniformCreditCode', {
                rules: [
                  {pattern: /^[\da-zA-z]{0,20}$/, message: '请输入正确格式的信用代码'},
                ],
              })(
                <Input
                  className={cn('suffix-close-input')}
                  placeholder={'请输入营业执照上信用代码'}
                  // suffix={register.step3.uniformCreditCode ? <span onClick={() => {
                  //   form.setFieldsValue({uniformCreditCode: ''});
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                />
              )}
            </FormItem> : null
        }

        <FormItem
          {...formItemLayout}
          label="行业类型"
        >
          {getFieldDecorator('socialTypeArr', {
            rules: [
              {required: true, message: '请选择行业类型'},
            ],
          })(
            <Cascader
              options={dict.industry}
              loadData={this.loadIndustryType}
              placeholder="请选择行业类型"
              changeOnSelect
              onChange={(e) => {
                dispatch({
                  type: 'register/setStep3',
                  payload: {
                    socialTypeOne: e[0] || '',
                    socialType: e[1] || '',
                  },
                });
              }}
            />
          )}
        </FormItem>

        <Row>
          <Col span={12}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 24 - 8}}
              label="管理员"
            >
              {getFieldDecorator('realName', {
                rules: [
                  {max: 60, message: '管理员输入长度不得超过60个字符'},
                  {required: true, message: '请输入姓名'},
                ],
              })(
                <Input
                  className={cn('suffix-close-input')}
                  placeholder={'请输入姓名'}
                  // suffix={register.step3.serviceManager ? <span onClick={() => {
                  //   form.setFieldsValue({serviceManager: ''});
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                />
              )}
            </FormItem>
          </Col>
          <Col span={11} offset={1}>
            <FormItem
              wrapperCol={{span: 24}}
            >
              {getFieldDecorator('contactPhone', {
                rules: [
                  {pattern: /^[\d]{11}$/,
                    message: '请输入正确的手机号',
                    required: true,
                  },
                ],
              })(
                <Input
                  className={cn('suffix-close-input')}
                  placeholder={'请输入联系电话'}
                  // suffix={register.step3.serviceManagerPhone ? <span onClick={() => {
                  //   form.setFieldsValue({serviceManagerPhone: ''});
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem

              labelCol={{span: 8}}
              wrapperCol={{span: 24 - 8}}
              label={'财务联系人'}
            >
              {getFieldDecorator('financeName', {
                rules: [
                  {max: 60, message: '财务联系人输入长度不得超过60个字符'},
                  {required: true, message: '请输入姓名'},

                ],
              })(
                <Input
                  className={cn('suffix-close-input')}
                  placeholder={'请输入姓名'}
                />
              )}
            </FormItem>
          </Col>
          <Col span={11} offset={1}>
            <FormItem
              wrapperCol={{span: 24}}
            >
              {getFieldDecorator('financePhone', {
                rules: [
                  {max: 11, message: '财务联系电话输入长度不得超过11个字符'},
                  {pattern: /^[\d]{11}$/,
                    message: '请输入正确的手机号',
                    required: true,
                  },
                ],
              })(
                <Input
                  className={cn('suffix-close-input')}
                  placeholder={'请输入联系电话'}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem
          {...formItemLayout}
          label="邮箱"
        >
          {getFieldDecorator('email', {})(
            <Input
              className={cn('suffix-close-input')}
              placeholder={'该邮箱用于通知接收、报税凭证接收等用途，请正确填写'}
              // suffix={register.step3.email ? <span onClick={() => {
              //   form.setFieldsValue({email: ''});
              // }}
              // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
            />
          )}
        </FormItem>
        <Form.Item
          {...formItemLayout}
          label="通讯地址"
        >
          {getFieldDecorator('areaAddress', {})(
            <Cascader
              options={dict.pcasData}
              loadData={this.loadAreaAddress}
              placeholder="请选择所在地区"
              onChange={(e) => {
                dispatch({
                  type: 'register/setStep3',
                  payload: {
                    province: e[0] || '', //省
                    city: e[1] || '', //市
                    area: e[2] || '', //区
                    streetTown: e[3] || '', //街道/乡镇
                  },
                });
              }}
            />
          )}
        </Form.Item>
        <FormItem
          {...formItemLayout}
          wrapperCol={{
            offset: 4,
          }}
        >
          {getFieldDecorator('address', {})(
            <Input
              className={cn('suffix-close-input')}
              placeholder={'详细地址'}
              // suffix={register.step3.address ? <span onClick={() => {
              //   form.setFieldsValue({address: ''});
              // }}
              // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
            />
          )}
        </FormItem>

        <Row>
          <Col span={12}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 24 - 8}}
              label="服务顾问"
            >
              {getFieldDecorator('serviceManager', {
                // rules: [
                //   {required: true, message: '请输入服务顾问姓名'},
                // ],
              })(
                <Input
                  className={cn('suffix-close-input')}
                  placeholder={'请输入姓名'}
                  // suffix={register.step3.serviceManager ? <span onClick={() => {
                  //   form.setFieldsValue({serviceManager: ''});
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                />
              )}
            </FormItem>
          </Col>
          <Col span={11} offset={1}>
            <FormItem
              wrapperCol={{span: 24}}
            >
              {getFieldDecorator('serviceManagerPhone', {
                rules: [
                  // {required: true, message: '请输入服务顾问手机号'},
                  {pattern: /^[\d]{11}$/, message: '请输入正确的手机号'},
                ],
              })(
                <Input
                  className={cn('suffix-close-input')}
                  placeholder={'请输入联系电话'}
                  // suffix={register.step3.serviceManagerPhone ? <span onClick={() => {
                  //   form.setFieldsValue({serviceManagerPhone: ''});
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem>
          <Button loading={register.isLoad} className={cn('play')} type={'primary'} htmlType={'submit'}>
            提交
          </Button>
        </FormItem>
      </Form>
    </div>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'register/setStep3', props.register.step3, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.register.step3, fieldContainer),
})(Class);

export default connect(state => state)(withRouter(hot(module)(FormClass)));
