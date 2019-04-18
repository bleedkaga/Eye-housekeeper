import React from 'react';
// import cn from 'classnames';
import {Form, Input, Row, Col, Select, DatePicker, Checkbox, Button, Icon, TreeSelect} from 'antd';
import moment from 'moment';
import './style.less';
import {StaffState} from 'client/utils/enums';
import RH from 'client/routeHelper';
import SelfSelect from 'client/components/Select';

const SelectOption = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 17,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // loadMore: false,
    };
  }

  static defaultProps = {
    dispatchKey: 'staff',
    leaveStaff: true,
    showType: true,
  };

  //渲染数据字段
  renderOption = (field) => {
    const {staff} = this.props;
    const options = staff[field].map(item => (
      <SelectOption key={item.value} value={item.value}>
        {item.label}
      </SelectOption>
    ));

    return options;
  };

  //更多身份的复选框
  renderIdentityIdOptions() {
    const {staff} = this.props;
    const more = staff.moreIdentities.map(item => ({
      label: item.label,
      value: item.value,
    }));

    return more;
  }

  //所属部门
  renderDepartmentOption() {
    const {staff} = this.props;
    const a = staff.departmentData.map(item => (
      <SelectOption key={item.id} value={item.id}>{item.departmentName}</SelectOption>
    ));
    return a;
  }

  handleMore() {
    //展示隐藏
    const {dispatch, staff, dispatchKey} = this.props;
    dispatch({ type: `${dispatchKey}/set`, payload: { loadMore: !staff.loadMore } });
    dispatch({type: `${dispatchKey}/resetCondition`});
    //拉取下拉字典
    if (!staff.loadMore) {
      const dictCodesArr = [
        'gender',
        'marryStatus',
        'identification',
        'politicalStatus',
        'educationalLevel',
        'censusRegisterType',
        'partyMembers',
        'youthLeagueMembers',
        'unionMembers',
        'laborModel',
        'womenFederation',
        'moreIdentities',
      ];
      dispatch({ type: `${dispatchKey}/findFirstValList`, payload: { dict_codes: dictCodesArr.join(',') } });
    }
  }

  updateCondition(k, v) {
    const {dispatch, dispatchKey} = this.props;
    dispatch({type: `${dispatchKey}/setCondition`, payload: {[k]: v}});
  }

  //跳转到离职员工表
  pushLeaveStaff() {
    const {history} = this.props;
    RH(history, 'leaveStaff', '/org/hr/leaveStaff');
  }

  handleSelect(e) {
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, values) => {
      if (err) return false;
      this.props.handleSelect(values);
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {staff, dispatch, leaveStaff, dispatchKey, showType} = this.props;
    const {condition} = staff;

    return (
      <Form
        className={'ant-advanced-search-form'}
        onSubmit={(e) => {
          this.handleSelect(e);
        }}
      >
        {staff.loadMore ? <div className={'search-more'}>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="姓名">
                {getFieldDecorator('userName', {
                  initialValue: condition.userName,
                })(<Input
                  placeholder={'请输入'}
                  maxLength={30}
                  className={'primary-input'}
                  // suffix={condition.userName ? <span onClick={() => {
                  //   this.props.form.setFieldsValue({userName: ''});
                  //   this.updateCondition('userName', '');
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                  onChange={(e) => {
                    this.updateCondition('userName', e.target.value);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                />)}
              </FormItem>
              <FormItem {...formItemLayout} label="电话">
                {getFieldDecorator('mobilePhone', {
                  rules: [
                    {
                      pattern: /^[0-9]*$/,
                      message: '请输入正确的手机号或者座机号',
                    },
                  ],
                  initialValue: condition.mobilePhone,
                })(<Input
                  placeholder="请输入"
                  maxLength={11}
                  className={'primary-input'}
                  // suffix={condition.mobilePhone ? <span onClick={() => {
                  //   this.props.form.setFieldsValue({mobilePhone: ''});
                  //   this.updateCondition('mobilePhone', '');
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                  onChange={(e) => {
                    this.updateCondition('mobilePhone', e.target.value);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                />)}
              </FormItem>
              <FormItem {...formItemLayout} label="证件号" className={'LabelTitleExcThree'}>
                {getFieldDecorator('certificateCode', {
                  initialValue: condition.certificateCode,
                })(
                  <Input
                    placeholder="请输入"
                    maxLength={18}
                    className={'primary-input'}
                    // suffix={condition.certificateCode ? <span onClick={() => {
                    //   this.props.form.setFieldsValue({certificateCode: ''});
                    //   this.updateCondition('certificateCode', '');
                    // }}
                    // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                    onChange={(e) => {
                      this.updateCondition('certificateCode', e.target.value);
                    }}
                    onPressEnter={e => this.handleSelect(e)}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="工号">
                {getFieldDecorator('workNumber', {
                  rules: [],
                  initialValue: condition.workNumber,
                })(<Input
                  placeholder="请输入"
                  maxLength={18}
                  className={'primary-input'}
                  // suffix={condition.workNumber ? <span onClick={() => {
                  //   this.props.form.setFieldsValue({workNumber: ''});
                  //   this.updateCondition('workNumber', '');
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                  onChange={(e) => {
                    this.updateCondition('workNumber', e.target.value);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                />)}
              </FormItem>
              <FormItem {...formItemLayout} label="性别">
                {getFieldDecorator('gender', {
                  rules: [],
                  initialValue: condition.gender || undefined,
                })(<SelfSelect
                  allowClear
                  onChange={(e) => {
                    this.updateCondition('gender', e);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                >{this.renderOption('gender')}</SelfSelect>)}
              </FormItem>
              <FormItem {...formItemLayout} label="婚姻状况" >
                {getFieldDecorator('marriage', {
                  rules: [],
                  initialValue: condition.marriage || undefined,
                })(<SelfSelect

                  allowClear
                  onChange={(e) => {
                    this.updateCondition('marriage', e);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                >{this.renderOption('marryStatus')}</SelfSelect>)}
              </FormItem>
              <FormItem {...formItemLayout} label="出生时间" >
                <RangePicker
                  format="MM-DD"
                  className={'handness'}
                  placeholder={['月-日', '月-日']}
                  value={[
                    condition.startMonth && condition.startDay ? moment(`${condition.startMonth}-${condition.startDay}`, 'MM-DD') : undefined,
                    condition.endMonth && condition.endDay ? moment(`${condition.endMonth}-${condition.endDay}`, 'MM-DD') : undefined,
                  ]}
                  onChange={(date, dateStr) => {
                    const start = dateStr[0].split('-');
                    const end = dateStr[1].split('-');
                    dispatch({
                      type: `${dispatchKey}/setCondition`,
                      payload: {
                        startMonth: start[0],
                        startDay: start[1],
                        endMonth: end[0],
                        endDay: end[1],
                      },
                    });
                  }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="所属部门">
                {getFieldDecorator('departmentCode', {
                  rules: [],
                  initialValue: condition.departmentCode || undefined,
                })(
                  <TreeSelect
                    allowClear

                    // style={{width: '100%'}}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={staff.department}
                    placeholder={'全部'}
                    treeDefaultExpandAll
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="职务" className={'LabelTitleExc'}>
                {getFieldDecorator('position', {
                  rules: [],
                  initialValue: condition.position || undefined,
                })(<Input
                  placeholder="请输入"
                  maxLength={10}
                  className={'primary-input'}
                  // suffix={condition.position ? <span onClick={() => {
                  //   this.props.form.setFieldsValue({position: ''});
                  //   this.updateCondition('position', '');
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                  onChange={(e) => {
                    this.updateCondition('position', e.target.value);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                />)}
              </FormItem>
              <FormItem {...formItemLayout} label="入职日期">
                <RangePicker
                  className={'handness'}
                  format={'YYYY-MM-DD'}
                  value={[
                    condition.startDate ? moment(condition.startDate, 'YYYY-MM-DD') : undefined,
                    condition.endDate ? moment(condition.endDate, 'YYYY-MM-DD') : undefined,
                  ]}
                  onChange={(date, dateStr) => {
                    dispatch({
                      type: `${dispatchKey}/setCondition`,
                      payload: {startDate: dateStr[0], endDate: dateStr[1]},
                    });
                  }}
                />
              </FormItem>
              {
                <FormItem {...formItemLayout} label="状态" className={'LabelTitleExc'}>
                  {getFieldDecorator('type', {
                    rules: [],
                    initialValue: condition.type || undefined,
                  })(
                    <SelfSelect
                      onChange={(e) => {
                        this.updateCondition('type', e);
                      }}
                      onPressEnter={e => this.handleSelect(e)}
                    >
                      <SelectOption key={StaffState.normal} value={StaffState.normal}>
                        正常
                      </SelectOption>
                      <SelectOption
                        key={StaffState.unActive}
                        value={StaffState.unActive}
                      >
                        未激活
                      </SelectOption>
                      {
                        showType ? <SelectOption
                          key={StaffState.toBeAudited}
                          value={StaffState.toBeAudited}
                        >
                          待审核
                        </SelectOption> : null
                      }
                    </SelfSelect>
                  )}
                </FormItem>
              }
              <FormItem {...formItemLayout} label="文化程度">
                {getFieldDecorator('levelEducation', {

                  rules: [],
                  initialValue: condition.levelEducation || undefined,

                })(<SelfSelect

                  onChange={(e) => {
                    this.updateCondition('levelEducation', e);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                >{this.renderOption('educationalLevel')}</SelfSelect>)}
              </FormItem>
              <FormItem {...formItemLayout} label="备注" className={'LabelTitleRemarkExc'}>
                {getFieldDecorator('remarks', {

                  rules: [],
                  initialValue: condition.remarks,
                })(<Input
                  placeholder="请输入"
                  maxLength={10}
                  className={'primary-input '}
                  // suffix={condition.remarks ? <span onClick={() => {
                  //   this.props.form.setFieldsValue({remarks: ''});
                  //   this.updateCondition('remarks', '');
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                  onChange={(e) => {
                    this.updateCondition('remarks', e.target.value);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="中共党员">
                {getFieldDecorator('communistPartyChina', {
                  rules: [],
                  initialValue: condition.communistPartyChina || undefined,
                })(
                  <SelfSelect

                    onChange={(e) => {
                      this.updateCondition('communistPartyChina', e);
                    }}
                    onPressEnter={e => this.handleSelect(e)}
                  >{this.renderOption('partyMembers')}</SelfSelect>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="共青团员">
                {getFieldDecorator('leagueMembers', {
                  rules: [],
                  initialValue: condition.leagueMembers || undefined,

                })(
                  <SelfSelect

                    onChange={(e) => {
                      this.updateCondition('leagueMembers', e);
                    }}
                    onPressEnter={e => this.handleSelect(e)}
                  >{this.renderOption('youthLeagueMembers')}</SelfSelect>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="工会职务">
                {getFieldDecorator('unionMember', {
                  rules: [],
                  initialValue: condition.unionMember || undefined,
                })(
                  <SelfSelect

                    onChange={(e) => {
                      this.updateCondition('unionMember', e);
                    }}
                    onPressEnter={e => this.handleSelect(e)}
                  >{this.renderOption('unionMembers')}</SelfSelect>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="劳动模范">
                {getFieldDecorator('modelLabor', {
                  rules: [],
                  initialValue: condition.modelLabor || undefined,
                })(
                  <SelfSelect

                    onChange={(e) => {
                      this.updateCondition('modelLabor', e);
                    }}
                    onPressEnter={e => this.handleSelect(e)}
                  >{this.renderOption('laborModel')}</SelfSelect>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="妇联工作">
                {getFieldDecorator('womanFederation', {
                  rules: [],
                  initialValue: condition.womanFederation || undefined,
                })(
                  <SelfSelect

                    onChange={(e) => {
                      this.updateCondition('womanFederation', e);
                    }}
                    onPressEnter={e => this.handleSelect(e)}
                  >{this.renderOption('womenFederation')}</SelfSelect>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="更多身份" className={'LabelTitleOperationExc'}>
                <CheckboxGroup
                  value={condition.operationlike ? condition.operationlike.split('_') : undefined}
                  onChange={(e) => {
                    this.updateCondition('operationlike', e ? e.join('_') : '');
                  }}

                  options={this.renderIdentityIdOptions()}
                />

              </FormItem>
              <FormItem className={'leave-item-box'}>
                {
                  leaveStaff ? <a className={'leave-link'} onClick={() => this.pushLeaveStaff()}>查看离职员工</a> : null
                }
                <Button
                  type="primary"
                  htmlType="submit"
                  className={'search-more-btn'}

                >
                  查询
                </Button>
                <Button
                  className={'search-more-btn'}
                  onClick={() => this.handleMore()}
                  style={{
                    borderColor: '#E5E5E5',
                    backgroundColor: '#F2F2F2',
                  }}
                >
                  收起查询
                  <Icon type="up"/>
                </Button>
              </FormItem>
            </Col>
          </Row>
        </div> : <div className={'base-search-box clearfix'}>
          <FormItem label="选择部门" className={'select-more-depart'}>
            {getFieldDecorator('departmentCode', {
              rules: [],
              initialValue: condition.departmentCode || undefined,
            })(
              <TreeSelect
                allowClear
                className={'cascader-primary'}
                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                treeData={staff.department}
                placeholder={'全部'}
                treeDefaultExpandAll
              />
            )}
          </FormItem>
          <FormItem className={'base-search-btn-item'}>

            <Button
              className={'base-search-more-btn'}
              onClick={() => this.handleMore()}
            >
              高级查询
              <Icon type="down"/>
            </Button>

          </FormItem>
          <FormItem style={{float: 'right'}}>
            <div className={'condition-box'}>
              {getFieldDecorator('condition', {
                initialValue: condition.condition,

              })(
                <Input
                  placeholder="姓名、电话、证件号"
                  maxLength={20}
                  className={'condition-input'}
                  // suffix={condition.condition ? <span onClick={() => {
                  //   this.props.form.setFieldsValue({condition: ''});
                  // }}
                  // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                  onChange={(e) => {
                    this.updateCondition('condition', e.target.value);
                  }}
                  onPressEnter={e => this.handleSelect(e)}
                />
              )}

              <Button
                type="primary"
                htmlType="submit"
                className={'base-search-btn'}
              >
                查询
              </Button>

            </div>
          </FormItem>
        </div>}
      </Form>
    );
  }
}

const Form2 = Form.create()(Class);

// export default connect(state => state)(hot(module)(Class));
export default Form2;
