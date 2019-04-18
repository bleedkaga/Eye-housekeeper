import React from 'react';
import cn from 'classnames';
import {Input, Button} from 'antd';

import './style.less';

class MashUpInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  static defaultProps = {
    className: '',
    style: {},

    placeholder: '请输入',
    allowClear: true,
    reset: false, //显示重置按钮
    height: 32,
    width: 250,
    value: '',

    buttonText: '查询',
    buttonWidth: 70,

    onSearch: () => {
    },
    onChange: () => {

    },
    onClear: undefined,
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({value: nextProps.value});
    }
  }

  render() {
    const {
      placeholder, allowClear, height, width, buttonText, buttonWidth, className, style, onSearch, onClear, onChange, reset,
    } = this.props;

    return (
      <div className={cn('mash-up-box', className, {'has-reset': reset})} style={{...style, width, height}}>
        <div className={cn('row')}>
          <Input
            className={cn('mu-input', 'col', 'col-center')}
            placeholder={placeholder}
            allowClear={allowClear}
            onPressEnter={(e) => {
              if (this.props.onPressEnter) {
                this.props.onPressEnter(e);
              } else {
                onSearch && onSearch(e);
              }
            }}
            onChange={(e) => {
              e.persist();
              this.setState({value: e.target.value});
              onChange && onChange(e);
              if (e.type !== 'change' && e.target.value === '') {
                setTimeout(() => {
                  if (onClear) {
                    onClear(e);
                  } else if (onSearch) {
                    onSearch(e);
                  }
                }, 16);
              }
            }}
            value={this.state.value}
            type={this.props.type}
            disabled={this.props.disabled}
          />
          <Button
            className={cn('col-center')}
            type={'primary'}
            style={{width: buttonWidth}}
            onClick={(e) => {
              onSearch && onSearch(e);
            }}
          >{buttonText}</Button>
        </div>
        {
          reset && this.state.value ? <a
            href="javascript:;"
            className={cn('mu-link')}
            onClick={(e) => {
              e.persist();
              this.setState({value: ''});
              onChange && onChange({target: {value: ''}});
              setTimeout(() => {
                onSearch && onSearch(e);
              }, 16);
            }}
          >重置</a> : null
        }
      </div>
    );
  }
}

export default MashUpInput;
