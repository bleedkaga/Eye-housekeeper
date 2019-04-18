import React from 'react';
import cn from 'classnames';
import {Button, Affix, DatePicker, Cascader, Table, Pagination, Popover, Popconfirm, message} from 'antd';
import {hot} from 'react-hot-loader';
import moment from 'moment/moment';
import Tools from 'client/utils/tools';
import ConfirmInput from 'client/components/ConfirmInput';
import RH from 'client/routeHelper';

import './style.less';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';


class Class extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch, location, location: {state = {}}} = this.props;
    //判断是否是后退 设置条件参数值

    if (location.search || state.__back) {
      dispatch({type: 'welfareRecords/setTabCondition', payload: location.search, index: 1});
    } else {
      //不是后退 重置条件参数值
      dispatch({type: 'welfareRecords/resetTabCondition', index: 1});
    }

    this.secondPath = window.__themeKey === 'org' ? 'hr' : 'spring';

    this.tableColumns = [
      {
        title: '序号',
        key: 'no',
        align: 'center',
        width: 70,
        render: (txt, row, idx) => idx + 1,
      },
      {
        title: '发放时间',
        dataIndex: 'createtime',
        align: 'center',
        width: 180,
        render: text => text,
      },
      {
        title: '人均发放金额',
        dataIndex: 'amount',
        align: 'center',
        width: 150,
        render: text => Tools.getViewPrice(text),
      },
      {
        title: '发放人数',
        dataIndex: 'personCount',
        align: 'center',
        width: 150,
        render: text => text,
      },
      {
        title: '发放总金额',
        dataIndex: 'totalAmount',
        align: 'center',
        width: 150,
        render: text => Tools.getViewPrice(text),
      },
      {
        title: '发放事由',
        dataIndex: 'transferReasonName',
        align: 'center',
        width: 320,
        render: text => (
          <div style={{width: 320 - 36}} className="margin-center text-hidden" title={text}>{text}</div>),
      },
      {
        title: '备注信息',
        dataIndex: 'note',
        align: 'center',
        width: 300,
        render: text => (
          <div style={{width: 300 - 36}} className="margin-center text-hidden" title={text}>{text}</div>),
      },
      {
        title: '状态',
        dataIndex: 'statusDesc',
        align: 'center',
        width: 150,
        key: 'statusDesc',
        render: (text, data) => {
          let [txt, corlor] = ['', ''];
          const status = `${data.status}`;
          switch (status) {
            case 1:
              txt = '发放中';
              break;
            case '-1':
            case '4':
              txt = status === '-1' ? '发放失败' : '已拒绝';
              corlor = 'red';
              break;
            case '2':
              // corlor = 'blue';
              txt = '已发放';
              break;
            case '3':
              corlor = 'orange';
              txt = '待审核';
              break;
            default:
              break;
          }
          return (<span className={`text-${corlor}`}>{txt || text}{
            (data.status === '-1' || status === '4') && (
              <Popover
                arrowPointAtCenter
                title={`${data.statusDesc}原因`}
                content={<div style={{maxWidth: 300}}>{data.reason}</div>}
                trigger="click"
              >
                <a className="text-blue reason">原因</a>
              </Popover>
            )
          }</span>);
        },
      },
      {
        title: '操作',
        dataIndex: 'auditRole',
        align: 'center',
        fixed: 'right',
        width: 260,
        render: (text, data) => {
          const opt = [
            {n: '再次发放', w: 0},
            {n: '撤回', w: 1},
            {n: '通过', w: 2},
            {n: '不通过', w: 3},
            {n: '查看明细', w: 4},
            {n: '上传资料', w: 5},
          ];
          const {status, companyGroupType, auditRole} = data;
          const options = [];
          if (companyGroupType === 3) {
            //老数据
            options.push(opt[4]); //查看明细
          } else {
            options.push(opt[4]); //查看明细， 这里为了区分老数据 还是将老数据显示了出来

            if (status === 1) {
              //执行中状态
              if (auditRole !== -1) {
                //有权限或者本人
                options.push(opt[0]); //再次发放

                //撤回按钮被删除了
                // if (auditRole === 2) {
                //   //本人
                //   options.push(opt[1]); //撤回
                // }
              }
            } else if (status === -1) {
              //失败状态 或者
              if (auditRole !== -1) {
                //有权限或者本人
                options.push(opt[0]); //再次发放
              }
            } else if (status === 3) {
              //待审核状态
              if (auditRole !== -1) {
                //有权限或者本人
                if (auditRole === 2) {
                  //本人
                  //撤回按钮被删除了
                  // options.push(opt[1]); //撤回
                } else if (auditRole === 1) {
                  //有审批权限
                  options.push(opt[2]); //通过
                  options.push(opt[3]); //不通过
                }
              }
            } else if (status === 4) {
              //拒绝状态
              if (auditRole !== -1) {
                //有权限或者本人
                options.push(opt[0]); //再次发放
              }
            }
          }

          if (status === 2) {
            //全部成功 都加上上传资料
            options.push(opt[5]);
            options.push(opt[0]); //经讨论还要加上再次发放
          }

          options.sort((a, b) => (a.w > b.w ? 1 : -1));

          return (<div className={cn('operate-box')}>
            {
              options.map(item => (item.w === 1 ? <Popconfirm
                key={item.n}
                title="是否确认撤回？"
                onConfirm={() => this.operation(data, item)}
              >
                <a href="javascript:">{item.n}</a>
              </Popconfirm> : <a key={item.n} onClick={() => this.operation(data, item)}>{item.n}</a>))
            }
          </div>);
        },
      },
    ];

    this.state = {
      confirmInput: null,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;

    dispatch({
      type: 'welfareRecords/getTab1Data',
      payload: {},
    });
  }

  onSearch() {
    const {dispatch} = this.props;
    return dispatch({type: 'welfareRecords/getTab1Data', payload: {}});
  }

  loadData = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findCNext',
      payload: {
        dict_code: 'releaseReason',
        selectedOptions,
      },
    });
  };

  operation(data, item) {
    // 操作函数
    const {history} = this.props;
    const {id} = data;
    switch (item.n) {
      case '再次发放':
        RH(history, 'sendStaff', `/${window.__themeKey}/${this.secondPath}/coupons/sendstaff/${data.id}`);
        break;
      case '撤回':
      case '通过': {
        const status = item.w === 2 ? 1 : 3;
        this.auditSendMoneyTask({status, id});
      }
        break;
      case '不通过':
        this.setState({
          confirmInput: {id, status: 2},
        });
        break;
      case '查看明细':
        RH(history, 'welfareRecordDetail', `/${window.__themeKey}/${this.secondPath}/welfareRecordDetail/0/${data.id}`, {state: {data}});
        break;
      case '上传资料':
        RH(history, 'uploadWelfare', `/${window.__themeKey}/${this.secondPath}/uploadWelfare/${data.id}`);
        break;
      default:
        break;
    }
  }

  auditSendMoneyTask(payload = {}) {
    const {dispatch} = this.props;
    dispatch({type: 'welfareRecords/auditSendMoneyTask', payload}).then((res) => {
      if (res.code === 0) {
        message.success(res.message);
        this.onSearch();
      }
    });
  }

  render() {
    const {dispatch, welfareRecords: {tab1 = {}}, dict} = this.props;

    const {condition} = tab1;

    return (
      <div className={cn('tab', 'tab1')}>
        <div className={cn('pcr-condition')}>
          <span>发放时间： </span>
          <RangePicker
            format={dateFormat}
            placeholder={['开始时间', '结束时间']}
            value={[
              condition.createTimeStart ? moment(condition.createTimeStart, dateFormat) : undefined,
              condition.createTimeEnd ? moment(condition.createTimeEnd, dateFormat) : undefined,
            ]}
            onChange={(date, dateStr) => {
              dispatch({
                type: 'welfareRecords/setTabCondition',
                payload: {createTimeStart: dateStr[0], createTimeEnd: dateStr[1]},
                index: 1,
              });
            }}
          />

          <span style={{marginLeft: 30}}>发放事由： </span>
          <Cascader
            placeholder={'请选择'}
            options={dict.releaseReason}
            loadData={this.loadData}
            onChange={(val) => {
              dispatch({
                type: 'welfareRecords/setTabCondition',
                // payload: {transferReasonName: selectedOptions.map(o => o.label)},
                payload: {transferReasonName: val},
                index: 1,
              });
            }}
            value={condition.transferReasonName}
          />
          <Button
            style={{marginLeft: '30px', width: 80}}
            type="primary"
            onClick={() => {
              dispatch({type: 'welfareRecords/setTabCondition', payload: {pageIndex: 1}, index: 1});
              this.onSearch();
            }}
          >查询</Button>
        </div>

        <Table
          bordered
          loading={tab1.isLoad}
          dataSource={tab1.list}
          pagination={false}
          rowKey={(item, index) => `${item ? item.id : 'cell'}-${index}`}
          columns={this.tableColumns}
          scroll={{x: [0, ...this.tableColumns].reduce((total, item) => (total + (item.width || 0)))}}
        />

        <div className={cn('footer-pagination-placeholder')} style={{height: 72}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${tab1.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'welfareRecords/setTabCondition', payload: {pageSize, pageIndex: 1}, index: 1});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'welfareRecords/setTabCondition', payload: {pageIndex}, index: 1});
                  this.onSearch();
                }}
                current={tab1.condition.pageIndex}
                pageSize={tab1.condition.pageSize}
                total={tab1.totalCount}
              />
            </div>
          </Affix>
        </div>

        <ConfirmInput
          visible={!!this.state.confirmInput}
          label={'拒绝原因：'}
          title="拒绝原因"
          onOk={(reason) => {
            this.setState({confirmInput: false});
            this.auditSendMoneyTask({...this.state.confirmInput, reason});
          }}
          onCancel={() => {
            this.setState({confirmInput: false});
          }}
        />
      </div>
    );
  }
}


export default hot(module)(Class);
