import React from 'react';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {connect} from 'dva';
import {Form, Input, Button, Cascader, message, Select, Spin, Row, Col} from 'antd';
import Tools from 'client/utils/tools';
import LoadingComplete, {Loading, CompleteTag} from 'client/components/IACLoading';

import './style.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
    offset: 0,
  },
};
const formItemAddressLayout = {
  wrapperCol: {
    span: 17,
    offset: 7,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCompanyNameLoading: 0,
    };
  }

  componentWillUnmount() {
    clearTimeout(this._companyNameLoading);
  }

  //展示行业类型
  socialTypeTitle() {
    const { company: companyModel, dict} = this.props;
    const {allCompanyData} = companyModel;
    const {company = {}} = allCompanyData;
    let title = '';
    const socialType = dict.industry.find(st =>
      st.value === company.socialTypeOne
    );
    if (socialType) {
      title = socialType.label;
      if (company.socialType && socialType.children) {
        const subsocialType = socialType.children.find(st => st.value === company.socialType);
        if (subsocialType) {
          title = `${title}-${subsocialType.label}`;
        }
      }
    }
    return title;
  }

  //展示通讯地址
  displayAddress() {
    const { company: companyModel, dict} = this.props;
    const {allCompanyData} = companyModel;
    const {company = {}} = allCompanyData;
    let text = '';
    const address = company.address ? company.address : '';
    const province = dict.pcaData.find(st =>
      st.value === company.province
    );

    if (province) {
      text = province.label + text;
      if (company.province && province.children) {
        const city = province.children.find(st => st.value === company.city);
        text += city.label;
        if (company.city && city.children) {
          const area = city.children.find(st => st.value === company.area);
          if (area) {
            text += area.label;
          }
        }
      }
    }
    text += address;
    return text;
  }

  //修改单位
  handleSubmit() {
    const {company: companyModel, dispatch, global} = this.props;
    const {allCompanyData} = companyModel;

    const {gsCompanyIndustry = {}} = allCompanyData;
    const { form } = this.props;
    const {validateFieldsAndScroll} = form;
    validateFieldsAndScroll((err, values) => {
      if (err) return message.error('保存失败');

      const payload = {
        ...values,
      };

      // console.log(values.companyType);
      if (values.companyType === '1') {
        if (Array.isArray(companyModel.companyNameData)) {
          const valueCode = values.companyNameCode.split('@@')[1] || '';
          const current = companyModel.companyNameData.find(item => item.KeyNo === valueCode);

          if (!current || !current.KeyNo || !current.CreditCode) {
            message.error('请选择检索的公司！');
            return;
          }
          if (current && current.KeyNo && current.CreditCode) {
            payload.no = (current.No ? current.No : current.CreditCode);
            payload.keyNo = current.KeyNo;
            payload.companyName = current.Name;
            payload.CreditCode = current.CreditCode;
            payload.industryId = allCompanyData.gsCompanyIndustry.id;
          }
        }
      }
      if (!values.companyType) {
        payload.no = gsCompanyIndustry.no ? gsCompanyIndustry.no : gsCompanyIndustry.CreditCode;
        payload.keyNo = gsCompanyIndustry.keyNo;
        payload.CreditCode = gsCompanyIndustry.CreditCode;
      }

      payload.socialTypeOne = (values.socialTypeCascader && values.socialTypeCascader[0]) ? values.socialTypeCascader[0] : '';
      payload.socialType = (values.socialTypeCascader && values.socialTypeCascader[1]) ? values.socialTypeCascader[1] : '';
      delete payload.socialTypeCascader;

      payload.province = (values.addressCascader && values.addressCascader[0]) ? values.addressCascader[0] : '';
      payload.city = (values.addressCascader && values.addressCascader[1]) ? values.addressCascader[1] : '';
      payload.area = (values.addressCascader && values.addressCascader[2]) ? values.addressCascader[2] : '';
      delete payload.addressCascader;

      payload.companyName = payload.companyName.split('@@')[0];

      dispatch({type: 'company/updateCompany',
        payload,
        callback: (res) => {
          if (res.code === 0) {
            dispatch({
              type: 'company/getCompanyByIdDetail',
              payload: {companyId: global.account.companyId }, //ok
              callback: (res2) => {
                if (res2.code === 0) {
                  dispatch({type: 'company/set', payload: {edit: false} });
                  message.success('修改成功');
                }
              }});

            dispatch({type: 'global/getListOfManagementCompany', payload: {}}); //新接口，更新单位列表


            dispatch({type: 'dashboard/get', payload: {companyId: global.account.companyId}}); //ok 需要更新超管名称调用首页接口
          }
        }});
    });
  }

  //服务经理与服务经理电话
  getManageDisplay() {
    const { company: companyModel } = this.props;
    const {allCompanyData} = companyModel;
    const {company = {}} = allCompanyData;
    let ret = '';
    if (company.serviceManager) {
      ret += company.serviceManager;
      if (company.serviceManagerPhone) {
        ret = `${ret}-${company.serviceManagerPhone}`;
      }
    } else if (company.serviceManagerPhone) {
      return company.serviceManagerPhone;
    } else {
      return '';
    }
    return ret;
  }

  //管理员与管理员联系电话
  getRealNameDisplay() {
    const { company: companyModel } = this.props;
    const {allCompanyData} = companyModel;
    const {company = {}} = allCompanyData;
    let ret = '';
    if (company.realName) {
      ret += company.realName;
      if (company.contactPhone) {
        ret = `${ret}-${company.contactPhone}`;
      }
    } else if (company.contactPhone) {
      return company.contactPhone;
    } else {
      return '';
    }
    return ret;
  }

  //管理员与管理员联系电话
  getfinanceNameDisplay() {
    const { company: companyModel } = this.props;
    const {allCompanyData} = companyModel;
    const {company = {}} = allCompanyData;
    let ret = '';
    if (company.financeName) {
      ret += company.financeName;
      if (company.financePhone) {
        ret = `${ret}-${company.financePhone}`;
      }
    } else if (company.financePhone) {
      return company.financePhone;
    } else {
      return '';
    }
    return ret;
  }

  //加载的行业类型
  loadAccountType = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findCNext',
      payload: {
        dict_code: 'industry',
        selectedOptions,
      },
    });
  };

  //加载通讯地址
  loadAreaAddress = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findCPCAS',
      payload: {selectedOptions},
    });
  };

  //变成编辑状态
  handleEdit(e) {
    const {dispatch} = this.props;
    e.preventDefault();
    dispatch({type: 'company/set', payload: {edit: true } });
  }

  // 变为展示
  handleCancel() {
    const {dispatch} = this.props;
    dispatch({ type: 'company/set', payload: {edit: false } });
  }

  //工商属性

  getCompanyTypeLabel(value) {
    const {dict} = this.props;
    const a = dict.unitType.find(item => item.value === value);
    return (a && a.label) || '';
  }

  renderOption(field) {
    const {dict} = this.props;

    if (!dict[field]) {
      return '请选择';
    }
    const options = dict[field].map(item => (
      <SelectOption key={item.value} value={item.value}>
        {item.label}
      </SelectOption>
    ));
    return options;
  }

  //非工商展示
  getCompanyType() {
    const {company: companyModel, form} = this.props;
    const {allCompanyData} = companyModel;
    const {company = {}} = allCompanyData;
    const {getFieldDecorator} = form;
    if (company.companyType === '1') {
      return (<span>{this.getCompanyTypeLabel(company.companyType)}</span>);
    } else {
      return (
        getFieldDecorator('companyType', {
          initialValue: allCompanyData.company.companyType,
          rules: [{ required: true, message: '请选择单位类型' }],
        })(<Select placeholder="请选择" >{this.renderOption('unitType')}</Select>)
      );
    }
  }

  //搜索公司名称
  searchCompanyName = (value) => {
    clearTimeout(this._loadCompanyNameTimer);
    value = Tools.formatCompanyName(value);
    if (!value || value.length < 2) return;
    const {dispatch} = this.props;
    this._loadCompanyNameTimer = setTimeout(() => {
      dispatch({ type: 'company/searchCompanyName', payload: {companyName: value } });
    }, 444);
  };


  //单位名称
  getCompanyName() {
    const {isShowCompanyNameLoading} = this.state;
    const {company: companyModel, form} = this.props;
    const {allCompanyData} = companyModel;
    const {getFieldDecorator, getFieldValue} = form;
    const {company = {}} = allCompanyData;

    if (company.companyType === '1') {
      return getFieldDecorator('companyName', {
        initialValue: company.companyName,
      })(<span >{company.companyName}</span>);
    }
    if (getFieldValue('companyType') === '1') {
      return (
        getFieldDecorator('companyNameCode', {
          initialValue: allCompanyData.gsCompanyIndustry.keyNo || undefined,
          rules: [{required: true, message: '请选择公司名称'}],
        })(
          <Select
            disabled={isShowCompanyNameLoading === 1}
            placeholder={'请检索公司名称,选择公司'}
            filterOption={false}
            showArrow={false}
            showSearch
            defaultActiveFirstOption={false}
            onSearch={this.searchCompanyName}
            notFoundContent={companyModel.isLoadCompanyList ? <Spin size="small"/> : null}
            onChange={() => {
              this.setState({isShowCompanyNameLoading: 1});
              this._companyNameLoading = setTimeout(() => {
                this.setState({isShowCompanyNameLoading: 2});
              }, 2000);
            }}
          >
            {companyModel.companyNameData && companyModel.companyNameData.length > 0 && companyModel.companyNameData.map(d => (
              <Select.Option
                key={`${d.Name}-${d.KeyNo}`}
                item={d}
                value={`${d.Name}@@${d.KeyNo}`}
              >{d.Name}</Select.Option>))}
          </Select>
        )
      );
    } else {
      return getFieldDecorator('companyName', {
        initialValue: company.companyName,
        rules: [{ required: true, message: '请输入公司名称' }],
      })(<Input placeholder="公司名称" maxLength={100}/>);
    }
  }

  //级联选择样式
  displayRender(label) {
    return label.join('-');
  }

  render() {
    const {isShowCompanyNameLoading} = this.state;
    const {form, company: companyModel, dict} = this.props;
    const {allCompanyData} = companyModel;
    const {company = {}} = allCompanyData;
    const {getFieldDecorator, getFieldValue} = form;
    const isIAC = getFieldValue('companyType') === '1';

    return (
      <div className={'tab1'}>
        {
         companyModel.edit ? (
           <Form className={'tab1-form'} onSubmit={(e) => { e.preventDefault(); this.handleSubmit(); }}>
             <FormItem {...formItemLayout} label={'工商属性'} className={'server-text'}>
               {this.getCompanyType()}
             </FormItem>
             <FormItem {...formItemLayout} label={'单位名称'} className={'server-text'}>
               {this.getCompanyName()}
               {isIAC && isShowCompanyNameLoading && isShowCompanyNameLoading !== 1 ?
                 <CompleteTag/> : null}
               {isIAC && isShowCompanyNameLoading === 1 ? <Loading/> : null}
               {isIAC && isShowCompanyNameLoading === 2 ? <LoadingComplete/> : null}
             </FormItem>
             <FormItem {...formItemLayout} label={'行业类型'}>
               {getFieldDecorator('socialTypeCascader', {
                 initialValue: company.socialTypeOne ? [company.socialTypeOne, company.socialType] : undefined,
                 rules: [
                   {required: true, message: '请选择行业类型'},
                 ],
               })(
                 <Cascader
                   options={dict.industry}
                   loadData={this.loadAccountType}
                   placeholder="请选择行业类型"
                   changeOnSelect
                   displayRender={label => this.displayRender(label)}
                   className={'text-left'}
                 />
               )}
             </FormItem>


             <Row>
               <Col span={14}>
                 <FormItem
                   labelCol={{span: 12}}
                   wrapperCol={{span: 12}}
                   label="管理员"
                 >
                   {getFieldDecorator('realName', {
                     initialValue: company.realName ? company.realName : '',
                     validateFirst: true,
                     rules: [
                       {max: 60, message: '财务联系人输入长度不得超过60个字符'},
                       {required: true, message: '请输入姓名'},

                     ],
                   })(
                     <Input placeholder="请输入姓名"/>
                   )}
                 </FormItem>
               </Col>
               <Col span={9} offset={1}>
                 <FormItem
                   wrapperCol={{span: 24}}
                 >
                   {getFieldDecorator('contactPhone', {
                     initialValue: (company && company.contactPhone) ? company.contactPhone : '',

                     rules: [

                       {pattern: /^[\d]{11}$/,
                         message: '请输入正确的手机号',
                         required: true,
                       },
                     ],
                   })(
                     <Input placeholder="请输入联系电话" />
                   )}
                 </FormItem>
               </Col>
             </Row>

             <Row>
               <Col span={14}>
                 <FormItem
                   labelCol={{span: 12}}
                   wrapperCol={{span: 12}}
                   label="财务联系人"
                 >
                   {getFieldDecorator('financeName', {
                     initialValue: company.financeName ? company.financeName : '',
                     validateFirst: true,
                     rules: [
                       {max: 60, message: '财务联系人输入长度不得超过60个字符'},
                       {required: true, message: '请输入姓名'},

                     ],
                   })(
                     <Input placeholder="请输入姓名"/>
                   )}
                 </FormItem>

               </Col>
               <Col span={9} offset={1}>
                 <FormItem
                   wrapperCol={{span: 24}}
                 >
                   {getFieldDecorator('financePhone', {
                     initialValue: (company && company.financePhone) ? company.financePhone : '',
                     validateFirst: true,
                     rules: [
                       {max: 11, message: '财务联系电话输入长度不得超过11个字符'},
                       {pattern: /^[\d]{11}$/,
                         message: '请输入正确的手机号',
                         required: true,
                       },


                     ],
                   })(
                     <Input placeholder="请输入联系电话" />
                   )}
                 </FormItem>

               </Col>
             </Row>

             <FormItem {...formItemLayout} label={'邮箱'}>
               {getFieldDecorator('email', {
                 initialValue: (company && company.email) ? company.email : '',
                 rules: [{
                   type: 'email', message: '请输入正确的邮箱格式',
                 }],
               })(
                 <Input placeholder={'请输入'}/>
               )}
             </FormItem>
             <FormItem {...formItemLayout} label={'通讯地址'}>
               {getFieldDecorator('addressCascader', {
                 initialValue: company.province ? [company.province, company.city, company.area] : undefined,
               })(
                 <Cascader
                   placeholder="请选择"
                   options={dict.pcaData}
                   loadData={this.loadAreaAddress}
                   displayRender={label => this.displayRender(label)}
                   className={'text-left'}
                 />
               )}
             </FormItem>
             <FormItem {...formItemAddressLayout} >
               {getFieldDecorator('address', {
                 initialValue: (company && company.address) ? company.address : '',
               })(
                 <Input placeholder={'请输入'}/>
               )}
             </FormItem>

             <FormItem {...formItemLayout} label={'服务顾问'} className={'server-text'}>
               <span >
                 {this.getManageDisplay()}
               </span>
             </FormItem>
             <div className={'tab-btns'}>
               <Button type="primary" htmlType="submit" loading={companyModel.isLoad}>
                 保存
               </Button>
               <Button onClick={() => this.handleCancel()} className={'btn-cancel'}>取消</Button>
             </div>
           </Form>
         ) : (
           <Form className={'tab1-form'} >
             <FormItem {...formItemLayout} label={'工商属性'} className={'server-text'}>
               {this.getCompanyTypeLabel(
                 company.companyType
               )}
             </FormItem>
             <FormItem {...formItemLayout} label={'单位名称'} className={'server-text'}>
               <span>{company.companyName}</span>
             </FormItem>
             <FormItem {...formItemLayout} label={'行业类型'} className={'server-text'}>
               <span>{this.socialTypeTitle()}</span>
             </FormItem>
             <FormItem {...formItemLayout} label={'管理员'} className={'server-text'}>
               <span>   {this.getRealNameDisplay()}</span>
             </FormItem>
             <FormItem {...formItemLayout} label={'财务联系人'} className={'server-text'}>
               <span>   {this.getfinanceNameDisplay()}</span>
             </FormItem>
             <FormItem {...formItemLayout} label={'邮箱'} className={'server-text'}>
               <span>{(company && company.email) ? company.email : '-' }</span>
             </FormItem>
             <FormItem {...formItemLayout} label={'通讯地址'} className={'server-text'}>
               <span>{this.displayAddress() || '-'} </span>
             </FormItem>

             <FormItem {...formItemLayout} label={'服务顾问'} className={'server-text'}>
               <span >
                 {this.getManageDisplay()}
               </span>
             </FormItem>
             <div className={'tab-btn-box'}>

               <Button onClick={e => this.handleEdit(e)} className={'btn-eitd'} type="primary">编辑</Button>
             </div>
           </Form>
         )
       }

      </div>
    );
  }
}

const Form3 = Form.create()(Class);

// export default Form3;
export default connect(state => state)(hot(module)(Form3));
