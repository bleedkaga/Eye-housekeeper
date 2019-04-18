import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Checkbox, Icon, Modal, message} from 'antd';
import Upload from 'client/components/Upload';
import RH, {goBack} from 'client/routeHelper';

import '../sendNotice/style.less';

const FormItem = Form.Item;

const checkboxOptions = [
  {label: (<span>系统通知<i style={{color: '#999'}}>(试用期间免费)</i></span>), value: 1},
  {label: '短信通知', value: 2, disabled: true},
  {label: '语音短信通知', value: 3, disabled: true},
];

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 11,
    offset: 0,
  },
};

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const {form, sendNotice: {step1}} = this.props;

    const fileList = form.getFieldValue('fileList') || [];

    if (fileList.length !== step1.fileList.length) {
      form.setFieldsValue({
        fileList: step1.fileList,
      });
    }
    this.setState({});
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, global, item = {}} = this.props;
    form.validateFields({force: true}, (err, values) => {
      if (!err) {
        const opt = {
          companyId: global.account.companyId, //ok

          informWay: values.informWay.join(','), // 类型
          messageTitle: values.messageTitle,
          informCountent: values.informCountent,
          id: item.id,
          // informPersonNumber: item.informPersonNumber,
          // informAmount: item.informAmount,
          // informPersonId: item.informPersonId,
          successAccount: item.successAccount,
          failAccount: item.failAccount,
          cost: item.cost,
          operation: `${global.account.accountId}_${global.account.realName}`, //ok 操作id_name
          // updateTime:修改时间
          // creationTime:创建时间
          // payStatus:支付状态：0 未支付 1 已支付 2 已退款
        };

        if ('link' in values) {
          opt.link = values.link;
        }
        if ('fileList' in values) {
          opt.informImg = values.fileList && values.fileList[0] && values.fileList[0].response ? values.fileList[0].response.url : item.informImg ? item.informImg : '';
        }

        dispatch({
          type: 'sendNotice/updateSendContent',
          payload: opt,
          callback: (res) => {
            if (res.code === 0) {
              message.success('修改成功');
              goBack();
            }
          },
        });
      }
    });
  };


  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };


  render() {
    const {previewVisible, previewImage} = this.state;
    const {form, sendNotice} = this.props;
    const {getFieldDecorator} = form;
    const {step1} = sendNotice;

    const fileList = form.getFieldValue('fileList') || [];

    return (<div className={'step1'}>
      <Form
        onSubmit={this.handleSubmit}
        className={cn('step-form')}
      >
        <FormItem
          {...formItemLayout}
          label={'通知类型'}
          wrapperCol={{
            span: 14,
          }}
        >
          {getFieldDecorator('informWay', {
            initialValue: step1.informWay,
            rules: [
              {required: true, message: '请选择'},
            ],
          })(
            <Checkbox.Group options={checkboxOptions}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'通知标题'}>
          {getFieldDecorator('messageTitle', {
            initialValue: step1.messageTitle,
            rules: [
              {required: true, message: '请输入标题'},
            ],
          })(
            <Input placeholder={'请输入'}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'通知内容'}>
          {getFieldDecorator('informCountent', {
            initialValue: step1.informCountent,
            rules: [
              {required: true, message: '请输入通知内容'},
              {max: 500, message: '通知内容长度超过500'},
            ],
          })(
            <Input.TextArea className={cn('noticeContent')} placeholder={'请输入'}/>
          )}
        </FormItem>

        {
          step1.informImg ? <FormItem
            {...formItemLayout}
            label={'图片附加'}
            className={cn('upload-form-item1')}
            wrapperCol={{
              span: 14,
              offset: 0,
            }}
          >
            <div className={cn('row')}>
              {
                fileList.length <= 0 && step1.informImg ? <div className={cn('col-top', 'temp-image-box')}>
                  <i className={cn('bg_contain')} style={{backgroundImage: `url(${step1.informImg})`}}/>
                </div> : null
              }
              <div className={cn('col-top')}>
                {getFieldDecorator('fileList', {
                  initialValue: step1.fileList,
                  validateFirst: true,
                  valuePropName: 'fileList',
                  rules: [],
                  getValueFromEvent: e => (e ? e.fileList : []),
                })(
                  <Upload
                    max={1}
                    type={'image'}
                    className={cn('uploadWelfare-btn')}
                    compress
                    listType="picture-card"
                    onPreview={this.handlePreview}
                  >
                    {fileList.length >= 1 ? null : <Icon type="plus" style={{fontSize: 33, color: '#999'}}/>}
                  </Upload>
                )}
              </div>
              <span className={cn('upload-tips', 'col-center')}>720 x 293px，JPG或PNG格式的图片</span>
            </div>
          </FormItem> : null
        }

        {
          step1.link ? <FormItem {...formItemLayout} label={'链接地址'}>
            {getFieldDecorator('link', {
              initialValue: step1.link,
              rules: [{
                validator: (rule, value, callback) => {
                  if (value === '' || (value.indexOf('http://') === 0 && value.length > 7) || (value.indexOf('https://') === 0 && value.length > 8)) {
                    callback();
                  } else {
                    callback(true);
                  }
                },
                message: '请输入正确的链接地址，以http://或https://开头',
              }],
            })(
              <Input placeholder={'请输入'}/>
            )}
          </FormItem> : null
        }

        <div className={cn('btns')} style={{paddingTop: 30}}>
          <Button
            loading={sendNotice.isLoad}
            type="primary"
            htmlType="submit"
          >
            保存
          </Button>
          <Button
            loading={sendNotice.isLoad}
            type={'gray'}
            onClick={() => {
              goBack();
            }}
          >
            取消
          </Button>
        </div>
      </Form>

      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => this.setState({previewVisible: false})}
      >
        <img style={{width: '100%'}} src={previewImage}/>
      </Modal>
    </div>);
  }
}

const FormClass = Form.create()(Class);

export default connect(state => state)(hot(module)(FormClass));
