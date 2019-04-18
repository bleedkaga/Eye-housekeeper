import React from 'react';
import cn from 'classnames';
import RH from 'client/routeHelper';
import Tools from 'client/utils/tools';

import { GContainer, GHeader, GPage } from 'client/components/GLayout';
import { connect } from 'dva';
import { Button, Carousel, Icon, Input, message, Modal, Popconfirm, Select } from 'antd';
import { hot } from 'react-hot-loader';

import './style.less';

import SetTaxpayerType from 'client/components/SetTaxpayerType';
import EAddress from 'client/components/EAddress';
import GTitle from 'client/components/GTitle';
import NumericInput from 'client/components/NumericInput';

const { TextArea } = Input;
const { Option } = Select;

//kaishi

// 删除单条发票
function DeleteInvoice(props) {
  if (props.index === 0) return null;
  const text = '确认删除这条发票吗？';
  return (
    <Popconfirm
      placement={'topRight'}
      title={text}
      onConfirm={() => props.onDelete(props.index)}
      okText="确定"
      cancelText="取消"
    >
      <Button icon="delete" className={'delete-single-invoice'} type="danger" htmlType={'button'}>删除</Button>
    </Popconfirm>
  );
}

class ApplyInvoicePaper extends React.Component {
  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
    this.invoiceTypesSelectRef = React.createRef();
    this.state = {
      current: 0, //发票预览的当前张数
    };
  }

  componentDidMount() {
    const { dispatch, location, global} = this.props;
    const searchParams = Tools.queryToParams(location.search);
    const companyGroupId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok

    // 获取开票信息相关
    dispatch({
      type: 'applyInvoicesPaper/applyInvoice',
      payload: {
        ...searchParams,
        companyId: companyGroupId, //ok
      },
    });
  }

  // 删除一个发票
  deleteSingle = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyInvoicesPaper/deleteInvoice',
      payload: {
        index,
      },
    });
  }

  taxRateMatch = (record, index) => {
    const { applyInvoicesPaper, dispatch } = this.props;
    const { submitApplyInvoice } = applyInvoicesPaper;
    const { invoiceScopeList } = applyInvoicesPaper.applyInvoice;
    const filtered = invoiceScopeList.filter(item => item.id === record.key)[0];
    if (filtered) {
      submitApplyInvoice[index].invoiceTaxRate = filtered.cess;
      submitApplyInvoice[index].invoiceServiceType = record.key;
      submitApplyInvoice[index].invoiceServiceTypeDesc = record.label;

      const value = submitApplyInvoice[index].invoiceTaxTotalMoney;

      // 设置
      dispatch({
        type: 'applyInvoicesPaper/setInvoiceInfo',
        payload: submitApplyInvoice,
      });

      // 计算
      dispatch({
        type: 'applyInvoicesPaper/calculator',
        payload: {
          index,
          value,
          taxrate: filtered.cess,
          uuid: submitApplyInvoice[index].uuid,
        },
      });
    }
  };

  closeInvoice = () => {
    const { history } = this.props;
    RH(history, 'applyInvoices', `/${window.__themeKey}/taxation/applyInvoices`);
  };

  // 重置发票
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyInvoicesPaper/resetInvoices',
    });
  }

  // 添加一条发票
  createSingleInvoice = () => {
    const { applyInvoicesPaper, dispatch } = this.props;
    const arrs = applyInvoicesPaper.submitApplyInvoice;
    arrs.push({
      invoiceId: '',
      invoiceExplain: '',
      invoiceTaxRate: 0,
      invoiceMoney: 0,
      invoiceTaxMoney: 0,
      invoiceType: '',
      invoiceServiceType: '',
      invoiceServiceTypeDesc: '',
      invoiceDetailAccount: '',
      invoiceTaxTotalMoney: 0,
      remarks: '',
      uuid: Tools.createUUID(1, ''),
    });
    dispatch({
      type: 'applyInvoicesPaper/set',
      payload: arrs,
    });
  };

  // 提交申请
  submitApply = () => {
    const { applyInvoicesPaper, dispatch, global, location} = this.props;
    const { companyId, groupId } = global.account;
    const companyGroupId = window.__themeKey === 'org' ? companyId : groupId;
    const { invoiceId, amount } = Tools.queryToParams(location.search);

    applyInvoicesPaper.submitApplyInvoice.forEach((item) => {
      item.companyId = companyGroupId;
      item.invoiceId = invoiceId;
      item.invoiceExplain = applyInvoicesPaper.invoiceExplain;
    });

    applyInvoicesPaper.submitApplyInvoice.forEach((item, index) => {
      if (item.invoiceType === '') {
        return message.error(`请为第 ${index + 1} 条发票选择类型`);
      }
      if (item.invoiceServiceType === '') {
        return message.error(`请为第 ${index + 1} 条发票选择服务类型`);
      }
      if (!item.invoiceTaxTotalMoney) {
        return message.error(`请为第 ${index + 1} 条发票填写含税金额`);
      }
      if (item.invoiceTaxTotalMoney < 0.01) {
        return message.error('最小开票金额为0.01元');
      }
    });

    // 总的开票金额不能大于可开票的金额
    const validAmount = applyInvoicesPaper.submitApplyInvoice.reduce((prev, next) => {
      prev += parseFloat(next.invoiceTaxTotalMoney);
      return prev;
    }, 0);

    if ((Math.round(parseFloat(validAmount) * 100)) > amount) {
      message.error('总开票金额不能大于可开票金额');
      return;
    }

    // 检查是否都填完了
    const invoiceServiceType = applyInvoicesPaper.submitApplyInvoice.every(item => !!item.invoiceServiceType);
    const invoiceType = applyInvoicesPaper.submitApplyInvoice.every(item => !!item.invoiceType);
    const invoiceTaxTotalMoney = applyInvoicesPaper.submitApplyInvoice.every(item => !!item.invoiceTaxTotalMoney && item.invoiceTaxTotalMoney >= 0.01);

    if (invoiceServiceType && invoiceType && invoiceTaxTotalMoney) {
      dispatch({
        type: 'applyInvoicesPaper/set',
        payload: {
          preSubmit: {
            step: 1, //打开发票详情对话框
          },
        },
      });

      dispatch({
        type: 'applyInvoicesPaper/queryInvoiceBaseInfo',
        payload: {
          companyId: companyGroupId,
        },
      });
    }
  }

  taxpayerTypeSet() {
    const { dispatch } = this.props;
    return (<a href="javascript:;" onClick={() => { dispatch({ type: 'applyInvoicesPaper/set', payload: { preSubmit: { step: 3}} }); }}>设置</a>);
  }

  // 更新含税金额
  updateInvolveTaxMoney = (value, item, index) => {
    if (!value && value !== '') return;
    console.log(value, item, index);
    const { dispatch } = this.props;
    dispatch({
      type: 'applyInvoicesPaper/calculator',
      payload: {
        index,
        value,
        taxrate: item.invoiceTaxRate,
        uuid: item.uuid,
      },
    });
  };

  //计算申请开票金额、发票总价税合计、差额 根据key计算
  computeMoneyByKey = (key, submitApplyInvoice) => {
    let money = 0;

    submitApplyInvoice.forEach((item) => {
      money += (parseFloat(item[key]) || 0);
    });

    return Tools.getViewPrice(money, undefined, true, undefined, ',');
  };


  render() {
    const { applyInvoicesPaper, dict, dispatch, history} = this.props;
    const { submitApplyInvoice } = applyInvoicesPaper;
    const { current } = this.state;
    const { invoiceTypeList, invoiceScopeList } = applyInvoicesPaper.applyInvoice;
    const { applyInvoice: paper = {} } = applyInvoicesPaper;
    const { pcaData } = dict;
    const textThemeKey = window.__themeKey === 'org' ? '单位' : '工会';
    const EAddressIsFirstEdit = (!paper.recipientName || !paper.recipientPhone || !paper.recipientAddress);
    let taxpayerTypeDesc = null;

    // 如果未设置纳税人类型
    if (!paper.taxpayerType) {
      taxpayerTypeDesc = this.taxpayerTypeSet();
    } else {
      taxpayerTypeDesc = paper.taxpayerTypeDesc;
    }

    const tMoney = submitApplyInvoice.reduce((prev, next) => {
      prev += parseFloat(next.invoiceTaxTotalMoney) || 0;
      return prev;
    }, 0);

    return (
      <GContainer className={cn('home-view')}>
        <GHeader
          route={[
            {name: '首页', path: `/${window.__themeKey}/dashboard`},
            {name: '发票申请', path: `/${window.__themeKey}/taxation/applyInvoices`},
            {name: '申请开票'},
          ]}
        />
        <GPage top={208} bottom={25}>
          {
            <div className={'apply-invoice-paper-panel'}>
              <div className={'header'}>
                <GTitle>申请开票</GTitle>
              </div>
              <div className={'invoice-container'}>
                {
                  submitApplyInvoice.map((item, index) => (
                    <div className={'list-group'} key={`${item.uuid}`}>
                      <table className={'invoice-table'} border="0" cellSpacing="0" cellPadding="0">
                        <tbody>
                          <tr>
                            <td colSpan={12}>
                              <div className={'invoice-title'}>
                                <Select
                                  placeholder="请选择"
                                  labelInValue
                                  style={{width: 150}}
                                  className={'select1'}
                                  onChange={(value) => {
                                    dispatch({
                                      type: 'applyInvoicesPaper/setInvoiceType',
                                      payload: {value, index},
                                    });
                                  }}
                                >
                                  {
                                  invoiceTypeList.map((subitem, subindex) => (
                                    <Option value={subitem.invoiceType} key={`${subitem.id}-${subindex}-select1`}>{subitem.invoiceTypeDesc}</Option>
                                  ))
                                }
                                </Select>

                                <span className={'bankname'}>{paper.bankName} {paper.bankAccount}</span>
                                <span>发票版面：一百万元版</span>
                                <DeleteInvoice index={index} onDelete={this.deleteSingle}/>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td width="354">
                              <div>
                                <div className={'label-title'}>货物或应税劳务、服务名称</div>
                                <div className={'label-text'}>
                                  <Select
                                    style={{width: '100%'}}
                                    placeholder="请选择"
                                    labelInValue
                                    onChange={(e) => {
                                      this.taxRateMatch(e, index);
                                    }}
                                  >
                                    {
                                    invoiceScopeList.map((subitem, subindex) => (
                                      <Option value={subitem.id} key={`${subindex}-select2`}>{subitem.name}</Option>
                                    ))
                                  }
                                  </Select>
                                </div>
                              </div>
                            </td>

                            <td width="75">
                              <div>
                                <div className={'label-title'}>规格型号</div>
                                <div className={'label-text'}>&nbsp;</div>
                              </div>
                            </td>

                            <td width="50">
                              <div>
                                <div className={'label-title'}>单位</div>
                                <div className={'label-text'}>&nbsp;</div>
                              </div>
                            </td>
                            <td width="50">
                              <div>
                                <div className={'label-title'}>数量</div>
                                <div className={'label-text'}>&nbsp;</div>
                              </div>
                            </td>

                            <td width="100">
                              <div>
                                <div className={'label-title'}>单价</div>
                                <div className={'label-text'}/>
                              </div>
                            </td>

                            <td>
                              <div style={{minWidth: 90}}>
                                <div className={'label-title'}>金额</div>
                                <div className={'label-text'}>{Tools.getViewPrice(item.invoiceMoney, undefined, true, undefined, ',')}</div>
                              </div>
                            </td>

                            <td>
                              <div>
                                <div className={'label-title'}>税率</div>
                                <div className={'label-text'}>{item.invoiceTaxRate * 100}%</div>
                              </div>
                            </td>

                            <td width="200">
                              <div>
                                <div className={'label-title'}>税额</div>
                                <div className={'label-text'}>{Tools.getViewPrice(item.invoiceTaxMoney, undefined, true, undefined, ',')}</div>
                              </div>
                            </td>

                            <td width="300">
                              <div>
                                <div className={'label-title'}>含税金额</div>
                                <div className={'label-text'}>
                                  <NumericInput
                                    onChange={(value) => {
                                      this.updateInvolveTaxMoney(value, item, index);
                                    }}
                                    value={item.invoiceTaxTotalMoney}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <div style={{height: 32, lineHeight: '32px', textAlign: 'center'}}>价税合计</div>
                            </td>
                            <td colSpan={8} align="right">
                              <span
                                style={{paddingRight: 10}}
                              >{Tools.getViewPrice(submitApplyInvoice[index].invoiceTaxTotalMoney * 100)}</span>
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={3}>
                              <div style={{height: 84, lineHeight: '84px', textAlign: 'center'}}>备注</div>
                            </td>
                            <td colSpan={6}>
                              <div style={{padding: 5}}>
                                <TextArea
                                  placeholder="此处内容会打印在发票备注栏中，请谨慎填写！"
                                  size="large"
                                  rows={4}
                                  onChange={(e) => {
                                    dispatch({
                                      type: 'applyInvoicesPaper/setRemarks',
                                      payload: {
                                        index,
                                        value: e.target.value,
                                      },
                                    });
                                  }}
                                  maxLength="184"
                                />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))
                }
                <div
                  className={'btn-create-invoice'}
                  onClick={this.createSingleInvoice}
                >
                  <Icon type="plus"/>
                  <span>增加发票</span>
                </div>
                <TextArea
                  placeholder="填写开票说明"
                  rows={6}
                  maxLength="200"
                  onChange={e => dispatch({type: 'applyInvoicesPaper/set', payload: {invoiceExplain: e.target.value}})}
                />

                <div className={cn('submit-bar')}>
                  <div className={cn('invoice_detail')}>
                    <span>
                      申请开票金额 ￥{this.computeMoneyByKey('invoiceTaxTotalMoney', submitApplyInvoice)}</span>
                    <span>
                      发票总价税合计 ￥
                      { this.computeMoneyByKey('invoiceTaxTotalMoney', submitApplyInvoice)}
                    </span>
                    <span>差额 ￥0</span>
                  </div>
                  <div className={cn('btn-group')}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType={'button'}
                      onClick={this.submitApply}
                    >提交申请</Button>
                    <Popconfirm title="确认取消吗？" okText="是" cancelText="否" onConfirm={this.closeInvoice}>
                      <Button size="large" className={'btn-cancel'}>取消</Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </div>
          }
        </GPage>
        {/* 发票详情 */}
        <Modal
          visible={applyInvoicesPaper.preSubmit.step === 1}
          className={cn('custom-add-modal')}
          title="开票申请单"
          width={600}
          onCancel={() => {
            dispatch({
              type: 'applyInvoicesPaper/set',
              payload: {
                preSubmit: {
                  steps: 0,
                },
              },
            });
          }}
          footer={null}
        >
          <div className={cn('dialog-invoice-detail')}>
            <ul>
              <li>
                <h3 className={cn('title')}>发票详情</h3>
                <div>
                  <span className={cn('layout-left')}>待申请发票 (张)： {applyInvoicesPaper.submitApplyInvoice.length}</span>
                  <span>价税合计总额(元)：{
                    Tools.getViewPrice(Math.round(tMoney * 100))
                  }</span>
                </div>
              </li>
              <li>
                <h3 className={cn('title')}>{textThemeKey}信息</h3>
                <div>
                  <span className={cn('layout-left')}>{textThemeKey}名称： {paper.companyName}</span>
                  <span>纳税人类型：{taxpayerTypeDesc}</span>
                </div>
              </li>
              <li>
                <h3 className={cn('title')}>
                  <span>邮寄信息</span>
                  <a
                    href="javascript:;"
                    className={cn('submission-address-set')}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch({
                        type: 'applyInvoicesPaper/set',
                        payload: {
                          preSubmit: {
                            step: 4,
                            EAddressIsFirstEdit,
                          },
                        },
                      });
                    }}
                  >{EAddressIsFirstEdit ? '设置' : '修改'}</a></h3>
                <div>
                  <p>
                    <span className={cn('layout-left')}>收件人姓名： {paper.recipientName}</span>
                    <span>联系电话：{paper.recipientPhone}</span>
                  </p>
                  <p>
                    <span className={cn('layout-left', 'column-pass')}>详细地址：{paper.recipientAddress}</span>
                  </p>
                </div>
              </li>
              <li>
                <h3 className={cn('title')}>开票说明</h3>
                <div>
                  <p>{applyInvoicesPaper.invoiceExplain}</p>
                </div>
              </li>
              <li className={cn('text-center', 'step-next')}>
                <Button
                  type="primary"
                  className={cn('step-next-button')}
                  onClick={() => {
                    if (!paper.taxpayerType) {
                      message.error('请设置纳税人类型');
                      return;
                    }
                    if (!paper.recipientName) {
                      message.error('请填写收件人姓名');
                    } else if (!paper.recipientPhone) {
                      message.error('请填写收件人电话');
                    } else if (!paper.recipientAddress) {
                      message.error('请填写收件人详细地址');
                    } else {
                      dispatch({
                        type: 'applyInvoicesPaper/set',
                        payload: {
                          preSubmit: {
                            step: 2,
                          },
                        },
                      });
                    }
                  }}
                >下一步</Button>
              </li>
            </ul>
          </div>
        </Modal>

        <Modal
          visible={applyInvoicesPaper.preSubmit.step === 2}
          className={cn('custom-add-modal')}
          title={`发票预览 ( 第 ${current + 1} / ${applyInvoicesPaper.submitApplyInvoice.length} 张)`}
          width={833}
          onCancel={() => {
            dispatch({
              type: 'applyInvoicesPaper/set',
              payload: {
                preSubmit: {
                  step: 0,
                },
              },
            });
          }}
          footer={null}
        >
          <div className={cn('dialog-invoice-prview')}>
            <div className={cn('pos-r')}>
              <span
                className={cn('btn-prev', applyInvoicesPaper.submitApplyInvoice.length === 1 && 'hide')}
                onClick={() => {
                  this.carouselRef.current.prev();
                }}
              />
              <span
                className={cn('btn-next', applyInvoicesPaper.submitApplyInvoice.length === 1 && 'hide')}
                onClick={() => {
                  this.carouselRef.current.next();
                }}
              />

              <Carousel
                ref={this.carouselRef}
                afterChange={(currents) => {
                  this.setState({current: currents});
                }}
              >
                {
                  applyInvoicesPaper.submitApplyInvoice.map((item, index) =>
                    (
                      <div key={index} className={cn('pos-r')}>
                        <div className={cn('invoice-bg', 'size-large')}>
                          <div className={cn('invoice-type-title')}>{item.invoiceTypeDesc}</div>
                          <div className={cn('company-info')}>
                            <p>{paper.companyName}</p>
                            <p>{paper.taxpayerCode}</p>
                            <p>{paper.taxpayerAddress} {paper.taxpayerPhone}</p>
                            <p>{paper.bankName} {paper.bankAccount}</p>
                          </div>
                          <div className={cn('company-info-2')}>
                            <p>{paper.ownCompanyName}</p>
                            <p>{paper.ownTaxpayerCode}</p>
                            <p>{paper.ownTaxpayerAddress} {paper.ownTaxpayerPhone} </p>
                            <p>{paper.ownBankName} {paper.ownBankAccount}</p>
                          </div>
                          <div className={cn('company-info-remarks')}>
                            {item.remarks}
                          </div>
                          <div className={cn('company-info-3')}>
                            <p>{Tools.smalltoBIG(item.invoiceTaxTotalMoney)}</p>
                            <p>{Tools.getViewPrice(item.invoiceTaxTotalMoney * 100, undefined, undefined, undefined, '')}</p>
                          </div>
                          <div className={cn('company-info-4')}>
                            <table className={cn('text-center')}>
                              <tbody>
                                <tr>
                                  <td width={170}>
                                    {item.invoiceServiceTypeDesc}
                                  </td>
                                  <td width={50}/>
                                  <td width={40}/>
                                  <td width={73}/>
                                  <td width={80}/>
                                  <td width={95}>
                                    {item.invoiceMoney}
                                  </td>
                                  <td width={30}>
                                    {item.invoiceTaxRate * 100}%
                                  </td>
                                  <td width={100}>
                                    {Tools.getViewPrice(item.invoiceTaxMoney, undefined, true, undefined, '')}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ),
                  )
                }
              </Carousel>

            </div>

            <div className={cn('btn-group')}>
              <Button
                size="large"
                onClick={() => {
                  dispatch({
                    type: 'applyInvoicesPaper/set',
                    payload: {
                      preSubmit: {
                        step: 1,
                      },
                    },
                  });
                }}
              >上一步</Button>
              <Button
                size="large"
                type="primary"
                htmlType={'button'}
                onClick={() => {
                  // 每一张发票信息里面都包含姓名、电话及收件地址
                  applyInvoicesPaper.submitApplyInvoice.forEach((item) => {
                    item.recipientName = paper.recipientName;
                    item.recipientPhone = paper.recipientPhone;
                    item.recipientAddress = paper.recipientAddress;
                  });


                  dispatch({
                    type: 'applyInvoicesPaper/submit',
                    payload: [...applyInvoicesPaper.submitApplyInvoice],
                    callback() {
                      dispatch({
                        type: 'applyInvoicesPaper/set',
                        payload: {
                          preSubmit: {
                            step: 0,
                          },
                          invoiceExplain: '',
                        },
                      });
                      dispatch({
                        type: 'applyInvoicesPaper/resetInvoices',
                      });
                      RH(history, 'record', `/${window.__themeKey}/taxation/record`);
                    },
                  });
                }}
              >确认提交</Button>
            </div>
          </div>
        </Modal>

        {/* ============ 纳税人设置 ============ */}
        {applyInvoicesPaper.preSubmit.step === 3 && SetTaxpayerTypeWrapper(applyInvoicesPaper, dispatch)}
        {/* ============ 纳税人设置 END ============ */}


        {/* 邮寄信息设置 */}
        {applyInvoicesPaper.preSubmit.step === 4 && EAddressWrapper(pcaData, dispatch)}
      </GContainer>
    );
  }
}

