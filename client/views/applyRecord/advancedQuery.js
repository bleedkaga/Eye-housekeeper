import React from 'react';
import cn from 'classnames';
import { Select, Input, DatePicker, Button, Icon } from 'antd';
import moment from 'moment';

const { Option } = Select;
class AdvancedQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      queryData: props.defaultData,
    };
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'applyRecord/setCondition',
    //   payload: {
    //     accountType: window.__themeKey === 'org' ? ['1', '2'] : ['3'],
    //   },
    // });
  }

  onChange(key, val) {
    const obj = {...this.state.queryData};
    switch (key) {
      case 'time':
        [obj.startTime, obj.endTime] = val;
        break;
      case 'accountType':
        obj[key] = val.split(',');
        break;
      default:
        obj[key] = val;
        break;
    }
    this.setState({
      queryData: obj,
    });

    console.log(obj);
  }

  count=0;

  render() {
    const { RangePicker } = DatePicker;
    const {queryData} = this.state;
    const dateFormat = 'YYYY-MM-DD';
    const { __themeKey } = window;

    return (
      [
        <div key="0" className={cn('page-layout-query')}>
          <div className="time-range">
            <RangePicker
              value={[
                queryData.startTime ? moment(queryData.startTime, dateFormat) : undefined,
                queryData.endTime ? moment(queryData.endTime, dateFormat) : undefined]
            }
              onChange={(e, val) => this.onChange('time', val)}
            />
          </div>

          <Button
            className={'query'}
            type="primary"
            onClick={() => {
              this.props.onSubmit(queryData);
            }}
          >查询</Button>
          <Button
            className={'advanced-query'}
            onClick={() => {
              this.setState({
                show: !this.state.show,
              });
            }}
          >
            {this.state.show ? '收起查询' : '高级查询'}
            <Icon type={this.state.show ? 'up' : 'down'} />
          </Button>
        </div>,
        this.state.show && (
          <div key="1" className={cn('advanced-query', 'f-cb')}>
            <div className={'query-item'}>
              <label>状态：</label>
              <Select defaultValue={queryData.status} style={{ width: 217 }} onChange={e => this.onChange('status', e)} >
                <Option value="">全部</Option>
                <Option value="1">未开票</Option>
                <Option value="2">已开票</Option>
                <Option value="3">已驳回</Option>
              </Select>
            </div>

            <div className={cn('query-item', __themeKey === 'union' && 'hide')}>
              <label>账务类型：</label>
              <Select defaultValue={queryData.accountType.join(',')} style={{ width: 217 }} onChange={e => this.onChange('accountType', e)} >
                <Option value="1,2">全部</Option>
                <Option value="1">现金账户充值</Option>
                <Option value="2">单位福利账户充值</Option>
              </Select>
            </div>

            <div className={cn('query-item', __themeKey === 'org' && 'hide')}>
              <label>账务类型：</label>
              <Select defaultValue={queryData.accountType.join(',')} style={{ width: 217 }} onChange={e => this.onChange('accountType', e)} >
                <Option value="3">工会福利账户充值</Option>
              </Select>
            </div>

            <div className={'query-item'}>
              <label>发票申请编号：</label>
              <div className={'input-enter'}>
                <Input placeholder="请输入" value={queryData.applyInvoiceCode} onChange={e => this.onChange('applyInvoiceCode', e.target.value)} />
              </div>
            </div>

            <div className={'query-item'}>
              <label>运单号：</label>
              <Input className={'input-enter'} value={queryData.expressCode} placeholder="请输入" onChange={e => this.onChange('expressCode', e.target.value)} />
            </div>
          </div>
        ),
      ]);
  }
}

export default AdvancedQuery;
