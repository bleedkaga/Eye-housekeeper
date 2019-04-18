import React from 'react';
import './style.less';
import PropTypes from 'prop-types';
import AJAX from 'client/utils/ajax';
import API from 'client/services/public';
import AGREEMENT from './internet_bank_payment_guarantee_agreement';
import { Modal, Button, message } from 'antd';

const ModalView = (props) => {
  const {
    visible,
    updateState,
    agreementType,
    agreemented,
    confirmBtnLoading,
    global,
  } = props;
  const closeModal = () => {
    updateState({
      visible: false,
    });
  };
  const queryData = {
    companyId: global.account.companyId,
  };

  const onOk = (payType) => {
    updateState({
      confirmBtnLoading: true,
    });
    AJAX.send(API.updatePayStatus, {payType, ...queryData}).then((res) => {
      if (res && res.code === 0) {
        setTimeout(() => {
          AJAX.send(API.queryOpenPayStatus, queryData).then((_res) => {
            if (_res && _res.code === 0) {
              const { data } = _res;
              updateState({
                confirmBtnLoading: false,
                visible: false,
                bank_agreemented: data.bankPay === 0,
                ali_agreemented: data.aliPay === 0,
                wx_agreemented: data.wechatPay === 0,
                pay_agreemented: data.cyberbankPay === 0,
              });
            } else {
              message.error(_res.message);
              updateState({
                confirmBtnLoading: false,
              });
            }
          });
        }, 1500);
      } else {
        message.error(res.message);
        updateState({
          confirmBtnLoading: false,
        });
      }
    });
  };


  const openAgreenment = () => {
    if (!agreemented) {
      if (agreementType === 'bank') {
        onOk(4);
      } else
      if (agreementType === 'ali') {
        onOk(1);
      } else
      if (agreementType === 'pay') {
        onOk(3);
      } else {
        onOk(2);
      }
    } else if (agreementType === 'bank') {
      updateState({
        bank_agreed: true,
        visible: false,
      });
    } else
    if (agreementType === 'ali') {
      updateState({
        ali_agreed: true,
        visible: false,
      });
    } else
    if (agreementType === 'pay') {
      updateState({
        pay_agreed: true,
        visible: false,
      });
    } else {
      updateState({
        wx_agreed: true,
        visible: false,
      });
    }
  };


  const agreement = {
    bank: {
      title: '银行担保代扣协议',
      content: AGREEMENT.bank,
    },
    wx: {
      title: '微信支付担保代扣协议',
      content: AGREEMENT.wx,
    },
    ali: {
      title: '支付宝支付担保代扣协议',
      content: AGREEMENT.ali,
    },
    pay: {
      title: '网银支付担保代扣协议',
      content: AGREEMENT.internet_bank,
    },
  };

  return (
    <div>
      <Modal
        title="协议签订"
        visible={visible}
        width={900}
        onCancel={closeModal}
        footer={
          <div className={'confirm_btn_wrap'}>
            <Button
              type="primary"
              className={'confirm_agreement'}
              onClick={openAgreenment}
              loading={confirmBtnLoading}
            >
              {agreemented ? '关闭' : '我已阅读并同意协议'}
            </Button>
          </div>
        }
      >
        <div className={'modal_view'}>
          <p className={'modal_view_title'}>{agreement[agreementType].title}</p>
          {agreement[agreementType].content}
        </div>
      </Modal>
    </div>
  );
};

ModalView.propTypes = {
  visible: PropTypes.bool,
  updateState: PropTypes.func,
  agreementType: PropTypes.string,
  confirmBtnLoading: PropTypes.bool,
  agreemented: PropTypes.bool,
};

export default ModalView;
