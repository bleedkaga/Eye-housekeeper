import React from 'react';
import './style.less';
import TaxHeaderData from 'client/components/TaxHeaderData';
import { formatMoney, accMul } from 'client/utils/formatData';
// import BIconfont from "client/components/Biconfont";
import AnimateComponent from './animateComponent';
import RH from 'client/routeHelper';
import {
  Affix,
  Table,
  Icon,
  Popover,
  Modal,
  Form,
  Input,
  Button,
  message,
} from 'antd';


const FormItem = Form.Item;

const Step2 = (props) => {
  const {
    history,
    form,
    dispatch,
    outTradeNo,
    personInfoTableScroll,
    dataSource,
    pageSize,
    pageIndex,
    totalCount,
    personinfoFull,
    currentScheme,
    tableViewLoading,
    queryContent,
    addPersonModal,
    personName,
    personPhone,
    certificateCode,
    personId,
    addPersonBtnLoad,
    sendTaskShowAnimate,
  } = props;

  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      span: 4, offset: 3,
    },
    wrapperCol: {
      span: 13,
    },
  };

  const affixChanged = (affixed) => {
    dispatch({
      type: 'taxPlan/updateState',
      payload: {
        personInfoTableScroll: affixed,
      },
    });
  };

  const columns = [
    {
      title: '收款人',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      className: 'step2-thead-item1',
    },
    {
      title: '组织易众包(元)',
      dataIndex: 'oaiWagesPaying',
      key: 'oaiWagesPaying',
      align: 'center',
      className: 'step2-thead-item2',
      render: val => formatMoney(accMul(val || 0, 0.01), true),
    },
    {
      title: '证件号码',
      dataIndex: 'certificateCode',
      key: 'certificateCode',
      align: 'center',
      className: 'step2-thead-item3',
    },
    {
      title: '订单号',
      dataIndex: 'outTradeNo',
      align: 'center',
      className: 'step2-thead-item4',
      render: (val, record) => {
        const obj = {
          children: val,
          props: {},
        };
        if (record.status == '-1') {
          obj.children = (
            <div style={{ color: '#FF4D4F' }}>
              {/* <BIconfont type="jinggao" />&nbsp; */}
                此用户未在系统内，请确认信息是否正确或&nbsp;&nbsp;
              <a style={{ color: '#32B16C'}} onClick={() => openModal(record)}>新增成员</a>&nbsp;&nbsp;
              到系统内
            </div>);
          obj.props.colSpan = 2;
        } else {
          obj.children = val;
        }
        return obj;
      },
    },
    {
      title: '打款渠道',
      align: 'center',
      className: 'step2-thead-item5',
      render: (val, record) => {
        const obj = {
          children: '现金账户',
          props: {},
        };
        if (record.status == '-1') {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '税务管理模式',
      align: 'center',
      className: 'step2-thead-item6',
      render: () => 'TPT',
    },
  ];
  const pagination = {
    current: pageIndex,
    pageSize,
    total: totalCount,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    showTotal: _total => `共${_total}条数据`,
    onChange: (_pageIndex, _pageSize) => {
      dispatch({
        type: 'taxPlan/searchSchemePerson',
        payload: {
          pageIndex: _pageIndex,
          pageSize: _pageSize,
          queryContent,
        },
      });
    },
    onShowSizeChange: (_pageIndex, _pageSize) => {
      dispatch({
        type: 'taxPlan/searchSchemePerson',
        payload: {
          pageIndex: _pageIndex,
          pageSize: _pageSize,
          queryContent,
        },
      });
    },
  };

  // 打开添加员工 modal
  const openModal = (record) => {
    dispatch({
      type: 'taxPlan/updateState',
      payload: {
        addPersonModal: true,
        personPhone: record.mobilePhone,
        personName: record.userName,
        certificateCode: record.certificateCode,
        personId: record.id,
      },
    });
  };

  // 搜索
  const search = (value) => {
    dispatch({
      type: 'taxPlan/searchSchemePerson',
      payload: {
        queryContent: value,
        pageIndex: 1,
        pageSize: 10,
      },
    });
  };

  // 下载方案
  const downScheme = () => {
    dispatch({
      type: 'taxPlan/downScheme',
      payload: {},
    });
  };

  // 新增员工
  const addPerson = () => {
    dispatch({
      type: 'taxPlan/addPerson',
      payload: {
        outTradeNo,
        bankAccountId: personId,
        certificateCode,
        mobilePhone: personPhone,
        userName: personName,
        callback: msg => message.success(msg),
      },
    });
  };

  return (
    <div>
      <AnimateComponent
        show={sendTaskShowAnimate}
        isSendTask
        clickIKnow={() => RH(history, 'taxSendRecord', `/${window.__themeKey}/salary/taxSendRecord`)}
      />
      <div className="step2-wrap">
        <TaxHeaderData
          {...props}
          has_hint={!personinfoFull}
          not_pass_hint
          hasSearch
          searchClick={search}
          hasDown={currentScheme === '1'}
          downClick={downScheme}
          fromTaxStep2
          hidden_service_money={true}
        />
        <Affix
          offsetTop={46 + 46}
          onChange={affixChanged}
        ><div style={{ width: '100%', height: '26px', backgroundColor: '#fff' }}/></Affix>
        <Affix
          offsetTop={46 + 46 + 26}
          onChange={affixChanged}
        >
          <div
            className="step2-thead"
            style={{
              borderBottom: `${personInfoTableScroll || dataSource.length === 0 ? '1px solid #e8e8e8' : '0'}`,
            }}
          >
            <div className="step2-thead-item1">收款人</div>
            <div className="step2-thead-item2">组织易众包(元)</div>
            <div className="step2-thead-item3">证件号码</div>
            <div className="step2-thead-item4">订单号</div>
            <div className="step2-thead-item5">打款渠道</div>
            <div className="step2-thead-item6">
              税务管理模式&nbsp;
              <Popover
                placement="bottomRight"
                content={<span><span>TPT：</span>所得税代征模式</span>}
              >
                <Icon type="question-circle" theme="filled" style={{color: '#FFBE4D', fontSize: '16px'}}/>
              </Popover>
            </div>
          </div>
        </Affix>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={tableViewLoading}
          bordered
          rowKey={record => record.id}
          pagination={pagination}
          rowClassName={record => (record.status === -1 ? 'step2-person-info-nofull' : '')}
          showHeader={false}
        />
      </div>
      <Modal
        visible={addPersonModal}
        title="添加员工信息"
        width={600}
        footer={null}
        maskStyle={{
          backgroundColor: 'rgba(0, 0, 0, .35)',
        }}
        destroyOnClose
        onCancel={() => {
          dispatch({
            type: 'taxPlan/updateState',
            payload: {
              addPersonModal: false,
            },
          });
        }}
      >
        <Form>
          <FormItem
            label="手机"
            {...formItemLayout}
          >
            {getFieldDecorator('mobilePhone', {
              initialValue: personPhone,
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem
            label="姓名"
            {...formItemLayout}
          >
            {getFieldDecorator('userName', {
              initialValue: personName,
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem
            label="身份证号"
            {...formItemLayout}
          >
            {getFieldDecorator('certificateCode', {
              initialValue: certificateCode,
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem
            wrapperCol={{
              span: 5,
              offset: 7,
            }}
          >
            <Button type="primary" onClick={addPerson} loading={addPersonBtnLoad}>
              提交
            </Button>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};
export default Form.create()(Step2);
