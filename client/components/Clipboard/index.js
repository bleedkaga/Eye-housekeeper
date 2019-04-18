import React from 'react';
import Clipboard from 'clipboard-polyfill';


class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    text: '',
  };

  componentWillMount() {
  }

  componentDidMount() {
  }

  onCopy = () => {
    const {text, onComplete, onError} = this.props;
    Clipboard.writeText(text).then(() => {
      onComplete && onComplete();
    }).catch(() => {
      onError && onError();
    });
  };

  render() {
    const {children} = this.props;
    const oldOnClick = children.props.onClick;
    const cloneChildren = React.cloneElement(children, {
      onClick: () => {
        oldOnClick && oldOnClick();
        this.onCopy();
      },
    });
    return (cloneChildren);
  }
}


export default Class;
