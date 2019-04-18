import Clipboard from 'client/components/Clipboard';
import { Popover } from 'antd';
import React from 'react';
import cn from 'classnames';

export const CopyBoard = (props) => {
  if (props.expressCompany && props.expressCode) {
    return (
      <div className={cn('inline-block')}>
        <span>{props.expressCompany} - {props.expressCode}</span>&nbsp;

        <Clipboard
          text={`${props.expressCode}`}
        >
          <Popover
            arrowPointAtCenter
            title=""
            content={'复制成功'}
            trigger="click"
          >
            <a href="javascript:;">复制</a>
          </Popover>
        </Clipboard>
        <span>{props.expressMessage && props.expressMessage}</span>
      </div>
    );
  } else if (props.expressMessage) {
    return <span>{props.expressMessage}</span>;
  } else {
    return <span>——</span>;
  }
};
