import React from 'react';
import cn from 'classnames';
import {Modal, Form, Spin, Radio, Select} from 'antd';
import Tools from 'client/utils/tools';

import './style.less';


const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 15,
    offset: 1,
  },
};

const FormModal = Form.create()(
  class Class extends React.Component {
    static defaultProps = {
      dispatchKey: 'unionInfo',
      companyGroupStatus: 2,
    };

    componentWillUnmount() {
      clearTimeout(this._loadCompanyNameTimer);
    }

    _loadCompanyNameTimer = null;

    loadCompanyName = (value) => {
      clearTimeout(this._loadCompanyNameTimer);
      value = Tools.formatCompanyName(value);
      if (!value || value.length < 2) return false;
      const {dispatch, type, global, dispatchKey} = this.props;
      this._loadCompanyNameTimer = setTimeout(() => {
        if (type === 1) {
          //工商
          dispatch({
            type: `${dispatchKey}/searchCompanyName`,
            payload: {
              companyName: value,
            },
          });
        } else {
          //非工商
          dispatch({
            type: `${dispatchKey}/findCompanyNameList`,
            payload: {
              companyName: value,
              companyGroupId: global.account.groupId, //ok
              companyGroupStatus: this.props.companyGroupStatus,
              pagecount: 100,
            },
          });
        }
      }, 444);
    };

    render() {
      const {
        title, visible, onCancel, onOk, form,
        obj, unionInfo, type,
      } = this.props;
      const {getFieldDecorator} = form;
      return (<Modal
        className={cn('gsg-modal', 'unionInfo-tab-modal')}
        title={title}
        width={600}
        visible={visible}
        okButtonProps={{loading: unionInfo.isLoad}}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form className={'tab1-form'}>
          <FormItem {...formItemLayout} label={'单位名称'}>
            {getFieldDecorator('name', {
              initialValue: obj.name,
              rules: [
                {required: true, message: '请输入单位名称'},
              ],
            })(
              <Select
                placeholder={'请输入单位名称关键词,进行检索'}
                filterOption={false}
                showArrow={false}
                showSearch
                defaultActiveFirstOption={false}
                onSearch={this.loadCompanyName}
                notFoundContent={unionInfo.isLoadModal ? <Spin size="small"/> : null}
                onChange={(e, c) => {
                  const {item} = c.props;
                  obj.item = item;
                }}
              >
                {unionInfo.modalList.map(d => (<Select.Option key={type === 1 ? d.KeyNo : d.companyId} item={d}>
                  {type === 1 ? d.Name : d.companyName}
                </Select.Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'人员变更是否通知'}>
            {getFieldDecorator('notice', {
              initialValue: obj.notice,
              rules: [
                {required: true, message: '请选择人员变更'},
              ],
            })(
              <Radio.Group>
                <Radio value={'1'}>是</Radio>
                <Radio value={'2'}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>);
    }
  }
);

export default FormModal;
