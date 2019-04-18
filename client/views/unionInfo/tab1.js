import React from 'react';
import cn from 'classnames';
import {Form, Input, Checkbox, Button, Cascader, message} from 'antd';
import {hot} from 'react-hot-loader';

import RH from 'client/routeHelper';
import Tools from 'client/utils/tools';
import './style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 17,
    offset: 1,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);

    const {global} = this.props;
    const groupId = global.account.groupId; //ok

    this.state = {
      groupId,
      edit: !groupId,
    };
  }

  componentDidMount() {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, global, unionInfo} = this.props;
    const {groupId} = this.state;

    form.validateFields((err) => {
      if (err) return;

      const fields = form.getFieldsValue();
      const values = {...fields};
      const {addressCascader = []} = values;
      delete values.addressCascader;
      values.province = addressCascader[0] ? addressCascader[0] : '';
      values.city = addressCascader[1] ? addressCascader[1] : '';
      values.area = addressCascader[2] ? addressCascader[2] : '';
      values.streetTown = '';
      values.sameAddr = unionInfo._sameAddr;
      if (groupId) {
        //修改
        dispatch({
          type: 'unionInfo/updateGroup',
          payload: {
            ...values,
            id: groupId, //ok
            fullAddressPath: `${this.getPCAData(values)}${values.address}`,
            industryId: unionInfo.group.industryId,
            modifier: `${global.account.accountId}_${global.account.realName}`, //ok
          },
          callback: (res) => {
            if (res.code === 0) {
              //缓存数据暂时无用
              dispatch({
                type: 'unionInfo/set',
                payload: {
                  _sameAddr: values.sameAddr,
                  _province: values.province,
                  _city: values.city,
                  _area: values.area,
                  _address: values.address,
                },
              });
              dispatch({
                type: 'unionInfo/setGroup', payload: {...values},
              });
              dispatch({type: 'global/getListOfManagementCompany', payload: {}}); //新接口，更新单位列表
              dispatch({type: 'dashboard/get', payload: {companyId: global.account.groupId}}); //需要更新超管名称调用首页接口

              this.setState({edit: false});
              message.success('修改成功');
            }
          },
        });
      } else {
        //新增
        dispatch({
          type: 'unionInfo/insertGroup',
          payload: {
            ...values,
            companyId: global.account.companyId, //ok
            fullAddressPath: `${this.getPCAData(values)}${values.address}`,
            operationer: `${global.account.accountId}_${global.account.realName}`, //ok
          },
          callback: (res) => {
            if (res.code === 0) {
              dispatch({type: 'global/getListOfManagementCompany', payload: {}}); //新接口，更新单位列表 2019-01-02
              this.reload();
            }
          },
        });
      }
    });
  };

  loadAreaAddress = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findCPCAS',
      payload: {selectedOptions},
    });
  };

  getPCAData(obj) {
    const {dict} = this.props;
    const {pcaData: areaAddressData} = dict;
    if (obj.province) {
      const p = obj.province;
      const c = obj.city;
      const a = obj.area;
      let province = {label: ''};
      let city = {label: ''};
      let area = {label: ''};
      let temp = areaAddressData.find(item => item.value === p);
      if (temp && temp.children) {
        province = temp;
        temp = province.children.find(item => item.value === c);
        if (temp && temp.children) {
          city = temp;
          temp = city.children.find(item => item.value === a);
          if (temp) area = temp;
        }
        return `${province.label}${city.label}${area.label}`;
      }
    }
    return '';
  }

  handleCancel = (e) => {
    e.preventDefault();
    const {dispatch, unionInfo} = this.props;
    //地址是否一致还原
    dispatch({type: 'unionInfo/set', payload: {_sameAddr: unionInfo.group.sameAddr}});
    dispatch({
      type: 'unionInfo/setGroup',
      payload: {
        province: unionInfo._province,
        city: unionInfo._city,
        area: unionInfo._area,
        address: unionInfo._address,
      },
    });
    this.setState({edit: false});
  };

  openEdit = () => {
    this.setState({edit: true});
  };

  reload() {
    const {dispatch, global} = this.props;
    const un = message.loading('加载中...', 15);
    Tools.resetAllModel(this.props).then(() => {
      dispatch({
        type: 'login/loginChoose',
        payload: {
          id: global.account.accountId, //ok
          loadingMsg: '加载中...',
        },
        callback: (res) => {
          un();
          if (res.code === 0) {
            RH(null, window.__themeKey, `/${window.__themeKey}/dashboard`);
          } else {
            window.location.reload(); //如果切工会数据失败则刷新
          }
        },
      });
    }).catch(() => {
      un();
      window.location.reload(); //如果切工会数据失败则刷新
    });
  }

  //级联选择样式
  displayRender(label) {
    return label.join('-');
  }

  render() {
    const {edit, groupId} = this.state;
    const {form, unionInfo, dispatch, dict} = this.props;
    const {getFieldDecorator} = form;

    return (
      <div className={cn('tab1')}>
        {
          edit ? <Form className={'tab1-form'} onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label={'工会名称'}>
              {getFieldDecorator('companyName', {
                initialValue: unionInfo.group.companyName,
                rules: [
                  {required: true, message: '请输入工会名称'},
                ],
              })(
                <Input placeholder="请输入" maxLength={60}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'纳税人识别号'}>
              {getFieldDecorator('uniformCreditCode', {
                initialValue: unionInfo.group.uniformCreditCode,
                rules: [
                  {
                    required: true,
                    message: '请正确输入纳税人识别号',
                    pattern: /^[0-9a-zA-Z]*$/},
                ],
              })(
                <Input placeholder="请输入" maxLength={20}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'开户行'}>
              {getFieldDecorator('bank', {
                initialValue: unionInfo.group.bank,
                rules: [
                  {required: true, message: '请输入开户行'},
                ],
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'开户行账号'}>
              {getFieldDecorator('bankAccount', {
                initialValue: unionInfo.group.bankAccount,
                rules: [
                  {required: true, message: '请输入开户行账号'},
                ],
              })(
                <Input placeholder="请输入" maxLength={30}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'电话'}>
              {getFieldDecorator('contactPhone', {
                initialValue: unionInfo.group.contactPhone,
                rules: [
                  {
                    pattern: /^[0-9]*$/,
                    message: '请输入正确的手机号或者座机号',
                  },
                ],
              })(
                <Input placeholder="请输入" maxLength={11}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'注册地址'}>
              <Checkbox
                checked={unionInfo._sameAddr === 1}
                onChange={(e) => {
                  if (e.target.checked) {
                    dispatch({
                      type: 'unionInfo/setGroup',
                      payload: {
                        province: unionInfo.company.province,
                        city: unionInfo.company.city,
                        area: unionInfo.company.area,
                        address: unionInfo.company.address,
                      },
                    });
                    form.setFieldsValue({
                      addressCascader: [
                        unionInfo.company.province,
                        unionInfo.company.city,
                        unionInfo.company.area,
                      ],
                      address: unionInfo.company.address,
                    });
                  }
                  //缓存数据暂时无用
                  /*else {
                    dispatch({
                      type: 'unionInfo/setGroup',
                      payload: {
                        province: unionInfo._province,
                        city: unionInfo._city,
                        area: unionInfo._area,
                        address: unionInfo._address,
                      },
                    });
                    form.setFieldsValue({
                      addressCascader: [
                        unionInfo._province,
                        unionInfo._city,
                        unionInfo._area,
                      ],
                      address: unionInfo._address,
                    });
                  }*/
                  dispatch({type: 'unionInfo/set', payload: {_sameAddr: e.target.checked ? 1 : 2}});
                }}
              >和单位信息一致</Checkbox>
            </FormItem>
            <FormItem {...formItemLayout} label={'通讯地址'} style={{marginBottom: 10}} key={'sar-0'}>
              {getFieldDecorator('addressCascader', {
                initialValue: unionInfo.group.province ? [unionInfo.group.province, unionInfo.group.city, unionInfo.group.area] : undefined,
                rules: [],
              })(
                <Cascader
                  disabled={unionInfo._sameAddr === 1}
                  placeholder="请选择"
                  options={dict.pcaData}
                  loadData={this.loadAreaAddress}
                  displayRender={label => this.displayRender(label)}
                />
              )}
            </FormItem>
            <FormItem wrapperCol={{span: 17, offset: 7}} key={'sar-1'}>
              {getFieldDecorator('address', {
                initialValue: unionInfo.group.address,
                rules: [],
              })(
                <Input disabled={unionInfo._sameAddr === 1} placeholder="请输入详细地址" maxLength={120}/>
              )}
            </FormItem>
            <div className={cn('btns')}>
              <Button type="primary" htmlType="submit" loading={unionInfo.isLoad}>
                保存
              </Button>
              {
                groupId ? <Button onClick={e => this.handleCancel(e)} className={'btn-cancel'}>取消</Button> : null
              }
            </div>
          </Form> : <div className={'tab1-form'}>
            <FormItem {...formItemLayout} label={'工会名称'}>
              <span>{unionInfo.group.companyName || '-'}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={'纳税人识别号'}>
              <span>{unionInfo.group.uniformCreditCode || '-'}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={'开户行'}>
              <span>{unionInfo.group.bank || '-'}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={'开户行账号'}>
              <span>{unionInfo.group.bankAccount || '-'}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={'电话'}>
              <span>{unionInfo.group.contactPhone || '-'}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={'注册地址'}>
              {this.getPCAData(unionInfo.group)}{unionInfo.group.address || '-'}
            </FormItem>
            <div className={cn('btns')}>
              <Button type="primary" onClick={this.openEdit} loading={unionInfo.isLoad}>
                编辑
              </Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

const Form3 = Form.create()(Class);

// export default Form3;
export default hot(module)(Form3);
