import React from 'react';
import './style.less';
import API from 'client/services/public';
import Upload from 'client/components/Upload';
import { Select, Input, Button, Form, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

const HeaderView = (props) => {
  const { form, type, queryContent, companyId, dispatch, downBtnLoading, onSearch, uploadPersonLoad } = props; //ok
  const { getFieldDecorator, getFieldsValue, resetFields } = form;
  const maybeSelect = [
    {
      label: '全部状态',
      value: '0',
    },
    {
      label: '正常',
      value: '1',
    },
    {
      label: '未绑定',
      value: '2',
    },
  ];

  const onUploadSuccess = (_data) => {
    if (_data && _data.code === 0) {
      message.success('上传人员账户信息成功');
      dispatch({
        type: 'taxList/setCondition',
        payload: {
          pageIndex: 1,
          pageSize: 10,
          type: '0',
          queryContent: '',
        },
      });
      dispatch({
        type: 'taxList/updateState',
        payload: {
          uploadPersonLoad: false,
        },
      });
      setTimeout(() => {
        onSearch();
      }, 16);
    } else {
      dispatch({
        type: 'taxList/updateState',
        payload: {
          uploadPersonLoad: false,
        },
      });
    }
  };

  const downPersonInfo = () => {
    dispatch({
      type: 'taxList/downloadPersonInfo',
      payload: {},
    });
  };

  const queryPerson = () => {
    const values = getFieldsValue();
    dispatch({
      type: 'taxList/setCondition',
      payload: {
        ...values,
        pageIndex: 1,
        pageSize: 10,
      },
    });
    setTimeout(() => {
      onSearch();
    }, 16);
  };

  const queryAll = () => {
    resetFields();
    dispatch({
      type: 'taxList/resetCondition',
      payload: {},
    });
    setTimeout(() => {
      onSearch();
    }, 16);
  };

  return (
    <div className="header-view">
      <div className="header-content">
        <div className="content-left">
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('type', {
                initialValue: type,
              })(
                <Select className="select">
                  {maybeSelect.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('queryContent', {
                initialValue: queryContent,
              })(
                <Search
                  enterButton="查询"
                  className="search"
                  onSearch={queryPerson}
                  placeholder="请输入姓名或手机号"
                />
              )}
            </FormItem>
            <FormItem>
              <Button className="query-all" onClick={queryAll}>查看所有人员</Button>
            </FormItem>
          </Form>
        </div>
        <div className="content-right">
          <Button
            type="primary"
            icon="download"
            className="down-person-info"
            onClick={downPersonInfo}
            loading={downBtnLoading}
          >
            下载人员账户信息
          </Button>
          <Upload
            name="file"
            size={2 * 1024}
            type="doc"
            suffix={['xlsx', 'xls']}
            url={API.uploadPersonList.url}
            onChange={(e) => { dispatch({type: 'taxList/updateState', payload: {uploadPersonLoad: true}}); }}
            data={{ companyId }}
            onComplete={onUploadSuccess}
            showUploadList={false}
          >
            <Button icon="upload" loading={uploadPersonLoad} className="upload-person-info">上传人员账户信息</Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};

export default Form.create()(HeaderView);
