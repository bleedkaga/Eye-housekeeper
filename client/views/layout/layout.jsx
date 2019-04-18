import React from 'react';
import {connect} from 'dva';
import {withRouter} from 'dva/router';
import cn from 'classnames';
import {Layout, Menu, Icon, Modal, LocaleProvider, Button, Dropdown, message, notification} from 'antd';
import {matchRoutes} from 'react-router-config';
import {routes, getIndexRoute} from 'client/router';
import Tools from 'client/utils/tools';
import Weight from 'client/utils/weight';
import Config from 'client/config';
import BIconfont from 'client/components/BIconfont';
import RH from 'client/routeHelper';
import ThemeConfig from 'client/themes/theme';

//I18N
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import './layout.less';

const {Header, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const {routeType} = Config;

class Class extends React.Component {
  constructor(props) {
    super(props);


    this.unlisten = props.history.listen((location) => {
      const ptk = Tools.getTypeByPath(location.pathname).key;

      if (!this.isWeight(location)) {
        message.warn('权限不足');
        //权限不足 回到到首页
        return RH(null, window.__themeKey, `/${window.__themeKey}/dashboard`);
      }

      if (location.pathname !== this.state.location.pathname) {
        this.updateParams(location);
      }
      if (window.__themeKey !== ptk) {
        this.setThemes(ptk);
      }
    });

    //首次主题判断
    const tk = Tools.getTypeByPath(props.location.pathname).key;
    this.state = {
      themeKey: tk,
      location: props.location,
    };

    this.setThemes(tk, true);

    this.verifyGroup(tk, props.location);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
    this.onScroll();
    const {location} = this.props;
    if (!this.isWeight(location)) {
      message.warn('权限不足');
      //权限不足 回到到首页
      return RH(null, window.__themeKey, `/${window.__themeKey}/dashboard`);
    }
    this.updateParams(location);
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
    window.removeEventListener('scroll', this.onScroll, false);
  }

  getGroupId() {
    const {global} = this.props;
    return global.account.groupId || window.__USER__.groupId; //ok
  }

  verifyGroup(key, location) {
    if (key === 'union' && location.pathname !== '/union/registerUnion' && !this.getGroupId()) {
      notification.error({
        className: 'gsg-notification-error',
        duration: 1.5,
        message: '未查询到工会信息，即将跳转到填写工会信息页面',
      });
      //没有工会ID
      setTimeout(() => {
        RH(null, 'unionInfo', '/union/registerUnion');
      }, 1000);
    }
  }

  isWeight(location) {
    const id = Weight.match(location.pathname);
    return Weight.isWeight(id);
  }

  onScroll = () => {
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    const e0 = document.querySelectorAll('.ant-affix');
    const e1 = document.querySelectorAll('.fixed-elem');
    this.setElement(e0, scrollLeft);
    this.setElement(e1, scrollLeft);
  };

  setElement(arr, left) {
    if (!arr) return false;
    for (let i = 0; i < arr.length; i++) {
      const elem = arr[i];
      const lt = parseInt(elem.style.left, 10) || 0;
      let __temp = 0;
      if (elem.__temp === undefined) {
        __temp = lt;
        elem.__temp = lt;
        elem.__old_temp = lt;
      } else {
        __temp = elem.__temp;
      }

      if (left === 0) {
        __temp = elem.__old_temp;
        elem.__temp = undefined;
      }
      elem.style.left = `${__temp - left}px`;
    }
  }

  updateParams(location) {
    const item = this.findRouter(location.pathname);

    const selectedKeys = [item.key || item.path];

    const openKeys = [];

    this.setOpenKey(openKeys, item);

    this.setState({
      selectedKeys,
      // openKeys: this.uniqueArr(openKeys.concat(this.state.openKeys)),
      openKeys: this.uniqueArr(openKeys),
      location,
    });
  }

  setOpenKey(openKeys, item) {
    openKeys.push(item.key || item.path);
    if (item.parent) {
      this.setOpenKey(openKeys, item.parent);
    }
  }

  setThemes(t, isInit) {
    const {dispatch} = this.props;
    window.__themeKey = t;
    if (t === 'org') {
      document.body.className = `gsg-theme ${routeType.org.theme}`;
    } else {
      document.body.className = `gsg-theme ${routeType.union.theme}`;
    }
    isInit ? (this.state.themeKey = t) : this.setState({themeKey: t});
    dispatch({type: 'global/set', payload: {themeKey: t}});
    // this.forceUpdate();
    setTimeout(() => {
      window.less.modifyVars(ThemeConfig[t]);
    }, 16);
  }

  findRouter(pathname) {
    const rel = matchRoutes(routes, pathname);
    const item = rel[rel.length - 1];
    const r = item.route;
    if (r.title) return r;
    return this._getValidParent(r);
  }

  _getValidParent(r) {
    if (r.parent) {
      if (r.parent.title) return r.parent;
      else return this._getValidParent(r.parent);
    } else {
      return getIndexRoute();
    }
  }

  uniqueArr(array) {
    const n = [];
    for (let i = 0; i < array.length; i++) {
      if (n.indexOf(array[i]) === -1) n.push(array[i]);
    }
    return n;
  }

  getMenuItem(item) {
    if (this.verifyMenuShow(item.routes)) {
      return (
        <SubMenu
          key={item.key || item.path}
          title={<span>{typeof item.icon === 'string' ?
            <Icon type={item.icon || 'setting'}/> : item.icon}<span>{item.title}</span></span>}
        >
          {
            item.routes.map((rItem) => {
              if (rItem.routes && this.verifyMenu(rItem.routes)) {
                return this.getMenuItem(rItem);
              } else {
                return rItem.title && rItem.menuShow ?
                  <Menu.Item
                    key={rItem.key || rItem.path}
                    item={rItem}
                  >
                    {rItem.title}
                  </Menu.Item> : null;
              }
            })
          }
        </SubMenu>
      );
    } else {
      return null;
    }
  }

  verifyMenu(rs) {
    const o = rs.find(item => !!item.title);
    return !!o;
  }

  verifyMenuShow(rs) {
    const o = rs.find(item => item.title && item.menuShow !== false);
    return !!o;
  }

  _logout = () => {
    Modal.confirm({
      title: '确认退出系统吗?',
      onOk: () => {
        Tools.logout();
      },
    });
  };

  getDropdownMenu() {
    const {global, dispatch, location} = this.props;
    return (
      <Menu>
        {
          global.companies.map((item, index) => (
            <Menu.Item
              key={`dm-${index}`}
              className={cn('companies-menu-item', 'f-toe')}
              onClick={() => {
                if (item.companyId !== global.account.companyId) { //ok
                  this.setState({openKeys: []});
                  const un = message.loading('切换中...', 15);
                  Tools.resetAllModel(this.props).then(() => {
                    dispatch({
                      type: 'login/loginChoose',
                      payload: {
                        id: item.id,
                        loadingMsg: '切换中...',
                      },
                      callback: (res) => {
                        un();
                        if (res.code === 0) {
                          if (location.pathname === '/org/dashboard' || location.pathname === '/union/dashboard') {
                            dispatch({type: 'global/checkIfThePayrollIsOpen'});
                            dispatch({type: 'dashboard/change'});
                          } else {
                            RH(null, window.__themeKey, `/${window.__themeKey}/dashboard`);
                          }
                        } else {
                          message.error('切换失败', 15);
                        }
                      },
                    });
                  }).catch(() => {
                    un();
                    message.error('切换失败', 15);
                  });
                }
              }}
            >
              <span>{item.companyName}</span>
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }

  getSettingMenu() {
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            RH(null, 'administrator', `/${window.__themeKey}/administrator`);
          }}
        ><span>管理员设置</span></Menu.Item>
        <Menu.Item
          onClick={() => {
            RH(null, 'pwd', `/${window.__themeKey}/pwd`);
          }}
        ><span>密码设置</span></Menu.Item>
        <Menu.Item
          onClick={() => {
            RH(null, 'addCompanies', `/${window.__themeKey}/addCompanies`);
          }}
        ><span>新增单位</span></Menu.Item>
      </Menu>
    );
  }

  updatePermissions() {
    const {global} = this.props;
    if (global.menuUpdate) {
      global.menuUpdate = false;
      this.getAllRoutes(routes, (item) => {
        if (item.skip || this.getMenuByName(global.menuArray, item.id)) {
          item.menuShow = true;
        } else {
          item.menuShow = false;
        }
      });
    }
  }

  getMenuByName(arr, id) {
    if (id === undefined) return false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        return arr[i];
      } else if (Array.isArray(arr[i].child)) {
        const o = this.getMenuByName(arr[i].child, id);
        if (o) return o;
      } else if (Array.isArray(arr[i].childMenu)) {
        const o = this.getMenuByName(arr[i].childMenu, id);
        if (o) return o;
      }
    }
  }

  getAllRoutes(arr, cb) {
    arr.forEach((item) => {
      cb && cb(item);
      if (Array.isArray(item.routes)) {
        this.getAllRoutes(item.routes, cb);
      }
    });
  }

  onMenuItemOnClick = ({item}) => {
    const {history} = this.props;
    const o = item.props.item;
    if (!o.extraJudge || o.extraJudge(this.props, o)) {
      RH(history, o.value || '', o.path);
    }
  };

  render() {
    const {history, children, global} = this.props;
    const {selectedKeys, openKeys, location, themeKey} = this.state;

    const clone = React.cloneElement(children, {location, history});

    this.updatePermissions();

    return (
      <LocaleProvider locale={zh_CN}>
        <Layout className={cn('layout-container')}>
          <Header className={cn('layout-header', 'f-cb', 'fixed-elem')}>
            <div className={cn('logo', 'f-cb')}>
              <i/>
              {/*<i>麦卡组织易</i>*/}
              <span>钉钉 | 应用服务商</span></div>
            <i className={cn('tag')}/>
            {
              global.companies.length ?
                <Dropdown
                  overlayClassName={'companies-dropdown-box'}
                  className={cn('companies-dropdown', 'f-toe')}
                  overlay={this.getDropdownMenu()}
                  trigger={['click']}
                ><span>{global.account.companyName}&nbsp;<Icon type="down"/></span></Dropdown> :
                <span>{global.account.companyName}</span>
            }

            <Button className={cn('header-btn', 'f-fr')} type={'blue2'} icon={'logout'} onClick={() => this._logout()}>
              退出
            </Button>

            <Dropdown
              overlay={this.getSettingMenu()}
              trigger={['click']}
            >
              <Button className={cn('header-btn', 'f-fr')} type={'blue2'} icon={'setting'}>
                设置
              </Button>
            </Dropdown>

          </Header>
          <Layout className={cn('layout-menu')}>
            <div className={cn('fixed-elem', 'menu-box')}>
              <div className={cn('cut-main', 'f-cb')}>
                <a
                  href={'javascript:;'}
                  className={cn('cut-btn', {active: themeKey === routeType.org.key})}
                  onClick={() => {
                    if (themeKey === routeType.org.key) return false;
                    RH(history, routeType.org.key, routeType.org.url);
                  }}
                >
                  <em className={cn('cut-icon')}><BIconfont type="danweiicon"/></em>
                  <span>单位管理</span>
                </a>
                <a
                  href={'javascript:;'}
                  className={cn('cut-btn', {active: themeKey === routeType.union.key})}
                  onClick={() => {
                    if (themeKey === routeType.union.key) return false;
                    if (global.account.groupId) { //ok
                      RH(history, routeType.union.key, routeType.union.url);
                    } else {
                      RH(history, 'unionInfo', '/union/registerUnion');
                    }
                  }}
                >
                  <i className={cn('cut-icon', 'cut-icon2')}> <BIconfont type="union-admin"/></i>
                  <span>工会管理</span>
                </a>
              </div>
              <div className={cn('layout-sider-main')}>
                <Sider className={cn('layout-sider')} width={167} style={{background: '#fff'}}>
                  <Menu
                    openKeys={openKeys}
                    selectedKeys={selectedKeys}
                    mode="inline"
                    onOpenChange={(e) => {
                      const latestOpenKey = e.find(key => openKeys.indexOf(key) === -1);
                      this.setState({openKeys: latestOpenKey ? [latestOpenKey] : []});
                    }}
                    onClick={this.onMenuItemOnClick}
                  >
                    {
                      themeKey === 'union' && !global.account.groupId ? null : routes.map((item) => { //ok
                        //存在title 和 当前主题下的key一致才显示
                        const currentKey = Tools.getTypeByPath(item.path).key;
                        if (item.title && item.menuShow && themeKey === currentKey) {
                          if (item.routes && this.verifyMenu(item.routes)) {
                            //子菜单
                            return this.getMenuItem(item);
                          } else {
                            return (
                              <Menu.Item
                                key={item.key || item.path}
                                item={item}
                              >
                                {typeof item.icon === 'string' ? <Icon type={item.icon || 'setting'}/> : item.icon}
                                <span>{item.title}</span>
                              </Menu.Item>
                            );
                          }
                        } else {
                          return null;
                        }
                      })
                    }
                  </Menu>
                </Sider>
              </div>
            </div>
            <Layout className={cn('layout-ant-layout')}>
              {clone}
            </Layout>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}

export default connect(s => s)(withRouter(Class));
