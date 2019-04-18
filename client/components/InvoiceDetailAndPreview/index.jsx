import React from 'react';
import {Modal, Tabs} from 'antd';
import cn from 'classnames';
import ModalInvoiceDetail from '../ModalInvoiceDetail';
import ModalInvoiceSwiper from '../ModalInvoiceSwiper';

const { TabPane } = Tabs;

class InvoiceDetailAndPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'detail',
    };
  }

  render() {
    const { dispatch, showInvoiceDetail} = this.props;
    const { type } = this.state;
    return (
      <Modal
        visible
        className={cn('custom-add-modal')}
        footer={null}
        onCancel={this.props.onClose}
        width={type === 'detail' ? 583 : 833}
      >
        <Tabs
          className={cn('invoice-record-tabs')}
          defaultActiveKey={'detail'}
          onChange={(key) => {
            this.setState({
              type: key,
            });
          }}
        >
          <TabPane tab="发票详情" key="detail">
            <ModalInvoiceDetail data={{dispatch}} detail={showInvoiceDetail} nextStep={null}/>
          </TabPane>
          <TabPane tab="发票预览" key="preview">
            <ModalInvoiceSwiper detail={showInvoiceDetail}/>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default InvoiceDetailAndPreview;
