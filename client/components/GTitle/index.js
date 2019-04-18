import React from 'react';
import cn from 'classnames';
import {Icon} from 'antd';
import {goBack} from 'client/routeHelper';

import './style.less';

//文件选择器
class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    className: '',
    style: {},
    height: 59,
    border: true,
    close: true,
    onClose: () => {
      goBack();
    },
  };

  componentDidMount() {
  }


  render() {
    const {className, style, height, border, onClose, children, close} = this.props;
    return (<div className={cn('gsg-title', className, {'no-border': !border})} style={{...style, lineHeight: `${height}px`}}>
      {children}
      {close && <button className={cn('close')} onClick={e => onClose(e)}><Icon type={'close'}/></button>}
    </div>);
  }
}

export default Class;
