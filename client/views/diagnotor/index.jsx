import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Cascader, message} from 'antd';
import BIconfont from 'client/components/BIconfont';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

import './style.less';

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 12},
};

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0, //状态
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const un = message.loading('加载中...', 15);
    Promise.all([
      dispatch({type: 'dict/findPCAS', payload: {}}), //获取省
      dispatch({type: 'dict/find', payload: {dict_codes: ['industry']}}), //获取一级字典
    ]).then(() => un());
  }

  componentWillUnmount() {
    fieldContainer = {};
    this.props.dispatch({type: 'diagnotor/reset'});
  }

  // componentWillReceiveProps(){
  // }

  loadAreaAddress = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findCPCAS',
      payload: {selectedOptions},
    });
  };

  loadAccountType = (selectedOptions) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dict/findCNext',
      payload: {
        dict_code: 'industry',
        selectedOptions,
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch} = this.props;

    form.validateFields({force: true}, (err) => {
      if (!err) {
        dispatch({type: 'diagnotor/compute'});
        this.setState({status: 2}); //转圈圈
        setTimeout(() => {
          this.setState({status: 1});
        }, 2000);
      }
    });
  };

  renderStatus0() {
    const {history, form, dict} = this.props;
    const {getFieldDecorator} = form;
    return (
      <div className={cn('diagnotor-box')}>
        <div className={cn('t1')}>企业人力成本智能诊断器</div>
        <div className={cn('t2')}>请填入企业的薪筹结构</div>
        <Form className={'form'} onSubmit={this.handleSubmit} hideRequiredMark>
          <Form.Item label="所在地区" {...formItemLayout}>
            {getFieldDecorator('areaAddress', {
              rules: [{required: true, message: '请选择所在地区'}],
            })(
              <Cascader
                options={dict.pcaData}
                loadData={this.loadAreaAddress}
                placeholder="请选择所在地区"
              />
            )}
          </Form.Item>
          <Form.Item label="行业类型" {...formItemLayout}>
            {getFieldDecorator('accountType', {
              rules: [{required: true, message: '请选择行业类型'}],
            })(
              <Cascader
                options={dict.industry}
                loadData={this.loadAccountType}
                placeholder="请选择行业类型"
                changeOnSelect
              />
            )}
          </Form.Item>
          <Form.Item label="总人力成本" {...formItemLayout}>
            {getFieldDecorator('allcost', {
              rules: [
                {required: true, message: '请输入总人力成本'},
                {
                  validator: (rule, value, callback) => {
                    if (value <= 0) {
                      return callback('成本必须大于0');
                    }
                    if (value > 9999999999.99) {
                      return callback('您输入的金额太大了');
                    }
                    return callback();
                  },
                },
              ],
            })(<Input placeholder="0" suffix={<i>元</i>}/>)}
          </Form.Item>
          <Form.Item label="非工资部分" {...formItemLayout}>
            {getFieldDecorator('nonwagecost', {
              rules: [{required: true, message: '请输入非工资部分'}, {
                validator: (rule, value, callback) => {
                  if (value <= 0) {
                    return callback('成本必须大于0');
                  }
                  if (value > 9999999999.99) {
                    return callback('您输入的金额太大了');
                  }
                  return callback();
                },
              }],
            })(<Input placeholder="0" suffix={<i>元</i>}/>)}
          </Form.Item>
          <Form.Item label="企业人数" {...formItemLayout}>
            {getFieldDecorator('staffmembers', {
              validateFirst: true,
              rules: [
                {required: true, message: '请输入企业人数'},
                {
                  pattern: /^[\d]+$/,
                  message: '企业人数必须是整数',
                },
                {
                  validator: (rule, value, callback) => {
                    if (parseInt(value, 10) <= 0) {
                      return callback('企业人数必须是整数');
                    }
                    if (parseInt(value, 10) > 9999999) {
                      return callback('企业人数太多了');
                    }
                    return callback();
                  },
                }],
            })(<Input placeholder="0" suffix={<i>人</i>}/>)}
          </Form.Item>
          <div className={cn('form-btns')}>
            <Button type="primary" htmlType="submit">
              开始诊断
            </Button>
            <Button
              className={cn('cl')}
              onClick={() => {
                RH(history, window.__themeKey, `/${window.__themeKey}/dashboard`);
              }}
            >
              取消
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  renderStatus1() {
    const {diagnotor, history} = this.props;
    return (
      <div className={cn('diagnotor-box')}>
        <div className={cn('r1')}>企业人力成本智能诊断器</div>
        <div className={cn('r2')} style={{color: `${diagnotor.health < 60 ? '#ff4d4f' : '#32B16C'}`}}>
          <BIconfont subType={'gsg-'} type={'huanbaoshuye'} style={{fontSize: '22px'}}/>
          健康度：{diagnotor.health}分
        </div>
        <div className={cn('r-box')}>
          <div className={cn('rb1')}><span>优化方案</span><em>节约&nbsp;<b
            className={cn('f-ffa')}
          >{(diagnotor.saveScale * 100) || 0}%</b></em></div>
          <div className={cn('rb2')}><span>总人力成本</span><em><b
            className={cn('f-ffa')}
          >{Tools.getViewPrice(diagnotor.newHumancost, '', true, 2, ',')}</b>元</em></div>
          <div className={cn('rb3')}><span>人均人力成本</span><em><b
            className={cn('f-ffa')}
          >{Tools.getViewPrice(diagnotor.costPercapita, '', true, 2, ',')}</b>元</em></div>
        </div>
        <div className={cn('r3')}>
          <Button
            type={'primary'}
            onClick={() => {
              RH(history, 'payOpened', '/org/payOpened');
            }}
          >开通薪筹规划</Button>
        </div>
        <div className={cn('r4')}><i>注：</i>因人工智能大数据计算，每次运算约有5%-10%的误差。</div>
      </div>
    );
  }

  renderStatus2() {
    return (
      <div className={cn('diagnotor-box')}>
        <div className={cn('loading', 'bg_cover')}/>
        <div className={cn('loading-text')}>人工智能卖力诊断中，请稍候~</div>
      </div>
    );
  }

  render() {
    const {status} = this.state;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '企业人力成本智能诊断器'},
        ]}
      />
      <GPage className={cn('diagnotor', 'bg_cover')}>
        {status === 0 ? this.renderStatus0() : null}
        {status === 1 ? this.renderStatus1() : null}
        {status === 2 ? this.renderStatus2() : null}
      </GPage>
    </GContainer>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'diagnotor/setFrom', props.diagnotor.from, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.diagnotor.from, fieldContainer),
})(Class);


export default connect(state => state)(hot(module)(FormClass));
