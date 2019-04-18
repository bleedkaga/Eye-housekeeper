import React from 'react';
import cn from 'classnames';
import {Modal, Checkbox, Icon, message} from 'antd';
import MashUpInput from 'client/components/MashUpInput';

import '../RaidoModal/style.less';
import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      list: [],
      loaded: false,
    };
  }

  static defaultProps = {
    placeholder: '请输入任务名称',
    title: '选择任务清单内容',
    width: 1000,
    getList: () => {
    },
    onOk: () => {
    },
    onCancel: () => {
    },
  };

  componentDidMount() {
    this.props.getList && this.props.getList(this.setList);
  }


  // componentWillReceiveProps(nextProps) {
  // }

  componentWillUnmount() {
    this.state.list = [];
    this.state.keyword = '';
  }


  onShow() {
    const un = message.loading('加载中...', 15);
    this.props.getList((status, list) => {
      if (!status) return un();
      this.props.getData((_, list2) => {
        un();
        this.setList(list, list2);
        this.setState({show: true});
      });
    });
  }

  onHide() {
    this.setState({show: false, keyword: '', list: [], filter: ''});
  }

  setList = (list, activeList) => {
    const temp = [];
    this.initMenuArray(list, temp, activeList);
    this.setState({list: temp, loaded: true});
  };

  initMenuArray(arr, obj, activeList = [], father) {
    if (!arr.length) return false;
    const tempArr = [...arr];
    for (let index = 0; index < tempArr.length; index++) {
      const item = tempArr[index];
      if (!father && (!item.child || item.child.length === 0)) {
        tempArr.splice(index, 1);
        index--;
      } else {
        const t = Object.assign({}, item);
        t.parent = father;
        obj[index] = t;
        if (activeList.find(k => t.father === k)) {
          t.active = true;
        }
        if (Array.isArray(t.child)) {
          t.isChild = true;
          t.child = [...t.child];
          this.initMenuArray(t.child, t.child, activeList, t);
          const rel = this._getFatherStatus(t.child);
          t.active = rel.active;
          t.indeterminate = rel.indeterminate;
        }
      }
    }
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
    if (item.parent) {
      const {parent} = item;
      const rel = this._getFatherStatus(parent.child);
      parent.active = rel.active;
      parent.indeterminate = rel.indeterminate;
      this.checkAllFather(parent);
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
      if (!item.isChild || this.isFilter(item)) {
        rel.push(<div
          className={cn('temp', {'temp-line': !item.isChild}, `num-${item.father}`)}
          key={`id-${item.father}-${index}`}
        >
          {
            item.isChild ? (
              <div className={cn('father-box')}>
                <Checkbox
                  indeterminate={item.isChild ? item.indeterminate : false}
                  onChange={e => this.onChangeCheckBox(e, item)}
                  checked={item.active}
                >
                  {item.taskName}
                </Checkbox>
                <span
                  className={cn('f-fr')}
                  onClick={() => {
                    item.unfold = !item.unfold;
                    this.setState({});
                  }}
                >{item.unfold ? '收起' : '展开'}<Icon type={item.unfold ? 'up' : 'down'}/></span>
              </div>
            ) : (
              <Checkbox
                indeterminate={item.isChild ? item.indeterminate : false}
                onChange={e => this.onChangeCheckBox(e, item)}
                checked={item.active}
              >
                {item.taskName}
              </Checkbox>
            )
          }
          {
            Array.isArray(item.child) && item.unfold ?
              <div className={cn('checkbox-box')}>
                <div className={cn('checkbox-box-temp')}>{this.getWeightCheckBox(item.child)}</div>
              </div> : null
          }
        </div>);
      }
    });
    if (rel.length) {
      return rel;
    } else {
      return (<div className={cn('f-tac')} style={{padding: '20px', paddingTop: 100}}>暂无数据</div>);
    }

  }

  isFilter(item) {
    const {filter} = this.state;
    if (!filter) return true;
    if (item.taskName && item.taskName.indexOf(filter) !== -1) {
      return true;
    } else if (Array.isArray(item.child)) {
      for (let i = 0; i < item.child.length; i++) {
        const temp = this.isFilter(item.child[i]);
        if (temp) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  listForEach(arr, cb, key = 'child') {
    arr.forEach((item) => {
      cb(item);
      if (Array.isArray(item[key])) {
        this.listForEach(item[key], cb, key);
      }
    });
  }

  getAllWeight() {
    const {list} = this.state;
    const actives = [];

    this.listForEach(list, (item) => {
      if (item.active || item.indeterminate) actives.push(item.father);
    });

    return actives;
  }

  scrollToItem(item) {
    const dom = document.querySelector(`.num-${item.father}`);
    if (dom) {
      const sRect = this._source.getBoundingClientRect();
      const dRect = dom.getBoundingClientRect();
      const sTop = sRect.top;
      const dTop = this._source.scrollTop + (dRect.top - 12); //12 是有12px marginTop
      this._source.scrollTop = dTop - sTop;
    }
  }

  getActiveCheckBox(arr = []) {
    const rel = [];
    arr.forEach((item, index) => {
      if (item.indeterminate || item.active) {
        rel.push(<div className={cn('content-item')} key={`id-${item.father}-${index}`}>
          <div className={cn('content-item-title')}>
            <span className={cn('f-toe')} onClick={() => this.scrollToItem(item)}>{item.taskName}</span>
            <a
              href={'javascript:;'}
              onClick={() => {
                this.onChangeCheckBox({target: {checked: false}}, item);
              }}
            >删除</a>
          </div>
          {
            Array.isArray(item.child) ? (
              <div className={cn('content-item-box', 'f-cb')}>
                {
                  item.child.map((o, ind) => (o.active ? (
                    <div className={cn('content-item-a')} key={`c-${o.id}-${ind}`}>
                      {o.taskName}
                      <a
                        href={'javascript:;'}
                        onClick={() => {
                          this.onChangeCheckBox({target: {checked: false}}, o);
                        }}
                      ><Icon type={'close'}/></a>
                    </div>
                  ) : null))
                }
              </div>
            ) : null
          }
        </div>);
      }
    });
    return rel;
  }

  getSelectSize() {
    const {list} = this.state;
    let count = 0;
    this.forEachAll(list, (item) => {
      item.active && count++;
    });
    return count;
  }

  forEachAll(arr = [], cb, key = 'child') {
    arr.forEach((item) => {
      if (Array.isArray(item[key])) {
        item[key].forEach((o) => {
          cb && cb(o);
        });
      }
    });
  }

  render() {
    const {show, keyword, list} = this.state;
    const {title, width, className, onOk, toCenter} = this.props;

    const actives = this.getActiveCheckBox(list);

    return (<Modal
      className={cn('gsg-modal', className)}
      title={title}
      width={list.length ? width : 666}
      footer={list.length ? undefined : null}
      visible={show}
      onOk={() => {
        const ids = this.getAllWeight();
        onOk && onOk(ids.join(','));
      }}
      onCancel={() => this.onHide()}
    >
      {
        list.length ? <div className={cn('row', 'select-modal-box', 'check-model-box')}>
          <div className={cn('col', 'col-top', 'col-50')}>
            <MashUpInput
              reset
              placeholder={this.props.placeholder}
              value={keyword}
              onChange={(e) => {
                this.setState({keyword: e.target.value});
              }}
              onSearch={() => {
                this._source.scrollTop = 0;
                this.setState({filter: this.state.keyword});
              }}
              height={34}
              width={300}
              buttonText={'搜索'}
            />
            <div className={cn('source')} ref={e => (this._source = e)}>
              <div className={cn('checkbox-main')}>
                <div className={cn('checkbox-box')}>
                  {this.getWeightCheckBox(list)}
                </div>
              </div>

              {/*<div className={cn('f-tac')} style={{color: '#999'}}>暂无数据</div>*/}
            </div>
          </div>
          <div className={cn('col', 'col-top', 'col-50', 'rel-box')}>
            <div className={cn('rel-content')}>
              <div className={cn('title')}>已选择（{this.getSelectSize()}项）</div>
              <div className={cn('content-temp')}>
                <div className={cn('content-box', 'f-cb')}>
                  {actives.length ? actives : (
                    <div className={cn('f-tac')} style={{color: '#999', paddingTop: 100}}>暂无数据</div>)}
                </div>
              </div>
            </div>
          </div>
        </div> : <div style={{fontSize: 18, padding: '100px 0'}} className={cn('f-tac')}>
          未设定任务内容，点击
          <a
            href={'javascript:;'}
            onClick={() => {
              toCenter && toCenter();
            }}
          >立即设定&gt;&gt;</a>
        </div>
      }
    </Modal>);
  }
}

export default Class;
