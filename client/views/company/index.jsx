import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Tabs, message} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import './style.less';
import Tab1 from './tab1';
import Tab2 from './tab2';
import Tab3 from './tab3';

const TabPane = Tabs.TabPane;

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {dispatch, global} = this.props;
    const queue = [];
    const un = message.loading('加载中...', 15);

    //获取单位信息
    queue.push(dispatch({
      type: 'company/getCompanyByIdDetail',
      payload: {companyId: global.account.companyId}, //ok
    }));
    //获取工商
    //获取一级字典
    queue.push(dispatch({type: 'dict/find', payload: {dict_codes: ['unitType', 'industry', 'unitNatureCode']}}));

    Promise.all(queue).then(() => {
      un();
      this.onNext();
    });
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'company/set', payload: {edit: false}});
  }

  onNext() {
    const {company: {allCompanyData: {company = {}}}, dispatch} = this.props;

    //单位信息
    //二级字典
    dispatch({
      type: 'dict/findNext',
      payload: {
        dict_code: 'industry',
        selectedOptions: [company.socialTypeOne, company.socialType], //selectedOptions 中的项可以为对象
        tierType: 'value', //tierType selectedOptions 值对应的键 默认为value
      },
    });

    //获取省市区 需要获取街道 加上street=true, 默认false不启用
    //selectedOptions 如果是个空数组则就请求省以此类推
    dispatch({
      type: 'dict/findPCAS',
      payload: {
        selectedOptions: [company.province, company.city, company.area],
      },
    });
  }

  render() {
    const {company} = this.props;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '单位信息'},
        ]}
      />
      <GPage className={'company-container'}>
        <Tabs defaultActiveKey="1" className={'tab-box'}>
          <TabPane tab="基本资料" key="1">
            <Tab1 />
          </TabPane>
          <TabPane tab="工商信息" key="2">
            <Tab2 industryInfo={company.allCompanyData.gsCompanyIndustry}/>
          </TabPane>
          <TabPane tab="税务登记信息" key="3">
            <Tab3 />
          </TabPane>
        </Tabs>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
