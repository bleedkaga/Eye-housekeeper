import React from 'react';
import cn from 'classnames';
import {Spin} from 'antd';
import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {};
  }

  static defaultProps = {
    valueKey: 'dicval',
    nameKey: 'dicname',
    list: [],
    loading: false,
  };

  componentDidMount() {
  }

  toggleOption(e, item) {
    e.preventDefault();
    const {value, onChange, list, valueKey} = this.props;
    let target = value || [];
    // 当操作的是全选按钮
    if (item[valueKey] === '全部') {

      if (target.indexOf('全部') === -1) {
        if (list && Array.isArray(list) && list.length !== 0) {
          const result = [];
          list.forEach((option) => {
            if (result.indexOf(option[valueKey]) === -1) {
              result.push(option[valueKey]);
            }
          });
          target = result;
        }
      } else {
        target = [];
      }

    } else if (target.indexOf(item[valueKey]) === -1) {
      // 当选中按钮时
      target.push(item[valueKey]);
      // 除了全选之外的按钮被全部选中
      if (target.length === list.length - 1) {
        target.push('全部');
      }
    } else {
      // 当反选按钮时
      const itemIndex = target.findIndex(key => key === item[valueKey]);
      // console.log(itemIndex, target, item);
      target.splice(itemIndex, 1);
      const allIndex = target.findIndex(key => key === '全部');
      if (allIndex !== -1) {
        target.splice(allIndex, 1);
      }
    }
    onChange(target);
  }

  render() {
    const {list, value = [], valueKey, nameKey, loading} = this.props;

    return (
      <div className={cn('consumption-checkbox', 'f-cb')}>
        {
          loading ? <div className={cn('loading-box')}><Spin/></div> :
            list.map(item => (
              <span
                className={cn('cc-item', 'f-toe', {active: value.indexOf(item[valueKey]) !== -1})}
                onClick={(e) => this.toggleOption(e, item)}
                key={item[valueKey]}
                value={item[valueKey]}
              >
                {item[nameKey]}
              </span>
            ))
        }
      </div>
    );
  }
}


export default Class;
