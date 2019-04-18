import React from 'react';
import {Input} from 'antd';


class NumericInput extends React.Component {
  componentDidMount() {
  }

  onChange = (e) => {
    let {value} = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//eslint-disable-line
      this.props.onChange(value);
    }
  };

  onFocus = (e) => {
    if (e.target.value === '0') {
      this.props.onChange('');
    }
  };

  render() {
    return (
      <Input
        {...this.props}
        onFocus={this.onFocus}
        onChange={this.onChange}
        placeholder="请输入"
        maxLength={25}
      />
    );
  }
}


export default NumericInput;
