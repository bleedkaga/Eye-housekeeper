import React from 'react';
import './style.less';
import { Table, Button } from 'antd';
import RH from 'client/routeHelper';

class TrialResult extends React.Component {
  // 首页路由跳转
  jumpRouter = (_data) => {
    const { dispatch, history, closeModal } = this.props;
    const { location } = history;
    if (location.pathname.indexOf('taxPlan') > -1) {
      closeModal && closeModal();
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          program: _data,
          currentScheme: '1',
        },
      });
    } else {
      closeModal && closeModal();
      RH(history, 'taxPlan', `/${window.__themeKey}/salary/taxPlan`);
      dispatch({
        type: 'taxPlan/updateState',
        payload: {
          program: _data,
          currentScheme: '1',
        },
      });
    }
  };

  // 格式化返回的数据
  formatData = (_data) => {
    const getCnName = (en) => {
      let cnName = null;
      switch (en) {
        case 'corporateWelfare':
          return;
        case 'preTaxSalary':
          cnName = { name: <span>应发工资</span>, sort: 1 };
          break;
        case 'securityPaymentBase':
          cnName = { name: <span>社保缴纳工资基数</span>, sort: 3 };
          break;
        case 'securityCompanyPayment':
          cnName = { name: <span>社保五险<br/>(企业缴纳部分)</span>, sort: 5, important: true };
          break;
        case 'securityEmployeePayment':
          cnName = { name: <span>社保五险<br/>(个人缴纳部分)</span>, sort: 7 };
          break;
        case 'providentCompanyPaymentPart':
          cnName = { name: <span>住房公积金<br/>(企业缴纳部分)</span>, sort: 9 };
          break;
        case 'providentPersonalPart':
          cnName = { name: <span>住房公积金<br/>(个人缴纳部分)</span>, sort: 11 };
          break;
        case 'companyAnnuityPaymentPart':
          cnName = { name: <span>企业年金<br/>(公司缴纳部分)</span>, sort: 13 };
          break;
        case 'companyAnnuityPersonalPayment':
          cnName = { name: <span>企业年金<br />(个人缴纳部分)</span>, sort: 15 };
          break;
        case 'educationTrainingFunds':
          cnName = { name: <span>教育经费</span>, sort: 25 };
          break;
        case 'individualHumanCost':
          cnName = { name: <span>企业用工总成本</span>, sort: 23, important: true };
          break;
        case 'companyMedicalInsurance':
          cnName = { name: <span>补充医疗保险</span>, sort: 27 };
          break;
        case 'other':
          cnName = {
            name: <span>其他应扣除部分<br/>(党费、工会会费、费用报销等)</span>,
            sort: 29,
          };
          break;
        case 'shouldBeDeducted':
          cnName = { name: <span>个人薪资所得税</span>, sort: 31 };
          break;
        case 'originalEnterprisePath':
          cnName = { name: <span>企业原路径发放</span>, sort: 33 };
          break;
        case 'organizationCrowdsourcing':
          cnName = { name: <span>组织易代发</span>, sort: 35 };
          break;
        case 'corporatePayroll':
          cnName = { name: <span>员工实得薪资</span>, sort: 38, important: true };
          break;
        default:
          cnName = { name: <span />, sort: 39};
      }

      return cnName;
    };
    const { uploadingDate, A, B, C, D } = _data;
    const tmp = [];
    // eslint-disable-next-line guard-for-in
    for (const key in uploadingDate) {
      const cnName = getCnName(key);
      if (key === "corporateWelfare") continue; // eslint-disable-line
      tmp.push({
        ...cnName,
        key,
        oldScheme: key === 'enterpriseCost' ? '' : `${uploadingDate[key]}元`,
        AScheme: key === 'enterpriseCost' ? <Button type="primary" onClick={() => this.jumpRouter(60)}>使用此方案</Button> : `${A[key]}元`,
        BScheme: key === 'enterpriseCost' ? <Button type="primary" onClick={() => this.jumpRouter(80)}>使用此方案</Button> : `${B[key]}元`,
        CScheme: key === 'enterpriseCost' ? <Button type="primary" onClick={() => this.jumpRouter(100)}>使用此方案</Button> : `${C[key]}元`,
        DScheme: key === 'enterpriseCost' ? '' : `${D[key]}元`,
      });
    }
    return tmp.sort((a, b) => a.sort - b.sort);
  };

  render() {
    const { schemeData } = this.props;
    const columns = [
      {
        title: <span className="tableTiel">对比项目</span>,
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: <span className="tableTiel">原薪筹结构</span>,
        dataIndex: 'oldScheme',
        align: 'center',
      },
      {
        title: <span className="tableTiel">A方案<br />(按社平工资60%缴纳社保)</span>,
        dataIndex: 'AScheme',
        align: 'center',
      },
      {
        title: <span className="tableTiel">B方案<br />(按社平工资80%缴纳社保)</span>,
        dataIndex: 'BScheme',
        align: 'center',
      },
      {
        title: <span className="tableTiel">C方案<br />(按社平工资100%缴纳社保)</span>,
        dataIndex: 'CScheme',
        align: 'center',
      },
      {
        title: <span className="tableTiel">D方案<br />(按实际薪筹缴纳社保)</span>,
        dataIndex: 'DScheme',
        align: 'center',
      },
    ];

    const tableProps = {
      columns,
      dataSource: this.formatData(schemeData),
      pagination: false,
      bordered: true,
      rowKey: record => record.key,
      rowClassName: record => (record.important ? 'blueColor' : 'defaultColor'),
    };
    return (
      <div><Table {...tableProps}/></div>
    );
  }
}

export default TrialResult;
