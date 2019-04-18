import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Cascader} from 'antd';
import ConsumptionCheckbox from 'client/components/ConsumptionCheckbox';

import './style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 10,
    offset: 0,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.__timer = null;

    this.state = {};
  }

  componentDidMount() {
    const {dispatch} = this.props;

    dispatch({type: 'sendStaff/set', payload: {isLoad: true}});

    this.setOut();
  }

  componentWillUnmount() {
    clearTimeout(this.__timer);
  }

  // componentWillReceiveProps(){
  // }

  setOut() {
    const {dispatch, id, sendStaff: {step1: {reason = []}}} = this.props;
    if ((id && reason.length) || !id) {
      dispatch({
        type: 'sendStaff/findFirstValListMy',
        payload: {
          dict_codes: 'releaseReason,consumerOptions',
          __autoLoading: true,
        },
        callback: () => {
          this.onInit(() => {
            dispatch({type: 'sendStaff/set', payload: {isLoad: false}});
          });
        },
      });
    } else {
      this.__timer = setTimeout(() => {
        this.setOut();
      }, 233);
    }
  }

  onInit(cb) {
    const {sendStaff: {step1: {reason = []}, releaseReason}, dispatch} = this.props;
    if (reason.length) {
      let tempArr = releaseReason;
      const _reason = (arr, index = 0) => {
        const value = arr[index];
        const isEnd = index === 1;
        if (value) {
          const rel = tempArr.find(item => item.value === value);
          if (rel) {
            dispatch({
              type: 'sendStaff/findSecondValList',
              payload: {
                dict_code: 'releaseReason',
                selectedOptions: [rel],
                end: isEnd,
              },
              callback: () => {
                tempArr = rel.children || [];
                _reason(arr, ++index);
              },
            });
          }
        } else {
          cb && cb();
        }
      };
      _reason(reason, 0);
    } else {
      cb && cb();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, next} = this.props;
    form.validateFields({force: true}, (err, values) => {
      if (!err) {
        dispatch({type: 'sendStaff/setStep1', payload: {...values}});
        next && next();
      }
    });
  };

  loadReasonsData = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendStaff/findSecondValList',
      payload: {
        dict_code: 'releaseReason',
        selectedOptions,
        end: selectedOptions.length === 2,
      },
    });
  };


  render() {
    const {history, form, sendStaff, dispatch, global} = this.props;
    const {getFieldDecorator} = form;
    const {step1} = sendStaff;

    return (<div className={'step1'}>
      <Form
        onSubmit={this.handleSubmit}
        className={cn('step-form')}
      >
        <FormItem {...formItemLayout} label={'发放事由'}>
          {getFieldDecorator('reason', {
            initialValue: step1.reason,
            rules: [
              {required: true, message: '请选择发放事由'},
              {
                validator: (rule, value, callback) => {
                  if (Array.isArray(value) && value.length === 3 && value[0] && value[1] && value[2]) {
                    callback();
                  } else callback(true);
                },
                message: '请选择完整的事由',
              },
            ],
          })(
            <Cascader
              placeholder="请选择"
              options={sendStaff.releaseReason}
              loadData={this.loadReasonsData}
              onChange={(e) => {
                if (!e || e.length === 0) {
                  dispatch({type: 'sendStaff/set', payload: {reasonTips: ''}});
                }
                if (e && e.length > 2) {
                  dispatch({
                    type: 'sendStaff/findSpecialNoteByThirdReason',
                    payload: {
                      dictCode: 'releaseReason',
                      dictValue: e[2],
                    },
                  });
                }
              }}
            />
          )}

          {
            sendStaff.reasonTips ? <div className={cn('reason-tips')}>
              <span>{sendStaff.reasonTips}</span>
            </div> : null
          }
        </FormItem>
        <FormItem {...formItemLayout} wrapperCol={{span: 20}} label={'使用范围'} className={cn('formItem-opt')}>
          {getFieldDecorator('consumptionOptions', {
            initialValue: step1.consumptionOptions,
            rules: [
              {required: true, message: '请选择使用范围'},
            ],
          })(
            <ConsumptionCheckbox
              loading={sendStaff.isLoadDict}
              list={sendStaff.consumerOptions}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'人均发放'}>
          {getFieldDecorator('amount', {
            validateFirst: true,
            initialValue: step1.amount,
            rules: [
              {required: true, message: '请输入'},
              {
                pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                message: '请输入正确的金额，小数点后最多两位',
              },
              {
                validator: (rule, value, callback) => {
                  if (parseFloat(value) > 0) {
                    callback();
                  } else {
                    callback(true);
                  }
                },
                message: '金额不能为0',
              },
              {
                validator: (rule, value, callback) => {
                  if (parseFloat(value) < 9999999.99) {
                    callback();
                  } else {
                    callback(true);
                  }
                },
                message: '最大支持金额 9999999.99',
              },
            ],
          })(
            <Input placeholder={'请输入'} suffix={<i>元</i>}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'备注信息'}>
          {getFieldDecorator('note', {
            initialValue: step1.note,
            rules: [{max: 120, message: '备注信息长度超过120'}],
          })(
            <Input placeholder={'请输入'}/>
          )}
        </FormItem>
        <div className={cn('btns')} style={{paddingTop: 30}}>
          <Button loading={sendStaff.isLoad} type="primary" htmlType="submit">
            下一步
          </Button>
        </div>
      </Form>
    </div>);
  }
}

const FormClass = Form.create()(Class);

export default connect(state => state)(hot(module)(FormClass));
