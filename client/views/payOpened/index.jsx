import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Icon, Button, Checkbox, Modal, message} from 'antd';

import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Payment from 'client/components/Payment';
import {zzyPayChannelType} from 'client/utils/enums';
import Config from 'client/config';
import RH from 'client/routeHelper';
import moment from 'moment';


import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);

    const {location: {state = {}}} = props;

    this.state = {
      redirect: state.redirect || '/org/salary/taxPlan',
      key: state.redirectKey || 'taxPlan',
      agree: true,
    };
  }

  componentDidMount() {
    const {dispatch, history} = this.props;
    const {key, redirect} = this.state;
    dispatch({
      type: 'global/checkIfThePayrollIsOpen',
      callback: (res) => {
        if (res.code === 0 && res.data.permission === 2) {
          RH(history, key, redirect);
        }
      },
    });
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  showAgree() {
    const unm = Modal.info({
      width: 750,
      closable: true,
      className: 'gsg-modal user-protocol-modal',
      iconType: '-',
      icon: '-',
      title: <span>用户协议<button
        onClick={() => unm.destroy()}
        className={cn('gsg-modal-close')}
      >
        <Icon type={'close'}/>
      </button></span>,
      content: (
        <div className={cn('user-protocol-box')}>
          <p className={cn('user-protocol-title-p')}>
            感谢贵司选择<span className={cn('user-protocol-text-underline')}>重庆市中小企业创业服务协会</span>与<span
              className={cn('user-protocol-text-underline')}
            >固守大数据有限公司</span>为您提供服务。我们将竭诚为您提供最规范、专业的服务。
          </p>
          <p className={cn('user-protocol-title-p')}>
            鉴于，贵司需要通过专业管理咨询、系统和机制设计、信息技术改造、流程优化全面提升经营管理水平；重庆固守大数据有限公司（下称“固守”）拟通过互联网、大数据、人工智能、移动智能终端等信息技术手段为贵司提供降本增效的服务，经重庆市中小企业创业服务协会（下称“协会”）推介贵司拟采用固守提供的智能化工具为载体提升贵司的工作效率、管理效率、经营能力并实现贵司组织管理创新和产业升级。
          </p>
          <p className={cn('user-protocol-title-p')}>
            贵司为提升工作效率，并降低其管理环节和成本，需要将部分业务工作、隐形计量工作外包给固守。固守具备研发销售智能工具软件和通过其运营的共享经济资源平台为客户提供业务委托外包服务的能力；固守接受贵司委托为其设计并研发专门的智能化应用工具并为其提供部署、安装、培训等服务；同时固守接受贵司方委托，外包其部分业务工作，固守所承接的外包服务将通过智能技术工具和共享经济资源平台为贵司实现，并根据实际业务与信息发生量实时计量计费。
          </p>
          <p className={cn('user-protocol-title')}>
            <b className={cn('user-protocol-b')}>第一条 合作内容及价款</b>
          </p>
          <p className={cn('user-protocol-title-p')}>
            1、贵司开通“VIP会员”既向固守购买“麦卡组织易”智能工具使用权一年。
          </p>
          <p className={cn('user-protocol-title-p')}>
            2、贵司通过“麦卡组织易”智能工具向固守委托完成各项业务，贵司根据每月实际服务委托需求向固守支付“基础服务费”；该项费用以贵司每月通过“麦卡组织易”智能软件发布的任务记录作为双方结算依据，固守作为智能共享经济平台，通过组织人力、物资、技术等各项资源为贵司完成每月任务，并返回服务记录；贵司方应根据服务记录向固守方支付“增值服务费”，“增值服务费”包含合法向税务机关缴纳的税费、向金融机构缴纳的支付清缴手续费、技术服务费，合计为“基础服务费”金额的10%。
          </p>
          <p className={cn('user-protocol-title-p')}>
            3、固守拥有共享经济资源平台及智能化工具，可接受贵司委托为其提供共享经济综合服务，包括但不限于由固守筛选适合的灵活用工者完成贵司委托固守的各项业务并向灵活用工者代缴个人所得税税款及行政收费（如适用）。
          </p>
          <p className={cn('user-protocol-title-p')}>
            服务费用将在贵司订购页面予以列明公示，贵司可自行选择具体服务类型并按列明的价格予以支付。
          </p>
          <p className={cn('user-protocol-title')}>
            <b className={cn('user-protocol-b')}>第二条 权利与义务</b>
          </p>
          <p className={cn('user-protocol-title-p')}>
            1、贵司不得从事违反法律及行政法规等行为，如洗钱、偷税漏税及其他固守认为不得使用固守服务的行为等。
          </p>
          <p className={cn('user-protocol-title-p')}>
            2、贵司或其用户/客户作为纳税人、扣缴义务人的，应该依法履行纳税义务。
          </p>
          <p className={cn('user-protocol-title-p')}>
            3、贵司承诺军人、公职人员等国家法律法规和纪律规定禁止从事兼职或经商的人员，严禁使用本协议项下固守提供的共享经济综合服务。
          </p>
          <p className={cn('user-protocol-title-p')}>
            4、贵司承诺对灵活用工者所披露的个人隐私信息进行保密。
          </p>
          <p className={cn('user-protocol-title-p')}>
            5、贵司承诺向固守合法提供或与固守合法分享的个人信息已经个人信息主体同意。同时，贵司授权固守为完成本协议合作之目的，使用贵司合法收集的个人信息（包括但不限于自然人姓名、身份证号、收款账户信息、接单数量及费用等）。上述“个人信息”是指，以电子或者其他方式记录的能够单独或者与其他信息结合识别自然人个人身份的各种信息，包括但不限于自然人的姓名、出生日期、身份证件号码、个人生物识别信息、住址、电话号码等。
          </p>
          <p className={cn('user-protocol-title-p')}>
            6、贵司应如实通过系统生成任务完成单，按时足额向固守支付服务“基础服务费”；贵司应在收到固守任务完成记录后及时向固守支付“增值服务费”。（如因特别问题，双方经协商可以纸质任务完成单及任务完成报告作为确认凭证，但需加盖贵司与固守公章）。
          </p>
          <p className={cn('user-protocol-title-p')}>
            7、贵司确保的所有录入系统信息均真实有效，发布的任务及服务委托不违反法律法规。
          </p>
          <p className={cn('user-protocol-title-p')}>
            8、协会作为推介服务方应审核各方遵守相应法律法规，不得从事洗钱等违法行为。
          </p>
          <p className={cn('user-protocol-title-p')}>
            9、协会作为推介服务方应将持续为贵司提供后续服务。
          </p>
          <p className={cn('user-protocol-title-p')}>
            10、固守负责完成平台的初始配置和使用培训及日常维护与升级。
          </p>
          <p className={cn('user-protocol-title-p')}>
            11、固守保证所约定服务中通过平台提供的第三方服务、物品或者任务的及时完成；
          </p>
          <p className={cn('user-protocol-title-p')}>
            12、固守有权向整合的共享经济平台上的服务商制定相应的服务标准和准入认定。
          </p>
          <p className={cn('user-protocol-title-p')}>
            13、固守为使灵活用工者满足贵司业务需求而向灵活用工者提供的服务，该等服务并不当然导致固守与灵活用工者构成任何劳动或劳务合同关系。固守对灵活用工者因从事生产经营活动与任一方或第三人所产生的争议不承担任何法律责任。
          </p>
          <p className={cn('user-protocol-title-p')}>
            14、针对获得生产经营所得的灵活用工者（自由职业者、代理人、经纪人、兼职者、外包个人、被委托人、事业合伙人、合作经营者、计时经营工作者、计件经营工作者等）在使用本协议项下固守提供的共享经济综合服务时，固守承诺依法纳税、确保自然人纳税人取得税后的合法收入。
          </p>
          <p className={cn('user-protocol-title-p')}>
            15、固守履行安全保护义务，保障网络免受干扰、破坏或未经授权的访问，防止网络数据泄露或被窃取、篡改。
          </p>
          <p className={cn('user-protocol-title')}>
            <b className={cn('user-protocol-b')}>第三条 终止与解除</b>
          </p>
          <p className={cn('user-protocol-title-p')}>
            1、出现以下情形之一的，固守可以随时解除本协议，并有权要求贵司承担相应违约责任，赔偿相应损失：
          </p>
          <p className={cn('user-protocol-title-p')}>
            （1）贵司安排灵活用工者从事违法、有伤社会风化，或者严重损害固守的利益的活动的；
          </p>
          <p className={cn('user-protocol-title-p')}>
            （2）贵司未能按时支付服务费的；
          </p>
          <p className={cn('user-protocol-title-p')}>
            2、因不可抗力因素致使无法实现服务目的，任何一方可以解除。
          </p>
          <p className={cn('user-protocol-title-p')}>
            3、服务期限内，一方依法解散、撤销或者因其他原因撤销主体资格的，另一方可视为本服务终止。
          </p>
          <p className={cn('user-protocol-title')}>
            <b className={cn('user-protocol-b')}>第四条 违约责任</b>
          </p>
          <p className={cn('user-protocol-title-p')}>
            1、若固守违反本协议的规定未提供双方约定的服务，致使贵司受到严重影响，贵司有权书面催告固守，要求固守立即履行义务，如造成贵司严重损失，固守应赔偿相应损失。
          </p>
          <p className={cn('user-protocol-title-p')}>
            2、若贵司未能履行付款义务，每逾期一日，固守有权要求贵司承担逾期付款金额的0.05%作为违约金，且固守有权以贵司的逾期付款金额作为计息本金，以0.05%/日计算贵司应支付的利息。
          </p>
          <p className={cn('user-protocol-title-p')}>
            3、本协议关于违约状态下的救济方法（包括要求承担违约责任和解除协议等）的条款是累加的，可以选择适用或同时适用。
          </p>
          <p className={cn('user-protocol-title-p')}>
            4、因政府行为或不可抗力因素导致本协议部分条款或全部条款无法履行的，遭受该行为的一方不承担违约责任。前述政府行为包括但不限于因中国政府机关不授予或取消贵司、协会、固守相应经营资质或权利。
          </p>
          <p className={cn('user-protocol-title')}>
            <b className={cn('user-protocol-b')}>第五条 声明、承诺与保证</b>
          </p>
          <p className={cn('user-protocol-title-p')}>
            本协议项下各方声明、承诺和保证：本协议任何一方已披露签署和履行本协议所应当向另一方披露的全部信息，且披露内容真实、准确、无遗漏。协议各方同时声明和承诺：本协议的签署和履行不与本协议任何一方已经签署的协议或需承担的任何义务相冲突，且也不会对本协议任何一方以外的第三方形成任何法律和商业上的冲突。
          </p>
          <p className={cn('user-protocol-title')}>
            <b className={cn('user-protocol-b')}>第六条 适用法律、争议及纠纷解决和司法管辖</b>
          </p>
          <p className={cn('user-protocol-title-p')}>
            本协议的订立、执行和解释及争议的解决均应适用中国法律。凡因本协议引起的或与本协议有关的任何争议，双方应友好协商解决。如不能协商解决，各方一致同意提交至重庆市南岸区人民法院通过诉讼解决。
          </p>
          <p className={cn('user-protocol-title')}>
            <b className={cn('user-protocol-b')}>第七条 补充协议及附件</b>
          </p>
          <p className={cn('user-protocol-title-p')}>
            各方同意，在本协议签订后，如另有补充协议的，该等补充协议及附件构成本协议不可分割的组成部分，具有同等法律效力。
          </p>
        </div>
      ),
      okText: '同意',
      onOk: () => {
        this.setState({agree: true});
      },
    });
  }

  showPayOpened(value1, value2) {
    const {key, redirect} = this.state;

    const unm = Modal.info({
      width: 583,
      closable: true,
      className: 'gsg-modal payOpened-modal',
      iconType: '-',
      icon: '-',
      title: <span>开通成功<button
        onClick={() => unm.destroy()}
        className={cn('gsg-modal-close')}
      >
        <Icon type={'close'}/>
      </button></span>,
      content: (
        <div className={cn('payOpened-modal-box')}>
          <div className={cn('t1')}>恭喜你，已开通VIP服务！</div>
          <div className={cn('t2')}>有效期：{moment(value1).format('YYYY年MM月DD日')}—{moment(value2).format('YYYY年MM月DD日')}</div>
          <div className={cn('pom-ms')}>
            <span className={cn('m0', 'bg_contain')}/>
            <span className={cn('m1', 'bg_contain')}/>
            <span className={cn('m2', 'bg_contain')}/>
            <span className={cn('m3', 'bg_contain')}/>
            <span className={cn('m4', 'bg_contain')}/>
            <span className={cn('m5', 'bg_contain')}/>
          </div>
        </div>
      ),
      okText: '开始薪筹管理',
      onOk: () => {
        const {history} = this.props;
        RH(history, key, redirect);
      },
    });
  }

  paymentCallback(type, next) {
    const {dispatch, global} = this.props;
    const opt = {
      moneyId: global.account.companyId, //ok
      amount: Config.vipMoney, //开通VIP固定2000元
      operationer: `${global.account.accountId}_${global.account.realName}`, //ok
      __autoLoading: true,
    };
    let nextBefore = null;
    switch (type) {
      case 'alipay':
        opt.channelType = zzyPayChannelType.ali;
        opt.returnUrl = window.location.href;
        nextBefore = data => `${data.aliPayUrl}?orderId=${data.data.tradeNo}`;
        break;
      case 'wx':
        opt.channelType = zzyPayChannelType.wx;
        nextBefore = data => data.data.payBase64;
        break;
      case 'pay':
        opt.channelType = zzyPayChannelType.yee;
        nextBefore = data => data.data.payUrl;
        break;
      default:
        return false;
    }

    dispatch({
      type: 'global/subscribeToAService',
      payload: opt,
      callback: (res) => {
        if (res.code === 0) {
          next(nextBefore(res.data));
        }
      },
    });
  }

  paymentComplete() {
    const {dispatch} = this.props;
    dispatch({
      type: 'global/checkIfThePayrollIsOpen',
      payload: {__autoLoading: '查询中...'},
      callback: (res) => {
        if (res.code === 0) {
          if (res.data.permission === 2) {
            this.showPayOpened(res.data.startTime, res.data.endTime);
          } else {
            message.error('支付失败！');
          }
        } else {
          message.error('查询失败！');
        }
      },
    });
  }

  render() {
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '企业人力成本智能诊断器', path: '/org/diagnotor'},
          {name: '当前页面'},
        ]}
      />
      <GPage className={cn('payOpened', 'bg_cover')}>
        <div className={cn('payOpened-box')}>
          <i className={cn('payOpened-img', 'bg_contain')}/>
          <div className={cn('tips')} />{/*注：</i>智能薪筹是运用政策探针通过智能优化财税、薪筹结构帮助企业节省至少10%的薪筹成本。*/}
          <table className={cn('payOpened-table')}>
            <tbody>
              <tr>
                <td>
                  <div>普通用户</div>
                  <div>（免费）</div>
                </td>
                <td>
                功能权限
                </td>
                <td>
                  <div className={cn('c1')}>VIP用户</div>
                  <div className={cn('c1')}>（2000元/年）</div>
                </td>
              </tr>
              <tr>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
                <td>
                智能人事
                </td>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
              </tr>
              <tr>
                <td>
                  <Icon type="close" className={cn('close')}/>
                </td>
                <td>
                任务管理
                </td>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
              </tr>
              <tr>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
                <td>
                工会管理
                </td>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
              </tr>
              <tr>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
                <td>
                账户管理
                </td>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
              </tr>
              <tr>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
                <td>
                开票管理
                </td>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
              </tr>
              <tr>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
                <td>
                通知管理
                </td>
                <td>
                  <Icon type="check" className={cn('check')}/>
                </td>
              </tr>
            </tbody>
          </table>
          <Button
            disabled={!this.state.agree}
            className={cn('pay-vip')}
            type={'primary'}
            onClick={() => {
              this.paymentDialog.showPayment();
            }}
          >开通VIP</Button>
          <div className={cn('pay-agree')}>
            <Checkbox
              checked={this.state.agree}
              onChange={(e) => {
                this.setState({agree: e.target.checked});
              }}
            >同意</Checkbox>
            <a
              href="javascript:"
              onClick={() => {
                this.showAgree();
              }}
            >《智能薪筹VIP开通服务协议》</a></div>
        </div>
      </GPage>
      <Payment
        ref={e => (this.paymentDialog = e)}
        dialog
        money={2000}
        way={['alipay', 'wx', 'pay']}
        callback={(opt, next) => this.paymentCallback(opt.type, next)}
        onComplete={type => this.paymentComplete(type)}
      />
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
