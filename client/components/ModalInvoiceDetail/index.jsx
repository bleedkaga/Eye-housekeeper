import React from 'react';
import cn from 'classnames';
import Tools from 'client/utils/tools';
import { Button } from 'antd';

// nextStep： true 显示下一步 false 为纯展示发票
// detail 为具体要显示的数据， 为保证字段的一致性，详情统一从接口上获取

class ModalInvoiceDetail extends React.Component {
  render() {
    const { data, nextStep, detail, setAddressVisible } = this.props;
    const { dispatch} = data;
    const text = window.__themeKey === 'org' ? '单位' : '工会';
    return (
      <div className={cn('dialog-invoice-detail')}>
        <ul>
          <li>
            <h3 className={cn('title')}>发票详情</h3>
            <div>
              <span className={cn('layout-left')}>发票 (张)： {detail.invoiceNumber}</span>
              <span>价税合计总额(元)：{ Tools.getViewPrice(detail.invoiceAmount) }</span>
            </div>
          </li>
          <li>
            <h3 className={cn('title')}>{text}信息</h3>
            <div>
              <span className={cn('layout-left')}>{text}名称： {detail.companyName}</span>
              <span>纳税人类型：{detail.taxpayerTypeDesc}</span>
            </div>
          </li>
          <li>
            <h3 className={cn('title')}>邮寄信息
              {setAddressVisible && (<a href="javascript:;" className={cn('submission-address-set', !nextStep ? 'hide' : '')}>设置</a>)}
            </h3>
            <div>
              <p>
                <span className={cn('layout-left')}>收件人姓名： {detail.recipientName}</span>
                <span>联系电话：{detail.recipientPhone}</span>
              </p>
              <p>
                <span className={cn('layout-left', 'column-pass')}>详细地址：{detail.recipientAddress}</span>
              </p>
            </div>
          </li>
          <li>
            <h3 className={cn('title')}>开票说明</h3>
            <div>
              <p>{detail.invoiceExplain}</p>
            </div>
          </li>
          <li className={cn('text-center', 'step-next')} style={{display: nextStep ? 'block' : 'none'}}>
            <Button
              type="primary"
              className={cn('step-next-button')}
              onClick={() => {
                dispatch({
                  type: 'applyInvoices/set',
                  payload: {
                    preSubmit: {
                      step: 2,
                    },
                  },
                });
              }}
            >下一步</Button>
          </li>
        </ul>
      </div>
    );
  }
}

export default ModalInvoiceDetail;
