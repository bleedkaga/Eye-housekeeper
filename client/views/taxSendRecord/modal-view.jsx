import React from 'react';
import './style.less';
import cn from 'classnames';
import { Modal, Button, Icon } from 'antd';


const ModalView = (props) => {
  const { dispatch, modalType, visible, title, channelBtnLoading, outTradeNo, onSearch } = props;

  // 关闭 modal
  const closeModal = () => {
    dispatch({
      type: 'taxSendRecord/updateState',
      payload: {
        visible: false,
      },
    });
  };

  // 确定撤销方案
  const revocationScheme = () => {
    dispatch({
      type: 'taxSendRecord/revocationScheme',
      payload: {
        outTradeNo,
        callback: onSearch,
      },
    });
  };

  const confirmed = (<div>
    <div>
      <p style={{ fontSize: '16px', color: '#333', textAlign: 'center' }}>
        由于线下汇款时间较长，为了快速上账，请及时联系客服
      </p>
      <p style={{ fontSize: '16px', color: '#333', textAlign: 'center' }}>
        并提供汇款金额、汇款银行流水号信息。
      </p>
      <p style={{ marginTop: '24px', fontSize: '20px', color: '#333', textAlign: 'center' }}>
        服务热线：
        <span style={{ color: '#359AF7' }}>40000-10-711</span>
      </p>
    </div>
    <div style={{ width: '115px', height: '36px', margin: 'auto' }}>
      <Button
        type="primary"
        style={{
          marginTop: '53px',
          width: '110px',
          height: '34px',
        }}
        onClick={closeModal}
      >
        我已联系
      </Button>
    </div>
  </div>);
  const channel = (<div className={'cancelModal'}>
    <p><Icon type="exclamation-circle" theme="filled" style={{ fontSize: '60px', color: '#FFBE4D' }} /></p>
    <p>您是否确认撤销该次众包费用发放？</p>
    <div>
      <Button
        className={'cancelBtnOk'}
        type="primary"
        loading={channelBtnLoading}
        onClick={revocationScheme}
      >
        确定
      </Button>
      <Button
        className={'cancelBtnOk'}
        onClick={closeModal}
      >
        取消
      </Button>
    </div>
  </div>);

  return (
    <div className={cn('modal-view')}>
      <Modal
        visible={visible}
        title={title}
        footer={false}
        width={519}
        wrapClassName={cn('modal')}
        onCancel={closeModal}
      >
        <div
          style={{
            margin: '25px auto 37px auto',
            height: '179px',
          }}
        >
          {modalType === 2 ? confirmed : channel}
        </div>
      </Modal>
    </div>
  );
};

export default ModalView;
