import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Tabs, message} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout/index';
import RH, {goBack} from 'client/routeHelper';
import GTitle from 'client/components/GTitle';

import Tab1 from './tab1';
import Tab2 from './tab2';
import Tab3 from './tab3';
import Tab4 from './tab4';

import './style.less';

const TabPane = Tabs.TabPane;

class Class extends React.Component {
  constructor(props) {
    super(props);
    const {match: {params: {id}}, location: {state}} = props;
    this.state = {
      id,
      name: state && state.name ? state.name : '',
    };
  }

  componentDidMount() {
    const {dispatch, global} = this.props;
    const {id} = this.state;
    const queue = [];
    const un = message.loading('加载中...', 15);
    queue.push(dispatch({
      type: 'addStaff/findFirstValListNoAll',
      payload: {
        dict_codes: 'idType,employmentnature,gender,marryStatus,censusRegisterType,nationality,educationalLevel,' +
        'politicalStatus,bloodType,partyMembers,laborModel,unionMembers,youthLeagueMembers,womenFederation,moreIdentities',
      },
    }));
    queue.push(dispatch({
      type: 'addStaff/queryDepartment',
      payload: {
        companyGroupId: global.account.companyId, //ok
      },
    }));

    if (id) {
      //编辑
      queue.push(dispatch({
        type: 'addStaff/queryUserInfo',
        payload: {
          id,
        },
      }));
    }

    Promise.all(queue).then(() => un());
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'addStaff/reset'});
  }

  // componentWillReceiveProps(){
  // }

  onNext = () => {
    const {history, dispatch, global, addStaff} = this.props;
    const {id} = this.state;
    if (id) {
      //修改
      dispatch({
        type: 'addStaff/updateUserInfo',

        payload: {
          id,
          companyId: global.account.companyId, //ok
          operationName: global.account.realName, //ok
          operationId: global.account.accountId, //ok
          membershipCard: 1,
          ...addStaff.tab1,
          ...addStaff.tab2,
          ...addStaff.tab3,
          ...addStaff.tab4,
        },
        callback: (res) => {
          if (res.code === 0) {
            message.success('修改成功');
            // goBack(history);
            RH(history, 'staff', `/${window.__themeKey}/hr/staff`);
          }
        },
      });
    } else {
      //新增
      dispatch({
        type: 'addStaff/addUser',
        payload: {
          companyId: global.account.companyId, //ok
          operationName: global.account.realName, //ok
          operationId: global.account.accountId, //ok
          membershipCard: 1,
          ...addStaff.tab1,
          ...addStaff.tab2,
          ...addStaff.tab3,
          ...addStaff.tab4,
          userName: addStaff.tab1.userName.split(' ').join(''),

        },
        callback: (res) => {
          if (res.code === 0) {
            message.success('添加成功');
            // goBack(history);
            RH(history, 'staff', `/${window.__themeKey}/hr/staff`);
          }
        },
      });
    }
  };

  render() {
    const {id, name} = this.state;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          window.__themeKey === 'org' ? {name: '电子档案', path: '/org/hr/staff'} : {name: '会员管理', path: '/union/unionStaff'},
          {name: id ? '查看资料' : '新增成员'},
        ]}
      />

      <GPage className={'add-staff'} style={{padding: 0, paddingBottom: 30}}>

        <GTitle>{id ? `${name}的资料` : '新增成员'}</GTitle>

        <Tabs defaultActiveKey="1" className={'tabBox'}>
          <TabPane tab="基本资料" key="1">
            <Tab1 {...this.props} id={id} next={this.onNext}/>
          </TabPane>
          <TabPane tab="工作资料" key="2">
            <Tab2 {...this.props} id={id} next={this.onNext}/>
          </TabPane>
          <TabPane tab="补充资料" key="3">
            <Tab3 {...this.props} id={id} next={this.onNext}/>
          </TabPane>
          <TabPane tab="身份标识" key="4">
            <Tab4 {...this.props} id={id} next={this.onNext}/>
          </TabPane>
        </Tabs>
      </GPage>
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
