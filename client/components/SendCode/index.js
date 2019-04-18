import React from 'react';
import cn from 'classnames';

import {Button} from 'antd';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      text: props.text,
      loading: false,
      disabled: false,
    };

    if (props.id) {
      //存在刷新计数器
      const d = new Date();
      const oldTimestamp = parseInt(window.localStorage[`_SendCode_${props.id}_`], 10) || 0;
      if (oldTimestamp && d.getTime() >= oldTimestamp) {
        const od = new Date(oldTimestamp);
        const s = (d - od) / 1000; //过去了多少秒
        if (s < props.max) {
          this.current = parseInt(props.max - s, 10);
          this.state.disabled = true;
          this.state.text = `${this.current}s`;
          this.onCountDown();
        }
      }
    }
  }

  static defaultProps = {
    max: 60,
    text: '发送验证码',
    replay: '重新发送',
    sending: '发送中...',
    send: () => {
    },
  };


  componentDidMount() {
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }


  onPlay() {
    const {send} = this.props;
    if (send) {
      send(this.onSending, this.onSendOKEnd, this.onSendNoEnd);
    }
  }

  onSending = () => {
    const {sending} = this.props;

    this.setState({
      text: sending,
      loading: true,
    });
  };

  onSendOKEnd = () => {
    const {id, max} = this.props;
    if (id) window.localStorage[`_SendCode_${id}_`] = new Date().getTime();

    this.onCountDown();
    this.current = max;
    this.setState({
      text: `${this.current}s`,
      loading: false,
      disabled: true,
    });
  };

  onSendNoEnd = () => {
    const {replay} = this.props;
    this.setState({
      text: replay,
      loading: false,
      disabled: false,
    });
  };

  current = 0;

  _timer = null;

  onCountDown() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      if (this.current > 0) {
        this.setState({text: `${--this.current}s`});
        this.onCountDown();
      } else {
        this.onSendNoEnd();
      }
    }, 1000);
  }

  render() {
    const {text, loading, disabled} = this.state;
    return (<Button
      loading={loading}
      disabled={disabled}
      type={'primary'}
      className={cn('send-code-btn', this.props.className)}
      onClick={() => this.onPlay()}
    >
      {text}
    </Button>);
  }
}


export default Class;

