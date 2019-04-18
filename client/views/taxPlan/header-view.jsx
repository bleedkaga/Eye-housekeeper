import React from 'react';
import './style.less';
import { Button } from 'antd';

const HeaderView = (props) => {
  const { dispatch } = props;
  return (
    <div className="header-view">
      <div className="header-wrap">
        <div className="header-content">人力成本试算</div>
        <div className="header-btn-wrap">
          <Button
            className="header-right-btn"
            type="primary"
            onClick={() => dispatch({ type: 'taxPlan/updateState', payload: { taxTrialVisible: true } })}
          >
            开始试算
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderView;
