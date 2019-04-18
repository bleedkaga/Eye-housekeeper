import React from 'react';
import './style.less';
import { connect } from 'dva';
import TrialForms from './trialForms';
import TrialResult from './trialResult';
import { Modal } from 'antd';

class TaxTrial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trialFull: false, // 试算完成
      schemeData: {}, // 方案数据
      startTrialBtnLoading: false, // 开始试算按钮 loading
    };
  }

  updateState = (payload, callback) => {
    this.setState(payload, () => callback && callback());
  };

  closeModal = () => {
    const { onCancel } = this.props;
    this.setState({
      trialFull: false,
    });
    onCancel && onCancel();
  };

  render() {
    const { trialFull, schemeData, startTrialBtnLoading } = this.state;
    const trialFormsProps = {
      startTrialBtnLoading,
      updateState: this.updateState,
      ...this.props,
    };
    const trialResultProps = {
      schemeData,
      closeModal: this.closeModal,
      ...this.props,
    };
    return (
      <Modal
        title={<div style={{ textAlign: 'center' }}>{trialFull ? '众包成本试算结果' : '众包成本试算'}</div>}
        visible={this.props.visible || false}
        onCancel={this.closeModal}
        width={trialFull ? 1076 : 833}
        footer={null}
        destroyOnClose
      >
        {trialFull ? <TrialResult {...trialResultProps}/> : <TrialForms {...trialFormsProps}/>}
      </Modal>
    );
  }
}

export default connect()(TaxTrial);
