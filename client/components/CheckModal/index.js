import React from 'react';
import cn from 'classnames';
import {Modal, Checkbox, Icon, message, Radio} from 'antd';
import MashUpInput from 'client/components/MashUpInput';

import '../RaidoModal/style.less';
import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.multiple = props.multiple;
    const c = props.checked || [];

    this.state = {
      checked: props.multiple ? [...c] : c, // //初始化选择的部门（主要再次进入时能正确的显示部门）
      tier: [],
      show: !!props.show,
      keyword: '',
      value: props.value,
      activeItems: props.activeItems || [],
      filter: '',
    };
  }

  static defaultProps = {
    list: [],
    multiple: true,
    departmentName: '部门',
    placeholder: '请输入...',
    title: '选择部门',
    width: 666,
    onOk: () => {
    },
    onCancel: () => {
    },
  };

  componentDidMount() {
    this.updateFlush();
  }

  _timer_ = null;

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.value !== this.props.value ||
      nextProps.list !== this.props.list ||
      nextProps.checked !== this.props.checked
    ) {
      this._timer_ = setTimeout(() => {
        if (nextProps.checked) {
          this.setState({checked: this.multiple ? [...nextProps.checked] : nextProps.checked});
        }
        this.updateFlush();
      }, 16);
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer_);
  }

  onReset() {
    this.setState({
      filter: '',
      keyword: '',
      value: this.props.value,
      activeItems: this.props.activeItems || [],
      tier: [],
    });
  }

  onShow() {
    this.setState({show: true});
  }

  onHide() {
    this.setState({show: false});
  }

  onOk() {
    const {onOk} = this.props;
    if (this.state.activeItems && this.state.activeItems.length) {
      this.onHide();
      onOk && onOk(this.state.activeItems);
    } else {
      message.warn('请选择部门');
    }
  }

  onCancel() {
    const {onCancel} = this.props;
    this.onHide();
    onCancel && onCancel();
  }

  checkItem(item, type) {
    const {checked} = this.state;
    item.active = !!type;
    if (!type) {
      const ind = checked.findIndex(o => o.id === item.id);
      if (ind !== -1) checked.splice(ind, 1);
    }
    if (Array.isArray(item.children)) {
      this.listForEach(item.children, (o) => {
        o.active = !!type;
        if (!type) {
          const ind = checked.findIndex(oo => oo.id === o.id);
          if (ind !== -1) checked.splice(ind, 1);
        }
      });
    }
    this.updateFlush();
  }

  checkRadioItem(item) {
    this.setState({checked: item.id, activeItems: [item]});
  }

  verifyAll() {
    const currentList = this.getCurrentList();
    for (let i = 0; i < currentList.length; i++) {
      if (!currentList[i].active) return false;
    }
    return true;
  }

  checkAll(type) {
    const {checked} = this.state;
    const currentList = this.getCurrentList();
    this.listForEach(currentList, (item) => {
      item.active = !!type;
      if (!type) {
        const ind = checked.findIndex(o => o.id === item.id);
        if (ind !== -1) checked.splice(ind, 1);
      }
    });

    this.updateFlush();
  }

  getCurrentList() {
    const {value, filter} = this.state;
    const {list = []} = this.props;
    const v = value || list;
    if (filter) {
      const nv = [];
      this.listForEach(v, (item) => {
        if (item.departmentName.indexOf(filter) !== -1) {
          nv.push(item);
        }
      });
      return nv;
    } else {
      return v;
    }
  }

  changeValue(item) {
    if (Array.isArray(item.children)) {
      const tier = this.state.tier || [];
      tier.push({list: item.children, name: item.departmentName});
      this._source.scrollTop = 0;
      this.setState({value: item.children, tier});
    }
  }

  listForEach(arr, cb) {
    arr.forEach((item) => {
      cb(item);
      if (Array.isArray(item.children)) {
        this.listForEach(item.children, cb);
      }
    });
  }

  updateFlush() {
    const {list, multiple} = this.props;
    const {checked} = this.state;
    if (multiple) {
      const recursion = (arr) => {
        let activeSize = 0;
        let cancelSize = 0;
        let indeterminateSize = 0;
        let activeItems = [];
        arr.forEach((item) => {
          if (checked.find(o => o.id === item.id)) {
            item.active = true;
          }

          if (Array.isArray((item.children))) {
            const max = item.children.length;
            const result = recursion(item.children);
            if (result.cancelSize === max) {
              item.indeterminate = false;
              item.active = false;
              cancelSize++;
            } else if (result.activeSize === max) {
              item.indeterminate = false;
              item.active = true;
              activeSize++;
              activeItems.push(item);
            } else {
              item.indeterminate = true;
              item.active = false;
              indeterminateSize++;
            }
            activeItems = activeItems.concat(result.activeItems);
          } else if (item.active) {
            activeItems.push(item);
            activeSize++;
          } else {
            cancelSize++;
          }
        });

        return {activeSize, cancelSize, indeterminateSize, activeItems};
      };
      const {activeItems} = recursion(list);
      this.setState({activeItems});
    } else {
      const listTemp = this.getCurrentList();
      const item = listTemp.find(o => o.id === checked);
      if (item) {
        this.setState({activeItems: [item]});
      }
    }

    if (checked.length) this.state.checked = [];
  }

  getCrumbs() {
    const currentList = this.getCurrentList();
    if (!currentList.length) return null;

    const {tier = []} = this.state;
    const {list = [], departmentName} = this.props;
    const isFirst = !tier.length;
    const arr = [];
    arr.push({
      name: departmentName,
      list,
      active: isFirst,
      onClick: () => {
        this.setState({tier: [], value: undefined});
      },
    });
    tier.forEach((item, index) => {
      arr.push({
        name: item.name,
        list: item.list,
        active: index === tier.length - 1,
        onClick: () => {
          tier.length = index + 1;
          this.setState({tier, value: tier[tier.length - 1].list});
        },
      });
    });

    return (
      <div className={cn('ladder', 'f-toe')}>
        {
          arr.map((item, index) => {
            if (item.active) {
              return (<span key={`cs-${index}`}>{item.name}</span>);
            } else {
              return ([<a key={`cs-${index}`} href={'javascript:;'} onClick={e => item.onClick(e)}>{item.name}</a>,
                <span key={`cs-${index}-gt`}>{' > '}</span>]);
            }
          })
        }
      </div>
    );
  }

  renderCurrentList() {
    const {multiple} = this.props;
    const {checked} = this.state;
    const currentList = this.getCurrentList();

    if (!currentList.length) return (<div className={cn('f-tac')} style={{padding: '20px', paddingTop: 69}}>暂无数据</div>);

    let arr = [];

    if (multiple) {
      arr = currentList.map((item, index) => (<div className={cn('department-item', 'f-toe')} key={`cb-${index}`}>
        <Checkbox
          indeterminate={item.children ? item.indeterminate : false}
          checked={item.active}
          onChange={(e) => {
            this.checkItem(item, e.target.checked);
          }}
        >{item.departmentName}</Checkbox>{
        item.children ? <a
          href={'javascript:;'}
          className={cn('tag', {disabled: item.active})}
          onClick={() => this.changeValue(item)}
        >下级 &gt;</a> : null}
      </div>));
      arr.unshift(<div className={cn('department-item', 'f-toe')} key={'cb-all'}>
        <Checkbox
          checked={this.verifyAll()}
          onChange={(e) => {
            this.checkAll(e.target.checked);
          }}
        >全选</Checkbox>
      </div>);
      return (<div className={cn('department-box')}>{arr}</div>);
    } else {
      arr = currentList.map((item, index) => (<div className={cn('department-item', 'f-toe')} key={`cb-${index}`}>
        <Radio
          value={item.id}
        >{item.departmentName}</Radio>{
        item.children ? <a
          href={'javascript:;'}
          className={cn('tag', {disabled: item.active})}
          onClick={() => this.changeValue(item)}
        >下级 &gt;</a> : null}
      </div>));

      return (<Radio.Group
        value={checked}
        onChange={(e) => {
          const list = this.getCurrentList();
          const item = list.find(o => o.id === e.target.value);
          this.checkRadioItem(item);
        }}
        className={cn('department-box')}
      >{arr}</Radio.Group>);
    }
  }

  isValidActiveItems() {
    const {activeItems} = this.state;
    return !!(Array.isArray(activeItems) && activeItems.length && activeItems[0].companyGroupId); //ok
  }

  setChildValue(item, value) {
    if (Array.isArray(item.children)) {
      item.children.forEach((o) => {
        o.active = value;
        this.setChildValue(o, value);
      });
    }
  }

  render() {
    const {show, keyword, activeItems} = this.state;
    const {title, width, className, list, onSearch} = this.props;

    return (<Modal
      className={cn('gsg-modal', className)}
      title={title}
      width={width}
      visible={show}
      onOk={() => this.onOk()}
      onCancel={() => this.onCancel()}
    >
      <div className={cn('row', 'select-modal-box', 'check-model-box')}>
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
              // onSearch && onSearch(this.state.keyword);
              this.setState({filter: this.state.keyword, tier: [], value: undefined});
            }}
            height={34}
            width={300}
          />
          {this.getCrumbs()}
          <div className={cn('source')} ref={e => (this._source = e)}>
            {
              list.length === 0 ?
                <div className={cn('f-tac')} style={{color: '#999'}}>暂无数据</div> : this.renderCurrentList()
            }
          </div>
        </div>
        <div className={cn('col', 'col-top', 'col-50', 'rel-box')}>
          <div className={cn('rel-content')}>
            <div className={cn('title')}>已选择</div>
            <div className={cn('content-temp')}>
              <div className={cn('content-box', 'f-cb')}>
                {
                  this.isValidActiveItems() ?
                    activeItems.map((item, index) => (
                      <div className={cn('item')} key={`cl-${index}`}>{`${item.departmentName || '-'}`}
                        <button
                          onClick={() => {
                            item.active = false;
                            this.setChildValue(item, false);
                            this.updateFlush();
                          }}
                        ><Icon type={'close'}/></button>
                      </div>)) :
                    <div className={cn('f-tac')} style={{color: '#999', paddingTop: '69px'}}>暂无选择</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>);
  }
}

export default Class;
