import React from 'react';
import { Spin } from 'antd';
import ChunkStorage from './ChunkStorage';
import './style.less';

class Chunk extends React.Component {
  constructor(props) {
    super(props);
    const loadable = ChunkStorage.get(props.name);
    this.state = {
      error: loadable.error,
      component: loadable.component,
    };
  }

  static defaultProps = {
    delayReLoad: 300,
    // loading: () => (<div className={'page-content-loading'}><Loading size={1}/></div>),
    loading: () => (
      <div className={'page-content-loading'}>
        <Spin size="large"/>
      </div>),
    error: () => (<div className={'page-content-loading'}>页面载入错误！</div>),
    otherProps: {},
  };

  componentWillMount() {
    const {component} = this.state;
    if (!component) {
      this.load();
    }
  }

  componentDidMount() {
  }

  load() {
    ChunkStorage.load(this.props.name).then((loadable) => {
      this.setState({
        error: loadable.error,
        component: loadable.component,
      });
    }).catch(() => {
      this.setState({
        error: true,
        component: null,
      });
    });
  }

  _timer = null;

  reload() {
    clearTimeout(this._timer);

    this.setState({
      error: false,
      component: null,
    });

    this._timer = setTimeout(() => {
      this.load();
    }, this.props.delayReLoad);
  }

  render() {
    const {error: errorFun, loading, otherProps} = this.props;
    const {error, component: C} = this.state;

    return (<div className={'page-content-container'}>
      {
        error ?
          errorFun(this) :
          C ? <C {...otherProps}/> : loading(this)
      }
    </div>);
  }
}


export default Chunk;

