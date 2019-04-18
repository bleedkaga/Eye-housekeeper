import React from 'react';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  //显示行业分类
  displayIndustry() {
    const {industryInfo} = this.props;
    let ret = '';
    if (industryInfo && industryInfo.industry) {
      ret += industryInfo.industry;
      if (industryInfo.subIndustry) {
        ret = `${ret}-${industryInfo.subIndustry}`;
        return ret;
      } else {
        return '';
      }
    }
    return ret;
  }

  render() {
    const {industryInfo = {}} = this.props;
    return (
      <table className={'tab2-table'} >
        <tbody>
          <tr>
            <td className={'tab2-label'}>法人</td>
            <td className={'tab2-content'} title={industryInfo.legalPersonName || '-'}>{industryInfo.legalPersonName || '-'}</td>
            <td className={'tab2-label'}>注册资本</td>
            <td className={'tab2-content'} title={industryInfo.registCapi || '-'}>{industryInfo.registCapi || '-'}</td>
          </tr>
          <tr>
            <td className={'tab2-label'}>公司名称</td>
            <td className={'tab2-content'} title={industryInfo.companyName || '-'}>{ industryInfo.companyName || '-'}</td>
            <td className={'tab2-label'}>注册号</td>
            <td className={'tab2-content'} title={industryInfo.no || '-'}>{ industryInfo.no || '-'}</td>
          </tr>
          <tr>
            <td className={'tab2-label'}>登记机关</td>
            <td className={'tab2-content'} title={industryInfo.belongOrg || '-'}>{industryInfo.belongOrg || '-'}</td>
            <td className={'tab2-label'}>企业状态</td>
            <td className={'tab2-content'} title={industryInfo.status || '-'}>{industryInfo.status || '-'}</td>
          </tr>
          <tr>
            <td className={'tab2-label'}>成立日期</td>
            <td className={'tab2-content'} title={industryInfo.startDate || '-'}>{industryInfo.startDate || '-'}</td>
            <td className={'tab2-label'}>组织机构代码</td>
            <td className={'tab2-content'} title={industryInfo.orgNo || '-'}>{industryInfo.orgNo || '-'}</td>
          </tr>
          <tr>
            <td className={'tab2-label'}>社会统一信用代码</td>
            <td className={'tab2-content'} title={industryInfo.creditCode || '-'}>{industryInfo.creditCode || '-'}</td>
            <td className={'tab2-label'}>行业分类</td>
            <td className={'tab2-content'} title={this.displayIndustry() || '-'} >{this.displayIndustry() || '-'}</td>
          </tr>
          <tr>
            <td className={'tab2-label'}>企业类型</td>
            <td className={'tab2-content'} title={industryInfo.econKind || '-'}>{industryInfo.econKind || '-'}</td>
            <td className={'tab2-label'}>营业期限</td>
            <td className={'tab2-content'} title={industryInfo.teamEnd || '-'}>{industryInfo.teamEnd || '-'}</td>
          </tr>
          <tr>
            <td className={'tab2-label'}>发照日期</td>
            <td className={'tab2-content'} title={industryInfo.checkDate || '-'}>{industryInfo.checkDate || '-'}</td>
            <td className={'tab2-label'}>经营范围</td>
            <td className={'tab2-content'} title={industryInfo.scope || '-'}>{industryInfo.scope || '-'}</td>
          </tr>
          <tr>
            <td className={'tab2-label'}>地址</td>
            <td className={'tab2-content'} title={industryInfo.address || '-'}>{industryInfo.address || '-'}</td>
            <td className={'tab2-label'}>联系邮箱</td>
            <td className={'tab2-content'} title={industryInfo.email || '-'}>{industryInfo.email || '-'}</td>
          </tr>
          <tr>
            <td className={'tab2-label'}>联系电话</td>
            <td className={'tab2-content'} title={industryInfo.phoneNumber || '-'}>{industryInfo.phoneNumber || '-'}</td>
            <td className={'tab2-label'}>网站地址</td>
            <td className={'tab2-content'} title={industryInfo.websiteUrl || '-'}>{ industryInfo.websiteUrl || '-'}</td>
          </tr>

          <tr>
            <td className={'tab2-label'}>网站名称</td>
            <td className={'tab2-content'} title={industryInfo.websiteName || ''}>{industryInfo.websiteName || '-'}</td>
            <td className={'tab2-label'} />
            <td className={'tab2-content'} />
          </tr>

        </tbody>
      </table>

    );
  }
}


export default Class;
