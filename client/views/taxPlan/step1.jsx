import React from 'react';
import './style.less';
import cn from 'classnames';
import HintInput from 'client/components/HintInput';
import SelfUpload from 'client/components/Upload';
import File, {SendUpload} from 'client/components/File';
import publicAPI from 'client/services/public';
import moment from 'moment';
import {
  Form,
  Button,
  Select,
  message,
  Icon,
  Tooltip,
  Input,
  DatePicker,
  Radio,
  Upload,
} from 'antd';
import AjaxMap from '../../services/public';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

const Step1 = (props) => {
  const {
    form,
    cityAverageSalary,
    program,
    createSchemeBtnDisable,
    currentScheme,
    dispatch,
    account,
    createSchemeBtnLoading,
    fileList,
    paymentMethod,
    whetherLend,
    distributionMethod,
    schemeTwoFile,
    downTmpLoading,
  } = props;
  const { getFieldDecorator, validateFields, setFields, setFieldsValue } = form;

  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 10 },
  };
  const formItemBtnLayout = {
    wrapperCol: { span: 10, offset: 10 },
  };
  const schemes = [
    {
      name: '社会平均工资60%缴纳社保',
      value: 60,
    },
    {
      name: '社会平均工资80%缴纳社保',
      value: 80,
    },
    {
      name: '社会平均工资100%缴纳社保',
      value: 100,
    },
  ];

  // 下载方案
  const downTemplate = () => {
    dispatch({
      type: 'taxPlan/downSchemeTemplate',
      payload: {
        type: currentScheme === '1' ? 2 : 1,
      },
    });
  };

  // 下一步
  const next = () => {
    dispatch({
      type: 'taxPlan/updateState',
      payload: {
        step: 1,
        createSchemeBtnDisable: true,
      },
    });
  };

  // 上传.组件属性
  const uploadProps = {
    name: 'file',
    fileList,
    size: 2 * 1024,
    type: 'doc',
    accpts: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //只能上传 .xlsx 文件
    url: currentScheme === '1' ? publicAPI.getUploadData.url : publicAPI.updateCustomIssue.url,
    data: {
      companyId: account.companyId, //ok
    },
    onChange: (e) => {
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          fileList: e.fileList,
        },
      });
    },
    onComplete: (_data) => {
      if (_data && _data.code === 0) {
        message.success('上传成功');
        if (currentScheme === '2') {
          dispatch({
            type: 'taxPlan/updateState',
            payload: {
              outTradeNo: _data.data.tradeNo,
              createSchemeBtnDisable: false,
            },
          });
        } else {
          dispatch({
            type: 'taxPlan/updateState',
            payload: {
              createSchemeBtnDisable: false,
            },
          });
        }
      } else {
        dispatch({
          type: 'taxPlan/updateState',
          payload: {
            fileList: [],
          },
        });
      }
    },
    onCancel: (delList, _fileList) => {
      if (_fileList.length <= 0) {
        dispatch({
          type: 'taxPlan/updateState',
          payload: {
            createSchemeBtnDisable: true,
          },
        });
      }
    },
  };


  // 自定义方案上传
  const twoUploadProps = {
    onRemove: (file) => {
      const index = schemeTwoFile.indexOf(file);
      const newFileList = schemeTwoFile.slice();
      newFileList.splice(index, 1);
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          schemeTwoFile: newFileList,
          createSchemeBtnDisable: true,
        }
      })
    },
    beforeUpload: (file) => {
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          schemeTwoFile: [file],
          createSchemeBtnDisable: false,
        }
      });
      return false;
    },
    fileList: schemeTwoFile,
  };
  // 生成方案
  const createScheme = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const { timer } = values;
        delete values.timer;
        values.taskStartTime = moment(timer[0]).format("YYYY-MM-DD HH:mm:ss");
        values.taskEndTime = moment(timer[1]).format("YYYY-MM-DD HH:mm:ss");
        // 是后付款，领取任务是否放款默认传1
        if (values.paymentMethod === 1) {
          values.whetherLend = 1;
        }

        dispatch({
          type: 'taxPlan/updateState',
          payload: {
            createSchemeBtnLoading: true,
          },
        });
        if (currentScheme === '2') {
          SendUpload(publicAPI.updateCustomIssue.url, {
            file: schemeTwoFile[0],
            companyId: account.companyId,
            ...values,
          }).then((res) => {
            if (res && res.code === 0) {
              dispatch({
                type: 'taxPlan/queryScheme',
                payload: {
                  outTradeNo: res.data.tradeNo,
                  pageIndex: 1,
                  pageSize: 10,
                  next,
                },
              });
            } else {
              dispatch({
                type: 'taxPlan/updateState',
                payload: {
                  createSchemeBtnLoading: false
                }
              })
            }
          }).catch(() =>
            dispatch({
              type: 'taxPlan/updateState',
              payload: {
                createSchemeBtnLoading: false
              }
            })
          );
          // dispatch({
          //   type: 'taxPlan/queryScheme',
          //   payload: {
          //     pageIndex: 1,
          //     pageSize: 10,
          //     next,
          //     ...values,
          //   },
          // });
        } else {
          dispatch({
            type: 'taxPlan/createScheme',
            payload: {
              next,
              ...values,
            },
          });
        }
      }
    });
  };

  // 校验社平工资
  const salaryValidate = (e) => {
    const { value } = e.target;
    const tmp = value.split('.');
    if (tmp.length > 1 && tmp[1].length > 2) {
      setFields({["clubLevel"]: {value: "", errors: [new Error("小数点后两位数字")]}}); // eslint-disable-line
    } else
    if (value > 99999.99) {
      setFields({["clubLevel"]: {value, errors: [new Error("您输入的数额太大")]}}); // eslint-disable-line
    }
  };


  // 标记
  const LabelTag = (args) => {
    const { title, tips="", showIcon } = args;
    return (
      <div className={cn("label-tag")}>
        <div className={cn("label-block")} />
        <h3 className={cn("label-title")}>{title}</h3>
        {
          showIcon && <Tooltip placement={"top"} overlayClassName={cn('tips-width')} title={tips}>
            <Icon type="question-circle" theme="filled" className={cn("label-icon")} />
          </Tooltip>
        }
      </div>
    )
  };

  const radioChange = (e) => {
    const { name, value } = e.target;
    if (paymentMethod !== 1) {
      if (name === 'whetherLend' && value === 0) {
        setFieldsValue({
          distributionMethod: 0
        })
      }
    }
    dispatch({
      type: 'taxPlan/updateState',
      payload: {
        [name]: value,
      }
    })
  };

  return (
    <div className="step1Wrap">
      <LabelTag
        title={"任务配置"}
        showIcon={true}
        tips={
          <span>
            <p>发布任务先付款：发布众包任务时，支付任务费用。</p>
            <p>发布任务后付款：发布众包任务，待任务结束后再付款。</p>
            <p>领取任务放款：承包方领取任务后，任务费用自动到用户账户。仅限“发布任务先付款”可用。</p>
            <p>自动放款：任务周期结束后，系统自动执行“放款”操作。</p>
            <p>手动放款：任务周期结束后，系统管理员手动执行“放款”操作。</p>
          </span>
        }
      />
      <Form
        onSubmit={createScheme}
      >
        <FormItem
          label="任务名称"
          {...formItemLayout}
        >
          {getFieldDecorator("taskName", {
            rules: [
              {required: true, message: "请输入任务名称"},
              {max: 60, message: '任务名称长度不得超过60个字符'}
            ]
          })(
            <Input placeholder={"请输入任务名称"}/>
          )}

        </FormItem>
        <FormItem
          label="发放模式"
          labelCol={{span: 10}}
          wrapperCol={{span: 12}}
        >
          {getFieldDecorator("paymentMethod", {
            initialValue: paymentMethod,
            rules: [
              {required: true, message: ""}
            ]
          })(
            <RadioGroup name={"paymentMethod"} onChange={radioChange}>
              <Radio value={1}>先发任务后付款</Radio>
              <Radio style={{width: "130px"}} value={0}>发放任务并付款</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {paymentMethod !== 1 &&
          <FormItem
            label="领取任务是否放款"
            {...formItemLayout}
          >
            {getFieldDecorator("whetherLend", {
              initialValue: whetherLend,
              rules: [
                {required: true, message: ""}
              ]
            })(
              <RadioGroup name={"whetherLend"} onChange={radioChange}>
                <Radio style={{width: "130px"}} value={0}>放款</Radio>
                <Radio value={1}>不放款</Radio>
              </RadioGroup>
            )}

          </FormItem>
        }
        <FormItem
          label="放款方式"
          {...formItemLayout}
        >
          {getFieldDecorator("distributionMethod", {
            initialValue: distributionMethod,
            rules: [
              {required: true, message: ""}
            ]
          })(
            <RadioGroup name={"distributionMethod"} onChange={radioChange}>
              <Radio key={"distributionMethod-0"} style={{width: "130px"}} value={0}>自动放款</Radio>
              <Radio key={"distributionMethod-1"} value={1} disabled={paymentMethod == 0 && whetherLend == 0}>手动放款</Radio>
            </RadioGroup>
          )}

        </FormItem>
        <FormItem
          label="任务周期"
          {...formItemLayout}
          style={{marginBottom: '52px'}}
        >
          {getFieldDecorator("timer", {
            rules: [
              {required: true, message: "请选择任务周期"}
            ]
          })(
            <RangePicker format={"YYYY-MM-DD HH:mm:ss"} showTime/>
          )}

        </FormItem>
        {/*下半段*/}
        <LabelTag
          title={"上传费用模板"}
          tips={"hello world"}
        />
        <FormItem
          label="下载众包费用模板"
          {...formItemLayout}
        >
          <Button icon="download" loading={downTmpLoading} onClick={downTemplate}>下载模板</Button>
        </FormItem>
        {currentScheme === '1' && <FormItem
          label="所在城市社会平均工资标准"
          {...formItemLayout}
        >
          {getFieldDecorator('clubLevel', {
            initialValue: cityAverageSalary,
            getValueFromEvent: event => ((event.target.value > -1) ? event.target.value : event.target.value.trim().match(/^\d+/g)),
            rules: [
              { required: true, message: '所在城市社会平均工资是必填项' },
            ],
          })(
            <HintInput tooltipContent="重庆市2018年7月1日后，社会平均工资标准为6106元" onBlur={salaryValidate}/>
          )}
        </FormItem>}
        {currentScheme === '1' && <FormItem
          label="使用方案"
          {...formItemLayout}
        >
          {getFieldDecorator('program', {
            initialValue: program,
            rules: [{ required: true, message: '请选择使用的方案' }],
          })(
            <Select>
              {schemes.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
            </Select>
          )}
        </FormItem>}
        <FormItem
          label="上传众包费用数据"
          {...formItemLayout}
        >
          {currentScheme === '1'
            ? <SelfUpload {...uploadProps}><Button icon="upload">上传模板</Button></SelfUpload>
            : <Upload {...twoUploadProps}><Button icon="upload">选择模板</Button></Upload>}
        </FormItem>
        <FormItem
          {...formItemBtnLayout}
        >
          <Button
            type="primary"
            htmlType="submit"
            className="createSchemeBtn"
            disabled={createSchemeBtnDisable}
            loading={createSchemeBtnLoading}
          >
            {currentScheme === '1' ? '确定' : '上传'}
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};


export default Form.create()(Step1);
