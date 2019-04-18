import React from 'react';
import cn from 'classnames';
import Tools from 'client/utils/tools';

class Class extends React.Component {
  render() {
    const { statistical, statisticalAmount } = this.props;
    const { success, underreview, failure, pendingpayment, total} = statistical;
    return (
      <div className={cn('gray-block')}>
        <div>
          {total}条充值记录，
          <i style={{color: '#32B16C'}}>充值成功{success}笔，</i>
          <i style={{color: '#FDC56B'}}>审核中{underreview}笔，</i>
          <i style={{color: '#FF4D4F'}}>审核不通过{failure}笔, </i>
          <i style={{color: '#1890FF'}}>待付款{pendingpayment}笔</i>
        </div>
        <div> 现金账户：
        累计充值{Tools.getViewPrice(statisticalAmount.totalamount, '', false, 2, ',', '.')}元，
        实际到账{Tools.getViewPrice(statisticalAmount.actualArrival, '', false, 2, ',', '.')}元
        </div>
      </div>
    );
  }
}

export default Class;
