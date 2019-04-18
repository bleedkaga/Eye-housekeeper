import React from 'react';
import cn from 'classnames';
import {Modal, Input, Button, Radio, Pagination, Icon, message} from 'antd';
import MashUpInput from 'client/components/MashUpInput';

import './style.less';


class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: !!props.show,
      keyword: '',
      pageIndex: 1,
      value: props.value,
    };
  }

  static defaultProps = {
    list: [],
    placeholder: '请输入...',
    title: '选择人员',
    pageSize: 10,
    total: 0,
    width: 666,
    onOk: () => {
    },
    onCancel: () => {
    },
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.total !== this.props.total ||
      nextProps.pageSize !== this.props.pageSize ||
      nextProps.value !== this.props.value ||
      nextProps.list !== this.props.list
    ) {
      this.setState({});
    }
  }

  onReset() {
    this.setState({
      keyword: '',
      pageIndex: 1,
      value: this.props.value,
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
    if (this.state.value) {
      this.onHide();
      onOk && onOk(this.state.value);
    } else {
      message.warn('请选择人员');
    }
  }

  onCancel() {
    const {onCancel} = this.props;
    this.onHide();
    onCancel && onCancel();
  }

  onChange = (e) => {
    const {list} = this.props;
    const id = e.target.value;
    const value = list.find(item => item.id === id);
    if (value) {
      this.setState({value});
    }
  };

  revise() {
    const {value} = this.state;
    const {list} = this.props;
    if (list && value && !value.id && value.userName && value.mobilePhone) {
      //校正
      for (let i = 0; i < list.length; i++) {
        const o = list[i];
        if (o.userName === value.userName && o.mobilePhone === value.mobilePhone) {
          this.setState({value: o});
          return true;
        }
      }
    }
  }

  render() {
    const {show, keyword, pageIndex, value} = this.state;
    const {title, width, className, pageSize, total, list, onSearch} = this.props;

    this.revise();

    return (<Modal
      className={cn('gsg-modal', className)}
      title={title}
      width={width}
      visible={show}
      onOk={() => this.onOk()}
      onCancel={() => this.onCancel()}
    >
      <div className={cn('row', 'select-modal-box')}>
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
              onSearch && onSearch(1, this.state.keyword);
            }}
            height={34}
            width={300}
          />
          <div className={cn('source')} ref={e => (this._source = e)}>
            <Radio.Group onChange={this.onChange} value={value ? value.id : undefined}>
              {
                list.map((item, index) => (
                  <div key={`source-${item.id}-${index}`} className={cn('f-toe', 'source-item')}>
                    <Radio value={item.id}>{`${item.userName}-${item.mobilePhone}-${item.department || '-'}`}</Radio>
                  </div>))
              }
            </Radio.Group>
            {
              list.length === 0 && <div className={cn('f-tac')} style={{color: '#999'}}>暂无数据</div>
            }
          </div>
          <div className={cn('source-pagination')}>
            <Pagination
              pageSizeOptions={['10', '20', '30', '40', '50']}
              hideOnSinglePage
              size="small"
              showSizeChanger={false}
              showQuickJumper={false}
              onChange={(page) => {
                this.setState({pageIndex: page});
                this._source.scrollTop = 0;
                onSearch && onSearch(page, this.state.keyword);
              }}
              current={pageIndex}
              pageSize={pageSize}
              total={total}
            />
          </div>
        </div>
        <div className={cn('col', 'col-top', 'col-50', 'rel-box')}>
          <div className={cn('rel-content')}>
            <div className={cn('title')}>已选择</div>
            <div className={cn('content-temp')}>
              <div className={cn('content-box', 'f-cb')}>
                {
                  value && value.mobilePhone ?
                    <div className={cn('item')}>{`${value.userName}-${value.mobilePhone}-${value.department || '-'}`}
                      <button
                        onClick={() => {
                          this.setState({value: undefined});
                        }}
                      ><Icon type={'close'}/></button>
                    </div> :
                    <div className={cn('f-tac')} style={{color: '#999', marginTop: '30px'}}>暂无选择</div>
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
