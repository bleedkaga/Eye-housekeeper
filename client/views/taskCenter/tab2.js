import React from 'react';
import cn from 'classnames';
import {Icon, Row, Col, Button, Spin, message} from 'antd';
import FormTaskModal from 'client/components/FormTaskModal';

import Utils from './utils';

import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: {}, //一级分类
      loading: true,
      lookSchema: 0,
      oldTaskIds: [],
    };
  }

  componentDidMount() {
    const {dispatch, global} = this.props;
    //初始化数据
    dispatch({
      type: 'taskCenter/initializeTab2Data',
      payload: {
        data: {companyId: global.account.companyId}, //ok
        first: {companyId: global.account.companyId}, //ok
      },
      callback: (value) => {
        const obj = this.getExclusiveObject();
        if (value) {
          const father = Utils.findFatherItemByValue(obj.list, value);
          father && this.onClickMenu(father);
        }
        const count = Utils.getSelectSize(obj.taskIds); //有效选择项
        this.setState({
          lookSchema: count > 0 ? 1 : 0,
          oldTaskIds: Utils.cloneTaskArr(obj.taskIds),
          loading: false,
        });
      },
    });
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  //获取当前的专属对象
  getExclusiveObject() {
    return this.props.taskCenter.tab2;
  }

  //选中父元素菜单
  onClickMenu(father) {
    const {dispatch} = this.props;
    const oldCurrent = this.state.current;

    if (oldCurrent) {
      oldCurrent.scroll = this.list2.scrollTop;
    }
    this.setState({current: father});

    this.list2.scrollTop = father.scroll || 0;
    if (father && father.value && (!father.children || father.children.length === 0)) {
      dispatch({
        type: 'taskCenter/getSecondCustomTask',
        payload: {
          selectedOptions: [father],
        },
      });
    }
  }

  //校正全选
  checkSelect(father) {
    const obj = this.getExclusiveObject();
    const {taskIds} = obj;
    father.all = Utils.checkAllSelect(father, taskIds);
  }

  //全选、反选
  onCheckAll(father, type) {
    const {dispatch, global} = this.props;
    const obj = this.getExclusiveObject();

    Utils.onAllChange(obj.taskIds, father, type,
      (arr) => {
        //全选
        dispatch({type: 'taskCenter/addTask', payload: {father, list: arr, type: 'tab2'}});
      },
      (arr) => {
        // 反选
        dispatch({type: 'taskCenter/delTask', payload: {father, list: arr, type: 'tab2'}});
      },
      (arr, ids) => {
        // 服务器反选
        dispatch({
          type: 'taskCenter/delSelectClassification',
          payload: {
            companyId: global.account.companyId, //ok
            id: ids.join(','),
            __autoLoading: true,
          },
          callback: () => {
            Utils.updateCloneArr(this.state.oldTaskIds, ids);
            dispatch({type: 'taskCenter/delTask', payload: {father, list: arr, type: 'tab2'}});
          },
        });
      },
    );
  }

  //选择、取消
  onCheck(father, item, type) {
    const {dispatch, global} = this.props;
    const obj = this.getExclusiveObject();

    Utils.onChange(obj.taskIds, father, item, type,
      (arr) => {
        //全选
        dispatch({type: 'taskCenter/addTask', payload: {father, list: arr, type: 'tab2'}});
      },
      (arr) => {
        // 反选
        dispatch({type: 'taskCenter/delTask', payload: {father, list: arr, type: 'tab2'}});
      },
      (arr, ids) => {
        // 服务器反选
        dispatch({
          type: 'taskCenter/delSelectClassification',
          payload: {
            companyId: global.account.companyId, //ok
            id: ids.join(','),
            __autoLoading: true,
          },
          callback: () => {
            Utils.updateCloneArr(this.state.oldTaskIds, ids);
            dispatch({type: 'taskCenter/delTask', payload: {father, list: arr, type: 'tab2'}});
          },
        });
      },
    );
  }

  //更新tab数据
  updateTabData() {
    const {dispatch, global} = this.props;
    dispatch({
      type: 'taskCenter/getTab2Data',
      payload: {companyId: global.account.companyId}, //ok
      callback: () => {
        this.setState({oldTaskIds: Utils.cloneTaskArr(this.props.taskCenter.tab2.taskIds)});
      },
    });
  }

  //保存
  save(taskIds = []) {
    if (!Utils.getSelectSize(taskIds)) return message.error('请选择一个任务');

    const {dispatch, global} = this.props;
    const temp = [];

    taskIds.forEach((f) => {
      const children = [];
      if (f.children && f.children.length) {
        f.children.forEach((c) => {
          children.push(c.value);
        });
        temp.push({id: f.value, child: children.join(','), status: 2});
      }
    });

    dispatch({
      type: 'taskCenter/addClassification',
      payload: {
        companyId: global.account.companyId, //ok
        tasks: JSON.stringify(temp),
      },
      callback: () => {
        dispatch({type: 'taskCenter/setTab2', payload: {isResult: true}});
        this.updateTabData();
        this.setState({lookSchema: 1});
        message.success('保存成功');
      },
    });
  }

  onTabChange() {
    const {dispatch, taskCenter: {tab2}} = this.props;
    dispatch({type: 'taskCenter/setTab2', payload: {taskIds: Utils.cloneTaskArr(this.state.oldTaskIds)}});
    tab2.isResult && this.setState({lookSchema: 1});
  }

  showTaskModal(o) {
    const obj = this.getExclusiveObject();
    this._ftm.onShow(o, obj.list);
  }

  hideTaskModal() {
    this._ftm.onHide();
  }

  addTaskData(values) {
    const {global, dispatch} = this.props;

    const father = {fatherName: values.title, childs: []};
    if (values.id) {
      father.id = values.id;
    }
    values.list.forEach((item) => {
      const o = {name: item.label};
      if (item.taskId) {
        o.taskId = item.taskId;
      }
      father.childs.push(o);
    });

    const payload = {
      companyId: global.account.companyId, //ok
      tasks: JSON.stringify([father]),
    };

    dispatch({
      type: 'taskCenter/batchClassification',
      payload,
      callback: () => {
        this.hideTaskModal();
        //更新一级任务
        dispatch({
          type: 'taskCenter/getFirstClassification',
          payload: {
            companyId: global.account.companyId, //ok
            __autoLoading: true,
          },
          callback: () => {
            if (!this.state.current.value) {
              //当前没有值
              this.state.current = this.props.taskCenter.tab2.list[0] || {};
            } else {
              this.state.current = Utils.findFatherItemByValue(this.props.taskCenter.tab2.list, this.state.current.value);
            }
            this.state.current.children = [];
            this.onClickMenu(this.state.current);
          },
        });
        //更新最后结果
        this.updateTabData();
        message.success('保存任务成功');
      },
    });
  }

  render() {
    const {dispatch, global} = this.props;
    const {current = {}, loading, lookSchema} = this.state;
    const obj = this.getExclusiveObject();

    this.checkSelect(current);

    return (<div className={'tab2'}>
      {
        lookSchema === 0 ? <div className={cn('edit-box')}>
          <Row gutter={20} className={cn('taskCenter-title')}>
            <Col span={14}>
              <i className={cn('tag', 'tag1')}/><span>请选择需要发放的任务清单</span>
              <Button
                className={cn('h34 w90')}
                ghost
                type="primary"
                style={{marginLeft: 20}}
                onClick={() => this.showTaskModal()}
              >添加任务</Button>
            </Col>
            <Col span={10}>
              <i className={cn('tag', 'tag2')}/><span>已选择（{Utils.getSelectSize(obj.taskIds)}项）</span>
            </Col>
          </Row>
          <Row gutter={25} className={cn('taskCenter-content')}>
            <Col span={14}>
              <div className={cn('row')}>
                {
                  obj.list.length ? <div className={cn('col-top', 'menu-list')}>
                    {
                      obj.list.map((item, index) => (<button
                        key={`menu1-${index}`}
                        className={cn('f-toe', {active: item.value === current.value})}
                        onClick={() => this.onClickMenu(item)}
                      >{item.label}</button>))
                    }
                  </div> : null
                }
                <div className={cn('col', 'col-top', 'f-toe')}>
                  <div className={cn('menu-list2', 'f-cb')} ref={e => (this.list2 = e)}>
                    {
                      obj.list.length && current.value && !current.loading ? (
                        <div className={cn('edit-btn-box', 'f-cb')}>
                          <div className={cn('item')}>
                            <button onClick={() => this.showTaskModal(this.state.current)}>编辑任务</button>
                          </div>
                          <span className={cn('f-fl', 'f-toe')} title={'“编辑任务”可对任务分类及任务进行增加、修改、删除操作'}>
                            “编辑任务”可对任务分类及任务进行增加、修改、删除操作
                          </span>
                        </div>
                      ) : null
                    }
                    {
                      !obj.list.length && <font className={cn('taskCenter-none-data', 'taskCenter-none-data2')}>
                        暂无自定义任务，请点击“
                        <a
                          onClick={() => this.showTaskModal()}
                          href="javascript:;"
                        >添加任务</a>
                        ”，增加自定义任务
                      </font>
                    }
                    {
                      obj.list.length && !current.value ?
                        <font className={cn('taskCenter-none-data')}>还未选择项目</font> : null
                    }
                    {
                      current.value && current.loading ?
                        <font className={cn('taskCenter-none-data')}><Spin/></font> : null
                    }
                    {
                      obj.list.length && current.value && !current.loading && current.children && current.children.length ? <div className={cn('item')}>
                        <button
                          onClick={() => this.onCheckAll(current)}
                          className={cn('f-toe', {active: current.all})}
                        >
                          全选
                        </button>
                      </div> : null
                    }
                    {
                      current.value && !current.loading && current.children ?
                        current.children.map((item, index) => (
                          <div
                            className={cn('item')}
                            key={`menu2-${index}`}
                            onClick={() => {
                              const cItem = Utils.findChildrenItemByValue(obj.taskIds, item.value);
                              this.onCheck(current, cItem ? {
                                id: cItem.id,
                                value: cItem.value,
                                label: cItem.label,
                                server: cItem.server,
                                active: item.active,
                              } : item);
                            }}
                          >
                            <button
                              className={cn('f-toe', {active: item.active})}
                              title={item.label}
                            >{item.label}</button>
                          </div>)) : null
                    }
                  </div>
                </div>
              </div>
            </Col>
            <Col span={10}>
              <div className={cn('menu-list3', 'f-cb')}>
                {
                  Utils.getSelectSize(obj.taskIds) > 0 ?
                    obj.taskIds.map((cr, ind) => (
                      cr.children && cr.children.length ? (<div className={cn('f-toe')} key={`${cr.value}-${ind}`}>
                        <div className={cn('list3-item-father')}>{cr.label}<a
                          href="javascript:;"
                          onClick={() => {
                            let cFather = Utils.findFatherItemByValue(obj.list, cr.value);
                            if (!cFather) cFather = cr;
                            this.onCheckAll(cFather, false);
                          }}
                        >删除</a></div>
                        {
                          cr.children.map((item, index) => (
                            <div className={cn('f-toe', 'f-fl')} key={`${item.value}-${index}`}>
                              {item.label}
                              <button
                                onClick={() => {
                                  let cFather = Utils.findFatherItemByValue(obj.list, cr.value);
                                  if (!cFather) cFather = cr;
                                  this.onCheck(cFather, {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    server: item.server,
                                  }, true);
                                }}
                              ><Icon type={'close'}/></button>
                            </div>
                          ))
                        }
                      </div>) : null
                    )) : <font className={cn('taskCenter-none-data')}>还未选择项目</font>
                }
              </div>
            </Col>
          </Row>
          <div className={cn('taskCenter-play-btns')}>
            <Button
              onClick={() => {
                this.save(obj.taskIds);
              }}
              loading={obj.isLoad}
              type={'primary'}
              className={cn('taskCenter-play')}
            >保存</Button>
            {
              obj.isResult ? <Button
                onClick={() => {
                  dispatch({type: 'taskCenter/setTab2', payload: {taskIds: Utils.cloneTaskArr(this.state.oldTaskIds)}});
                  this.setState({lookSchema: 1});
                }}
                loading={obj.isLoad}
                className={cn('taskCenter-play')}
              >取消</Button> : null
            }
          </div>
        </div> : null
      }

      {
        lookSchema === 1 ? <div className={cn('rel-box')}>
          <Row className={cn('taskCenter-title')}>
            <Col span={24}>
              <i className={cn('tag', 'tag2')}/><span>已选自定义任务清单</span>
            </Col>
          </Row>
          <Row className={cn('taskCenter-content')}>
            <Col span={24}>
              <div className={cn('menu-list3', 'f-cb')}>
                {
                  Utils.getSelectSize(obj.taskIds) > 0 ?
                    obj.taskIds.map((cr, ind) => (
                      cr.children && cr.children.length ? (<div className={cn('f-toe')} key={`${cr.value}-${ind}`}>
                        <div className={cn('list3-item-father')}>{cr.label}</div>
                        {
                          cr.children.map((item, index) => (
                            <div
                              className={cn('f-toe', 'f-fl')}
                              key={`${item.value}-${index}`}
                              style={{paddingRight: 15}}
                            >
                              {item.label}
                            </div>
                          ))
                        }
                      </div>) : null
                    )) : <font className={cn('taskCenter-none-data')}>还未选择项目</font>
                }
              </div>
            </Col>
          </Row>
          <Button
            onClick={() => {
              this.setState({lookSchema: 0});
            }}
            style={{width: 110}}
            type={'primary'}
            className={cn('taskCenter-play')}
          >编辑已选任务</Button>
        </div> : null
      }
      {
        loading ? <div className={cn('shade')}><Spin/></div> : null
      }
      <FormTaskModal
        isLoad={obj.isLoad}
        wrappedComponentRef={e => (this._ftm = e)}
        onComplete={values => this.addTaskData(values)}
        onDelItem={(item, next) => {
          dispatch({
            type: 'taskCenter/delClassification',
            payload: {
              id: item.taskId,
              __autoLoading: true,
            },
            callback: () => {
              //更新一级任务
              dispatch({
                type: 'taskCenter/getFirstClassification',
                payload: {
                  companyId: global.account.companyId, //ok
                  __autoLoading: true,
                },
                callback: () => {
                  this.state.current.children = [];
                  this.onClickMenu(this.state.current);
                },
              });
              next && next();
            },
          });
        }}
        onDelFather={(id) => {
          dispatch({
            type: 'taskCenter/delFatherClassification',
            payload: {
              id,
              companyId: global.account.companyId, //ok
              __autoLoading: true,
            },
            callback: () => {
              this.hideTaskModal();
              //更新一级任务
              dispatch({
                type: 'taskCenter/getFirstClassification',
                payload: {
                  companyId: global.account.companyId, //ok
                  __autoLoading: true,
                },
                callback: () => {
                  if (id == this.state.current.value) {
                    //删除的当前选择项
                    this.state.current = this.props.taskCenter.tab2.list[0] || {};
                  }
                  this.state.current.children = [];
                  this.onClickMenu(this.state.current);
                },
              });
              message.success('删除任务分类成功');
            },
          });
        }}
      />
    </div>);
  }
}

export default Class;