const EAddressWrapper = (pcaData, dispatch) => (<EAddress
  data={{...pcaData}}
  onSave={(data) => {
    dispatch({
      type: 'applyInvoicesPaper/set',
      payload: {
        preSubmit: {
          step: 1,
        },
      },
    });
    dispatch({
      type: 'applyInvoicesPaper/updateReceive',
      payload: {
        ...data,
      },
    });
  }}
/>
);

const SetTaxpayerTypeWrapper = (applyInvoicesPaper, dispatch) => (
  <Modal
    visible={applyInvoicesPaper.preSubmit.step === 3}
    className={cn('custom-add-modal')}
    footer={null}
    width={600}
    onCancel={() => {
      dispatch({
        type: 'applyInvoicesPaper/set',
        payload: {
          preSubmit: {
            step: 1,
          },
        },
      });
    }}
  >
    <div className={cn('set-taxpayer-type')}>
      <div className={cn('m-header')}>
        <div className={cn('m-step')}>
          <span
            className={cn('back')}
            onClick={() => {
              dispatch({
                type: 'applyInvoicesPaper/set',
                payload: {
                  preSubmit: {
                    step: 1,
                  },
                },
              });
            }}
          >
            <Icon type="arrow-left"/>
            <label>返回</label>
          </span>
          <span> 设置纳税人类型 </span>
        </div>
        <div className={cn('close')}>
          <i className={cn('icon-close')}/>
        </div>

      </div>
      <div className={cn('m-body')}>
        <SetTaxpayerType
          onSave={(taxpayerType) => {
            dispatch({
              type: 'applyInvoicesPaper/set',
              payload: {
                preSubmit: {
                  step: 1,
                },
                applyInvoice: {
                  ...applyInvoicesPaper.applyInvoice,
                  taxpayerType: parseInt(taxpayerType.value),
                  taxpayerTypeDesc: taxpayerType.label,
                },
              },
            });
          }}
        />
      </div>
    </div>
  </Modal>
);

export default connect(state => state)(hot(module)(ApplyInvoicePaper));

