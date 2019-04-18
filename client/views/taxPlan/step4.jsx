import React from 'react';
import './style.less';
import RH from 'client/routeHelper';
import PollgingRequest from 'client/utils/pollingRequest';
import AnimateComponent from './animateComponent';
import { Modal, Button } from 'antd';

const Step4 = (props) => {
  const {
    taxSendDetailRecord,
    step,
    dispatch,
    history,
    showAnimate,
    successNum,
    failNum,
    outTradeNo,
  } = props;

  const clickIKnow = () => {
    PollgingRequest.clearPoll();
    RH(
      history,
      'taxSendRecord',
      `/${window.__themeKey}/salary/taxSendRecord`
    );
  };

  const agenExe = () => {
    if (failNum > 0) {
      dispatch({
        type: 'taxSendDetailRecord/queryDetail',
        payload: {
          outTradeNo,
          status: '-2',
          pageIndex: 1,
          pageSize: 10,
          callback: () => {
            dispatch({
              type: 'taxPlan/updateState',
              payload: {
                step: 3,
                showAnimate: false,
                showResult: true,
              },
            });
          },
        },
      });
    } else {
      RH(
        history,
        'sendRecord',
        `/${window.__themeKey}/salary/taxSendRecord`,
        {
          status: 5,
          outTradeNo,
          pageIndex: 1,
          pageSize: 10,
        }
      );
    }
  };

  return (
    <div>
      <AnimateComponent show={step === 3 && showAnimate} clickIKnow={clickIKnow}/>
      {/*<Modal*/}
        {/*visible={step === 3 && showAnimate}*/}
        {/*maskStyle={{ backgroundColor: 'rgba(155,167,176,.3)' }}*/}
        {/*footer={null}*/}
        {/*width={600}*/}
        {/*style={{ height: '400px', top: '300px' }}*/}
        {/*closable={false}*/}
      {/*>*/}
        {/*<p className={'ESexecuteProgress'}>*/}
          {/*方案执行中，请耐心等待~*/}
        {/*</p>*/}
        {/*<p className={'ESexecuteAnimationWrap'} />*/}
        {/*<div*/}
          {/*className={'ESbtnwrap'}*/}
        {/*>*/}
          {/*<Button className={'meKnowBtn'} type="primary" onClick={clickIKnow}>我知道了</Button>*/}
        {/*</div>*/}
      {/*</Modal>*/}
      <Modal
        visible={step === 3 && !showAnimate}
        maskStyle={{ backgroundColor: 'rgba(155,167,176,.3)' }}
        title="方案执行完毕"
        footer={null}
        style={{ height: '400px', top: '300px' }}
        closable
      >
        <p className={'ESfullModalContent'}>
          成功{successNum}条，失败<span style={{color: failNum > 0 ? 'red' : ''}}>{failNum}</span>条
        </p>
        <p className={'ESfullBtnWrap'}>
          <Button
            type="primary"
            onClick={agenExe}
            className={'ESfullBtn'}
            loading={taxSendDetailRecord.queryDetailBtnLoad}
          >
            {failNum > 0 ? '再次发放' : '查看详情'}
          </Button>
        </p>
      </Modal>
    </div>
  );
};

export default Step4;
