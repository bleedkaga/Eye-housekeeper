import React from 'react';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Modal, Form, Input, Icon} from 'antd';

import './style.less';


const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
    // offset: 1,
  },
};

// const store = {
//   title: {
//     value: '',
//   },
//   list: {
//     value: [],
//   },
// };

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      title_id: '',
      list: [],
      category: [],
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  resetTaskModal() {
    const {list = []} = this.state;
    const size = list.length;
    const n = new Date().getTime();
    if (size === 0) {
      list.push({uid: n});
      list.push({uid: n - 1});
    } else if (size === 1) {
      list.push({uid: n});
    }
  }

  onShow(o, list = []) {
    if (o) {
      this.state.title = o.label;
      this.state.title_id = o.value;
      if (Array.isArray(o.children)) {
        this.state.list = [];
        o.children.forEach((item) => {
          this.state.list.push({
            label: item.label,
            taskId: item.value,
          });
        });
        this.props.form.setFields({list: this.state.list});
      }
    }
    this.resetTaskModal();
    this.setState({visible: true, category: list});
  }

  onHide() {
    this.setState({
      visible: false,
      title: '',
      title_id: '',
      list: [],
    });
    this.props.form.resetFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, onComplete} = this.props;
    form.validateFields({force: true}, (err, values) => {
      if (!err) {
        this.state.title = values.title;
        onComplete && onComplete({title: values.title, list: this.state.list, id: this.state.title_id});
      }
    });
  };

  isValidTask() {
    const {list} = this.state;
    if (!list.length) return false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].label) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {form, isLoad, onDelItem, onDelFather} = this.props;

    const {list, title, visible, title_id, category} = this.state;

    const {getFieldDecorator} = form;

    return (<Modal
      className={cn('gsg-modal', 'task-edit-modal')}
      title={'添加任务'}
      width={800}
      visible={visible}
      okType={''}
      okText={'删除任务分类'}
      cancelText={'保存添加'}
      okButtonProps={{
        className: cn('h34', 'w120'),
        loading: isLoad,
        style: {display: title_id ? 'inline-block' : 'none'},
      }}
      cancelButtonProps={{type: 'primary', className: cn('h34', 'w90'), loading: isLoad}}
      onCancel={(e) => {
        if (e.target.nodeName === 'BUTTON') {
          this.handleSubmit(e);
        } else {
          this.onHide();
        }
      }}
      onOk={() => {
        if (this.isValidTask()) {
          const un = Modal.confirm({
            iconType: '-',
            icon: '-',
            className: 'gsg-modal',
            confirmLoading: true,
            width: 600,
            title: (<div>
              删除任务分类
              <button
                className={cn('ant-modal-close')}
                style={{display: 'block'}}
                onClick={() => {
                  un && un.destroy();
                }}
              ><span className="ant-modal-close-x"><Icon type={'close'} className={cn('ant-modal-close-icon')}/></span></button>
            </div>),
            content: <div className={cn('f-tac')} style={{padding: '60px 0', fontSize: 20}}>该任务分类下还有任务，确定删除该分类？</div>,
            okText: '删除',
            cancelText: '保留',
            onOk: () => {
              onDelFather && onDelFather(title_id);
            },
          });
        } else {
          onDelFather && onDelFather(title_id);
        }
      }}
    >
      <Form
        hideRequiredMark
        className={'tab2-form'}
      >
        <div className={cn('father-box')}>
          <FormItem {...formItemLayout} label={'任务分类名称'}>
            {getFieldDecorator('title', {
              initialValue: title,
              validateFirst: true,
              rules: [
                {required: true, message: '请输入任务分类名称'},
                {whitespace: true, message: '不能使用空格'},
                {pattern: /^[^\s]/, message: '内容开始不能使用空格'},
                {pattern: /[^\s]$/, message: '内容结尾不能使用空格'},
                {max: 24, message: '最多输入24个字符'},
                {
                  validator: (rule, value, callback) => {
                    if (category.some(o => (title_id === o.value ? false : o.label === value))) {
                      callback(true);
                    } else {
                      callback();
                    }
                  },
                  message: '任务分类已存在，请重新输入',
                },
              ],
            })(
              <Input
                placeholder={'请输入任务分类名称'}
                onChange={(e) => {
                  this.state.title = e.target.value;
                }}
              />
            )}
          </FormItem>
        </div>
        <div className={cn('children-box')}>
          {
            list.map((item, index) => (
              <FormItem
                labelCol={{
                  span: index === 0 ? 7 : 0,
                }}
                wrapperCol={{
                  span: 17,
                  offset: index === 0 ? 0 : 7,
                }}
                label={index === 0 ? '任务名称' : ''}
                key={`task-item-u${item.uid}-t${item.taskId}-i${index}`}
              >
                <div className={cn('row')}>
                  <div className={cn('col', 'col-center')}>
                    {getFieldDecorator(`list[${index}].label`, {
                      validateFirst: true,
                      initialValue: item.label,
                      rules: [
                        {required: true, message: '请输入任务名称'},
                        {whitespace: true, message: '不能使用空格'},
                        {pattern: /^[^\s]/, message: '内容开始不能使用空格'},
                        {pattern: /[^\s]$/, message: '内容结尾不能使用空格'},
                        {max: 40, message: '最多输入40个字符'},
                        {
                          validator: (rule, value, callback) => {
                            if (list.some((o, i) => (i === index ? false : o.label === value))) {
                              callback(true);
                            } else {
                              callback();
                            }
                          },
                          message: '任务名称已存在，请重新输入',
                        },
                      ],
                    })(
                      <Input
                        key={`task-input-u${item.uid}-t${item.taskId}-i${index}`}
                        placeholder={'请输入任务名称'}
                        disabled={list[index].taskId}
                        onChange={(e) => {
                          list[index].label = e.target.value;
                        }}
                      />
                    )}
                  </div>
                  <div className={cn('col-center', 'task-operate')}>
                    <button
                      title={'在此任务下插入一个新的任务'}
                      onClick={() => {
                        list.splice(index + 1, 0, {label: '', uid: (new Date().getTime())});
                        this.setState({}, () => {
                          form.resetFields();
                        });
                      }}
                    ><Icon type="plus-circle"/></button>
                    <button
                      title={'删除该项任务（至少保留1项任务）'}
                      className={cn({disabled: list.length <= 1})}
                      onClick={() => {
                        if (list.length <= 1) return false;
                        if (item.taskId) {
                          onDelItem && onDelItem(item, () => {
                            list.splice(index, 1);
                            this.setState({});
                          });
                        } else {
                          list.splice(index, 1);
                          this.setState({});
                        }
                      }}
                    ><Icon type="minus-circle"/>
                    </button>
                  </div>
                </div>
              </FormItem>)
            )
          }
        </div>
      </Form>
    </Modal>);
  }
}

const FormClass = Form.create({
  // mapPropsToFields: () => {
  //   const result = {};
  //   Object.keys(store).forEach((k) => {
  //     const field = store[k];
  //     result[k] = Form.createFormField({
  //       ...field,
  //       value: store[k].value,
  //     });
  //   });
  //   return result;
  // },
  // onFieldsChange(props, fields) {
  //   // Tools.setOnFieldsChange(props.dispatch, 'pwd/setPwd2', props.pwd.pwd2, fieldContainer, fields);
  //   Object.keys(fields)
  //     .forEach((k) => {
  //       const field = fields[k];
  //       fieldContainer[k] = field;
  //       if (isThan || field.name in o) {
  //         dispatch({type: dispatchType, payload: {[field.name]: field.value}});
  //       }
  //     });
  //
  // },
})(Class);

export default hot(module)(FormClass);
