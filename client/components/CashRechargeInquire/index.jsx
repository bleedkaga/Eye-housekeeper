import React from 'react';
import cn from 'classnames';
import Moment from '../../views/assetAccount';
import {Button, DatePicker, Form, Icon, Select} from 'antd';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const { Option } = Select;

const renderOptions = item => <Option value={item.value}>{item.label}</Option>;

class Class extends React.Component {
  state = {
    cashFlag: false,
  };

  highSearch = () => {
    const { cashFlag } = this.state;
    this.setState({
      cashFlag: !cashFlag,
    });
  };

  commonSearchOne = () => {
    const { dispatch, onSearch } = this.props;
    dispatch({
      type: 'assetAccount/setParamCash',
      payload: { pageIndex: 1 },
    });
    onSearch && onSearch();
  };

  selectChannelOption = (b) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'assetAccount/setParamCash',
      payload: {channelType: b.props.value},
    });
  };

  selectAccountType = (b) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'assetAccount/setParamCash',
      payload: {financialType: b.props.value},
    });
  };

  selectStatusOptions = (b) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'assetAccount/setParamCash',
      payload: {status: b.props.value},
    });
  };

  render() {
    const { cashFlag } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { dispatch } = this.props;
    const paramCash = this.props;
    const { startDate, endDate } = paramCash;
    const rangeValue = [
      startDate ? Moment(startDate, dateFormat) : undefined,
      endDate ? Moment(endDate, dateFormat) : undefined,
    ];

    // Inquire options
    const channelOptions = [
      { value: '', label: '全部'},
      { value: 'yeepay_zzy_cash', label: '线上支付(网银支付)'},
      { value: 'ALIPAY_zzy_cash', label: '线上支付(支付宝支付)'},
      { value: 'WXPAY_zzy_cash', label: '线上支付(微信支付)'},
      { value: 'bank_transfer', label: '线下银行汇款'},
    ].map(renderOptions);

    const accountTypeOptions = [
      { value: '', label: '全部'},
      { value: '1', label: '现金账户充值'},
    ].map(renderOptions);

    const statusOptions = [
      { value: '', label: '全部'},
      { value: '1', label: '审核通过'},
      { value: '2', label: '审核不通过'},
      { value: '3', label: '审核中'},
      { value: '4', label: '待付款'},
    ].map(renderOptions);

    return (
      <Form layout="inline" className={cn('query-bar')} style={{paddingBottom: 16}}>
        <FormItem >
          <RangePicker
            value={rangeValue}
            onChange={(date, dateStr) => {
              dispatch({
                type: 'assetAccount/setParamCash',
                payload: { startDate: dateStr[0], endDate: dateStr[1] },
              });
            }}
          />
        </FormItem>

        <FormItem >
          <Button onClick={this.commonSearchOne} type="primary" className={cn('query-button')} htmlType={'button'} > 查询 </Button>
        </FormItem>

        <FormItem >
          {
            cashFlag === false
              ? <Button className={cn('expand-query-button')} onClick={this.highSearch} htmlType={'button'} >高级查询 <Icon type="down" /></Button>
              : <Button className={cn('expand-query-button')} onClick={this.highSearch} htmlType={'button'} >收起查询<Icon type="up" /></Button>
          }
        </FormItem>

        {
          !cashFlag ? '' :
          <div style={{marginTop: '16px'}}>
            <FormItem label="打款渠道" >
              {
                getFieldDecorator('payment0', {
                  initialValue: paramCash.channelType ? paramCash.channelType : '',
                  rules: [],
                })(
                  <Select className={cn('channel-select')} placeholder="请选择" onChange={(a, b) => this.selectChannelOption(b)} >
                    { channelOptions }
                  </Select>
                )
              }
            </FormItem>

            <FormItem label="账务类型" >
              {
                getFieldDecorator('type0', {
                  initialValue: paramCash.financialType ? paramCash.financialType : '',
                })(
                  <Select className={cn('channel-select')} placeholder="请选择" onChange={(a, b) => this.selectAccountType(b)} >
                    { accountTypeOptions }
                  </Select>
                )
              }
            </FormItem >

            <FormItem label="状态" >
              {
                getFieldDecorator('status0', {
                  initialValue: paramCash.status ? paramCash.status : '',
                })(
                  <Select className={cn('channel-select')} placeholder="请选择" onChange={(a, b) => this.selectStatusOptions(b)} >
                    { statusOptions }
                  </Select>
                )
              }
            </FormItem>
          </div>
        }
      </Form>
    );
  }
}

export default Form.create({})(Class);
