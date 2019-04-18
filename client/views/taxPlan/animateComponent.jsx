import React from 'react';
import './style.less';
import { Modal, Button } from 'antd';

class AnimateComponent extends React.Component {
  render() {
    const { clickIKnow, show, isSendTask = false } = this.props;
    return (
      <Modal
        visible={show}
        maskStyle={{ backgroundColor: 'rgba(155,167,176,.3)' }}
        footer={null}
        width={600}
        style={{ height: '400px', top: '300px' }}
        closable={false}
      >
        <p className={'ESexecuteProgress'}>
          {!isSendTask ? '方案执行' : '任务发布'}中，请耐心等待~
        </p>
        <p className={'ESexecuteAnimationWrap'} />
        <div
          className={'ESbtnwrap'}
        >
          <Button className={'meKnowBtn'} type="primary" onClick={clickIKnow}>我知道了</Button>
        </div>
      </Modal>
    )
  }
}

export default AnimateComponent;
