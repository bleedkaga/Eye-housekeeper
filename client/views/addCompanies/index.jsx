import React from 'react';
import {connect} from 'dva';
import {hot} from 'react-hot-loader';
import {Card, Form, Input, Select, Cascader, Row, Col, Button, message, Spin} from 'antd';
import Tools from 'client/utils/tools';
import cn from 'classnames';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import RH from 'client/routeHelper';
import GTitle from 'client/components/GTitle';
import LoadingComplete, {Loading, CompleteTag} from 'client/components/IACLoading';
import './style.less';


const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCompanyNameLoading: 0,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const un = message.loading('加载中...', 15);
    const request = [];
    request.push(
      dispatch({
        type: 'dict/find',
        payload: {
          dict_codes: ['unitType', 'industry', 'unitNatureCode'],
        },
      })
    );
    request.push(
      dispatch({
        type: 'dict/findPCAS',
        payload: {
          selectedOptions: [undefined, undefined, undefined, undefined],
          street: true,
        },
      })
    );
    Promise.all(request).then(() => {
      un();
    });
  }

  componentWillUnmount() {
    clearTimeout(this._companyNameLoading);
  }

  //搜索单位名称
  handleCompanyNameSearch = (d) => {
    clearTimeout(this._loadCompanyNameTimer);
    d = Tools.formatCompanyName(d);
    if (!d || d.length < 2) return;
    const {dispatch, global} = this.props;
    this._loadCompanyNameTimer = setTimeout(() => {
      const phoneParam = global.account.phone;
      dispatch({
        type: 'addCompany/searchCompanyName',
        payload: {
          companyName: d,
          phone: phoneParam,
        },
      });
    }, 444);
  };

  handleAutoCompleteOption(i) { //选择单位时除了单位名的其他入参
    clearTimeout(this._companyNameLoading);
    const {dispatch} = this.props;
    dispatch({
      type: 'addCompany/changeParam',
      payload: {
        keyNo: i.KeyNo || '',
        no: i.No || i.CreditCode || '',
        creditCode: i.CreditCode || '',
      },
    });
    this.setState({isShowCompanyNameLoading: 1});
    this._companyNameLoading = setTimeout(() => {
      this.setState({isShowCompanyNameLoading: 2});
    }, 2000);
  }

  handleSubmit() {
    const { form: { validateFields }, dispatch, global, history } = this.props;
    const phoneParam = global.account.phone;
    validateFields((errors, values) => {
      if (!errors) {
        delete values.addressCascader;
        delete values.socialTypeCascader;
        const param = Object.assign(values, {phone: phoneParam,
          // , companyName: values.companyNameAutoCompleteNot
        });

        param.companyName = param.companyName.split('@@')[0];

        dispatch({
          type: 'addCompany/sbumit',
          payload: param,
          callback: (res) => {
            dispatch({type: 'global/getListOfManagementCompany', payload: {}}); //新接口，更新单位列表 2019-01-02
            RH(history, 'choose', `/${window.__themeKey}/choose`, {state: {id: res.data}});
          },
        });
      }
    });
  }

  handleClose() {
    const { history } = this.props;
    RH(history, 'dashboard', `/${window.__themeKey}/dashboard`, {replace: true});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {addCompany, dispatch, dict} = this.props;
    const {isShowCompanyNameLoading} = this.state;

    const {unitType, unitNatureCode, industry, pcasData} = dict;
    const {param, companyName, companyNameLoading} = addCompany;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '管理中心', path: `/${window.__themeKey}/dashboard`},
          {name: '新增单位'},
        ]}
      />
      <GPage className={cn('addcompanines')}>
        <div className={cn('addcompanyWrapper')}>
          <Card style={{borderRadius: '8px', borderBottomColor: '#fff'}}>
            <GTitle
              onClose={() => this.handleClose()}
              className={cn('Gtitle')}
            >新增单位</GTitle>
            <div className={cn('addcompanyContentBox')}>
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="工商属性"
                >
                  {getFieldDecorator('companyType', {
                    rules: [
                      //   {
                      //   type: 'email', message: 'The input is not valid E-mail!',
                      // },
                      {
                        required: true, message: '请选择单位工商属性',
                      }],
                  })(
                    <Select
                      placeholder="请选择"
                      onChange={d => dispatch({
                        type: 'addCompany/changeParam',
                        payload: {
                          companyType: d || '2',
                        },
                      })
                      }
                    >
                      {unitType && unitType.map((item, index) => (<Option
                        value={item.value}
                        key={`${item.value}-${index}`}
                      >{item.label}</Option>))}
                    </Select>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="单位类型"
                >
                  {getFieldDecorator('unitNatureCode', {
                    rules: [{
                      required: true, message: '请选择单位类型',
                    }],
                  })(
                    <Select
                      placeholder="请选择"
                    >
                      {unitNatureCode.map((item, index) => (<Option
                        value={item.value}
                        key={`${item.value}-${index}`}
                      >{item.label}</Option>))}
                    </Select>
                  )}
                </FormItem>
                {
                  param.companyType === '2' ?//判断是否是工商属性
                    <div>
                      <FormItem
                        {...formItemLayout}
                        label="单位名称"
                      >
                        {getFieldDecorator('companyName', {
                          rules: [{
                            required: true, message: '请输入单位名称',
                          }],
                        })(
                          <Input placeholder="请输入"/>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label="社会统一信用代码"
                      >
                        {getFieldDecorator('uniformCreditCode', {
                          rules: [
                            {pattern: /^[\da-zA-z]{0,20}$/, message: '请输入正确格式的信用代码'},
                          ],
                        })(
                          <Input placeholder="请输入营业执照上信用代码"/>
                        )}
                      </FormItem>
                    </div> :
                    <FormItem
                      {...formItemLayout}
                      label="单位名称"
                    >
                      {getFieldDecorator('companyName', {
                        rules: [{
                          required: true, message: '请选择',
                        }],
                      })(
                        <Select
                          disabled={isShowCompanyNameLoading === 1}
                          placeholder={'请选择单位'}
                          filterOption={false}
                          showArrow={false}
                          showSearch
                          defaultActiveFirstOption={false}
                          onSearch={this.handleCompanyNameSearch}
                          notFoundContent={companyNameLoading ? <Spin size="small"/> : null}
                          onChange={(e, c) => {
                            const {item} = c.props;
                            this.handleAutoCompleteOption(item);
                          }}
                        >
                          {
                            companyName && companyName.map(d => (<Select.Option
                              key={`${d.Name}-${d.KeyNo}`}
                              item={d}
                              value={`${d.Name}@@${d.KeyNo}`}
                            >{d.Name}</Select.Option>))
                          }
                        </Select>
                      )}
                      {isShowCompanyNameLoading && isShowCompanyNameLoading !== 1 ? <CompleteTag/> : null}
                      {isShowCompanyNameLoading === 1 ? <Loading/> : null}
                      {isShowCompanyNameLoading === 2 ? <LoadingComplete/> : null}
                    </FormItem>
                }

                <FormItem
                  {...formItemLayout}
                  label="行业类型"
                >
                  {getFieldDecorator('socialTypeCascader', {
                    rules: [{
                      required: true, message: '请选择单位的行业类型',
                    }],
                  })(
                    <Cascader
                      placeholder="请选择"
                      options={industry}
                      loadData={s => dispatch({
                        type: 'dict/findCNext',
                        payload: {
                          selectedOptions: s,
                          dict_code: 'industry',
                        },
                      })}
                      changeOnSelect
                      onChange={(d) => {
                        dispatch({
                          type: 'addCompany/changeParam',
                          payload: {
                            socialTypeOne: d[0] || '',
                            socialType: d[1] || '',
                          },
                        });
                      }}
                    />
                  )}
                </FormItem>

                <Row>
                  <Col span={8} offset={3}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 9,
                        },
                        wrapperCol: {
                          span: 14,
                        },
                      }}
                      label="管理员"
                    >
                      {getFieldDecorator('realName', {
                        rules: [
                          {max: 60, message: '管理员输入长度不得超过60个字符'},
                          {required: true, message: '请输入姓名'},
                        ],
                      })(
                        <Input placeholder="请输入姓名"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 0,
                        },
                        wrapperCol: {
                          span: 24,
                        },
                      }}
                      // label="电话"
                    >
                      {getFieldDecorator('contactPhone', {
                        rules: [
                          {pattern: /^[\d]{11}$/,
                            message: '请输入正确的手机号',
                            required: true,
                          },
                        ],
                      })(
                        <Input placeholder="请输入联系电话"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={10} offset={1}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 12,
                        },
                        wrapperCol: {
                          span: 11,
                        },
                      }}
                      label="财务联系人"
                    >
                      {getFieldDecorator('financeName', {
                        rules: [
                          {max: 60, message: '财务联系人输入长度不得超过60个字符'},
                          {required: true, message: '请输入姓名'},

                        ],
                      })(
                        <Input placeholder="请输入姓名"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} offset={0}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 0,
                        },
                        wrapperCol: {
                          span: 24,
                        },
                      }}
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
                        <Input placeholder="请输入联系电话"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <FormItem
                  {...formItemLayout}
                  label="邮箱"
                >
                  {getFieldDecorator('email', {
                    rules: [{
                      type: 'email', message: '输入有误，请正确填写邮箱',
                    },
                      //  {
                      //   required: true, message: 'Please input your E-mail!',
                      // }
                    ],
                  })(
                    <Input placeholder="该邮箱用于通知接收、报税凭证接收等用途，请正确填写"/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="通讯地址"
                >
                  {getFieldDecorator('addressCascader', {
                    // rules: [
                    // {
                    // required: true, message: '请选择单位通讯地址',
                    // },
                    // ],
                  })(
                    <Cascader
                      placeholder="请选择"
                      options={pcasData}
                      loadData={selectedOptions => dispatch({
                        type: 'dict/findCPCAS', //市
                        payload: {
                          selectedOptions,
                          street: true,
                        },
                      })}
                      // this.loadAreaAddress}
                      onChange={d => dispatch({
                        type: 'addCompany/changeParam',
                        payload: {
                          province: d[0] || '',
                          city: d[1] || '',
                          area: d[2] || '',
                          streetTown: d[3] || '',
                        },
                      })}
                    />
                  )}
                </FormItem>
                <Row>
                  <Col span={16} offset={6}>
                    <FormItem>
                      {getFieldDecorator('address', {
                        // rules: [{
                        // required: true, message: '请填写详细地址',
                        // }],
                      })(
                        <Input placeholder="详细地址"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={9} offset={2}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 11,
                        },
                        wrapperCol: {
                          span: 12,
                        },
                      }}
                      label="服务顾问"
                    >
                      {getFieldDecorator('serviceManager', {
                        // rules: [
                        //   {
                        //     required: true, message: '请输入姓名',
                        //   },
                        // ],
                      })(
                        <Input placeholder="请输入姓名"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} offset={0}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 0,
                        },
                        wrapperCol: {
                          span: 24,
                        },
                      }}
                    >
                      {getFieldDecorator('serviceManagerPhone', {
                        rules: [
                          // {required: true, message: '请输入服务顾问电话'},
                          {pattern: /^[\d]{11}$/, message: '请输入正确的手机号'},
                        ],
                      })(
                        <Input placeholder="请输入联系电话"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                {/* <Row>
                    <Col span={4} offset={11}> */}
                <Button className={cn('button')} type="primary" onClick={() => this.handleSubmit()}>提交</Button>
                {/* </Col> */}
                {/* <Col span={6} >
                      <Button style={{width: '75px', marginLeft: '26px'}} >取消</Button>
                    </Col> */}
                {/* </Row> */}
              </Form>
            </div>
          </Card>
        </div>
      </GPage>
    </GContainer>);
  }
}
const WrappedRegistrationForm = Form.create()(Class);
export default connect(state => state)(hot(module)(WrappedRegistrationForm));
