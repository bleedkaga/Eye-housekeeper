import React from 'react';
import {connect} from 'dva';
import {withRouter} from 'dva/router';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Form, Input, Button, Icon, Checkbox, Modal} from 'antd';
import SendCode from 'client/components/SendCode';
import Tools from 'client/utils/tools';
import Config from 'client/config';
import RH from 'client/routeHelper';

import '../login/style.less';
import './style.less';

const FormItem = Form.Item;


class Class extends React.Component {
  constructor(props) {
    super(props);
    Tools.updateFullScreenPathTheme(Config.routeType.org.key);

    this.state = {};
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'global/getVfCodePhoneToken'});
  }

  componentWillUnmount() {
    fieldContainer = {};
  }

  // componentWillReceiveProps(){
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, next} = this.props;

    form.validateFields((err) => {
      if (!err) {
        const fields = form.getFieldsValue();
        const {phone, vfcode} = fields;
        dispatch({
          type: 'global/verificationCodeCheck',
          payload: {phone, vfcode},
          callback: () => {
            next && next();
          },
        });
      }
    });
  };

  onClause() {
    const {dispatch} = this.props;
    Modal.confirm({
      iconType: '-',
      icon: '-',
      title: '麦卡组织易服务条款',
      content: (
        <div style={{width: '100%', overflowY: 'scroll', height: '500px'}}>
          <p className={cn('register-protocol-title')}>
            <b
              className={cn('register-protocol-b')}
            > 以下所述条款和条件构成您与麦卡组织易系统（以下简称“麦卡组织易”）就使用服务条款所达成的协议，如果您想注册登录，即表示您同意接受以下所述的条款和条件。</b>
          </p>
          < p className={cn('register-protocol-p')}>
            < b className={cn('register-protocol-b')}> 1、注册条款的确认与接受 </b>
          </p>
          <p className={cn('register-protocol-p')}>
            所有服务的所有权和运作权归麦卡组织易所有。所提供的服务必须按照其发布的条款和操作规则认真执行。用户在注册之前，必须提供以下内容：
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（1） </b>
            提供及时、详尽及准确的个人资料。
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（2）</b>
            更新注册资料时，符合及时、详细准确的要求。用户初始键入的个人资料将引用为注册资料。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>2、注册条款的修改</b>
          </p>
          <p className={cn('register-protocol-p')}>  {
            '麦卡组织易会根据实时的需要，修改条款。注册条款发生变动时，麦卡组织易将会在用户进行注册过程中，提示修改内容。如果用户同意改动，则在"同意"单选框打勾。如果用户不同意，则无法进行注册操作'
          }
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（1）</b>
            确认并同意注册条款及其变动。
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（2）</b>
            同意并接受所有注册条款限制。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>3、服务的变更及中止</b>
          </p>
          <p className={cn('register-protocol-p')}>
            麦卡组织易保留随时变更或中止服务后再行通知用户的权利。用户同意麦卡组织易行使修改或中止服务的权利而不需对用户或第三方承但任何责任。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>4、用户隐私制度</b>
          </p>
          <p className={cn('register-protocol-p')}>
            在用户知晓并同意之后，便于为用户提供更好的服务。麦卡组织易一定不会公开、编辑或透露用户的注册资料及保存在各项服务中的非公开内容，除非麦卡组织易在诚信的基础上认为透露这些信息在以下几种情况是必要的:
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（1）</b>
            遵守有关法律规定，包括在国家有关机关查询时，提供用户的注册信息、用户在麦卡组织易的网页上发布的信息内容及其发布时间、互联网地址或者域名。
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（2）</b>
            保持维护麦卡组织易的知识产权和其他重要权利
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（3）</b>
            在紧急情况下竭力维护用户个人和社会大众的隐私安全。
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（4）</b>
            根据本条款相关规定或者麦卡组织易认为必要的其他情况下。
          </p>
          <p className={cn('register-protocol-promise')}>
            用户在此授权麦卡组织易可以向其电子邮箱或手机发送商业信息
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>5、用户的帐号、密码和安全性</b>
          </p>
          <p className={cn('register-protocol-p')}>
            您一旦注册成功成为用户，您的密码和账号将做为您的隐私，不对外透露。如果您未保管好自己的帐号和密码而对您损害，您将自行负责。您可随时修改您的密码，使用新密码登录。用户同意若发现任何非法使用用户帐号或安全漏洞的情况，立即举报给麦卡组织易。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>6、免责条款</b>
          </p>
          <p className={cn('register-protocol-p')}>
            麦卡组织易对直接、间接、偶然、特殊及继起的损害不负责任，这些损害来自:不正当使用产品服务，在网上购买商品或类似服务，在网上进行交易，非法使用服务或用户传送的信息有所变动。这些损害会导致麦卡组织易形象受损，所以麦卡组织易早已提出这种损害的可能性。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>7、禁止服务的商业化</b>
          </p>
          <p className={cn('register-protocol-p')}>
            用户承诺，非经麦卡组织易公司同意，用户不能利用麦卡组织易各项服务进行销售或其他商业用途。如用户有需要将服务用于商业用途，应书面通知麦卡组织易并获得麦卡组织易的明确授权。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>8、用户管理</b>
          </p>
          <p className={cn('register-protocol-p')}>
            用户单独承担发布内容的责任。用户对服务的使用是根据所有适用于服务的地方法律、国家法律和国际法律标准的。用户承诺:
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（1）</b>
            在麦卡组织易的网页上发布信息或者利用麦卡组织易的服务时必须符合中国有关法规(部分法规请见附录)，不得在麦卡组织易的网页上或者利用麦卡组织易的服务制作、复制、发布、传播以下信息:
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(a)</b>
            反对宪法所确定的基本原则的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(b)</b>
            危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(c)</b>
            损害国家荣誉和利益的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(d)</b>
            煽动民族仇恨、民族歧视，破坏民族团结的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(e) </b>
            破坏国家宗教政策，宣扬邪教和封建迷信的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(f)</b>
            散布谣言，扰乱社会秩序，破坏社会稳定的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(g)</b>
            散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(h) </b>
            侮辱或者诽谤他人，侵害他人合法权益的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(i)</b>
            含有法律、行政法规禁止的其他内容的。
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（2）</b>
            在麦卡组织易的网页上发布信息或者利用麦卡组织易的服务时还必须符合其他有关国家和地区的法律规定以及国际法的有关规定
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（3）</b>
            不利用麦卡组织易的服务从事以下活动:
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(a) </b>
            未经允许，进入计算机信息网络或者使用计算机信息网络资源的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(b)</b>
            未经允许，对计算机信息网络功能进行删除、修改或者增加的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(c)</b>
            未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(d)</b>
            故意制作、传播计算机病毒等破坏性程序的；
          </p>
          <p className={cn('register-protocol-p-third')}>
            <b className={cn('register-protocol-b')}>(e)</b>
            其他危害计算机信息网络安全的行为。
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（4）</b>
            不以任何方式干扰麦卡组织易的服务。
          </p>
          <p className={cn('register-protocol-p-second')}>
            <b className={cn('register-protocol-b')}>（5）</b>
            遵守麦卡组织易的所有其他规定和程序。
          </p>
          <p
            style={{textIndent: '2em'}}
            className={cn('register-protocol-promise')}
          >用户需对自己在使用麦卡组织易服务过程中的行为承担法律责任。用户理解，如果麦卡组织易发现其网站传输的信息明显属于上段第(1)条所列内容之一，依据中国法律，麦卡组织易有义务立即停止传输，保存有关记录，向国家有关机关报告，并且删除含有该内容的地址、目录或关闭服务器。
            用户使用麦卡组织易电子公告服务，须遵守本条的规定以及麦卡组织易将专门发布的电子公告服务规则，上段中描述的法律后果和法律责任同样适用于电子公告服务的用户。
            若用户的行为不符合以上提到的服务条款，麦卡组织易将作出独立判断立即取消用户服务帐号。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>9、参与广告策划</b>
          </p>
          <p className={cn('register-protocol-p')}>
            在麦卡组织易许可下用户可在他们发表的信息中加入宣传资料或参与广告策划，在麦卡组织易各项免费服务上展示他们的产品。任何这类促销方法，包括运输货物、付款、服务、商业条件、担保及与广告有关的描述都只是在相应的用户和广告销售商之间发生，麦卡组织易不承担任何责任。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>10、内容的所有权</b>
          </p>
          <p className={cn('register-protocol-p')}>
            内容的定义包括:文字、图片、图表；在广告中的全部内容；电子邮件的全部内容；麦卡组织易为用户提供的商业信息。所有这些内容均受版权、商标、标签和其它财产所有权法律的保护。所以，用户只能在麦卡组织易和广告商授权下才能使用这些内容，而不能擅自复制、再造这些内容、或创造与内容有关的派生产品。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>11、法律相关</b>
          </p>
          <p className={cn('register-protocol-p')}>
            本协议的成立、生效、履行和解释，均适用中华人民共和国法律； 在法律允许范围内，本协议由麦卡组织易负责解释。
          </p>
          <p className={cn('register-protocol-p')}>
            客户和麦卡组织易在履行本协议的过程中，如发生争议，应友好协商解决。协商不成的，双方可向消费者协会等有关部门投诉。双方通过协商不能解决争议的，提交人民法院诉讼解决。
          </p>
          <p className={cn('register-protocol-p')}>
            <b className={cn('register-protocol-b')}>12、 协议生效和效力</b>
          </p>
          <p className={cn('register-protocol-p')}>
            本协议自客户点击“同意”按钮时生效。本协议的任何条款如因任何原因而被确认无效，都不影响本协议其他条款的效力。
          </p>
          <p style={{textIndent: '2em'}} className={cn('register-protocol-promise')}>
            麦卡组织易有权根据需要不时地制定、修改本协议，如本协议有任何变更，麦卡组织易将在网站上刊载公告，通知客户。经修订的协议一经在网站上公布后，立即自动生效。
          </p>
        </div>
      ),
      width: 800,
      okText: '同意条款',
      cancelText: '不同意条款',
      onCancel: () => {
        dispatch({type: 'register/setStep1', payload: {agree: false}});
      },
      onOk: () => {
        dispatch({type: 'register/setStep1', payload: {agree: true}});
      },
    });
  }

  render() {
    const {history, form, register, dispatch, global} = this.props;
    const {getFieldDecorator} = form;

    return (<div className={'step1'}>
      <div className={cn('step-title')}>验证手机</div>
      <Form
        onSubmit={this.handleSubmit}
        className={cn('login-form')}
      >
        <FormItem>
          <div className={cn('login-input')}>
            {getFieldDecorator('phone', {
              validateFirst: true,
              rules: [
                {required: true, message: '请输入您的手机号'},
                {pattern: /^[\d]{11}$/, message: '请输入正确的手机号'},
                {
                  validator: (rule, value, callback) => {
                    dispatch({
                      type: 'global/checkIfTheUserExists',
                      payload: {phone: value},
                      callback: (res) => {
                        res.code === 0 ? callback() : callback(res.message);
                      },
                    });
                  },
                },
              ],
            })(
              <Input
                className={cn('suffix-close-input')}
                placeholder={'请输入您的手机号'}
                // suffix={register.step1.phone ? <span onClick={() => {
                //   form.setFieldsValue({phone: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
          </div>
        </FormItem>
        <FormItem>
          <div className={cn('login-input')}>
            {getFieldDecorator('vfcode', {
              rules: [
                {required: true, message: '请输入验证码'},
              ],
            })(
              <Input
                type={'text'}
                className={cn('suffix-close-input', 'send-code-input')}
                placeholder={'请输入验证码'}
                // suffix={register.step1.vfcode ? <span onClick={() => {
                //   form.setFieldsValue({vfcode: ''});
                // }}
                // ><Icon type={'close-circle'} theme={'filled'}/></span> : null}
              />
            )}
            <SendCode
              id={'reg-send-code'}
              send={(sending, okNext, noNext) => {
                form.validateFields(['phone'], (err) => {
                  if (!err) {
                    sending();
                    dispatch({
                      type: 'register/getVerificationCode',
                      payload: {phone: register.step1.phone},
                      callback: (res) => {
                        res.code === 0 ? okNext() : noNext();
                      },
                    });
                  }
                });
              }}
            />
          </div>
        </FormItem>
        <FormItem>
          <Button loading={global.isLoad} className={cn('login-play')} type="primary" htmlType="submit">
            下一步
          </Button>
        </FormItem>
        <FormItem>
          <div className={cn('form-row-item')}>
            {getFieldDecorator('agree', {
              rules: [
                {
                  validator: (r, value, callback) => {
                    value ? callback() : callback(true);
                  },
                  message: '请同意服务网条款',
                },
              ],
            })(
              <Checkbox
                checked={register.step1.agree}
              >我已同意麦卡组织易</Checkbox>
            )}
            <em className={cn('tk')} onClick={() => this.onClause()}>《服务条款》</em>
          </div>
        </FormItem>
      </Form>
      <div className={cn('reg-footer')}>
        <span>已有账号，</span>
        <em
          onClick={() => {
            RH(history, 'login', '/login');
          }}
        >马上登录</em>
      </div>
    </div>);
  }
}

let fieldContainer = {};

const FormClass = Form.create({
  onFieldsChange(props, fields) {
    Tools.setOnFieldsChange(props.dispatch, 'register/setStep1', props.register.step1, fieldContainer, fields);
  },
  mapPropsToFields: props => Tools.getMapPropsToFields(props.register.step1, fieldContainer),
})(Class);

export default connect(state => state)(withRouter(hot(module)(FormClass)));
