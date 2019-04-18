import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Icon, Modal, Form, Button, Input, Table, message} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import GTitle from 'client/components/GTitle';
import Upload from 'client/components/Upload';

import './style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 15,
    offset: 0,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '序号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        width: 120,
      },
      {
        title: '资料',
        dataIndex: 'imageUrls',
        key: 'imageUrls',
        render: (e, item) => {
          if (!e) return '-';
          const arr = e.split(',');
          return arr.map((url, index) => (<button
            key={`img-${item.id}-${index}`}
            className={cn('image-item', 'bg_contain')}
            style={{backgroundImage: `url(${url})`}}
            onClick={() => {
              this.setState({
                previewImage: url,
                previewVisible: true,
              });
            }}
          />));
        },
      },
      {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        width: '60%',
      },
    ];

    const {match: {params = {}}} = props;

    this.state = {
      id: params.id,
      previewVisible: false,
      previewImage: '',
    };
  }

  componentDidMount() {
    const {id} = this.state;
    const {dispatch} = this.props;
    dispatch({type: 'uploadWelfare/get', payload: {taskId: id, pageIndex: 1}});
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'uploadWelfare/reset'});
  }

  // componentWillReceiveProps(){
  // }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, global} = this.props;
    const {id} = this.state;
    form.validateFields({force: true}, (err, values) => {
      if (!err) {
        const list = values.fileList.map(file => file.response.url);

        dispatch({
          type: 'uploadWelfare/add',
          payload: {
            taskId: id,
            uploader: global.account.realName,
            description: values.description,
            imageUrls: list.join(','),
          },
          callback: () => {
            message.success('添加成功');
            values.fileList.length = 0;
            form.resetFields();
            dispatch({type: 'uploadWelfare/get', payload: {taskId: id}});
          },
        });
      }
    });
  };

  render() {
    const {previewVisible, previewImage, id} = this.state;
    const {form, uploadWelfare, dispatch} = this.props;
    const {getFieldDecorator} = form;

    const fileList = form.getFieldValue('fileList') || [];
    const description = form.getFieldValue('description') || '';

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {
            name: '福利记录',
            path: window.__themeKey === 'org' ? '/org/hr/welfareRecords' : '/union/spring/welfareRecords',
          },
          {name: '上传资料'},
        ]}
      />
      <GPage className={cn('uploadWelfare')}>
        <GTitle>上传资料</GTitle>
        <div className={cn('top-box')}>
          <Form
            onSubmit={this.handleSubmit}
            className={cn('upload-form')}
          >
            <FormItem {...formItemLayout} label={'上传照片'} className={cn('upload-form-item1')}>
              {getFieldDecorator('fileList', {
                initialValue: [],
                validateFirst: true,
                valuePropName: 'fileList',
                rules: [
                  {required: true, message: '请上传照片'},
                ],
                getValueFromEvent: e => (e ? e.fileList : undefined),
              })(
                <Upload
                  max={5}
                  type={'image'}
                  className={cn('uploadWelfare-btn')}
                  compress
                  listType="picture-card"
                  onPreview={this.handlePreview}
                >
                  {fileList.length >= 5 ? null : <Icon type="plus" style={{fontSize: 33, color: '#999'}}/>}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'说明'}>
              {getFieldDecorator('description', {
                validateFirst: true,
                rules: [
                  {required: true, message: '请输入'},
                  {max: 150, message: '说明内容长度超过150'},
                ],
              })(
                <Input.TextArea
                  className={cn('upload-form-textarea')}
                  placeholder={'请输入'}
                />
              )}
              <div className={cn('textarea-tips')}><i>{150 - description.length < 0 ? 0 : 150 - description.length}</i>/150
              </div>
            </FormItem>
            <FormItem className={cn('btns')} label={''} wrapperCol={{offset: 4, span: 15}}>
              <Button loading={uploadWelfare.isFormLoad} type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className={cn('bottom-box')}>
          <div className={cn('tag-title')}><i/>存档资料</div>
          <Table
            columns={this.columns}
            dataSource={uploadWelfare.list}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '40', '50'],
              total: uploadWelfare.totalCount,
              pageSize: uploadWelfare.pageSize,
              current: uploadWelfare.pageIndex,
              showSizeChanger: false,
              showQuickJumper: true,
              onShowSizeChange: (current, pageSize) => {
                dispatch({type: 'uploadWelfare/set', payload: {pageSize, pageIndex: 1}});
                dispatch({type: 'uploadWelfare/get', payload: {taskId: id}});
              },
              onChange: (pageIndex) => {
                dispatch({type: 'uploadWelfare/set', payload: {pageIndex}});
                dispatch({type: 'uploadWelfare/get', payload: {taskId: id}});
              },
            }}
            bordered
            loading={uploadWelfare.isLoad}
            rowKey={item => item.id}
          />
        </div>
      </GPage>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => this.setState({previewVisible: false})}
      >
        <img style={{width: '100%'}} src={previewImage}/>
      </Modal>
    </GContainer>);
  }
}

const FormClass = Form.create()(Class);

export default connect(state => state)(hot(module)(FormClass));

