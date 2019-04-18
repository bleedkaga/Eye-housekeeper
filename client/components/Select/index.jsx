import React from 'react';
import { Select } from 'antd';

const { Option } = Select;


class SelfSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  static defaultProps = {
    blankAllItem: false, // 不显示 "全部" 选项, false 为显示
    allItemValue: '', // "全部" 选项的值
    placeholder: '全部',
  };

  render() {
    const { allItemValue, blankAllItem, onChange, placeholder } = this.props;
    return (
      <Select
        allowClear
        value={this.state.value}
        placeholder={placeholder}
        {...this.props}
        onChange={(v, o) => {
          if (v === undefined) {
            this.setState({
              value: allItemValue,
            });
            onChange && onChange(allItemValue, o);
          } else {
            this.setState({
              value: v,
            });
            onChange && onChange(v, o);
          }
        }}
      >
        {!blankAllItem && <Option key="default-null" value={allItemValue}>全部</Option>}
        {this.props.children}
      </Select>
    );
  }
}

export default SelfSelect;
