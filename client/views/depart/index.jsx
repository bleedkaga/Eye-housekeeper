import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import { Row, Col, Button, Divider, Tree, Input, Spin, Popconfirm, message, Modal, Select} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import CheckModal from 'client/components/CheckModal';
// import RH, {goBack} from '../../routeHelper';
// import Tools from 'client/utils/tools';
import RH from 'client/routeHelper';

import './style.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const Option = Select.Option;

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      perDepartInformation: undefined, // 存储每一项点击后生成的信息
      editDepart: false, //是否编辑部门名字
      newDepartName: '', // 输入的新的部门名字
      modalVisible: false, //增加部门模态框是否显示
      addDepartName: '', //新增子部门的名字
      addDepartparenetId: '0', //新增部门名称的父级id
      defaultSeleValue: '0', //下拉菜单的默认值
      adjustSort: false, //调整排序
      isAdjustSort: false, //是否点击过调整排序的按钮
      adjustArr: [], //调整排序后生成的新数组
      moveDepartOrEditUpdepart: true, //转移员工或者修改上级部门
      showBlue: '0', //控制树显示的某一条数据
      showLoading: false, //点击时候控制加载样式
      addDepartNameWarn: '', //添加重复部门名称的警告语
    };
  }

  componentDidMount() {
    const {dispatch, depart} = this.props;
    const o = {...depart.condition};
    if (JSON.stringify(o) === '{}') {
      dispatch({
        type: 'depart/queryDepartment',
      });
      dispatch({
        type: 'depart/queryAdministrator',
        payload: {
          departmentCode: '',
          __autoLoading: true,
        },
      });
    } else {
      this.setState({
        perDepartInformation: o.perDepartInformation,
        showBlue: o.showBlue,
      });
      dispatch({
        type: 'depart/set',
        payload: {
          departments: o.departments,
        },
      });
      dispatch({
        type: 'depart/queryAdministrator',
        payload: {
          departmentCode: o.perDepartInformation === undefined ? '' : o.perDepartInformation.id === '0' ? '' : o.perDepartInformation.id,
          __autoLoading: true,
        },
      });
    }
  }

  componentWillUnmount() {
  }

  treeNodeTitle = (isRoot, item, isFirstLevel) =>
    //树结构每一项的title
    (
      <div className={isRoot ? 'first-Name' : 'child-Name'}>
        <div>
          <div>
            <span className={isFirstLevel ? '' : ''}>
              {item.departmentName}
            </span>
            <span>
              {/*没有组织结构的话 累加上来的就是underfind所以要这么判断*/}
              [{item.staffNumber === undefined ? 0 : item.staffNumber}]
            </span>
          </div>
        </div>
      </div>
    );

  genTree = () => {
    // 生成左边的树结构
    const {depart} = this.props;
    const departMent = depart.departments;
    const treeNode = (data) => {
      if (data !== undefined && data.length !== 0) {
        return data.map((item) => {
          if (item.children && item.children.length > 0) {
            return (
              <TreeNode
                name={JSON.stringify(item)}
                className="depart-tree-node"
                title={this.treeNodeTitle(item.level === 0, item, item.level === 1)}
                key={item.id.toString()}
              >
                {treeNode(item.children)}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              name={JSON.stringify(item)}
              className="depart-tree-node"
              title={this.treeNodeTitle(item.level === 0, item, item.level === 1)}
              key={item.id.toString()}
            />
          );
        });
      }
    };
    return treeNode(departMent);
  };

  cancelAdministrator = (administrator) => {
    //取消管理员
    const {dispatch} = this.props;
    if (this.state.perDepartInformation !== undefined) {
      dispatch({
        type: 'depart/deleteDepartmentAdministrator',
        payload: {
          deptId: this.state.perDepartInformation.id,
          id: administrator.id,
          __autoLoading: true,
        },
      }).then((res) => {
        if (res.code === 0) {
          dispatch({
            type: 'depart/queryAdministrator',
            payload: {
              departmentCode: this.state.perDepartInformation.id,
              __autoLoading: true,
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'depart/deleteAccountById',
        payload: {id: administrator.id},
      }).then((res) => {
        if (res.code === 0) {
          dispatch({
            type: 'depart/queryAdministrator',
            payload: {
              departmentCode: '',
              __autoLoading: true,
            },
          });
        }
      });
    }
  };

  getQueryDepartment(demtName = '') {
    const {dispatch, global} = this.props;
    return dispatch({
      type: 'depart/queryDepartment',
      payload: {
        companyGroupId: global.account.companyId, //ok
        demtName,
      },
    });
  }

  perAdministrator = () => {
    // 管理员每一项的展示
    const {depart} = this.props;
    if (depart.Administrator.length !== 0) {
      return depart.Administrator.map(item => (
        <div key={item.id} className={cn('show-admin')}>
          <span>{item.realName}</span>
          {item.isMaster === 1 ? <span className={cn('cancel-admin')}>超级管理员</span> : <Popconfirm onConfirm={() => this.cancelAdministrator(item)} placement="left" title="确定要取消管理员吗" okText="确定" cancelText="取消">
            <span className={cn('cancel-admin')} style={{color: 'rgba(153,153,153,1)'}}>取消管理员</span>
          </Popconfirm>}
        </div>
      ));
    }
  };

  downSort = (childrenArr, data, isFirstLoading) => {
    // 调整排序下移
    this.setState({
      isAdjustSort: true,
    });
    const {depart, dispatch} = this.props;
    const i = data.sortNum;
    childrenArr[i].sortNum += 1;
    childrenArr[i + 1].sortNum -= 1;
    const neWchildrenArr = childrenArr.sort((obj1, obj2) => {
      const val1 = obj1.sortNum;
      const val2 = obj2.sortNum;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    });
    this.setState({
      adjustArr: neWchildrenArr,
    });
    if (isFirstLoading) {
      const totalDataArr = depart.departments;
      totalDataArr[0].children = neWchildrenArr;
      dispatch({
        type: 'depart/set',
        payload: {
          departments: totalDataArr,
        },
      });
    } else {
      const perDataArr = this.state.perDepartInformation;
      perDataArr.children = neWchildrenArr;
      this.setState({
        perDepartInformation: perDataArr,
      });
    }
  };

  upSort = (childrenArr, data, isFirstLoading) => {
    // 调整排序上移
    this.setState({
      isAdjustSort: true,
    });
    const {depart, dispatch} = this.props;
    const i = data.sortNum;
    childrenArr[i].sortNum -= 1;
    childrenArr[i - 1].sortNum += 1;
    const neWchildrenArr = childrenArr.sort((obj1, obj2) => {
      const val1 = obj1.sortNum;
      const val2 = obj2.sortNum;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    });
    this.setState({
      adjustArr: neWchildrenArr,
    });
    if (isFirstLoading) {
      const totalDataArr = depart.departments;
      totalDataArr[0].children = neWchildrenArr;
      dispatch({
        type: 'depart/set',
        payload: {
          departments: totalDataArr,
        },
      });
    } else {
      const perDataArr = this.state.perDepartInformation;
      perDataArr.children = neWchildrenArr;
      this.setState({
        perDepartInformation: perDataArr,
      });
    }
  };

  adjustOk = (id) => {
    //完成调整排序
    const {dispatch} = this.props;
    if (this.state.isAdjustSort) {
      const newAdjustArr = [];
      this.state.adjustArr.map((item) => {
        newAdjustArr.push({ deptId: item.id, sortDept: item.sortNum});
        return 1;
      });
      dispatch({
        type: 'depart/editDepartmentSort',
        payload: {
          sortJsonData: JSON.stringify(newAdjustArr),
          parentId: id,
          __autoLoading: true,
        },
      }).then((res) => {
        if (res.code === 0) {
          message.success('调整排序成功');
        }
      });
    }
    this.setState({
      adjustSort: false,
      isAdjustSort: false,
    });
  };

  lookDetail = (data) => {
    const {dispatch} = this.props;
    this.setState({
      showBlue: data.id.toString(),
      perDepartInformation: data,
    });
    dispatch({
      type: 'depart/queryLowerAndUpperDepartments',
      payload: {
        departmentId: data.id,
      },
    });
    dispatch({
      type: 'depart/queryAdministrator',
      payload: {
        departmentCode: data.id === '0' ? '' : data.id,
      },
    });
  };

  lowerDepart = (TreeInformation, isFirstLoading) => {
    // 下级部门
    if (TreeInformation.children !== null && TreeInformation.children) {
      let i = 0;
      TreeInformation.children.forEach((itemData) => {
        itemData.sortNum = i;
        i++;
      });
      return TreeInformation.children.map(item => (
        <div key={item.id} className={cn('lower-name')}>
          <span>{item.departmentName}</span>
          <span onClick={() => this.lookDetail(item)} className={cn('float-right', 'next-depart')}>查看</span>
          {this.state.adjustSort ? <span>
            {item.sortNum === (i - 1) ? '' : <i onClick={() => this.downSort(TreeInformation.children, item, isFirstLoading)} className={cn('down-arr')}/> }
            {item.sortNum === 0 ? '' : <i onClick={() => this.upSort(TreeInformation.children, item, isFirstLoading)} className={cn('up-arr')}/>}
          </span> : ''}
        </div>
      ));
    }
  };

  upDepart = () => {
    //上级部门
    const {depart} = this.props;
    if (depart.LowerAndUpperDepartments !== undefined) {
      return (
        <div className={cn('per-updepart')}>
          <span>
            {depart.LowerAndUpperDepartments.higherOffice !== undefined ? depart.LowerAndUpperDepartments.higherOffice.departmentName : '顶级'}
          </span>
          <span
            onClick={() => {
              this.setState({moveDepartOrEditUpdepart: false});
              this.getQueryDepartment('');
              this._cm.onReset();
              this._cm.onShow();
            }}
            className={cn('float-right', 'edit-updepart')}
          >
            修改
          </span>
        </div>
      );
    }
  };

  editDepartInput = (e) => {
    // 更改部门的名称
    this.setState({
      newDepartName: e.target.value,
    });
  };

  editDepartName = (perTreeInformation) => {
    const {dispatch, depart} = this.props;
    let isRepeat = false;
    const departNameArr = [];
    const mapDepartName = (child) => {
      child.map((item) => {
        departNameArr.push(item.departmentName);
        if (item.children !== null) {
          mapDepartName(item.children);
        }
        return false;
      });
    };
    mapDepartName(depart.departments);
    departNameArr.map((item) => {
      if (this.state.newDepartName === item) {
        message.error('部门名称已存在，请重新输入');
        isRepeat = true;
      }
      return false;
    });
    // 如果名字有重复 就跳出这个函数
    if (isRepeat) {
      return false;
    }
    //更改部门名字
    if (this.state.newDepartName === '') {
      this.setState({
        editDepart: false,
      });
    } else {
      dispatch({
        type: 'depart/updateDepartment',
        payload: {
          id: perTreeInformation.id,
          departmentName: this.state.newDepartName,
          parentId: perTreeInformation.parentId,
        },
      }).then((res) => {
        if (res.code === 0) {
          message.success('修改部门名称成功');
          const newperDepartInformation = this.state.perDepartInformation;
          newperDepartInformation.departmentName = this.state.newDepartName;
          this.setState({
            perDepartInformation: newperDepartInformation,
            newDepartName: '',
          });
        } else {
          message.error('修改部门名称失败');
        }
      });
      this.setState({
        editDepart: false,
      });
    }
  };

  delectDepart = (perTreeInformation) => {
    // 删除部门
    const {dispatch} = this.props;
    dispatch({
      type: 'depart/delDepartment',
      payload: {
        departmentId: perTreeInformation.id,
        __autoLoading: true,
      },
    }).then((res) => {
      if (res.code === 0) {
        message.success('删除部门成功');
        this.state.perDepartInformation = undefined;
      } else {
        message.error('删除部门失败');
      }
    });
  };

  departMentDetail = (totalTreeInformation, perTreeInformation) => {
    const {depart, dispatch} = this.props;
    // 生成每一项部门的具体信息
    if (perTreeInformation === undefined || perTreeInformation.id === '0') {
      //初次加载或者点击公司信息
      return (
        <div>
          <div className={cn('depart-title')}>
            {totalTreeInformation[0].departmentName}
          </div>
          <div>
            <div className={cn('add-admin')}>
              <span>管理员</span>
              <Button
                type={'primary'}
                className={cn('add-Administrator')}
                onClick={() => {
                  dispatch({type: 'depart/setCondition',
                    payload: {
                      perDepartInformation: this.state.perDepartInformation,
                      showBlue: this.state.showBlue,
                      departments: depart.departments,
                    }});
                  RH(this.props.history, 'addAdmin', '/org/addAdmin');
                }}
              >新增管理员</Button>
            </div>
            {this.perAdministrator()}
          </div>
          <div>
            <div className={cn('lower-depart')}>
              <span>下级部门</span>
              <div className={cn('adjust-btn')}>
                {this.state.adjustSort ? <Button onClick={() => this.adjustOk(totalTreeInformation[0].id)}>完成</Button> :
                  totalTreeInformation[0].children !== undefined && totalTreeInformation[0].children !== null && totalTreeInformation[0].children.length > 1 ?
                    <Button onClick={() => this.setState({adjustSort: true})}>调整排序</Button> : ''}
                <Button onClick={() => this.setState({modalVisible: true, defaultSeleValue: '0', addDepartparenetId: totalTreeInformation[0].id})} type={'primary'}>添加子部门</Button>
              </div>
            </div>
            {this.lowerDepart(totalTreeInformation[0], true)}
          </div>
        </div>
      );
    } else {
      //点击部门信息生成的每一项信息
      return (
        <div>
          <div className={cn('perdepart-title')}>
            {this.state.editDepart ?
              <div style={{display: 'inline-block'}} >
                <div className={cn('depart-name')}>
                  <Input
                    defaultValue={perTreeInformation.departmentName}
                    id="myInput"
                    maxLength={12}
                    // suffix={<span onClick={() => {
                    //   this.setState({
                    //     newDepartName: '',
                    //   });
                    //   document.getElementById('myInput').value = '';
                    // }}
                    // ><Icon type={'close-circle'} theme={'filled'} style={{cursor: 'pointer'}}/></span>}
                    onChange={this.editDepartInput}
                  />
                </div>
                <span onClick={() => this.editDepartName(perTreeInformation)} className={cn('edit-not')}>确定</span>
              </div> :
              <div style={{display: 'inline-block'}}>{perTreeInformation.departmentName}<span onClick={() => this.setState({editDepart: true})} className={cn('edit-not')}>编辑</span></div>}
            <div className={cn('float-right')}>
              {perTreeInformation.staffNumber === 0 ? <Popconfirm onConfirm={() => this.delectDepart(perTreeInformation)} placement="left" title="删除该部门？" okText="删除" cancelText="保留">
                <Button>删除部门</Button>
              </Popconfirm> : <Button onClick={
                () => {
                  this.setState({moveDepartOrEditUpdepart: true});
                  this.getQueryDepartment('');
                  this._cm.onReset();
                  this._cm.onShow();
                }
              }
              >批量转移员工</Button>}
            </div>
          </div>
          <div style={{marginBottom: '43px'}}>
            <div className={cn('add-admin')}>
              <span>上级部门</span>
            </div>
            {this.upDepart()}
          </div>
          <div>
            <div className={cn('add-admin')}>
              <span>管理员</span>
              <Button
                type={'primary'}
                className={cn('add-Administrator')}
                onClick={() => {
                  dispatch({type: 'depart/setCondition',
                    payload: {
                      perDepartInformation: this.state.perDepartInformation,
                      showBlue: this.state.showBlue,
                      departments: depart.departments,
                    }});
                  RH(this.props.history, 'addAdmin', '/org/addAdmin', {state: {dept: perTreeInformation}});
                }}
              >新增管理员</Button>
            </div>
            {this.perAdministrator()}
          </div>
          <div>
            <div className={cn('lower-depart')}>
              <span>下级部门</span>
              <div className={cn('adjust-btn')}>
                {this.state.adjustSort ?
                  <Button onClick={() => this.adjustOk(perTreeInformation.id)}>完成</Button> :
                  perTreeInformation.children !== null && perTreeInformation.children.length > 1 ? <Button onClick={() => this.setState({adjustSort: true})}>调整排序</Button> : ''}
                <Button type={'primary'} onClick={() => this.setState({modalVisible: true, addDepartparenetId: perTreeInformation.id, defaultSeleValue: (perTreeInformation.id).toString()})}>添加子部门</Button>
              </div>
            </div>
            {this.lowerDepart(perTreeInformation, false)}
          </div>
        </div>
      );
    }
  };

  allDepart = () => {
    // 所有部门的名字
    const {depart} = this.props;
    const departNameArr = [];
    const mapDepartName = (child) => {
      child.map((item) => {
        departNameArr.push({id: item.id, departmentName: item.departmentName, parentId: item.parentId});
        if (item.children && item.children !== null) {
          mapDepartName(item.children);
        }
        return 1;
      });
    };
    mapDepartName(depart.departments);
    return departNameArr.map(item => (
      <Option key={(item.id).toString()}>{item.id === '0' ? '顶级' : item.departmentName}</Option>
    ));
  };

  addDepart = () => {
    //添加部门
    //如果addDepartparenetId === '0'的原因是否上级部门是顶级，因为右边部分的来源有可能是总的返回的所有的返回的或者点击右边生成的树结构，
    const {depart, dispatch} = this.props;
    let isRepeat = false;
    const departNameArr = [];
    const mapDepartName = (child) => {
      if (child !== undefined) {
        child.map((item) => {
          departNameArr.push(item.departmentName);
          if (item.children !== null) {
            mapDepartName(item.children);
          }
          return false;
        });
      }
    };
    mapDepartName(depart.departments);
    departNameArr.map((item) => {
      if (this.state.addDepartName === item) {
        this.setState({
          addDepartNameWarn: '部门名称已存在，请重新输入',
        });
        isRepeat = true;
      }
      return false;
    });
    // 如果名字有重复 就跳出这个函数
    if (isRepeat) {
      return false;
    }
    let parentDepart = null;
    const findDepartById = (departData, id) => {
      for (const item of departData) {
        if (item.id === id) {
          return (parentDepart = item);
        }

        if (item.children && item.children.length > 0) {
          findDepartById(item.children, id);
        }
      }
    };

    findDepartById(depart.departments, this.state.addDepartparenetId);

    let level = 1;
    if (parentDepart && parentDepart.level >= 0) {
      level = parentDepart.level + 1;
    }
    dispatch({
      type: 'depart/addDepartment',
      payload: {
        level,
        parentId: this.state.addDepartparenetId,
        departmentName: this.state.addDepartName,
        __autoLoading: true,
      },
    }).then((res) => {
      if (res.code === 0) {
        if (this.state.addDepartparenetId === '0' || this.state.perDepartInformation === undefined) {
          this.setState({
            modalVisible: false,
            addDepartName: '',
            perDepartInformation: undefined,
            addDepartNameWarn: '',
          });
        } else {
          if (this.state.perDepartInformation.children === null) {
            this.state.perDepartInformation.children = [res.data];
          } else {
            this.state.perDepartInformation.children.push(res.data);
          }
          const newArr = this.state.perDepartInformation;
          this.setState({
            modalVisible: false,
            addDepartName: '',
            perDepartInformation: newArr,
            addDepartNameWarn: '',
          });
        }
      }
    });
  };

  getNewperDepart = (selectedKeys, info) => {
    // 获取点击每一个部门的信息
    const {dispatch} = this.props;
    const perDepartInformation = JSON.parse(info.node.props.name);
    const un = message.loading('切换中...', 15);
    this.setState({
      editDepart: false,
      perDepartInformation,
      adjustSort: false,
      showBlue: perDepartInformation.id.toString(),
    });
    dispatch({
      type: 'depart/queryAdministrator',
      payload: {
        departmentCode: perDepartInformation.id === '0' ? '' : perDepartInformation.id,
      },
    });
    if (perDepartInformation.id !== '0') {
      dispatch({
        type: 'depart/queryLowerAndUpperDepartments',
        payload: {
          departmentId: perDepartInformation.id,
        },
      });
    }
    setTimeout(un, 233);
  };

  onSearchWord = (value) => {
    //搜索部门
    const {dispatch} = this.props;
    dispatch({
      type: 'depart/queryDepartment',
      payload: {
        demtName: value,
      },
    });
  };

  componentWillReceiveProps() {
  }

  render() {
    const {depart, dispatch, global, history} = this.props;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '组织结构'},
        ]}
      />
      <CheckModal
        multiple={false}
        ref={e => (this._cm = e)}
        show={false}
        departmentName={global.account.companyName}
        placeholder={'输入部门名称'}
        checked={[]}
        list={depart.departments[0] && depart.departments[0].children ? depart.departments[0].children : []}
        onSearch={(name) => {
          this.getQueryDepartment(name);
        }}
        onOk={(data = []) => {
          const item = this.state.perDepartInformation;
          if (this.state.moveDepartOrEditUpdepart) {
            dispatch({
              type: 'depart/departmentDatch',
              payload: {
                deptNumber: item.staffNumb,
                nowDeptId: item.id,
                updateDeptId: data[0].id,
                updateDeptName: data[0].departmentName,
                __autoLoading: true,
              },
            }).then((res) => {
              if (res.code === 0) {
                message.success('批量转移员工成功');
              }
            });
          } else {
            dispatch({
              type: 'depart/editDepartmentParent',
              payload: {
                newParentId: data[0].id === '0' ? '' : data[0].id,
                nowDeptId: item.id,
                __autoLoading: true,
              },
            }).then((res) => {
              if (res.code === 0) {
                dispatch({
                  type: 'depart/queryLowerAndUpperDepartments',
                  payload: {
                    departmentId: item.id,
                  },
                });
                message.success('修改上级部门成功');
              }
            });
          }
        }}
      />
      <GPage className={cn('depart')}>
        <Row>
          <Modal destroyOnClose footer={null} visible={this.state.modalVisible} title="新增部门" centered onCancel={() => this.setState({modalVisible: false, addDepartName: '', addDepartNameWarn: ''})}>
            <div className={cn('modal-style')}>
              <div className={cn('new-depart', 'row')}>
                <div style={{paddingTop: '6px'}}>
                  <span style={{ marginRight: '10px' }}>部门名称:</span>
                </div>
                <div style={{display: 'inline-block'}}>
                  <Input
                    onChange={e => this.setState({addDepartName: e.target.value, addDepartNameWarn: ''})}
                    maxLength={12}
                    placeholder="12个汉字以内"
                    suffix={<div><span style={{ fontWight: 'normal', color: this.state.addDepartName.length <= 0 ? 'red' : '#32B16C' }}>{this.state.addDepartName.length}</span><span>/12</span></div>}
                    style={{ width: '250px' }}
                  />
                  <div className={cn('depart-warn')}>
                    {this.state.addDepartNameWarn}
                  </div>
                </div>
              </div>
              <div className={cn('up-depart', 'row')}>
                <div style={{paddingTop: '6px'}}>
                  <span style={{ marginRight: '10px' }}>上级部门:</span>
                </div>
                <div>
                  <Select defaultValue={this.state.defaultSeleValue} style={{ width: 250 }} onChange={key => this.setState({addDepartparenetId: key})}>
                    {depart.departments.length !== 0 ? this.allDepart() : <Spin/>}
                  </Select>
                </div>
              </div>
              <div className={cn('btn-group')}>
                <Button className={cn('ok-btn')} onClick={() => this.addDepart()} disabled={this.state.addDepartName === ''}>确定</Button>
                <Button className={cn('cancel-btn')} onClick={() => this.setState({modalVisible: false, addDepartName: '', addDepartNameWarn: ''})}>取消</Button>
              </div>
            </div>
          </Modal>
          <Col span={24} className={cn('top-button')}>
            <Button className={cn('first-btn')} type={'primary'} onClick={() => this.setState({modalVisible: true, defaultSeleValue: '0', addDepartparenetId: '0'})}>新增部门</Button>
            <Button
              className={(cn('second-btn'))}
              onClick={() => {
                dispatch({type: 'depart/setCondition',
                  payload: {
                    perDepartInformation: this.state.perDepartInformation,
                    showBlue: this.state.showBlue,
                    departments: depart.departments,
                  }});
                RH(history, 'linkOrg', '/org/hr/linkOrg');
              }}
            >设置关联单位</Button>
          </Col>
          <Col className={cn('line-style')} span={24}>
            <Divider className={cn('line')}/>
          </Col>
        </Row>
        <Row>
          <Col span={11} className={cn('main-left')}>
            <Search onSearch={this.onSearchWord} enterButton="查询" placeholder={'请输入部门名称'} className={cn('search-inp')}/>
            <div className={cn('tree-height')}>
              {
                depart.departments.length ?
                  <Tree selectedKeys={[this.state.showBlue]} showLine defaultExpandAll onSelect={this.getNewperDepart}>
                    {this.genTree()}
                  </Tree> : <div className={cn('f-tac')} style={{paddingTop: 30}}><Spin/></div>
              }
            </div>
          </Col>
          <Col span={12} className={cn('main-right')}>
            {this.state.showLoading ? <Spin/> : ''}
            <div className={cn('per-content')}>
              {depart.departments.length !== 0 ?
                this.departMentDetail(depart.departments, this.state.perDepartInformation) :
                <div className={cn('f-tac')} style={{paddingTop: 30}}><Spin/></div>}
            </div>
          </Col>
        </Row>
      </GPage>

    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
