import React from 'react';
import {withRouter} from 'dva/router';
import cn from 'classnames';
import RH from 'client/routeHelper';

import './style.less';

const LoginLayout = props => (
  <div className={cn('login-layout-wrap')}>
    <div className={cn('login-layout-main', 'bg_cover', props.className)} style={props.styles}>
      <div className={cn('login-layout-box')}>
        <button
          className={cn('login-layout-reg')}
          onClick={() => {
            RH(props.history, 'register', '/register');
          }}
        >注册
        </button>
        <div className={cn('login-layout-content')}>
          {props.children}
        </div>
      </div>
    </div>

    <div className={cn('login-layout-bottom')}>
      {
        props.noneOrg ? null : <div className={cn('login-layout-org')}>
          <div className={cn('login-layout-org-wrap')}>
            <div className={cn('org-box1')}>

              <div className={cn('org-head-title')}>主办单位：</div>

              <div className={cn('row')}>
                <div className={cn('col-center', 'col-30')}><i className={cn('i0')}/>重庆市西南中小企业创业服务中心</div>
                <div className={cn('col-center', 'col-30')}><i className={cn('i2')}/>重庆市中小企业创业服务协会</div>
                <div className={cn('col-center', 'col-30')}><i className={cn('i1')}/>重庆市促进中小企业融资服务中心</div>

              </div>

            </div>
            <div className={cn('org-box2')}>

              <div className={cn('org-head-title')}>协办单位：</div>

              <div className={cn('row')}>
                <div className={cn('col-center', 'col-60')}><i className={cn('i3')}/>阿里巴巴钉钉智能移动办公平台</div>
                <div className={cn('col-center', 'col-50')}><i className={cn('i5')}/>重庆固守大数据有限公司</div>
              </div>
            </div>
          </div>
        </div>
      }
      <div className={cn('login-layout-other')}>
        <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010802002650"
          target={'_blank'}
          className={cn('login-layout-ba')}
        ><i/><span>渝公网安备50010802002650号</span></a>
        <a
          href="http://www.miitbeian.gov.cn"
          target={'_blank'}
          className={cn('login-layout-gs')}
        ><i/><span>渝ICP备18008058号 -2</span></a>
      </div>
    </div>

  </div>


);

export default withRouter(LoginLayout);
