
const PollgingRequest = {};

// 轮询获取执行结果, 税筹规划 step4
PollgingRequest.pollingResult = (dispatch, outTradeNo) => {
  dispatch({
    type: "taxPlan/updateState",
    payload: {
      step: 3,
      showAnimate: true,
      showResult: false,
    },
  });
  PollgingRequest.polling(dispatch, outTradeNo);
};

PollgingRequest.polling = (dispatch, outTradeNo) => {
  PollgingRequest.GLOGABL_INTERVAL_POLLRESULT = setTimeout(() => {
    dispatch({
      type: "taxPlan/pollingResult",
      payload: {
        outTradeNo,
      },
    }).then((res) => {
      if (res && res.code === 0) {
        const { data } = res;
        dispatch({
          type: "taxPlan/updateState",
          payload: {
            personCount: data.total,
            successNum: data.succeed,
            failNum: data.failure,
          },
        });
        if (data.failure + data.succeed === data.total) {
          clearTimeout(PollgingRequest.GLOGABL_INTERVAL_POLLRESULT);
          dispatch({
            type: "taxPlan/updateState",
            payload: {
              showAnimate: false,
              successNum: data.succeed,
              failNum: data.failure,
            },
          });
        } else {
          PollgingRequest.polling(dispatch, outTradeNo);
        }
      } else {
        clearTimeout(PollgingRequest.GLOGABL_INTERVAL_POLLRESULT);
        dispatch({
          type: "taxPlan/updateState",
          payload: {
            showAnimate: false,
            successNum: 0,
            failNum: 0,
          },
        });
      }
    });
  }, 2000);
};

PollgingRequest.clearPoll = () => {
  clearTimeout(PollgingRequest.GLOGABL_INTERVAL_POLLRESULT);
};

export default PollgingRequest;
