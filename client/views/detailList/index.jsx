import React from 'react';

export default class DetailedList React.Component; {
  constructor(props); {
    super(props);
    this.state = {
      startTime: props.startTime || '',
      endTime: props.endTime || '',
    };
  }

  render(); {
    return (
      <div>
        发放清单页面
      </div>
    );
  }
}
