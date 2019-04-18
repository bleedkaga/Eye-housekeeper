import React from 'react';
import './style.less';
import { connect } from 'dva';
import cn from 'classnames';
import { accMul, formatMoney } from 'client/utils/formatData';
import RH from 'client/routeHelper';
import AJAX from 'client/utils/ajax';
import CapacityTaxAPI from 'client/services/capacityTax';
import { Modal, Form, Input, Button, InputNumber } from 'antd';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 15},
};

class CostCalculate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      visible: false,
      startCalculateBtnLoad: false,
      addedTaxRate: '0.06', // 增值税率
      colligateRate: '0.1', // 综合税率
      superTaxRate: '0.12', // 附加税率
      invoiceAmount: 0, // 开票金额
      colligateValue: 0, // 综合税
      factCostRate: 0, // 实际产生成本率
      factCost: 0, // 实际成本
      addedTaxValue: 0, // 增值税
      superTaxValue: 0, // 附加税
    };
    this.showModal = this.showModal.bind(this);
  }

  componentDidMount() {
    // const { companyId } = this.props.global.account;
    // AJAX.send(CapacityTaxAPI.queryCrowdRate, {companyId}).then((res) => {
    //   if (res && res.code === 0) {
    //     const { data } = res;
    //     this.setState({
    //       addedTaxRate: data.addedTaxRate,
    //       colligateRate: data.colligateRate,
    //       superTaxRate: data.superTaxRate,
    //     });
    //   }
    // });
  }

  showModal(bool) {
    this.setState({
      visible: bool,
      result: false,
    });
  }

  startCalculate(values) {
    const { companyId } = this.props.global.account;
    this.setState({
      startCalculateBtnLoad: true,
    });
    AJAX.send(CapacityTaxAPI.costCalculate, {...values, companyId}).then((res) => {
      if (res && res.code === 0) {
        const { data } = res;
        this.setState({
          result: true,
          startCalculateBtnLoad: false,
          invoiceAmount: data.invoiceAmount, // 开票金额
          colligateValue: data.colligateValue, // 综合税
          factCostRate: data.factCostRate, // 实际产生成本率
          factCost: data.factCost, // 实际成本
          addedTaxValue: data.addedTaxValue, // 增值税
          superTaxValue: data.superTaxValue,
        });
      } else {
        this.setState({
          startCalculateBtnLoad: false,
        });
      }
    });
  }

  renderForm(form) {
    const { getFieldDecorator, validateFields } = form;
    const { result, startCalculateBtnLoad, addedTaxRate, colligateRate, superTaxRate } = this.state;
    const handleSubmit = () => {
      validateFields((err, values) => {
        if (!err) {
          const queryData = {
            factAmount: accMul(values.factAmount, 100),
            addedTaxRate: `${accMul(addedTaxRate, 1)}`,
            superTaxRate: `${accMul(superTaxRate, 1)}`,
          };
          this.startCalculate(queryData);
        }
      });
    };

    return (
      <div className={cn('cost-form')}>
        <div className={cn('cost-content-wrap')}>
          <h6 className={cn('cost-content-title')}>请输入企业众包成本情况：</h6>
          <FormItem
            label={<span style={{color: '#666'}}>实发金额</span>}
            {...FormItemLayout}
          >
            {getFieldDecorator('factAmount', {
              getValueFromEvent: e => e.target.value.replace(/\D/, ''),
              rules: [
                {required: true, message: '请输入任务绩效费'},
                {max: 7, message: '请输入正确的金额'},
              ],
            })(
              <Input suffix="元" placeholder="请输入任务绩效费" />
            )}
          </FormItem>
          <FormItem
            label={<span style={{color: '#666'}}>增值税税率</span>}
            {...FormItemLayout}
          >
            {getFieldDecorator('addedTaxRate', {
              initialValue: `${accMul(addedTaxRate, 100)}`,
              rules: [{required: true, message: '请输入增值税税率'}],
            })(
              <InputNumber
                style={{width: '100%'}}
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                disabled
              />
            )}
          </FormItem>
          <FormItem
            label={<span style={{color: '#666'}}>附加税税率</span>}
            {...FormItemLayout}
          >
            {getFieldDecorator('superTaxRate', {
              initialValue: accMul(superTaxRate, 100),
              rules: [{required: true, message: '请输入附加税税率'}],
            })(
              <InputNumber
                style={{width: '100%'}}
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                disabled
              />
            )}
          </FormItem>
          <FormItem
            label={<span style={{color: '#666'}}>综合税率</span>}
            {...FormItemLayout}
          >
            <span>{`${accMul(colligateRate, 100)}%`}</span>
          </FormItem>
          <div className={cn('cost-content-footer-btn-wrap')}>
            <Button
              className={cn({'cost-calculate-start-btn': true, 'is-result-btn': result})}
              type="primary"
              onClick={handleSubmit}
              icon={result ? 'sync' : null}
              loading={startCalculateBtnLoad}
            >
              {!result ? '开始测算' : '重新测算'}
            </Button>
          </div>
        </div>
      </div>);
  }

  renderResult() {
    const { history } = this.props;
    const {
      colligateValue, // 综合税
      factCostRate, // 实际产生成本率
      factCost, // 实际成本
      addedTaxValue, // 增值税
      invoiceAmount, // 开票金额
      superTaxValue, // 附加税
    } = this.state;
    return (
      <div className={cn('cost-result')}>
        <div className={cn('cost-content-wrap')}>
          <div className={cn('cost-content-result-wrap')}>
            <p className={cn('cost-content-title')}>众包成本测算结果：</p>
            <p><label>开票金额(含税)：</label><span>{`${formatMoney(accMul(invoiceAmount, 0.01), true)}元`}</span></p>
            <p><label>综合税费：</label><span>{`${formatMoney(accMul(colligateValue, 0.01), true)}元`}</span></p>
            <p><label>增值税：</label><span>{`${formatMoney(accMul(addedTaxValue, 0.01), true)}元`}</span></p>
            <p><label>附加税：</label><span>{`${formatMoney(accMul(superTaxValue, 0.01), true)}元`}</span></p>
            <p><label>实际产生成本率：</label><span>{`${accMul(factCostRate, 100)}%`}</span></p>
            <p><label>实际产生成本：</label><span>{`${formatMoney(accMul(factCost, 0.01), true)}元`}</span></p>
          </div>
        </div>
        <div className={cn('start-tax-plan-btn-wrap')}>
          <Button
            type="primary"
            className={cn('start-tax-plan-btn')}
            onClick={() => RH(history, 'taxPlan', `/${window.__themeKey}/salary/taxPlan`)}
          >
            开启税酬规划
          </Button>
        </div>
      </div>);
  }

  render() {
    const { result, visible } = this.state;
    return (
      <div className={cn('cost-calculate')}>
        <Modal
          title={<p style={{textAlign: 'center'}}>企业众包成本测算器</p>}
          visible={visible}
          footer={false}
          width={result ? 1000 : 700}
          onCancel={() => this.showModal(false)}
          destroyOnClose
        >
          <div className={cn('cost-calculate-wrap')}>
            <div style={{width: `${result ? '50%' : '100%'}`}} className={cn('cost-calculate-left-content')}>{this.renderForm(this.props.form)}</div>
            {result && <div className={cn('cost-calculate-right-content')}>{this.renderResult(this.props.form)}</div>}
          </div>
        </Modal>
      </div>
    );
  }
}


export default connect(state => (state))(Form.create()(CostCalculate));
