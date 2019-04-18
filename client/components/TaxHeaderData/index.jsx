import React from 'react';
import './style.less';
import cn from 'classnames';
import { formatMoney, accMul } from 'client/utils/formatData';
import { Input, Button } from 'antd';

const Search = Input.Search;

class TaxHeaderData extends React.Component {
  render() {
    const {
      fromTaxStep2,
      personCount,
      totalMoney,
      totalAmount,
      didNotPass,
      wrongAmount,
      qualifiedCount,
      qualifyingAmount,
      serviceCharge,
      hasSearch,
      searchClick,
      hasExport,
      exportClick,
      hasDown,
      downClick,
      outTradeNo,
      has_hint,
      fail_hint,
      not_pass_hint,
      hidden_service_money,
    } = this.props;
    return (
      <div className="taxHeaderData">
        {has_hint && <div className="hint_wrap">
          {/*{not_pass_hint && <div className="not_pass_hint">温馨提示：名单中有非系统内人员，请根据提示进行修改。</div>}*/}
          {fail_hint && <div className="fail_hint_info">温馨提示：请根据失败原因修正数据，您可以联系您的客户经理协助你解决问题。</div>}
        </div>}
        <div
          className={cn({
            middle_data: true,
            is_pass: has_hint && not_pass_hint,
          })}
        >
          {hasSearch && <Search className="search_input" enterButton="查询" onSearch={searchClick} placeholder="姓名，手机，身份证号"/>}
          {hasDown && <Button icon="download" type="primary" className="down_btn" onClick={downClick}>下载费用方案</Button>}
          <p className="out_trade_no_wrap"><span style={{color: '#999'}}>订单号：</span><span style={{color: '#333'}}>{outTradeNo}</span></p>
          <p className="order_info">
            <span style={{color: '#999'}}>交易总额：</span><span style={{color: '#333'}}>合计{personCount}笔 /
            {/*<span>实时收综合税费{formatMoney(accMul(serviceCharge || 0, 0.01), true, 2)}元，</span>*/}
            <span style={{ fontWeight: 'bold' }}>共计{formatMoney(accMul(totalMoney || 0, 0.01), true, 2)}元</span></span>
          </p>
          {hasExport && <Button type="primary" icon="upload" className="export_btn" onClick={exportClick}>导出发放明细</Button>}
        </div>
        <div className="footer_data">
          <div
            className="success_data"
            style={{
              width: hidden_service_money ? '50%':'33%'
            }}
          >
            <div className="icon success_icon" />
            <div className="content success_content">
              <p className="text success_title">{fromTaxStep2 ? '通过验证' : '发放成功'}</p>
              <p className="footer_text success_detail_data">{`${qualifiedCount || 0}条 / ${formatMoney(accMul(qualifyingAmount || 0, 0.01), true, 2)}元`}</p>
            </div>
          </div>
          <div
            className="fail_data"
            style={{
              width: hidden_service_money ? '50%':'33%'
            }}
          >
            <div className="icon fail_icon" />
            <div className="content fail_content">
              <p className="text fail_title">{fromTaxStep2 ? '未通过验证' : '发放失败'}</p>
              <p className="footer_text fail_detail_data">{`${didNotPass || 0}条 / ${formatMoney(accMul(wrongAmount || 0, 0.01), true, 2)}元`}</p>
            </div>
          </div>
          {!hidden_service_money && <div className="tax_money">
            <div className="icon tax_icon" />
            <div className="content tax_content">
              <p className="text success_title">综合税费（含税）</p>
              <p className="footer_text tax_detail_data">{formatMoney(accMul(serviceCharge || 0, 0.01), true, 2) || 0}元</p>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

export default TaxHeaderData;
