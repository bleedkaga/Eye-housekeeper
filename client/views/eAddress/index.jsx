import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Alert, Spin} from 'antd';

import {GContainer, GHeader, GPage} from 'client/components/GLayout';

import './style.less';
import ReceiveEditable from './ReceivceEditable';
import ReceiveStatic from './ReceiveStatic';

// Components

class Class extends React.Component {
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const {dispatch, global} = this.props;
    const companyGroupId = window.__themeKey === 'org' ? global.account.companyId : global.account.groupId; //ok

    dispatch({
      type: 'eaddress/queryRecipientInfo',
      payload: {
        companyId: companyGroupId, //ok
      },
      callback: (res) => {
        if (!res.data.recipientProvince) {
          const {recipientProvince, recipientCity, recipientArea} = res.data;
          dispatch({
            type: 'dict/findPCAS',
            payload: {
              selectedOptions: [{value: recipientProvince}, {value: recipientCity}, {value: recipientArea}],
            },
          });
        } else {
          dispatch({
            type: 'dict/findPCAS',
            payload: {
              selectedOptions: [],
            },
          });
        }
      },
    });
  };

  render() {
    const {eaddress} = this.props;
    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '邮寄地址', path: ''},
        ]}
      />
      <div className={cn('baseinfo-container')}>
        <GPage top={18} bottom={88}>
          {
            <Spin delay={100} spinning={eaddress.isLoad}>
              <div className={'invoices-info'}>
                <div className={cn('alert-wrapper')}>
                  <Alert message="温馨提示：请及时维护最新的邮寄地址，以保证您能及时收到相应票据" type="warning"/>
                </div>
                {
                  eaddress.edit ? <ReceiveEditable save={this.getData}/> : <ReceiveStatic/>
                }
              </div>
            </Spin>
          }
        </GPage>

      </div>

    </GContainer>);
  }
}


export default connect(state => state)(hot(module)(Class));
