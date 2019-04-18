import React from 'react';
import cn from 'classnames';
import { Carousel } from 'antd';
import Tools from 'client/utils/tools';
import { CopyBoard } from 'client/components/CopyBoard';

class ModalInvoiceSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
  }

  state = {
    current: 0,
  }

  rateMoney = item => (parseFloat(item.invoiceMoney / 100) / (1 + item.invoiceServiceCess) * item.invoiceServiceCess).toFixed(2)

  render() {
    const { detail } = this.props;
    const { current } = this.state;

    if (!detail.invoiceDetailList) return null;
    return (
      <div className={cn('dialog-invoice-prview')}>
        <div style={{padding: 22}}>
          <div className={cn('pos-r')}>

            <span className={cn('btn-prev', detail.invoiceNumber === 1 && 'hide')} onClick={() => { this.carouselRef.current.prev(); }}/>
            <span className={cn('btn-next', detail.invoiceNumber === 1 && 'hide')} onClick={() => { this.carouselRef.current.next(); }}/>

            <Carousel ref={this.carouselRef} afterChange={(currents) => { this.setState({ current: currents}); }} >
              {
                detail.invoiceDetailList.map((item, index) =>
                  (
                    <div key={index}>

                      <div className={cn('invoice-bg', 'size-large')}>
                        <div className={cn('invoice-type-title')}>{item.invoiceTypeDesc}</div>
                        <div className={cn('company-info')}>
                          <p>{item.applyCompanyName}</p>
                          <p>{item.applyCompanyCreditCode}</p>
                          <p>{item.applyCompanyAddress} {item.applyCompanyPhone}</p>
                          <p>{item.applyCompanyBankName} {item.applyComnpanyBankAccount}</p>
                        </div>
                        <div className={cn('company-info-2')}>
                          <p>{item.invoiceCompanyName}</p>
                          <p>{item.invoiceCompanyCreditCode}</p>
                          <p>{item.invoiceCompanyAddress} {item.invoiceCompanyPhone} </p>
                          <p>{item.invoiceCompanyBankName} {item.invoiceCompanyBankAccount}</p>
                        </div>
                        <div className={cn('company-info-remarks')}>
                          {item.remarks}
                        </div>
                        <div className={cn('company-info-3')}>
                          <p>{Tools.smalltoBIG(item.invoiceMoney / 100)}</p>
                          <p>{Tools.getViewPrice(item.invoiceMoney)}</p>
                        </div>
                        <div className={cn('company-info-4')}>
                          <table className={cn('text-center')}>
                            <tbody>
                              <tr>
                                <td width={170}>
                                  { item.invoiceServiceName}
                                </td>
                                <td width={50}/>
                                <td width={40}/>
                                <td width={73}/>
                                <td width={80}/>
                                <td width={95}>
                                  {Tools.getViewPrice(Math.round(item.invoiceMoney * 100 / (1 + item.invoiceServiceCess) / 100))}
                                </td>
                                <td width={30}>
                                  {item.invoiceServiceCess * 100}%
                                </td>
                                <td width={120}>
                                  {this.rateMoney(item)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className={cn('invoice-count-state')}>
                        <div className={cn('left')}>
                          <span className={cn(`status-${item.status}`)}>{item.statusDesc}</span>
                          <CopyBoard className={cn({hide: !item.expressCompany && !item.expressCode})} {...item} />
                        </div>
                        <div className={cn('right')} >
                          <span>第 {current + 1}/{detail.invoiceNumber} 张</span>
                        </div>
                      </div>
                    </div>
                  )
                )
              }
            </Carousel>
          </div>
        </div>


      </div>
    );
  }
}

export default ModalInvoiceSwiper;
