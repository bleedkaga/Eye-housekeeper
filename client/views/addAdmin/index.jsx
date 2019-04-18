import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Tabs, Icon, Checkbox, message, Button, Radio} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import RaidoModal from 'client/components/RaidoModal';
import CheckModal from 'client/components/CheckModal';
import GTitle from 'client/components/GTitle';
import {goBack} from 'client/routeHelper';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);
    const {global, match: {params: {id}}, location: {state = {}}} = props;

    const temp = {};

    this.initMenuArray(global.menuArray, temp, true);

    if (state.dept) {
      const deptData = [];
      this.listForEach([state.dept], (item) => {
        deptData.push({departmentName: item.departmentName, id: item.id});
      }, 'children');
      props.dispatch({type: 'addAdmin/set', payload: {deptData}});
    }

    this.state = {
      id,
      active: '1',
      org: temp['0'] || [],
      union: temp['1'] || [],
      pub: temp['-1'] || [],
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const {id, org, union, pub} = this.state;
    const queue = [];
    const un = message.loading('加载中...', 15);
    queue.push(this.getQueryManager(1, undefined));
    queue.push(this.getQueryDepartment(''));

    if (id) {
      queue.push(dispatch({
        type: 'addAdmin/getAccountId',
        payload: {id},
        callback: (res) => {
          if (res.code === 0) {
            const {addAdmin} = this.props;
            const array = [].concat(org).concat(union).concat(pub);
            this.listForEach(array, (item) => {
              if (addAdmin.menuIds.indexOf(item.id) !== -1) {
                item.active = true;
              }
            });
            this.setState({});
          }
        },
      }));
    }
    Promise.all(queue).then(() => un());
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({type: 'addAdmin/reset'});
  }

  // componentWillReceiveProps(){
  // }

  getQueryManager(pageIndex, demtNameOruserName = '') {
    const {dispatch, global, addAdmin} = this.props;
    return dispatch({
      type: 'addAdmin/queryManager',
      payload: {
        companyId: global.account.companyId,
        pageSize: addAdmin.manager.pageSize,
        demtNameOruserName,
        pageIndex,
      },
    });
  }

  getQueryDepartment(demtName = '') {
    const {dispatch, global} = this.props;
    return dispatch({
      type: 'addAdmin/queryDepartment',
      payload: {
        companyGroupId: global.account.companyId, //ok
        demtName,
      },
    });
  }

  initMenuArray(arr, obj, isFirst, father) {
    if (!arr.length) return false;
    arr.forEach((item, index) => {
      const t = Object.assign({}, item);
      if (isFirst) {
        if (!obj[t.isGroupShow]) obj[t.isGroupShow] = [];
        obj[t.isGroupShow].push(t);
        if (Array.isArray(t.child)) {
          t.isChild = true;
          t.child = [...t.child];
          this.initMenuArray(t.child, t.child, false, t);
        }
      } else {
        t.father = father;
        obj[index] = t;
        if (Array.isArray(t.child)) {
          t.isChild = true;
          t.child = [...t.child];
          this.initMenuArray(t.child, t.child, false, t);
        }
      }
    });
  }

  onChangeCheckBox(e, item) {
    const value = e.target.checked;
    //操作子元素
    item.active = value;
    item.indeterminate = false;
    this.checkAllChild(item, value);
    //操作父元素
    this.checkAllFather(item);

    this.setState({});
  }

  checkAllChild(item, type) {
    if (Array.isArray(item.child)) {
      item.child.forEach((o) => {
        o.indeterminate = false;
        o.active = type;
        this.checkAllChild(o, type);
      });
    }
  }

  checkAllFather(item) {
    if (item.father) {
      const father = item.father;
      const rel = this._getFatherStatus(father.child);
      father.active = rel.active;
      father.indeterminate = rel.indeterminate;
      this.checkAllFather(father);
    }
  }

  _getFatherStatus(arr) {
    let activeSize = 0;
    let cancelSize = 0;
    let indeterminateSize = 0;
    const max = arr.length;
    for (let i = 0; i < max; i++) {
      const item = arr[i];
      if (item.active) {
        activeSize++;
      } else if (item.isChild && item.indeterminate) {
        indeterminateSize++;
      } else {
        cancelSize++;
      }
    }

    if (indeterminateSize) {
      //部分
      return {indeterminate: true, active: false};
    } else if (cancelSize === max) {
      //取消
      return {indeterminate: false, active: false};
    } else if (activeSize === max) {
      //选择
      return {indeterminate: false, active: true};
    } else {
      //部分
      return {indeterminate: true, active: false};
    }
  }

  getWeightCheckBox(arr = []) {
    const rel = [];
    arr.forEach((item, index) => {
      rel.push(<div className={cn('temp', {'temp-line': !item.isChild})} key={`id-${item.id}-${index}`}>
        <Checkbox
          indeterminate={item.isChild ? item.indeterminate : false}
          onChange={e => this.onChangeCheckBox(e, item)}
          checked={item.active}
        >
          {item.menuName}
        </Checkbox>
        {
          Array.isArray(item.child) ?
            <div className={cn('checkbox-box')}>{this.getWeightCheckBox(item.child)}</div> : null
        }
      </div>);
    });
    return rel;
  }

  getPeople() {
    const {addAdmin, dispatch} = this.props;
    const {people} = addAdmin;
    if (!people.phone) return null;

    //-${people.companyName || '-'}
    return (
      <div className={cn('result', 'col-center', 'col', 'f-cb')}>
        <div className={cn('item', 'f-toe')}>
          {`${people.realName}-${people.phone}`}
          <Icon
            type={'close'}
            onClick={() => {
              dispatch({
                type: 'addAdmin/setPeople',
                payload: {
                  phone: '',
                  realName: '',
                },
              });
            }}
          />
        </div>
      </div>
    );
  }

  getDepartment() {
    const {addAdmin, dispatch} = this.props;
    const {deptData} = addAdmin;
    if (!deptData || !deptData.length) return null;

    return (
      <div className={cn('result', 'col-center', 'col', 'f-cb')}>
        {
          deptData.map((item, index) => (
            <div className={cn('item', 'f-toe')} key={`department=${item.id}-${index}`}>
              {item.departmentName}
              <Icon
                type={'close'}
                onClick={() => {
                  deptData.splice(index, 1);
                  dispatch({
                    type: 'addAdmin/set',
                    payload: {deptData},
                  });
                }}
              />
            </div>
          ))
        }
      </div>
    );
  }

  getAllWeight() {
    const {org = [], union = [], pub = []} = this.state;
    const array = [].concat(org).concat(union).concat(pub);
    const actives = [];

    this.listForEach(array, (item) => {
      if (item.active || item.indeterminate) actives.push(item.id);
    });

    return actives;
  }

  listForEach(arr, cb, key = 'child') {
    arr.forEach((item) => {
      cb(item);
      if (Array.isArray(item[key])) {
        this.listForEach(item[key], cb, key);
      }
    });
  }

  checkout() {
    const {addAdmin} = this.props;

    if (!addAdmin.people.phone) {
      return false;
    }

    if (addAdmin.scopeControl !== 1 && !addAdmin.deptData.length) {
      return false;
    }

    const actives = this.getAllWeight();
    return actives.length;
  }

  save() {
    const {id} = this.state;
    const {dispatch, addAdmin, global, history} = this.props;
    const actives = this.getAllWeight();

    if (id) {
      //修改
      dispatch({
        type: 'addAdmin/updateAccount',
        payload: {
          id,
          realName: addAdmin.people.realName, // 姓名
          phone: addAdmin.people.phone, //电话
          companyId: global.account.companyId, //ok 单位id
          modifier: `${global.account.accountId}_${global.account.realName}`, //ok 操作人
          scopeControl: addAdmin.scopeControl, //1表示全单位，2表示部门
          deptIds: addAdmin.deptData.map(item => item.id).join(','), //部门ids
          menuIds: actives.join(','), //菜单ids
        },
        callback: () => {
          message.success('修改成功');
          goBack(history);
        },
      });
    } else {
      //新增
      dispatch({
        type: 'addAdmin/insertAccount',
        payload: {
          phone: addAdmin.people.phone, //电话
          companyId: global.account.companyId, // 单位id
          realName: addAdmin.people.realName, // 姓名
          companyName: global.account.companyName, //ok 单位名称
          operationer: `${global.account.accountId}_${global.account.realName}`, //ok 操作人
          scopeControl: addAdmin.scopeControl, //1表示全单位，2表示部门
          deptIds: addAdmin.deptData.map(item => item.id).join(','), //部门ids
          menuIds: actives.join(','), //菜单ids
        },
        callback: () => {
          message.success('添加成功');
          goBack(history);
        },
      });
    }
  }

  render() {
    const {org, union, pub, id} = this.state;
    const {addAdmin, global, dispatch, history} = this.props;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {
            name: '管理员设置',
            key: 'administrator',
            path: `/${window.__themeKey}/administrator`,
            options: {state: {__back: true}},
          },
          {name: '新增管理员'},
        ]}
      />
      <GPage className={cn('addAdmin')}>
        <GTitle>{id ? '修改管理员' : '新增管理员'}</GTitle>
        <div className={cn('addAdmin-content')}>
          <div className={cn('row', 'row-title')}>
            <div className={cn('label', 'col-center')}>管理员：</div>
            <div className={cn('info', 'col-center', 'col')}>
              <a
                href="javascript:"
                onClick={() => {
                  this.getQueryManager(1);
                  this._rm.onReset();
                  this._rm.onShow();
                }}
              >{addAdmin.people && addAdmin.people.phone ? '更换选择' : '点击选择'}</a>
            </div>
          </div>
          <div className={cn('row', 'row-title')}>
            <div className={cn('label', 'col-center')}>&nbsp;</div>
            {this.getPeople()}
          </div>

          <div className={cn('row', 'row-title')}>
            <div className={cn('label', 'col-center')}>管理范围：</div>
            <div className={cn('info', 'col-center', 'col')}>
              <Radio.Group
                value={addAdmin.scopeControl}
                onChange={(e) => {
                  dispatch({
                    type: 'addAdmin/set',
                    payload: {
                      scopeControl: e.target.value,
                    },
                  });
                }}
              >
                {global.account.isMaster === 1 ? <Radio value={1}>全单位</Radio> : null}
                <Radio value={2}>指定部门</Radio>
              </Radio.Group>
              {
                addAdmin.scopeControl === 2 ? <a
                  href="javascript:"
                  onClick={() => {
                    this.getQueryDepartment('');
                    this._cm.onReset();
                    this._cm.onShow();
                  }}
                >选择部门</a> : null
              }
            </div>
          </div>
          <div className={cn('row', 'row-title')}>
            <div className={cn('label', 'col-center')}>&nbsp;</div>
            {addAdmin.scopeControl === 2 ? this.getDepartment() : null}
          </div>

          <div className={cn('row', 'row-title')}>
            <div className={cn('label', 'col-top')} style={{marginTop: '16px'}}>设置权限：</div>
            <div className={cn('info', 'col-top', 'col')}>
              <Tabs
                animated={false}
                activeKey={this.state.active}
                onChange={(key) => {
                  this.setState({active: key});
                }}
              >
                <Tabs.TabPane tab={'单位管理'} key="1">
                  <div className={cn('checkbox-main')}>
                    <div className={cn('checkbox-box')}>
                      {this.getWeightCheckBox(org)}
                    </div>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab={'工会管理'} key="2">
                  <div className={cn('checkbox-main')}>
                    <div className={cn('checkbox-box')}>
                      {this.getWeightCheckBox(union)}
                    </div>
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>

          <div className={cn('row', 'row-title')} style={{marginTop: '30px'}}>
            <div className={cn('label', 'col-top')} style={{marginTop: '6px'}}>系统管理：</div>
            <div className={cn('info', 'col-top', 'col')}>
              <div className={cn('checkbox-main')}>
                <div className={cn('checkbox-box')}>
                  {this.getWeightCheckBox(pub)}
                </div>
              </div>
            </div>
          </div>

          <div className={cn('addAdmin-btns')}>
            <Button
              disabled={!this.checkout()}
              loading={addAdmin.isLoad}
              type={'primary'}
              onClick={() => {
                this.save();
              }}
            >确定</Button>
            <Button onClick={() => goBack(history)}>取消</Button>
          </div>
        </div>
      </GPage>
      <RaidoModal
        ref={e => (this._rm = e)}
        show={false}
        placeholder={'输入姓名、部门名称'}
        list={addAdmin.manager.list}
        total={addAdmin.manager.total}
        value={{userName: addAdmin.people.realName, mobilePhone: addAdmin.people.phone}}
        onSearch={(pageIndex, demtNameOruserName) => {
          this.getQueryManager(pageIndex, demtNameOruserName);
        }}
        onOk={(data) => {
          dispatch({
            type: 'addAdmin/setPeople',
            payload: {
              phone: data.mobilePhone,
              realName: data.userName,
            },
          });
        }}
      />
      <CheckModal
        multiple
        ref={e => (this._cm = e)}
        show={false}
        departmentName={global.account.companyName}
        placeholder={'输入部门名称'}
        list={addAdmin.department.list}
        checked={addAdmin.deptData}
        onSearch={(name) => {
          this.getQueryDepartment(name);
        }}
        onOk={(data = []) => {
          dispatch({
            type: 'addAdmin/set',
            payload: {
              deptData: data.map(item => ({id: item.id, departmentName: item.departmentName})),
            },
          });
        }}
      />
    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
