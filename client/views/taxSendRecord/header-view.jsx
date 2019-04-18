import React from 'react';
import './style.less';
import cn from 'classnames';
import moment from 'moment';
import { Form, Input, Select, DatePicker, Button } from 'antd';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const HeaderView = (props) => {
  const {
    form,
    dispatch,
    isAdvancedQuery,
    status,
    orderId,
    startTime,
    endTime,
    onSearch,
  } = props;
  const { getFieldDecorator, validateFields } = form;
  const maybeSelected = [
    {
      value: 'null',
      name: '全部',
    },
    {
      value: '1',
      name: '等待付款',
    },
    {
      value: '2',
      name: '等待确认',
    },
    {
      value: '3',
      name: '待生效'
    },
    {
      value: '4',
      name: '进行中',
    },
    {
      value: '5',
      name: '待放款'
    },
    {
      value: '6',
      name: '放款中'
    },
    {
      value: '7',
      name: '部分完成'
    },
    {
      value: '8',
      name: '已完成'
    },
    {
      value: '-1',
      name: '失效'
    },
    {
      value: '-2',
      name: '失败',
    },
  ];

  // 展开高级搜索
  const advancedQuery = () => {
    if (isAdvancedQuery) {
      dispatch({
        type: 'taxSendRecord/updateState',
        payload: {
          orderId: '',
          status: null,
          isAdvancedQuery: !isAdvancedQuery,
        },
      });
      dispatch({
        type: 'taxSendRecord/setCondition',
        payload: {
          orderId: '',
          status: null,
          isAdvancedQuery: !isAdvancedQuery,
        },
      });
    } else {
      dispatch({
        type: 'taxSendRecord/updateState',
        payload: {
          isAdvancedQuery: true,
        },
      });
      dispatch({
        type: 'taxSendRecord/setCondition',
        payload: {
          isAdvancedQuery: !isAdvancedQuery,
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const { time } = values;
        let _startTime = '';
        let _endTime = '';
        if (time && time.length > 1) {
          _startTime = moment(time[0]).format('YYYY-MM-DD');
          _endTime = moment(time[1]).format('YYYY-MM-DD');
        }
        delete values.time;
        values.startTime = _startTime;
        values.endTime = _endTime;
        dispatch({
          type: 'taxSendRecord/setCondition',
          payload: {
            pageIndex: 1,
            pageSize: 10,
            ...values,
          },
        });
        setTimeout(() => {
          onSearch();
        }, 16);
      }
    });
  };

  return (
    <div className="header-view">
      <Form layout="inline" onSubmit={handleSubmit}>
        <FormItem>
          {getFieldDecorator('time', {
            initialValue: startTime !== '' && endTime !== '' ? [moment(startTime, 'YYYY-MM-DD'), moment(endTime, 'YYYY-MM-DD')] : [],
          })(
            <RangePicker />
          )}
        </FormItem>
        {isAdvancedQuery && <FormItem
          label="订单号"
        >
          {getFieldDecorator('orderId', {
            getValueFromEvent: event => event.target.value.replace(/\D/g, ''),
            initialValue: orderId,
            rules: [
              {max: 32, message: '最多输入32位'},
            ],
          })(
            <Input className="header-view-input" placeholder={'请输入32位订单号'}/>
          )}
        </FormItem>}
        {isAdvancedQuery && <FormItem
          label="状态"
        >
          {getFieldDecorator('status', {
            initialValue: status,
          })(
            <Select className="header-view-select">
              {maybeSelected.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)}
            </Select>
          )}
        </FormItem>}
        <FormItem>
          <Button type="primary" htmlType="submit" className={cn('query-btn')}>查询</Button>
        </FormItem>
        {/*<FormItem>*/}
          {/*<Button*/}
            {/*onClick={advancedQuery}*/}
            {/*className={cn({advancedQueryBtn: !isAdvancedQuery, advancedQuery: true})}*/}
          {/*>*/}
            {/*{isAdvancedQuery ? '收起查询  <<' : '高级查询  >>'}*/}
          {/*</Button>*/}
        {/*</FormItem>*/}
      </Form>
    </div>
  );
};

export default Form.create()(HeaderView);
