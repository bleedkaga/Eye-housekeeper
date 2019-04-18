import React from 'react';
import './style.less';
// import PropTypes from "prop-types";
import { formatMoney, accMul } from 'client/utils/formatData';
import {
  Input, Button,
} from 'antd';

const Search = Input.Search;

/**
 * @param { string } prompt 温馨提示
 * @param { boolean } promptShow 温馨提示是否显示
 * @param { boolean } promptBorder 温馨提示边框
 * @param { string } orderNum 流水号
 * @param { string } orderTotal 订单笔数
 * @param { string } orderMoney 订单收费
 * @param { string } serviceCharge 服务费
 * @param { string } totalMoney 总收费
 * @param { boolean } hasborder 是否有边框
 * @param { boolean } hasSearch 是否显示搜索框
 * @param { function } clickSearch 点击搜索框按钮的回调
 * @param { function } downScheme 点击下载方案按钮的回调
 * @param { boolean } hasExportBtn 是否有导出按钮
 * @param { function } cliclExportBtn 点击导出按钮的回调
 * @param { boolean } fromTable 来自 table
 * @param { string } successTotal 成功条数
 * @param { string } failTotal 失败条数
 * @param { string } successMoney 成功金额
 * @param { string } failMonet 失败金额
 * @param { boolean } showDownBtn 显示下载按钮
 * @param { boolean } showRate 显示含税点
 * @param { number | string } rate 税率
 */
class OperatorHeaderPandect extends React.Component {
  render() {
    const {
      prompt,
      promptShow,
      orderNum,
      orderTotal,
      orderMoney,
      serviceCharge,
      hasborder,
      hasSearch,
      clickSearch,
      downScheme,
      totalMoney,
      hasExportBtn,
      cliclExportBtn,
      fromTable,
      successTotal,
      failTotal,
      successMoney,
      failMonet,
      promptBorder,
      showDownBtn,
      // showRate,
      // rate 税
    } = this.props;
    return (
      <div className={'OperatorHeaderPandect'}>
        {/* 温馨提示 */}
        <div
          className={`${`${'promptTop'} ${promptBorder ? 'promptBorder' : ''}`}`}
          style={{
            display: `${promptShow ? 'flex' : 'none'}`,
          }}
        >
          温馨提示：{prompt}
        </div>
        {/* 详细信息 */}
        <div
          className={`${'operatorMiddle'} ${`${hasborder ? 'hasLRborder' : ''}`}`}
          style={{
            justifyContent: `${hasExportBtn ? 'space-between' : 'start'}`,
            flexDirection: `${hasSearch ? 'column' : 'row'}`,
            alignItems: `${hasSearch ? 'space-between' : 'center'}`,
          }}
        >
          <div
            className={'searchBtnWrap'}
            style={{ display: `${hasSearch ? 'flex' : 'none'}` }}
          >
            <div className={'btnWrap'}>
              <Search className={'search'} enterButton="查询" placeholder="姓名、手机号、身份证号" onSearch={clickSearch} maxLength={20}/>
              {
                showDownBtn
                  ? <Button icon="download" type="primary" className={'downBtn'} onClick={downScheme}>下载费用方案</Button>
                  : <div />
              }

            </div>
          </div>
          <div className={'txtInfo'}>
            <p className="">订单号：{orderNum}</p>
            <p>交易总额合计{orderTotal}笔 / {formatMoney(accMul(orderMoney, 0.01), true)}元，实时收综合税费{formatMoney(accMul(serviceCharge, 0.01), true)}元，<span style={{ fontWeight: 'bold' }}>共计{formatMoney(accMul(totalMoney, 0.01), true)}元</span></p>
          </div>
          <div
            className={'exportBtn'}
            style={{
              display: `${hasExportBtn ? 'flex' : 'none'}`,
            }}
          >
            <Button type="primary" icon="upload" className={'exportButton'} onClick={cliclExportBtn}>导出发放明细</Button>
          </div>
        </div>
        {/* 带图标的详情 */}
        <div className={'detailBottom'}>
          <div className={'sendSuccess'}>
            <div className={'leftIcon'}>
              <p className={'bg_icon success_icon'} />
            </div>
            <div className={'rightContent'}>
              <p className={'top'}>{fromTable ? '通过验证' : '发送成功'}</p>
              <p className={'bottom'}>{`${successTotal}条 / ${formatMoney(accMul(successMoney, 0.01), true)}元`}</p>
            </div>
          </div>
          <div className={'sendFailt'}>
            <div className={'leftIcon'}>
              <p className={'bg_icon fail_icon'} />
            </div>
            <div className={'rightContent'}>
              <p className={'top'}>{fromTable ? '未通过验证' : '发放失败'}</p>
              <p className={'bottom'}>{`${failTotal}条 / ${formatMoney(accMul(failMonet, 0.01), true)}元`}</p>
            </div>
          </div>
          <div className={'serviceMoney'}>
            <div className={'leftIcon'}>
              <p className={'bg_icon service_icon'} />
            </div>
            <div className={'rightContent'}>
              <p className={'top'}>综合税费(含税)</p>
              <p className={'bottom'}>{formatMoney(accMul(serviceCharge, 0.01), true)}元</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// OperatorHeaderPandect.propTypes = {
//   prompt: PropTypes.any,
//   promptShow: PropTypes.bool,
//   orderNum: PropTypes.any,
//   orderTotal: PropTypes.any,
//   orderMoney: PropTypes.any,
//   serviceCharge: PropTypes.any,
//   totalMoney: PropTypes.any,
//   hasborder: PropTypes.bool,
//   hasSearch: PropTypes.bool,
//   clickSearch: PropTypes.func,
//   downScheme: PropTypes.func,
//   hasExportBtn: PropTypes.bool,
//   cliclExportBtn: PropTypes.func,
//   fromTable: PropTypes.bool,
//   successTotal: PropTypes.any,
//   failTotal: PropTypes.any,
//   successMoney: PropTypes.any,
//   failMonet: PropTypes.any,
//   promptBorder: PropTypes.bool,
//   showRate: PropTypes.bool,
//   rate: PropTypes.any,
//   showDownBtn: PropTypes.bool,
// };
OperatorHeaderPandect.defaultProps = {
  prompt: '名单中有非系统内人员，请根据提示进行修改。',
  promptShow: true,
  orderNum: '',
  orderTotal: '0',
  orderMoney: '0',
  serviceCharge: '0',
  totalMoney: '0',
  successTotal: '0',
  failTotal: '0',
  successMoney: '00',
  failMonet: '0',
  rate: '0',
  showRate: true,
  hasborder: true,
  hasSearch: false,
  fromTable: false,
  promptBorder: false,
  showDownBtn: true,
  clickSearch: (val) => { console.log(val); },
  downScheme: () => { console.log('你点击了下载费用方案按钮'); },
  hasExportBtn: false,
  cliclExportBtn: () => { console.log('你点击了导出按钮'); },
};


export default OperatorHeaderPandect;
