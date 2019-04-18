import React from 'react';
import {connect} from 'dva';
import {hot} from 'react-hot-loader';
import { Table, Button, Input, Icon, Affix} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import './style.less';
import Moment from 'moment';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.columns = [
      {
        title: '序号',
        dataIndex: 'num',
        className: 'center',
        render: (text, record, index) => (index + 1),

      },
      {
        title: '发布日期',
        dataIndex: 'docIssuedTime',
        className: 'center',
        render: text => Moment(text).format('YYYY-MM-DD'),

      },
      {
        title: '文件名',
        dataIndex: 'docName',
        className: 'center',
      },
      {
        title: '标题',
        dataIndex: 'docMessage',
        className: 'center',
      },
      {
        title: '单位',
        dataIndex: 'docIssuedDepartment',
        className: 'center',
      },
      {
        title: '操作',
        dataIndex: 'job',
        className: 'center-line',
        render: (text, record) => {
          if (record.downloadUrl) {
            const temp = record.downloadUrl.split('/');
            const name = temp[temp.length - 1];
            return <a href={record.downloadUrl} download={name} target={'__bank'}>下载</a>;
          }
        },
      },
    ];
  }


  componentDidMount() {
    this.onSearch();
  }


  onSearch() {
    const {dispatch, govHandle} = this.props;
    dispatch({ type: 'govHandle/findDocumentByKeyword', payload: {keyword: govHandle.condition.keyword}});
  }


  render() {
    const {govHandle, dispatch} = this.props;
    const {condition} = govHandle;
    return (<GContainer >
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '政策文件'},
        ]}
      />

      <GPage className={'gsdownload-container'}>
        <div style={{height: 72}}>
          <Affix offsetTop={46 + 46}>
            <div className={'search-box'} >
              <Input
                placeholder="请输入标题关键字"
                value={condition.keyword}
                // suffix={condition.keyword ? <span onClick={() => {
                //   dispatch({
                //     type: 'govHandle/setCondition',
                //     payload: {keyword: ''},
                //   });
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
                onChange={(e) => {
                  dispatch({
                    type: 'govHandle/setCondition',
                    payload: {keyword: e.target.value},
                  });
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  dispatch({type: 'govHandle/setCondition', payload: {pageIndex: 1}});
                  setTimeout(() => {
                    this.onSearch();
                  }, 16);
                }}
              >查询</Button>
            </div>
          </Affix>
        </div>

        <div>
          <Table
            dataSource={govHandle.list}
            columns={this.columns}
            bordered
            className={'gov-table'}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '40', '50'],
              total: govHandle.list.length,
              pageSize: condition.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              current: condition.pageIndex,
              showTotal: _total => `共${_total}条数据`,
              onChange: (pageIndex) => {
                dispatch({type: 'govHandle/setCondition', payload: {pageIndex}});
              },
              onShowSizeChange: (current, pageSize) => {
                dispatch({type: 'govHandle/setCondition', payload: {pageSize, pageIndex: 1}});
              },
            }}

            loading={govHandle.isLoad}
          />

        </div>


      </GPage>

    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
