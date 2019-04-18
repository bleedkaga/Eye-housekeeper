import React, { Component } from 'react';
import { Input, Tooltip, Icon } from 'antd';
import './style.less';

class HintInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unit: this.props.unit || '元', // 默认元
      size: this.props.size || 'default',
    };
  }

  render() {
    return (
      <div className={'HintInput-container'}>
        <Input
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          disabled={this.props.disabled}
          size={this.state.size}
          maxLength={this.props.maxLength}
          type={this.props.type}
        />
        <span className={'unit'}>
          {this.props.hasUnit ? this.state.unit : null}&nbsp;
          <Tooltip title={this.props.tooltipContent}>
            <Icon type="question-circle" theme="filled" style={{ color: '#FFBE4D' }}/>
          </Tooltip></span>
      </div>
    );
  }
}

export default HintInput;
