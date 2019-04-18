import React from 'react';

import './style.less';
import { Form, Button, Input, message} from 'antd';
import {hot} from 'react-hot-loader';
import {connect} from 'dva';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
    // offset: 1,
  },
};
class Class extends React.Component {
  constructor(props) {
    super(props);
    const {company: companyModel} = this.props;
    this.state = {
      editFinance: companyModel.editFinance,
    };
  }

  displayBank() {
    const { company: companyModel } = this.props;
    const {gsCompanyIndustry = {} } = companyModel.allCompanyData;
    let ret = '';
    if (gsCompanyIndustry.bank) {
      ret += gsCompanyIndustry.bank;
      if (gsCompanyIndustry.bankAccount) {
        ret = `${ret}-${gsCompanyIndustry.bankAccount}`;
      }
    }
    return ret;
  }

  //变成编辑状态
  handleEdit() {
    this.setState({
      editFinance: true,
    });
  }

  handleCancel() {
    this.setState({
      editFinance: false,
    });
  }

  //提交方法
  onHandleSubmit() {
    const { dispatch, company: companyModel, form} = this.props;
    const {gsCompanyIndustry = {} } = companyModel.allCompanyData;
    const {validateFieldsAndScroll} = form;
    validateFieldsAndScroll((err, values) => {
      if (err) {
        message.error('保存失败');
      }
      if (!values.bank && values.bankAccount) {
        message.error('请输入开户行');
        return;
      }
      if (!err) {
        dispatch({
          type: 'company/updateIndustryBaseInfo',
          payload: {
            companyId: gsCompanyIndustry.companyId, //ok
            companyName: gsCompanyIndustry.companyName, //ok
            ...values,
          },
          callback: (res) => {
            if (res.code === 0) {
              dispatch({
                type: 'company/getCompanyByIdDetail',
                payload: {companyId: gsCompanyIndustry.companyId } }); //ok
              this.setState({editFinance: false });
              message.success('修改成功');
            }
          },
        });
      }
    });
  }

  render() {
    const { company: companyModel, form} = this.props;

    const {gsCompanyIndustry = {}, company = {}} = companyModel.allCompanyData;
    const {editFinance} = this.state;
    const {getFieldDecorator} = form;

    return (
      <div className="tab3">
        <div className="text-box">
          <span>温馨提示：请核对税务登记信息是否正确，如果有错误，请及时修改。避免使用系统造成不必要的阻碍。</span>
        </div>
        {
          editFinance ? (
            <Form onSubmit={(e) => { e.preventDefault(); this.onHandleSubmit(e); }} className={'tab3-form'}>
              <FormItem label="单位名称" {...formItemLayout} className={'server-text'}>
                { gsCompanyIndustry.companyName || '-'}
              </FormItem>
              <FormItem label="纳税人识别号" {...formItemLayout} >
                {getFieldDecorator('creditCode', {
                  initialValue: gsCompanyIndustry.creditCode ? gsCompanyIndustry.creditCode : '',
                  rules: [
                    {
                      required: company.companyType === '1',
                      message: '请正确输入纳税人识别号',
                      pattern: /^[0-9a-zA-Z]*$/},
                  ],
                })(
                  <Input placeholder="请输入" maxLength={20}/>
                )}
              </FormItem>
              <FormItem label="单位注册地址" {...formItemLayout} >
                {getFieldDecorator('address', {
                  initialValue: gsCompanyIndustry.address ? gsCompanyIndustry.address : '',
                  rules: [{ required: company.companyType === '1', message: '请输入单位注册地址'}],
                })(
                  <Input placeholder={'请输入'} />
                )}
              </FormItem>
              <FormItem label="电话" {...formItemLayout} >
                {getFieldDecorator('phoneNumber', {
                  initialValue: gsCompanyIndustry.phoneNumber ? gsCompanyIndustry.phoneNumber : '',
                  rules: [
                    {
                      required: company.companyType === '1',
                      pattern: /^[\d]{11}$/,
                      message: '请输入正确的手机号或者座机号(无需横杠)',
                    },
                  ],
                })(
                  <Input placeholder={'请输入'} maxLength={11}/>
                )}
              </FormItem>
              <FormItem label="开户行" {...formItemLayout} >
                {getFieldDecorator('bank', {
                  initialValue: gsCompanyIndustry.bank ? gsCompanyIndustry.bank : '',
                  rules: [{ required: company.companyType === '1', message: '请输入开户行' }],
                })(
                  <Input placeholder={'请输入'} />
                )}
              </FormItem>
              <FormItem label="账户" {...formItemLayout} >
                {getFieldDecorator('bankAccount', {
                  initialValue: gsCompanyIndustry.bankAccount ? gsCompanyIndustry.bankAccount : '',
                  rules: [{ required: company.companyType === '1', message: '请输入账户'}],
                })(
                  <Input placeholder={'请输入'} />
                )}
              </FormItem>


              <div className={'tab-btns'}>
                <Button type="primary" htmlType="submit" loading={company.isLoad}>
                  保存
                </Button>
                <Button onClick={() => this.handleCancel()} className={'btn-cancel'}>取消</Button>
              </div>
            </Form>
          ) : (
            <div className={'tab3-form'}>
              <FormItem label="单位名称" {...formItemLayout} className={'server-text'}>
                { gsCompanyIndustry.companyName || '-'}
              </FormItem>
              <FormItem label="纳税人识别号" {...formItemLayout} className={'server-text'} >
                {gsCompanyIndustry.creditCode || '-'}
              </FormItem>
              <FormItem label="单位注册地址" {...formItemLayout} className={'server-text'}>
                {gsCompanyIndustry.address || '-'}
              </FormItem>
              <FormItem label="电话" {...formItemLayout} className={'server-text'}>
                {gsCompanyIndustry.phoneNumber || '-'}
              </FormItem>
              <FormItem label="开户行及账户" {...formItemLayout} className={'server-text'}>
                {this.displayBank() || '-'}
              </FormItem>
              <div className={'tab-btn-box'}>
                <Button onClick={e => this.handleEdit(e)} className={'btn-eitd'} type="primary">修改</Button>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

const Form4 = Form.create()(Class);

// export default Form3;
export default connect(state => state)(hot(module)(Form4));
