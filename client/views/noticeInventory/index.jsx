import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Input, Table, Affix, Pagination, message} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import GTitle from 'client/components/GTitle';


import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);
    const {match: {params = {}}} = props;

    this.tableColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (_, __, index) => index + 1,
      },

      {
        title: '状态',
        dataIndex: 'sendStatus',
        key: 'sendStatus',
        render: v => (v === 3 ? <span style={{color: '#FF4D4F'}}>失败</span> : <span>成功</span>),
      },

      {
        title: '发送时间',
        dataIndex: 'createtime',
        key: 'createtime',
        // render: v => Tools.formatDatetime(v, undefined, 1),
      },
      {
        title: '接收手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
    ];


    this.state = {
      id: params.id,
      phone: '',
    };
  }

  componentDidMount() {
    this.onSearch();
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'noticeInventory/reset'});
  }

  // componentWillReceiveProps(){
  // }

  onSearch() {
    const {id, phone} = this.state;
    const {dispatch} = this.props;
    dispatch({
      type: 'noticeInventory/get',
      payload: {
        informId: id,
        phone,
      },
    });
  }

  onReSend() {
    const {id} = this.state;
    const {dispatch} = this.props;

    dispatch({
      type: 'noticeInventory/resendAllTheInformation',
      payload: {
        personId: id,
        __autoLoading: true,
      },
      callback: (res) => {
        if (res.code === 0) {
          message.success('重新发送完毕');
          dispatch({type: 'noticeInventory/set', payload: {pageIndex: 1}});
          this.onSearch();
        }
      },
    });
  }

  render() {
    const {noticeInventory, dispatch} = this.props;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '通知管理', path: `/${window.__themeKey}/notice`},
          {name: '发放明细'},
        ]}
      />
      <GPage className={cn('noticeInventory')}>
        <GTitle>发放明细</GTitle>
        <div style={{paddingLeft: 30, paddingRight: 30}}>
          <div className={cn('notice-menu')}>
            <span className={cn('menu-name')}>电话号码：</span>
            <Input
              className={cn('menu-input')}
              placeholder={'请输入'}
              value={this.state.phone}
              onPressEnter={() => {
                dispatch({type: 'noticeInventory/set', payload: {pageIndex: 1}});
                this.onSearch();
              }}
              onChange={(v) => {
                this.setState({phone: v.target.value});
              }}
            />
            <Button
              style={{marginLeft: '20px', width: 75}}
              type="primary"
              onClick={() => {
                dispatch({type: 'noticeInventory/set', payload: {pageIndex: 1}});
                this.onSearch();
              }}
            >查询</Button>
          </div>
          <div className={cn('noticeInventory-tips')}>
            发送成功<i>{noticeInventory.successful}</i>人，发送失败<em>{noticeInventory.failure}</em>人
            {noticeInventory.failure > 0 ? <span>
            ，您可以点击 <a href="javascript:;" onClick={() => this.onReSend()}>重试</a> 将失败记录重新发送。
            </span> : null}
          </div>
          <Table
            bordered
            loading={noticeInventory.isLoad}
            className={cn('components-table-demo-nested', 'goods-table')}
            rowKey={(item, index) => `${item.id}-${index}`}
            columns={this.tableColumns}
            dataSource={noticeInventory.list}
            pagination={false}
          />
        </div>
        <div className={cn('footer-pagination-placeholder')} style={{height: 72}}>
          <Affix offsetBottom={0}>
            <div className={cn('footer-pagination')}>
              <Pagination
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showTotal={() => `共${noticeInventory.totalCount}条数据`}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch({type: 'noticeInventory/set', payload: {pageSize, pageIndex: 1}});
                  this.onSearch();
                }}
                showQuickJumper
                onChange={(pageIndex) => {
                  dispatch({type: 'noticeInventory/set', payload: {pageIndex}});
                  this.onSearch();
                }}
                current={noticeInventory.pageIndex}
                pageSize={noticeInventory.pageSize}
                total={noticeInventory.totalCount}
              />
            </div>
          </Affix>
        </div>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
